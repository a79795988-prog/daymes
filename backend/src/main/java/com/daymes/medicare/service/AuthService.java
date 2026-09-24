package com.daymes.medicare.service;

import com.daymes.medicare.model.User;
import com.daymes.medicare.dto.RegisterRequest;
import com.daymes.medicare.dto.LoginRequest;
import com.daymes.medicare.dto.AuthResponse;
import com.daymes.medicare.repository.UserRepository;
import com.daymes.medicare.repository.TokenRepository;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Service to handle authentication operations like register, login, and token validation.
 */
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;

    public AuthService(UserRepository userRepository, TokenRepository tokenRepository) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
    }

    // Hashes the user password using SHA-256 for security
    public String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes("UTF-8"));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception ex) {
            throw new RuntimeException("Error hashing password", ex);
        }
    }

    // Removes sensitive information before sending the user to the client
    public Map<String, Object> sanitizeUser(User user) {
        Map<String, Object> safeUser = new HashMap<>();
        safeUser.put("id", user.getId());
        safeUser.put("fullName", user.getFullName());
        safeUser.put("email", user.getEmail());
        safeUser.put("mobile", user.getMobile());
        safeUser.put("provider", user.getProvider());
        safeUser.put("googleId", user.getGoogleId());
        safeUser.put("picture", user.getPicture());
        safeUser.put("emailVerified", user.getEmailVerified());
        safeUser.put("createdAt", user.getCreatedAt());
        return safeUser;
    }

    // Registers a new user if the email is not taken
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.findByEmail(req.getEmail()) != null) {
            return AuthResponse.error("Email is already taken.");
        }
        
        User user = new User();
        user.setId("usr-" + System.currentTimeMillis());
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setMobile(req.getMobile());
        user.setPasswordHash(hashPassword(req.getPassword()));

        userRepository.save(user);

        // Generate a secure token for the user session
        String token = UUID.randomUUID().toString();
        tokenRepository.save(token, user.getId());

        return AuthResponse.success(token, sanitizeUser(user));
    }

    // Logs in a user by verifying credentials
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail());
        if (user == null || !user.getPasswordHash().equals(hashPassword(req.getPassword()))) {
            return AuthResponse.error("Invalid email or password.");
        }
        
        // Generate a secure token for the user session
        String token = UUID.randomUUID().toString();
        tokenRepository.save(token, user.getId());
        
        return AuthResponse.success(token, sanitizeUser(user));
    }

    // Logs out the user by deleting their token
    public void logout(String token) {
        if (token != null) {
            tokenRepository.deleteByToken(token);
        }
    }

    // Validates a given token and returns the corresponding user
    public Optional<User> validateToken(String token) {
        Optional<String> userIdOpt = tokenRepository.findUserIdByToken(token);
        if (userIdOpt.isPresent()) {
            User user = userRepository.findById(userIdOpt.get());
            return Optional.ofNullable(user);
        }
        return Optional.empty();
    }
}
