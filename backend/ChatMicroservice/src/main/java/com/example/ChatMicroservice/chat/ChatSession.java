package com.example.ChatMicroservice.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatSession {
    private String sessionId;
    private String userId;
    private String adminId;
    private List<ChatMessage> messages = new ArrayList<>();

    public ChatSession(String sessionId, String userId, String adminId) {
        this.sessionId = sessionId;
        this.userId = userId;
        this.adminId = adminId;
        this.messages = new ArrayList<>();
    }

}


