package com.daymes.medicare.controller;

import com.daymes.medicare.dto.CartItemRequest;
import com.daymes.medicare.dto.CartResponse;
import com.daymes.medicare.model.User;
import com.daymes.medicare.service.AuthService;
import com.daymes.medicare.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Optional;

/**
 * REST controller for cart operations. All endpoints require authentication.
 */
@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;
    private final AuthService authService;

    public CartController(CartService cartService, AuthService authService) {
        this.cartService = cartService;
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

    // Get the user's cart
    @GetMapping("/")
    public ResponseEntity<?> getCart(HttpServletRequest request) {
        String userId = getUserId(request);
        if (userId == null) return ResponseEntity.status(401).body("Unauthorized");
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    // Add an item to the user's cart
    @PostMapping("/")
    public ResponseEntity<?> addToCart(@RequestBody CartItemRequest req, HttpServletRequest request) {
        String userId = getUserId(request);
        if (userId == null) return ResponseEntity.status(401).body("Unauthorized");
        return ResponseEntity.ok(cartService.addToCart(userId, req));
    }

    // Update quantity of a specific cart item
    @PutMapping("/{productId}")
    public ResponseEntity<?> updateCartItem(@PathVariable String productId, @RequestBody CartItemRequest req, HttpServletRequest request) {
        String userId = getUserId(request);
        if (userId == null) return ResponseEntity.status(401).body("Unauthorized");
        return ResponseEntity.ok(cartService.updateCartItem(userId, productId, req.getQty()));
    }

    // Remove a specific item from the cart
    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromCart(@PathVariable String productId, HttpServletRequest request) {
        String userId = getUserId(request);
        if (userId == null) return ResponseEntity.status(401).body("Unauthorized");
        return ResponseEntity.ok(cartService.removeFromCart(userId, productId));
    }
}
