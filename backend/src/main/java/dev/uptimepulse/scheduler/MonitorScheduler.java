package dev.uptimepulse.scheduler;

import dev.uptimepulse.entity.Monitor;
import dev.uptimepulse.repository.MonitorRepository;
import dev.uptimepulse.service.MonitoringMetricsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Component
@ConditionalOnProperty(name = "uptimepulse.monitor.scheduler-enabled", havingValue = "true", matchIfMissing = true)
@RequiredArgsConstructor
@Slf4j
public class MonitorScheduler {

    private final MonitorRepository monitorRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final MonitoringMetricsService metricsService;

    @Value("${uptimepulse.monitor.stream-name:monitor-checks}")
    private String streamName;

    @Scheduled(fixedDelay = 30000)
    public void dispatch() {
        // BUG-3 FIX: use per-monitor intervalSeconds via native query instead of hardcoded 25s cutoff
        List<Monitor> dueMonitors = monitorRepository.findDueMonitors(Instant.now());
        metricsService.recordDispatchSize(dueMonitors.size());
        log.debug("Scheduling {} monitors for health check", dueMonitors.size());

        for (Monitor monitor : dueMonitors) {
            try {
                Map<String, String> payload = Map.of("monitorId", String.valueOf(monitor.getId()));
                redisTemplate.opsForStream().add(streamName, payload);
            } catch (Exception e) {
                metricsService.recordEnqueueFailure();
                log.error("Failed to enqueue monitor {}: {}", monitor.getId(), e.getMessage());
            }
        }
    }
}
