import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import moment from "moment";

const UserChat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const userId = sessionStorage.getItem("userId");
  const [client, setClient] = useState(null);
  const [activeChat, setActiveChat] = useState("admin");

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: "ws://chat.localhost/ws",
      reconnectDelay: 5000,
      debug: (str) => console.log("STOMP Debug:", str),
    });

    stompClient.onConnect = () => {
      console.log("Connected as User");

      stompClient.subscribe(`/topic/user/${userId}`, (msg) => {
        const newMessage = JSON.parse(msg.body);
        setMessages((prev) => [...prev, { ...newMessage, isRead: false }]);
      });

      stompClient.subscribe(`/topic/read/${userId}`, () => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => ({ ...msg, isRead: true }))
        );
      });

      stompClient.subscribe(`/topic/typing/${userId}`, () => {
        setTyping(true);
        setTimeout(() => setTyping(false), 3000);
      });

      setClient(stompClient);
    };

    stompClient.activate();

    return () => stompClient.deactivate();
  }, [userId]);

  const sendMessage = () => {
    if (!message.trim() || !client || !client.connected) return;

    const chatMessage = {
      nickname: userId,
      content: message,
      timestamp: new Date().toISOString(),
    };

    client.publish({
      destination: `/app/chat/user`,
      body: JSON.stringify(chatMessage),
    });

    setMessages((prev) => [...prev, { ...chatMessage, isRead: false }]);
    setMessage("");
  };

  const handleTyping = () => {
    if (client && client.connected) {
      client.publish({
        destination: `/app/typing/user/${userId}`,
        body: JSON.stringify({ nickname: userId }),
      });
    }
  };

  const selectChat = () => {
    if (client && client.connected) {
      console.log("Sending read notification for user:", userId);
      client.publish({
        destination: `/app/read/user/${userId}`,
        body: JSON.stringify({ userId }),
      });
    }

    setMessages((prevMessages) =>
      prevMessages.map((msg) => ({ ...msg, isRead: true }))
    );
  };

  useEffect(() => {
    selectChat();
  }, [activeChat]);

  return (
    <div style={{ display: "flex" }}>
      {}
      <div
        style={{
          width: "30%",
          borderRight: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <h4>Active Chat</h4>
        <div
          onClick={() => {
            setActiveChat("admin");
            selectChat();
          }}
          style={{
            cursor: "pointer",
            fontWeight: "bold",
            color: "blue",
          }}
        >
          Chat with Admin
        </div>
      </div>

      {}
      <div style={{ width: "70%", padding: "10px" }}>
        <div
          style={{
            height: "400px",
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: msg.nickname === userId ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  backgroundColor:
                    msg.nickname === userId ? "#007bff" : "#f0f0f0",
                  color: msg.nickname === userId ? "white" : "black",
                  padding: "10px",
                  borderRadius: "8px",
                  maxWidth: "70%",
                }}
              >
                <div>{msg.content}</div>
                {msg.nickname === userId && (
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: msg.isRead ? "green" : "gray",
                    }}
                  ></div>
                )}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#888",
                  marginTop: "5px",
                }}
              >
                {moment(msg.timestamp).format("HH:mm")}
              </div>
            </div>
          ))}
        </div>
        {typing && (
          <div style={{ fontStyle: "italic", color: "#888" }}>
            Admin is typing...
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleTyping}
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginRight: "10px",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserChat;
