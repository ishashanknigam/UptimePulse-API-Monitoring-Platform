package dev.uptimepulse.service;

import dev.uptimepulse.dto.monitor.CreateMonitorRequest;
import dev.uptimepulse.dto.monitor.MonitorResponse;
import dev.uptimepulse.entity.Monitor;
import dev.uptimepulse.entity.Project;
import dev.uptimepulse.entity.enums.MonitorMethod;
import dev.uptimepulse.exception.ResourceNotFoundException;
import dev.uptimepulse.repository.MonitorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MonitorService {

    private static final Set<String> ALLOWED_SCHEMES = Set.of("http", "https");

    private final MonitorRepository monitorRepository;

    // VAL-1 FIX: validate URL to prevent SSRF (file://, internal IPs, etc.)
    private void validateUrl(String url) {
        try {
            URI uri = new URI(url);
            String scheme = uri.getScheme();
            if (scheme == null || !ALLOWED_SCHEMES.contains(scheme.toLowerCase())) {
                throw new IllegalArgumentException("URL must use http or https scheme");
            }
            String host = uri.getHost();
            if (host == null || host.isBlank()) {
                throw new IllegalArgumentException("URL must have a valid host");
            }
            // Block internal/private addresses
            if (host.equalsIgnoreCase("localhost") || host.equals("127.0.0.1") ||
                host.equals("0.0.0.0") || host.startsWith("169.254.") ||
                host.startsWith("10.") || host.startsWith("192.168.") ||
                host.startsWith("172.")) {
                throw new IllegalArgumentException("URL must point to a public host");
            }
        } catch (java.net.URISyntaxException e) {
            throw new IllegalArgumentException("Invalid URL: " + e.getMessage());
        }
    }

    @Transactional
    public MonitorResponse create(CreateMonitorRequest request, Project project) {
        validateUrl(request.url()); // VAL-1 FIX
        Monitor monitor = Monitor.builder()
                .name(request.name())
                .url(request.url())
                .method(request.method() != null ? request.method() : MonitorMethod.GET)
                .expectedStatusCode(request.expectedStatusCode() != null ? request.expectedStatusCode() : 200)
                .intervalSeconds(request.intervalSeconds() != null ? request.intervalSeconds() : 60)
                .timeoutSeconds(request.timeoutSeconds() != null ? request.timeoutSeconds() : 10)
                .active(request.active() != null ? request.active() : true)
                .project(project)
                .build();
        return MonitorResponse.from(monitorRepository.save(monitor));
    }

    @Transactional(readOnly = true)
    public List<MonitorResponse> listByProject(Long projectId) {
        return monitorRepository.findByProjectId(projectId).stream()
                .map(MonitorResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public MonitorResponse getById(Long monitorId, Long projectId) {
        return monitorRepository.findByIdAndProjectId(monitorId, projectId)
                .map(MonitorResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Monitor not found: " + monitorId));
    }

    public Monitor getEntityById(Long monitorId) {
        return monitorRepository.findById(monitorId)
                .orElseThrow(() -> new ResourceNotFoundException("Monitor not found: " + monitorId));
    }

    @Transactional
    public MonitorResponse update(Long monitorId, Long projectId, CreateMonitorRequest request) {
        Monitor monitor = monitorRepository.findByIdAndProjectId(monitorId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Monitor not found: " + monitorId));
        if (request.name() != null) monitor.setName(request.name());
        if (request.url() != null) {
            validateUrl(request.url()); // VAL-1 FIX for updates too
            monitor.setUrl(request.url());
        }
        if (request.method() != null) monitor.setMethod(request.method());
        if (request.expectedStatusCode() != null) monitor.setExpectedStatusCode(request.expectedStatusCode());
        if (request.intervalSeconds() != null) monitor.setIntervalSeconds(request.intervalSeconds());
        if (request.timeoutSeconds() != null) monitor.setTimeoutSeconds(request.timeoutSeconds());
        if (request.active() != null) monitor.setActive(request.active());
        return MonitorResponse.from(monitorRepository.save(monitor));
    }

    @Transactional
    public void delete(Long monitorId, Long projectId) {
        Monitor monitor = monitorRepository.findByIdAndProjectId(monitorId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Monitor not found: " + monitorId));
        monitorRepository.delete(monitor);
    }

    @Transactional
    public void updateLastCheckedAt(Long monitorId) {
        // LOG-8 FIX: direct UPDATE query instead of SELECT + save
        monitorRepository.updateLastCheckedAt(monitorId, java.time.Instant.now());
    }

    @Transactional
    public MonitorResponse toggleActive(Long monitorId, Long projectId) {
        Monitor monitor = monitorRepository.findByIdAndProjectId(monitorId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Monitor not found: " + monitorId));
        monitor.setActive(!monitor.getActive());
        return MonitorResponse.from(monitorRepository.save(monitor));
    }
}
