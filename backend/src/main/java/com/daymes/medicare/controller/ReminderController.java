package com.daymes.medicare.controller;

import com.daymes.medicare.dto.ReminderRequest;
import com.daymes.medicare.model.User;
import com.daymes.medicare.service.AuthService;
import com.daymes.medicare.service.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Optional;

/**
 * REST controller for medication reminders and scheduling.
 */
@RestController
@RequestMapping("/api/reminders")
public class ReminderController {
    private final ScheduleService scheduleService;
    private final AuthService authService;

    public ReminderController(ScheduleService scheduleService, AuthService authService) {
        this.scheduleService = scheduleService;
        this.authService = authService;
    }

    // Helper to get authenticated User ID
    private String getUserId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            Optional<User> user = authService.validateToken(authHeader.substring(7));
            if (user.isPresent()) {
                return user.get().getId();
            }
        }
        return null;
    }

    // Retrieves the user's medication schedule
    @GetMapping("/")
    public ResponseEntity<?> getSchedule(HttpServletRequest request) {
        String userId = getUserId(request);
        if (userId == null) return ResponseEntity.status(401).body("Unauthorized");
        return ResponseEntity.ok(scheduleService.getSchedule(userId));
    }

    // Adds a new reminder to the schedule
    @PostMapping("/")
    public ResponseEntity<?> addReminder(@RequestBody ReminderRequest req, HttpServletRequest request) {
        String userId = getUserId(request);
        if (userId == null) return ResponseEntity.status(401).body("Unauthorized");
        return ResponseEntity.status(201).body(scheduleService.addReminder(userId, req));
    }

    // Toggles the status of a specific reminder (Taken / Pending)
    @PatchMapping("/{id}")
    public ResponseEntity<?> toggleStatus(@PathVariable String id, HttpServletRequest request) {
        String userId = getUserId(request);
        if (userId == null) return ResponseEntity.status(401).body("Unauthorized");
        try {
            return ResponseEntity.ok(scheduleService.toggleStatus(userId, id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
