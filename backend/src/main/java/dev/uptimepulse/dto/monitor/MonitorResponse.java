package dev.uptimepulse.dto.monitor;

import dev.uptimepulse.entity.Monitor;
import dev.uptimepulse.entity.enums.MonitorMethod;
import java.time.Instant;

public record MonitorResponse(
        Long id,
        String name,
        String url,
        MonitorMethod method,
        Integer expectedStatusCode,
        Integer intervalSeconds,
        Integer timeoutSeconds,
        Boolean active,
        Instant lastCheckedAt,
        Instant createdAt,
        Long projectId,
        String projectName,
        Boolean hasOpenIncident
) {
    public static MonitorResponse from(Monitor m) {
        boolean hasOpenIncident = m.getIncidents() != null && m.getIncidents().stream()
                .anyMatch(i -> dev.uptimepulse.entity.enums.IncidentStatus.OPEN.equals(i.getStatus()));

        return new MonitorResponse(
                m.getId(), m.getName(), m.getUrl(), m.getMethod(),
                m.getExpectedStatusCode(), m.getIntervalSeconds(), m.getTimeoutSeconds(),
                m.getActive(), m.getLastCheckedAt(), m.getCreatedAt(),
                m.getProject().getId(), m.getProject().getName(),
                hasOpenIncident
        );
    }
}
