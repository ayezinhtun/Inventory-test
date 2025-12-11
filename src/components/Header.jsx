import { useAuth } from "../context/AuthContext"; // adjust path
import { Search } from "lucide-react";
import { Link } from "react-router-dom";


export default function Header() {
  const { user } = useAuth();

  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <header className="bg-white shadow px-6 py-4 flex items-center justify-end sticky top-0 z-30">

      {/* User Avatar */}
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center text-white font-bold">
          {user?.user_metadata?.full_name?.charAt(0).toUpperCase() || "U"}
        </div>
      )}
    </header>
  );
}
