package dev.uptimepulse.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
                "service", "UptimePulse API Monitoring PaaS",
                "status", "running",
                "health", "/actuator/health",
                "swagger", "/swagger-ui.html",
                "apiDocs", "/api-docs"
        );
    }
}
