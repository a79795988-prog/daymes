package com.daymes.medicare.controller;

import com.daymes.medicare.model.User;
import com.daymes.medicare.dto.RegisterRequest;
import com.daymes.medicare.dto.LoginRequest;
import com.daymes.medicare.dto.AuthResponse;
import com.daymes.medicare.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;

/**
 * REST controller for authentication endpoints.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Helper to extract the Bearer token from the request
    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    // Endpoint to register a new user
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        AuthResponse res = authService.register(req);
        if (res.isSuccess()) {
            return ResponseEntity.status(201).body(res);
        }
        return ResponseEntity.badRequest().body(res);
    }

    // Endpoint to log in an existing user
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        AuthResponse res = authService.login(req);
        if (res.isSuccess()) {
            return ResponseEntity.ok(res);
        }
        return ResponseEntity.status(401).body(res);
    }

    // Endpoint to log out the current user
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String token = extractToken(request);
        if (token != null) {
            authService.logout(token);
            return ResponseEntity.ok("Logged out successfully");
        }
        return ResponseEntity.badRequest().body("No token provided");
    }

    // Endpoint to get the currently authenticated user's details
    @GetMapping("/me")
    public ResponseEntity<?> getMe(HttpServletRequest request) {
        String token = extractToken(request);
        if (token != null) {
            Optional<User> userOpt = authService.validateToken(token);
            if (userOpt.isPresent()) {
                return ResponseEntity.ok(authService.sanitizeUser(userOpt.get()));
            }
        }
        return ResponseEntity.status(401).body("Unauthorized");
    }
}
