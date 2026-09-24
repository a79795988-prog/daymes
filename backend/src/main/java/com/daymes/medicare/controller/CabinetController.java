package com.daymes.medicare.controller;

import com.daymes.medicare.dto.CabinetReorderRequest;
import com.daymes.medicare.model.User;
import com.daymes.medicare.service.AuthService;
import com.daymes.medicare.service.ReorderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Optional;

/**
 * REST controller for managing the medicine cabinet and bulk reordering.
 */
@RestController
@RequestMapping("/api/cabinet")
public class CabinetController {
    private final ReorderService reorderService;
    private final AuthService authService;

    public CabinetController(ReorderService reorderService, AuthService authService) {
        this.reorderService = reorderService;
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

    // Retrieves all items in the user's reorder cabinet
    @GetMapping("/")
    public ResponseEntity<?> getReorderItems(HttpServletRequest request) {
        String userId = getUserId(request);
        if (userId == null) return ResponseEntity.status(401).body("Unauthorized");
        return ResponseEntity.ok(reorderService.getReorderItems(userId));
    }

    // Places a bulk reorder for selected cabinet items
    @PostMapping("/")
    public ResponseEntity<?> bulkReorder(@RequestBody CabinetReorderRequest req, HttpServletRequest request) {
        String userId = getUserId(request);
        if (userId == null) return ResponseEntity.status(401).body("Unauthorized");
        try {
            return ResponseEntity.status(201).body(reorderService.bulkReorder(userId, req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
