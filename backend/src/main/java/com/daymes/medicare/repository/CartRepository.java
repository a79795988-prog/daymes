package com.daymes.medicare.repository;

import com.daymes.medicare.model.CartItem;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class CartRepository {
    private final ConcurrentHashMap<String, List<CartItem>> carts = new ConcurrentHashMap<>();

    public List<CartItem> getCart(String userId) {
        return carts.getOrDefault(userId, new ArrayList<>());
    }

    public void saveCart(String userId, List<CartItem> items) {
        carts.put(userId, new ArrayList<>(items));
    }

    public void clearCart(String userId) {
        carts.remove(userId);
    }
}
