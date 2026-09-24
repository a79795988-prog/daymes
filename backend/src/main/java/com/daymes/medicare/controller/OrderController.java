package com.daymes.medicare.controller;

import com.daymes.medicare.dto.OrderRequest;
import com.daymes.medicare.model.User;
import com.daymes.medicare.service.AuthService;
import com.daymes.medicare.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Optional;

/**
 * REST controller for order management. All endpoints require authentication.
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;
    private final AuthService authService;

    public OrderController(OrderService orderService, AuthService authService) {
        this.orderService = orderService;
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

    // Create a new order from current cart
    @PostMapping("/")
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest req, HttpServletRequest request) {
        String userId = getUserId(request);
        if (userId == null) return ResponseEntity.status(401).body("Unauthorized");
        try {
            return ResponseEntity.status(201).body(orderService.placeOrder(userId, req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all orders for the user
    @GetMapping("/")
    public ResponseEntity<?> getOrders(HttpServletRequest request) {
        String userId = getUserId(request);
        if (userId == null) return ResponseEntity.status(401).body("Unauthorized");
        return ResponseEntity.ok(orderService.getOrders(userId));
    }

    // Reorder a past order
    @PostMapping("/{id}/reorder")
    public ResponseEntity<?> reorderById(@PathVariable String id, HttpServletRequest request) {
        String userId = getUserId(request);
        if (userId == null) return ResponseEntity.status(401).body("Unauthorized");
        return ResponseEntity.ok(orderService.reorderById(userId, id));
    }
}
