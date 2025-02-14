import React, { useEffect, useState } from "react";
import {
  getAllDevices,
  getAllUsers,
  deleteDevice,
} from "../utils/ApiFunctions";
import { useNavigate } from "react-router-dom";
import "./DeviceList.css";

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Please log in to access the devices!");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const devicesData = await getAllDevices();
        console.log(devicesData);
        setDevices(devicesData);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchDevices();
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Invalid device ID:", id);
      return;
    }
    try {
      await deleteDevice(id);
      setDevices(devices.filter((device) => device.id !== id));
    } catch (error) {
      console.error("Error deleting device:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/devices/edit/${id}`);
  };

  const goToUserList = () => {
    navigate("/users");
  };

  const goToChat = () => {
    navigate("/chat-1");
  };

  return (
    <div>
      <h2>Device List</h2>
      <button
        className="device-button add"
        onClick={() => navigate("/devices/add")}
      >
        Add Device
      </button>
      <button className="device-button user" onClick={goToUserList}>
        View Users
      </button>
      <button className="device-button chat" onClick={goToChat}>
        Go to Chat
      </button>
      <table className="device-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Address</th>
            <th>Max Consumption</th>
            <th>User</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {devices.length > 0 ? (
            devices.map((device, index) => (
              <tr key={device.deviceId || index}>
                <td>{index + 1}</td>
                <td>{device.description}</td>
                <td>{device.address}</td>
                <td>{device.maxHourlyConsumption}</td>
                <td>{device.userId ? device.userId : "No User"}</td>
                <td>
                  <button
                    className="device-button edit"
                    onClick={() => handleEdit(device.deviceId)}
                  >
                    Edit
                  </button>
                  <button
                    className="device-button delete"
                    onClick={() => {
                      console.log(
                        "Delete button clicked for device ID:",
                        device.deviceId
                      );
                      handleDelete(device.deviceId);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No devices found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DeviceList;
