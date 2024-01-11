package com.lodging.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lodging.service.model.Place;
import com.lodging.service.service.ChatService;
import com.lodging.service.service.EmbeddingService;

@RestController
public class LodgingController {
    private static final float MATCH_THRESHOLD = 0.7f;
    private static final int MATCH_CNT = 3;

    private EmbeddingService embeddingService;

    private ChatService chatService;

    @Autowired
    public LodgingController(EmbeddingService embeddingService, ChatService chatService) {
        this.embeddingService = embeddingService;
        this.chatService = chatService;
    }

    @GetMapping("/search")
    public List<Place> searchPlaces(@RequestParam("prompt") String prompt, @RequestParam("engine") String serviceType) {
        if (serviceType.equals("postgres")) {
            return embeddingService.searchPlaces(prompt);
            
        } else if (serviceType.equals("openai_chat")) {
            return chatService.searchPlaces(prompt);
        } else {
            throw new IllegalArgumentException("Unknown service type: " + serviceType);
        }
    }
}
