package com.daymes.medicare.controller;

import com.daymes.medicare.dto.ChatRequest;
import com.daymes.medicare.dto.ChatBotResponse;
import com.daymes.medicare.service.ChatbotService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for interacting with the AI chatbot. No authentication required.
 */
@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {
    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    // Process a message and return the chatbot's response
    @PostMapping("/")
    public ResponseEntity<ChatBotResponse> processMessage(@RequestBody ChatRequest req) {
        return ResponseEntity.ok(chatbotService.processMessage(req));
    }
}
