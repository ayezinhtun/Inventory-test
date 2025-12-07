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

function App() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfiles();

  useEffect(() => {
    if(user && profile && window.location.pathname === '/login') {
        if(profile.role === 'engineer') navigate('/profile', {replace: true});
        else navigate('/', {replace: true});
    }
  }, [user, profile, navigate])

  if (loading || profileLoading) return <p>Loading...</p>;

  return (
    <Routes>
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} replace />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addwarehouse" element={<AddWarehouse />} />


      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
