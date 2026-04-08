package dev.uptimepulse.dto.auth;

public record AuthResponse(
        String token,
        String email,
        String name,
        Long userId
) {}
