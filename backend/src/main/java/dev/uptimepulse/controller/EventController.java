package dev.uptimepulse.controller;

import dev.uptimepulse.dto.event.CreateEventRequest;
import dev.uptimepulse.entity.ApiKey;
import dev.uptimepulse.entity.CustomEvent;
import dev.uptimepulse.repository.CustomEventRepository;
import dev.uptimepulse.service.ApiKeyService;
import dev.uptimepulse.service.RateLimiterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
@Tag(name = "Custom Events")
public class EventController {

    private final ApiKeyService apiKeyService;
    private final CustomEventRepository customEventRepository;
    private final RateLimiterService rateLimiterService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Submit a custom event using an API key")
    public Map<String, String> submit(@Valid @RequestBody CreateEventRequest request) {
        String rawKey = request.apiKey();

        // SEC-7 FIX: validate key FIRST so fake keys never touch a real user's rate-limit counter
        ApiKey apiKey = apiKeyService.validateKey(rawKey);

        // Rate-limit by the key's stable DB id (not the raw prefix)
        if (!rateLimiterService.isAllowed(String.valueOf(apiKey.getId()))) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Rate limit exceeded: 60 requests/minute");
        }

        CustomEvent event = CustomEvent.builder()
                .eventType(request.eventType())
                .payload(request.payload())
                .apiKey(apiKey)
                .project(apiKey.getProject())
                .build();
        customEventRepository.save(event);

        return Map.of("status", "accepted", "eventType", request.eventType());
    }
}
