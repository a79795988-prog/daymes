package com.daymes.medicare.repository;

import com.daymes.medicare.model.ReorderItem;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class ReorderRepository {
    private final ConcurrentHashMap<String, List<ReorderItem>> reorderItems = new ConcurrentHashMap<>();

    public List<ReorderItem> findByUserId(String userId) {
        return reorderItems.getOrDefault(userId, new ArrayList<>());
    }

    public void save(String userId, List<ReorderItem> items) {
        reorderItems.put(userId, new ArrayList<>(items));
    }

    public Optional<ReorderItem> findItemById(String userId, String itemId) {
        List<ReorderItem> items = findByUserId(userId);
        return items.stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst();
    }
}
