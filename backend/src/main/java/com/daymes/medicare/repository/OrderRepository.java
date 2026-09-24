package com.daymes.medicare.repository;

import com.daymes.medicare.model.Order;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class OrderRepository {
    private final ConcurrentHashMap<String, List<Order>> orders = new ConcurrentHashMap<>();

    public void save(String userId, Order order) {
        List<Order> userOrders = orders.computeIfAbsent(userId, k -> new ArrayList<>());
        userOrders.add(0, order); // prepends to list
    }

    public List<Order> findByUserId(String userId) {
        return orders.getOrDefault(userId, new ArrayList<>());
    }

    public Optional<Order> findOrderById(String userId, String orderId) {
        List<Order> userOrders = findByUserId(userId);
        return userOrders.stream()
                .filter(o -> o.getOrderId().equals(orderId))
                .findFirst();
    }

    public void saveAll(String userId, List<Order> orderList) {
        orders.put(userId, new ArrayList<>(orderList));
    }
}
