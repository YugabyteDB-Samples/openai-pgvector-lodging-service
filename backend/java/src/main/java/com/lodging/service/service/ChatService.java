package com.lodging.service.service;

import java.util.List;

import org.springframework.ai.chat.ChatClient;
import org.springframework.ai.chat.ChatResponse;
import org.springframework.ai.chat.ChatClient;
import org.springframework.ai.chat.messages.*;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.lodging.service.model.Place;

@Service
public class ChatService implements LodgingService {

    private static final SystemMessage SYSTEM_MESSAGE = new SystemMessage(
            """
                    You're an assistant who helps to find lodging in San Francisco.
                    Suggest three options. Send back a JSON object in the format below.
                    [{\"name\": \"<hotel name>\", \"description\": \"<hotel description>\", \"price\": <hotel price>}]
                    Don't add any other text to the response. Don't add the new line or any other symbols to the response. Send back the raw JSON.
                    """);

    private ChatClient aiClient;

    @Autowired
    public ChatService(ChatClient aiClient) {
        this.aiClient = aiClient;
    }

    @Override
    public List<Place> searchPlaces(String prompt) {
        Prompt chatPrompt = new Prompt(List.of(SYSTEM_MESSAGE, new UserMessage(prompt)));

        ChatResponse response = aiClient.call(chatPrompt);

        String rawJson = response.getResult().getOutput().getContent();
        Place[] places = new Gson().fromJson(rawJson, Place[].class);

        return List.of(places);
    }

}
