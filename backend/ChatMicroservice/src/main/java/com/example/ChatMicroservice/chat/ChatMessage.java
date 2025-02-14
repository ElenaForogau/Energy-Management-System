package com.example.ChatMicroservice.chat;

import lombok.*;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
@Getter
@Setter
public class ChatMessage {
    private String nickname;
    private String content;
    private Date timestamp;
    private boolean isRead;

    public ChatMessage(String nickname, String content, Date timestamp) {
        this.nickname = nickname;
        this.content = content;
        this.timestamp = timestamp;
        this.isRead = false;
    }
}
