package com.example.ChatMicroservice.chat;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Controller
@CrossOrigin("http://localhost:5173")
public class ChatController {
    private final Map<String, ChatSession> sessions = new ConcurrentHashMap<>();

    @MessageMapping("/chat/user")
    @SendTo("/topic/admin")
    public ChatMessage receiveFromUser(@Payload ChatMessage chatMessage) {
        ChatSession session = sessions.computeIfAbsent(
                chatMessage.getNickname(),
                id -> new ChatSession(UUID.randomUUID().toString(), chatMessage.getNickname(), null)
        );
        session.getMessages().add(chatMessage);
        return chatMessage;
    }

    @MessageMapping("/chat/admin/{userId}")
    @SendTo("/topic/user/{userId}")
    public ChatMessage receiveFromAdmin(@Payload ChatMessage chatMessage, @DestinationVariable String userId) {
        ChatSession session = sessions.get(userId);
        if (session != null) {
            session.getMessages().add(chatMessage);
        }
        return chatMessage;
    }

    @MessageMapping("/typing/user/{userId}")
    @SendTo("/topic/typing/admin")
    public String notifyTypingFromUser(@DestinationVariable String userId) {
        System.out.println("User " + userId + " is typing...");
        return userId;
    }

    @MessageMapping("/typing/admin/{userId}")
    @SendTo("/topic/typing/{userId}")
    public String notifyTypingFromAdmin(@DestinationVariable String userId) {
        System.out.println("Admin is typing for user ID: " + userId);
        return userId;
    }

    @MessageMapping("/read/admin/{userId}")
    @SendTo("/topic/read/{userId}")
    public ReadNotification notifyReadByAdmin(
            @DestinationVariable String userId,
            @Payload ReadNotification notification) {
        markMessagesAsRead(userId);
        return new ReadNotification(notification.getNickname(), "all_read");
    }


    @MessageMapping("/read/user/{adminId}")
    @SendTo("/topic/read/admin")
    public ReadNotification notifyReadByUser(
            @DestinationVariable String adminId,
            @Payload ReadNotification notification) {
        System.out.println("User read notification received for admin: " + adminId);

        notification.setNickname(adminId);

        markMessagesAsRead(adminId);

        return new ReadNotification(notification.getNickname(), "all_read");
    }


    private void markMessagesAsRead(String userId) {
        ChatSession session = sessions.get(userId);
        if (session != null) {
            session.getMessages().forEach(msg -> msg.setRead(true));
        }
    }

}
