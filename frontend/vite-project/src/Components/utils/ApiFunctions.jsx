import axios from "axios";

export const api = axios.create({
  baseURL: "http://users.localhost",
});

export const apiDevices = axios.create({
  baseURL: "http://device.localhost",
});

export const getHeader = (isMultipart = false) => {
  const token = sessionStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

export async function registerUser(registration) {
  try {
    const response = await api.post("/auth/register-user", registration);
    return response.data;
  } catch (error) {
    if (error.reeponse && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`User registration error : ${error.message}`);
    }
  }
}

export async function loginUser(credentials) {
  try {
    const response = await api.post("/auth/login", credentials);
    console.log("Login Response:", response.data);

    const { token, roles, id } = response.data;
    const role = roles[0];

    sessionStorage.setItem("token", token);
    sessionStorage.setItem("role", role);
    sessionStorage.setItem("userId", id);

    return { token, role, id };
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}

export async function deleteUser(userId) {
  try {
    const response = await api.delete(`/users/delete/${userId}`, {
      headers: getHeader(),
    });
    console.log("Delete User Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Delete User Error:", error);
    throw new Error(`Error deleting user: ${error.message}`);
  }
}

export async function getUser(userId, token) {
  try {
    const response = await api.get(`/users/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getUserById(userId) {
  try {
    const response = await api.get(`/users/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
}

export async function updateUser(userId, userData) {
  try {
    const response = await api.put(`/users/update/${userId}`, userData, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
}

export async function getAllUsers() {
  try {
    const response = await api.get("/users/all", {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
}

export async function createDevice(device) {
  try {
    const response = await apiDevices.post("/devices/create", device, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error creating device: ${error.message}`);
  }
}

export async function getAllDevices() {
  try {
    const response = await apiDevices.get("/devices/all", {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getDeviceById(deviceId) {
  try {
    const response = await apiDevices.get(`/devices/${deviceId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateDevice(deviceId, deviceData) {
  try {
    const response = await apiDevices.put(
      `/devices/update/${deviceId}`,
      deviceData,
      {
        headers: getHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating device:", error);
    throw error;
  }
}

export async function assignDeviceToUser(deviceId, userId) {
  try {
    const response = await apiDevices.put(
      `/devices/assign/${deviceId}`,
      { userId },
      {
        headers: getHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error assigning device to user: ${error.message}`);
  }
}

export async function deleteDevice(deviceId) {
  try {
    const response = await apiDevices.delete(`/devices/delete/${deviceId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function navigateToDashboard(navigate) {
  const role = sessionStorage.getItem("role");
  if (role === "ROLE_ADMIN") {
    navigate("/admin-dashboard");
  } else if (role === "ROLE_USER") {
    navigate("/user-dashboard");
  } else {
    navigate("/login");
  }
}

export async function getAllDevicesForUser(userId) {
  console.log("User ID trimis:", userId);
  try {
    const response = await apiDevices.get(`/devices/user/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(`Error fetching user devices: ${error.message}`);
  }
}

export const fetchConsumptionData = async (deviceId, date) => {
  const url = `http://monitoring.localhost/api/consumption/${deviceId}/${date}`;
  console.log("Fetching data from:", url);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};
