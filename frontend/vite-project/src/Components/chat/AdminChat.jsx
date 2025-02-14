import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import axios from "axios";

const AdminChat = () => {
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [client, setClient] = useState(null);

  const fetchUserLastName = async (userId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://users.localhost/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`User data for ID ${userId}:`, response.data);
      return response.data.lastName || `User ${userId}`;
    } catch (error) {
      console.error(`Error fetching user data for ID ${userId}:`, error);
      return `User ${userId}`;
    }
  };

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: "ws://chat.localhost/ws",
      reconnectDelay: 5000,
      debug: (str) => console.log("STOMP Debug:", str),
    });

    stompClient.onConnect = () => {
      console.log("Connected as Admin");

      stompClient.subscribe("/topic/admin", async (msg) => {
        const newMessage = JSON.parse(msg.body);

        setActiveChats((prevChats) => {
          const existingChat = prevChats.find(
            (chat) => chat.nickname === newMessage.nickname
          );

          if (existingChat) {
            return prevChats.map((chat) =>
              chat.nickname === newMessage.nickname
                ? {
                    ...chat,
                    messages: [
                      ...chat.messages,
                      { ...newMessage, isRead: false },
                    ],
                  }
                : chat
            );
          } else {
            return [
              ...prevChats,
              {
                nickname: newMessage.nickname,
                name: `Loading...`,
                messages: [{ ...newMessage, isRead: false }],
              },
            ];
          }
        });

        const lastName = await fetchUserLastName(newMessage.nickname);
        setActiveChats((prevChats) =>
          prevChats.map((chat) =>
            chat.nickname === newMessage.nickname
              ? { ...chat, name: lastName }
              : chat
          )
        );

        if (selectedChat?.nickname === newMessage.nickname) {
          setSelectedChat((prevChat) => ({
            ...prevChat,
            messages: [...prevChat.messages, { ...newMessage, isRead: false }],
          }));
        }
      });

      stompClient.subscribe(`/topic/typing/admin`, (msg) => {
        const typingUser = msg.body;

        if (selectedChat?.nickname === typingUser) {
          setTyping(true);
          setTimeout(() => setTyping(false), 3000);
        }
      });

      stompClient.subscribe(`/topic/read/admin`, (msg) => {
        const notification = JSON.parse(msg.body);
        console.log(
          "Read notification received for user:",
          notification.nickname
        );

        setActiveChats((prevChats) =>
          prevChats.map((chat) =>
            chat.nickname === notification.nickname
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    !msg.isRead ? { ...msg, isRead: true } : msg
                  ),
                }
              : chat
          )
        );

        if (selectedChat?.nickname === notification.nickname) {
          setSelectedChat((prevChat) => ({
            ...prevChat,
            messages: prevChat.messages.map((msg) =>
              !msg.isRead ? { ...msg, isRead: true } : msg
            ),
          }));
        }
      });

      setClient(stompClient);
    };

    stompClient.activate();

    return () => stompClient.deactivate();
  }, [selectedChat]);

  const handleTyping = () => {
    if (client && client.connected && selectedChat) {
      client.publish({
        destination: `/app/typing/admin/${selectedChat.nickname}`,
        body: "",
      });
    }
  };

  const sendMessage = () => {
    if (!message.trim() || !selectedChat || !client || !client.connected)
      return;

    const chatMessage = {
      nickname: "admin",
      content: message,
      timestamp: new Date().toISOString(),
    };

    client.publish({
      destination: `/app/chat/admin/${selectedChat.nickname}`,
      body: JSON.stringify(chatMessage),
    });

    setSelectedChat((prev) => ({
      ...prev,
      messages: [...prev.messages, { ...chatMessage, isRead: false }],
    }));

    setActiveChats((prevChats) =>
      prevChats.map((chat) =>
        chat.nickname === selectedChat.nickname
          ? {
              ...chat,
              messages: [...chat.messages, { ...chatMessage, isRead: false }],
            }
          : chat
      )
    );

    setMessage("");
  };

  const selectChat = (chat) => {
    setSelectedChat(chat);

    if (client && client.connected) {
      client.publish({
        destination: `/app/read/admin/${chat.nickname}`,
        body: JSON.stringify({ nickname: chat.nickname }),
      });
    }

    setActiveChats((prevChats) =>
      prevChats.map((c) =>
        c.nickname === chat.nickname
          ? {
              ...c,
              messages: c.messages.map((msg) =>
                !msg.isRead ? { ...msg, isRead: true } : msg
              ),
            }
          : c
      )
    );
  };

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{ width: "30%", borderRight: "1px solid #ccc", padding: "10px" }}
      >
        <h4>Active Chats</h4>
        {activeChats.map((chat, index) => (
          <div
            key={index}
            onClick={() => selectChat(chat)}
            style={{
              cursor: "pointer",
              marginBottom: "10px",
              color: "blue",
              fontWeight:
                selectedChat?.nickname === chat.nickname ? "bold" : "normal",
            }}
          >
            Chat with {chat.name || `User ${chat.nickname}`}
          </div>
        ))}
      </div>
      <div style={{ width: "70%", padding: "10px" }}>
        {selectedChat ? (
          <>
            <div
              style={{
                height: "400px",
                overflowY: "auto",
                border: "1px solid #ccc",
                marginBottom: "10px",
                padding: "10px",
              }}
            >
              {selectedChat.messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems:
                      msg.nickname === "admin" ? "flex-end" : "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      backgroundColor:
                        msg.nickname === "admin" ? "#007bff" : "#f0f0f0",
                      color: msg.nickname === "admin" ? "white" : "black",
                      padding: "10px",
                      borderRadius: "8px",
                      maxWidth: "70%",
                    }}
                  >
                    <div>{msg.content}</div>
                    {msg.nickname === "admin" && (
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
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
            {typing && (
              <div style={{ fontStyle: "italic", color: "#888" }}>
                User is typing...
              </div>
            )}
            <div style={{ display: "flex" }}>
              <input
                type="text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleTyping();
                }}
                style={{
                  flex: 1,
                  marginRight: "10px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  padding: "10px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p>Select a chat to start messaging.</p>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
