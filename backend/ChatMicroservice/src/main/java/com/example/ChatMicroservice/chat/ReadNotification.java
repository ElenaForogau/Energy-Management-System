package com.example.ChatMicroservice.chat;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReadNotification {
    private String nickname;
    private String timestamp;

    public ReadNotification() {}

    public ReadNotification(String nickname, String timestamp) {
        this.nickname = nickname;
        this.timestamp = timestamp;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}


