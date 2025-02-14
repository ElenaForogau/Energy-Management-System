import React, { useEffect, useState } from "react";
import { connectWebSocket, disconnectWebSocket } from "./websocketClient";

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const savedNotifications =
      JSON.parse(sessionStorage.getItem("notifications")) || [];
    setNotifications(savedNotifications);

    const onMessageReceived = (message) => {
      console.log("Mesaj primit prin WebSocket:", message);

      setNotifications((prevNotifications) => {
        const updatedNotifications = [...prevNotifications, message];
        sessionStorage.setItem(
          "notifications",
          JSON.stringify(updatedNotifications)
        );
        return updatedNotifications;
      });
    };

    if (userId) {
      connectWebSocket(userId, onMessageReceived);
    } else {
      console.error("User ID invalid. Nu se poate conecta la WebSocket.");
    }

    return () => {
      disconnectWebSocket();
    };
  }, [userId]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        padding: "10px",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "5px",
        maxWidth: "300px",
        zIndex: 1000,
      }}
    >
      <h4>Notifications</h4>
      <ul>
        {notifications.map((notif, index) => (
          <li key={index}>
            {notif}
            <button
              style={{
                marginLeft: "10px",
                background: "red",
                color: "white",
                border: "none",
                cursor: "pointer",
                borderRadius: "5px",
              }}
              onClick={() => {
                setNotifications((prev) => {
                  const updated = prev.filter((_, i) => i !== index);
                  sessionStorage.setItem(
                    "notifications",
                    JSON.stringify(updated)
                  );
                  return updated;
                });
              }}
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
