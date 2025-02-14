import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../utils/ApiFunctions";
import { useNavigate } from "react-router-dom";
import "./UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      console.log("Deleting user with ID:", userId);
      try {
        await deleteUser(userId);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleEdit = (userId) => {
    navigate(`/users/edit/${userId}`);
  };

  const handleAddUser = () => {
    navigate("/users/add");
  };

  const handleBack = () => {
    navigate("/devices");
  };

  return (
    <div>
      <h2>User List</h2>
      <button className="user-button add" onClick={handleAddUser}>
        Add User
      </button>{" "}
      {/* Butonul Add User */}
      <button className="user-button back" onClick={handleBack}>
        Back
      </button>{" "}
      {/* Butonul Back */}
      <table className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.roles.map((role) => role.name).join(", ")}</td>
              <td>
                <button
                  className="user-button edit"
                  onClick={() => handleEdit(user.id)}
                >
                  Edit
                </button>
                <button
                  className="user-button delete"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
