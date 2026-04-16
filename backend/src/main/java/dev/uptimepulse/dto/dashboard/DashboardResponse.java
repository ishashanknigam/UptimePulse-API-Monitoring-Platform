package dev.uptimepulse.dto.dashboard;

import dev.uptimepulse.dto.alert.AlertResponse;
import dev.uptimepulse.dto.incident.IncidentResponse;
import dev.uptimepulse.dto.monitor.MonitorResponse;
import java.util.List;

public record DashboardResponse(
        long totalMonitors,
        long activeMonitors,
        double uptimePercentage,
        double avgLatencyMs,
        long openIncidents,
        List<MonitorResponse> monitors,
        List<IncidentResponse> recentIncidents,
        List<AlertResponse> recentAlerts,
        List<CheckResultSummary> recentChecks
) {}
