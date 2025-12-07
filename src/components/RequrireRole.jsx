import { Navigate } from "react-router-dom";
import { useUserProfiles } from "../context/UserProfileContext";

export default function RequireRole({ roles, children }) {
  const { profile, loading } = useUserProfiles();

  if (loading) return null; // or a spinner
  if (!profile) return <Navigate to="/login" replace />;

  return roles.includes(profile.role) ? children : <Navigate to="/" replace />;
}