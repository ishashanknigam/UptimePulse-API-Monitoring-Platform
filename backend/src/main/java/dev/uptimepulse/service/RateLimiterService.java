package dev.uptimepulse.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

/**
 * SEC-7 FIX: Sliding-window rate limiter using a Redis Sorted Set.
 *
 * Old approach (fixed window):
 *   - Used a counter key bucketed per-minute → allowed 2× burst at minute boundaries.
 *   - Rate-limited by raw key PREFIX before validation → fake keys could exhaust real users' quota.
 *
 * New approach (sliding window):
 *   - Uses ZADD / ZREMRANGEBYSCORE / ZCARD on a per-key-id sorted set.
 *   - Window is a rolling 60-second period — no boundary bursts.
 *   - Rate-limit bucket is the validated API key's DB id (passed by EventController after validation).
 */
@Service
@RequiredArgsConstructor
public class RateLimiterService {

    private final RedisTemplate<String, String> redisTemplate;

    @Value("${uptimepulse.rate-limit.requests-per-minute:60}")
    private int requestsPerMinute;

    /**
     * Returns true if the request is allowed, false if the rate limit is exceeded.
     *
     * @param keyIdentifier a stable, unique identifier for the rate-limit bucket
     *                      (use the API key's DB id — NOT the raw key or prefix)
     */
    public boolean isAllowed(String keyIdentifier) {
        long nowMs = System.currentTimeMillis();
        long windowStartMs = nowMs - 60_000L;  // 60-second sliding window

        String redisKey = "ratelimit:sliding:" + keyIdentifier;

        // 1. Remove all entries older than the sliding window
        redisTemplate.opsForZSet().removeRangeByScore(redisKey, 0, windowStartMs - 1);

        // 2. Add current request with score = nowMs, member = unique string per timestamp
        redisTemplate.opsForZSet().add(redisKey, String.valueOf(nowMs), (double) nowMs);

        // 3. Keep key alive for 90s so idle keys are cleaned up automatically
        redisTemplate.expire(redisKey, Duration.ofSeconds(90));

        // 4. Count entries in the 60-second window
        Long count = redisTemplate.opsForZSet().count(redisKey, windowStartMs, nowMs);
        return count == null || count <= requestsPerMinute;
    }
}
