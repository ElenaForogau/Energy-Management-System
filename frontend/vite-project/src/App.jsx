import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Components/homePage/HomePage.jsx";
import Login from "./Components/authentication/Login.jsx";
import Registration from "./Components/authentication/Registration.jsx";
import { AuthProvider } from "./Components/authentication/AuthProvider.jsx";
import DeviceList from "./Components/device/DeviceList.jsx";
import AddDevice from "./Components/device/AddDevice.jsx";
import EditDevice from "./Components/device/EditDevice.jsx";
import UserList from "./Components/user/UserList.jsx";
import EditUser from "./Components/user/EditUser.jsx";
import AddUser from "./Components/user/AddUser.jsx";
import UserDashboard from "./Components/user/UserDashboard.jsx";
import ProtectedRoute from "./Components/authentication/ProtectedRoute.jsx";
import Chat from "./Components/chat/Chat.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reg" element={<Registration />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/chat-1" element={<Chat />} />

          {}
          <Route
            path="/devices"
            element={
              <ProtectedRoute>
                <DeviceList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/devices/add"
            element={
              <ProtectedRoute>
                <AddDevice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/devices/edit/:id"
            element={
              <ProtectedRoute>
                <EditDevice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/edit/:userId"
            element={
              <ProtectedRoute>
                <EditUser />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
