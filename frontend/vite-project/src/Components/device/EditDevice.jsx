import React, { useState, useEffect } from "react";
import { getDeviceById, updateDevice } from "../utils/ApiFunctions";
import { useNavigate, useParams } from "react-router-dom";

const EditDevice = () => {
  const { id } = useParams();
  const [device, setDevice] = useState({
    description: "",
    address: "",
    maxHourlyConsumption: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const deviceData = await getDeviceById(id);
        setDevice(deviceData);
      } catch (error) {
        console.error("Error fetching device:", error);
      }
    };

    fetchDevice();
  }, [id]);

  const handleChange = (e) => {
    setDevice({ ...device, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDevice(id, device);
      setSuccessMessage("Device updated successfully!");

      setTimeout(() => {
        navigate("/devices");
      }, 2000);
    } catch (error) {
      setSuccessMessage("Failed to update device.");
      console.error("Error updating device:", error);
    }
  };

  return (
    <div>
      <h2>Edit Device</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Update Device</button>
      </form>

      {successMessage && (
        <div style={{ marginTop: "20px" }}>
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default EditDevice;
