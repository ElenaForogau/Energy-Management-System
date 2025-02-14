import React, { useEffect, useState } from "react";
import { getAllDevicesForUser } from "../utils/ApiFunctions";
import Notifications from "../websockets/Notifications";
import "./UserList.css";
import HistoricalConsumption from "../chart/HistoricalConsumption";
import { Link, useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [devices, setDevices] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedUserId = sessionStorage.getItem("userId");

    if (!token || !storedUserId) {
      alert("Please log in to access the dashboard!");
      navigate("/login");
      return;
    }

    setUserId(storedUserId);
  }, [navigate]);

  useEffect(() => {
    const fetchDevices = async () => {
      if (!userId) return;
      try {
        const devicesData = await getAllDevicesForUser(userId);
        setDevices(devicesData);
      } catch (error) {
        console.error("Eroare la obținerea dispozitivelor:", error);
      }
    };

    fetchDevices();
  }, [userId]);

  return (
    <div>
      <Notifications userId={userId} /> {}
      <h2>User Dashboard</h2>
      <h3>My Devices</h3>
      <table className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Address</th>
            <th>Max Hourly Consumption</th>
            <th>View History</th>
          </tr>
        </thead>
        <tbody>
          {devices.length > 0 ? (
            devices.map((device, index) => (
              <tr key={device.id || device.deviceId}>
                <td>{index + 1}</td>
                <td>{device.description}</td>
                <td>{device.address}</td>
                <td>{device.maxHourlyConsumption}</td>
                <td>
                  <button onClick={() => setSelectedDevice(device.deviceId)}>
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No devices assigned.</td>
            </tr>
          )}
        </tbody>
      </table>
      {selectedDevice && <HistoricalConsumption deviceId={selectedDevice} />}
      {}
      <div style={{ marginTop: "20px" }}>
        <Link to="/chat-1">
          <button style={{ padding: "10px 20px", fontSize: "16px" }}>
            Go to Chat
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
