import { Client } from "@stomp/stompjs";

const client = new Client({
  brokerURL: "ws://monitoring.localhost/ws",
  reconnectDelay: 5000,
  debug: function (str) {
    console.log(str);
  },
});

export const connectWebSocket = (userId, onMessageReceived) => {
  if (!userId) {
    console.error("Invalid userId. Cannot connect to WebSocket.");
    return;
  }

  client.onConnect = () => {
    console.log("Connected to WebSocket");

    client.subscribe(`/topic/notifications/${userId}`, (message) => {
      try {
        const parsedMessage = JSON.parse(message.body);
        onMessageReceived(parsedMessage);
      } catch (e) {
        console.warn("Received non-JSON message:", message.body);
        onMessageReceived(message.body);
      }
    });
  };

  client.onStompError = (frame) => {
    console.error("WebSocket error: " + frame.headers["message"]);
  };

  client.activate();
};

export const disconnectWebSocket = () => {
  if (client.connected) {
    client.deactivate();
    console.log("Disconnected from WebSocket");
  }
};
