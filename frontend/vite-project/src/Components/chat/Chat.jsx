import React from "react";
import UserChat from "./UserChat";
import AdminChat from "./AdminChat";

const AppChat = () => {
  const role = sessionStorage.getItem("role");

  if (!role) {
    alert("Please log in to access the chat!");
    window.location.href = "/login";
    return null;
  }

  return (
    <div>
      {role === "ROLE_USER" && <UserChat />}
      {role === "ROLE_ADMIN" && <AdminChat />}
    </div>
  );
};

export default AppChat;
