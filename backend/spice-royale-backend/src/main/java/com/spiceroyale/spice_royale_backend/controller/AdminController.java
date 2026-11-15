
package com.spiceroyale.spice_royale_backend.controller;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.spiceroyale.spice_royale_backend.service.JwtService;

@RestController
@RequestMapping("/api/admin")

public class AdminController {

    private final JwtService jwtService;

    @Value("${ADMIN_USERNAME}")
    private String adminUsername;

    @Value("${ADMIN_PASSWORD}")
    private String adminPassword;

    public AdminController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public Map<String, String> adminLogin(
            @RequestBody Map<String, String> request) {

        String username = request.get("username");
        String password = request.get("password");

        if (username == null || password == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Username and password are required"
            );
        }

        boolean usernameMatches = MessageDigest.isEqual(
            username.getBytes(StandardCharsets.UTF_8),
            adminUsername.getBytes(StandardCharsets.UTF_8)
        );

        boolean passwordMatches = MessageDigest.isEqual(
            password.getBytes(StandardCharsets.UTF_8),
            adminPassword.getBytes(StandardCharsets.UTF_8)
        );

        if (!usernameMatches || !passwordMatches) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Invalid admin username or password"
            );
        }

        String token = jwtService.generateAdminToken(adminUsername);

        return Map.of(
            "message", "Admin login successful",
            "token", token,
            "username", adminUsername,
            "role", "ADMIN"
        );
    }
}
