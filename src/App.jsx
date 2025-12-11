import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useUserProfiles } from "./context/UserProfileContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddWarehouse from "./pages/CreateWarehouse";
import ProtectedRoute from "./ProtectedRoute";
import RackPage from "./pages/Rack";
import DeviceList from "./pages/DeviceList";
import InstallRequestCreate from "./pages/InstallRequestCreate";
import RelocationRequestCreate from "./pages/RelocationRequestCreate";
import AddDevice from "./pages/AddDevice";

import InstallMyRequests from "./pages/InstallMyRequests";
import InstallManagerQueue from "./pages/InstallManagerQueue";
import InstallAdminQueue from "./pages/InstallAdminQueue";
import InstallPhysicalQueue from "./pages/InstallPhysicalQueue";

import RelocationAdminQueue from './pages/RelocationAdminQueue';
import RelocationPhysicalQueue from "./pages/RelocationPhysicalQueue";
import RelocationMyRequests from "./pages/RelocationMyRequests";

import RelocationManagerQueue from "./pages/RelocateManagerQueue";
// Optional role guard (create src/components/RequireRole.jsx as previously shown)
import RequireRole from "./components/RequrireRole";

function App() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfiles();

  useEffect(() => {
    if (user && profile && window.location.pathname === "/login") {
      if (profile.role === "engineer") navigate("/profile", { replace: true });
      else navigate("/", { replace: true });
    }
  }, [user, profile, navigate]);

  if (loading || profileLoading) return <p>Loading...</p>;

  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} replace />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addwarehouse" element={<AddWarehouse />} />
        <Route path="/racks" element={<RackPage />} />

        <Route
          path="/install/physical"
          element={
            <RequireRole roles={['admin', 'manager']}>
              <InstallPhysicalQueue />
            </RequireRole>
          }
        />

        <Route path="/devices" element={<DeviceList />} />

        <Route
          path="/install/new"
          element={
            <RequireRole roles={['engineer']}>
              <InstallRequestCreate />
            </RequireRole>
          }
        />

        <Route
          path="/relocation/new"
          element={
            <RequireRole roles={['engineer']}>
              <RelocationRequestCreate />
            </RequireRole>
          }
        />

        <Route
          path="/devices/new"
          element={
            <RequireRole roles={['admin', 'manager']}>
              <AddDevice />
            </RequireRole>
          }
        />

        <Route
          path="/install/mine"
          element={
            <RequireRole roles={['engineer', 'manager', 'admin']}>
              <InstallMyRequests />
            </RequireRole>
          }
        />

        <Route
          path="/install/manager"
          element={
            <RequireRole roles={['manager']}>
              <InstallManagerQueue />
            </RequireRole>
          }
        />

        <Route
          path="/install/admin"
          element={
            <RequireRole roles={['admin']}>
              <InstallAdminQueue />
            </RequireRole>
          }
        />

        <Route
          path="/relocation/manager"
          element={
            <RequireRole roles={['manager']}>
              <RelocationManagerQueue />
            </RequireRole>
          }
        />

        <Route
          path="/relocation/admin"
          element={
            <RequireRole roles={['admin']}>
              <RelocationAdminQueue />
            </RequireRole>
          }
        />

        <Route
          path="/relocation/physical"
          element={
            <RequireRole roles={['admin', 'manager']}>
              <RelocationPhysicalQueue />
            </RequireRole>
          }
        />

        <Route
          path="/relocation/mine"
          element={
            <RequireRole roles={['engineer', 'manager', 'admin']}>
              <RelocationMyRequests />
            </RequireRole>
          }
        />


      </Route>




      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;