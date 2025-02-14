// EditUser.jsx
import React, { useState, useEffect } from "react";
import { getUserById, updateUser } from "../utils/ApiFunctions";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    roles: [],
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(userId);
        setUser(userData);
        console.log("User data fetched:", userData);
      } catch (error) {
        setErrorMessage("Error fetching user details");
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleRoleChange = (e) => {
    const selectedRoles = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setUser({ ...user, roles: selectedRoles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(userId, user);
      setSuccessMessage("User updated successfully!");
      setTimeout(() => navigate("/users"), 2000);
    } catch (error) {
      setErrorMessage("Failed to update user.");
      console.error("Error updating user:", error);
    }
  };

  return (
    <div>
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={user.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={user.lastName}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          readOnly
        />

        <select
          multiple
          value={user.roles.map((role) => role.name)}
          onChange={handleRoleChange}
        >
          <option value="ROLE_USER">User</option>
          <option value="ROLE_ADMIN">Admin</option>
        </select>

        <button type="submit">Update User</button>
      </form>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default EditUser;
