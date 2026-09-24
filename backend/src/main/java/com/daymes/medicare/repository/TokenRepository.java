package com.daymes.medicare.repository;

import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class TokenRepository {
    private final ConcurrentHashMap<String, String> tokens = new ConcurrentHashMap<>();

    public void save(String token, String userId) {
        tokens.put(token, userId);
    }

    public Optional<String> findUserIdByToken(String token) {
        return Optional.ofNullable(tokens.get(token));
    }

    public void deleteByToken(String token) {
        tokens.remove(token);
    }

    public void deleteAllForUser(String userId) {
        List<String> userTokens = tokens.entrySet().stream()
                .filter(entry -> entry.getValue().equals(userId))
                .map(ConcurrentHashMap.Entry::getKey)
                .collect(Collectors.toList());
        
        userTokens.forEach(tokens::remove);
    }
}
