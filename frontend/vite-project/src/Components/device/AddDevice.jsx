import React, { useEffect, useState } from "react";
import { createDevice, getAllUsers } from "../utils/ApiFunctions";
import { useNavigate } from "react-router-dom";

const AddDevice = () => {
  const [device, setDevice] = useState({
    description: "",
    address: "",
    maxHourlyConsumption: "",
    userId: "",
  });
  const [users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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

  const handleChange = (e) => {
    setDevice({ ...device, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    if (
      !device.description ||
      !device.address ||
      !device.maxHourlyConsumption ||
      !device.userId
    ) {
      setErrorMessage("All fields are required.");
      return false;
    }
    if (
      isNaN(device.maxHourlyConsumption) ||
      device.maxHourlyConsumption <= 0
    ) {
      setErrorMessage("Max Consumption must be a positive number.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    try {
      await createDevice(device);
      setSuccessMessage("Device added successfully!");
      setDevice({
        description: "",
        address: "",
        maxHourlyConsumption: "",
        userId: "",
      });
    } catch (error) {
      setErrorMessage("Failed to add device.");
      console.error("Error adding device:", error);
    }
  };

  const goToDeviceList = () => {
    navigate("/devices");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Add Device</h2>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}{" "}
        {/* Display error message */}
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={device.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={device.address}
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxHourlyConsumption"
          placeholder="Max Consumption"
          value={device.maxHourlyConsumption}
          onChange={handleChange}
        />
        <select name="userId" value={device.userId} onChange={handleChange}>
          <option value="" disabled>
            Select User
          </option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstName} {}
            </option>
          ))}
        </select>
        <button type="submit">Add Device</button>
      </form>

      {successMessage && (
        <div style={{ marginTop: "20px" }}>
          <p>{successMessage}</p>
          <button onClick={goToDeviceList}>Go to Devices List</button>
        </div>
      )}
    </div>
  );
};

export default AddDevice;
