package dev.uptimepulse.controller;

import dev.uptimepulse.dto.alert.AlertResponse;
import dev.uptimepulse.entity.User;
import dev.uptimepulse.service.AlertService;
import dev.uptimepulse.service.AuthService;
import dev.uptimepulse.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Alerts")
public class AlertController {

    private final AlertService alertService;
    private final AuthService authService;
    private final ProjectService projectService;

    @GetMapping("/api/v1/alerts")
    @Operation(summary = "List all alerts for current user")
    public List<AlertResponse> listAll(@AuthenticationPrincipal UserDetails principal,
                                       @RequestParam(defaultValue = "50") int limit) {
        User user = authService.getCurrentUser(principal.getUsername());
        return alertService.getByUser(user.getId(), limit);
    }

    @GetMapping("/api/v1/projects/{projectId}/alerts")
    @Operation(summary = "List alerts for a project")
    public List<AlertResponse> listByProject(@PathVariable Long projectId,
                                             @RequestParam(defaultValue = "50") int limit,
                                             @AuthenticationPrincipal UserDetails principal) {
        User user = authService.getCurrentUser(principal.getUsername());
        projectService.getEntityById(projectId, user.getId());
        return alertService.getByProject(projectId, limit);
    }
}
