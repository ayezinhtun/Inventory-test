import { LayoutDashboard, Package, User, ClipboardList, ClipboardPlus, CheckSquare, Shield } from 'lucide-react';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserProfiles } from '../context/UserProfileContext';

export default function Sidebar() {
  const { logOut } = useAuth();
  const { profile } = useUserProfiles();
  const role = profile?.role;

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate('/login');
  }

  return (
    <div className="w-64 bg-white shadow-xl h-full fixed left-0 top-0 z-40 flex flex-col">
      <div className="p-4 flex items-center space-x-3">
        <img src={logo} alt="Logo" className="h-10 w-10" />
        <div>
          <h1 className="font-bold text-gray-900 text-lg">Inventory Manager</h1>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link
          to="/"
          className="flex items-center mb-4 px-3 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 hover:border-blue-700 transition"
        >
          <LayoutDashboard className="h-5 w-5 mr-2" />
          <span>Warehouse</span>
        </Link>

        <Link
          to="/racks"
          className="flex items-center px-3 py-4 rounded-xl border border-gray-300 hover:bg-gray-100 transiton hover:border-blue-700"
        >
          <Package className="h-5 w-5 mr-2" />
          <span>Racks</span>
        </Link>
        {(role === 'admin' || role === 'manager') && (
          <Link
            to="/devices/new"
            className="flex items-center px-3 py-4 rounded-xl border border-gray-300 hover:bg-gray-100 hover:border-blue-700 transition"
          >
            <Package className="h-5 w-5 mr-2" />
            <span>Add Device</span>
          </Link>
        )}

        <Link to="/devices" className="flex items-center px-3 py-4 rounded-xl border border-gray-300 hover:bg-gray-100 hover:border-blue-700 transition">
          <Package className="h-5 w-5 mr-2" />
          <span>Devices</span>
        </Link>




        {role && (
          <div className="mt-4 space-y-2">

            {(role === 'manager' || role === 'admin') && (
              <Link
                to="/users"
                className="flex items-center px-3 py-4 rounded-xl border border-gray-300 hover:bg-gray-100 transiton hover:border-blue-700"
              >
                <User className="h-5 w-5 mr-2" />
                <span>User Management</span>
              </Link>
            )}


            {role === 'manager' && (
              <Link to="/install/manager" className="flex items-center px-3 py-4 rounded-xl border border-gray-300 hover:bg-gray-100 hover:border-blue-700 transition">
                <CheckSquare className="h-5 w-5 mr-2" />
                <span>Install Manager Queue</span>
              </Link>
            )}

            {role === 'engineer' && (
              <Link to="/install/new" className="flex items-center px-3 py-4 rounded-xl border border-gray-300 hover:bg-gray-100 hover:border-blue-700 transition">
                <ClipboardPlus className="h-5 w-5 mr-2" />
                <span>New Install</span>
              </Link>
            )}

            {role === 'engineer' && (
              <Link to="/relocation/new" className="flex items-center px-3 py-4 rounded-xl border border-gray-300 hover:bg-gray-100 hover:border-blue-700 transition">
                <ClipboardList className="h-5 w-5 mr-2" />
                <span>New Relocation</span>
              </Link>
            )}


            {role === 'admin' && (
              <>
                <Link
                  to="/install/admin"
                  className="flex items-center px-3 py-4 rounded-xl border border-gray-300 hover:bg-gray-100 hover:border-blue-700 transition"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  <span>Install Admin Queue</span>
                </Link>

                <Link
                  to="/install/physical"
                  className="flex items-center px-3 py-4 rounded-xl border border-gray-300 hover:bg-gray-100 hover:border-blue-700 transition"
                >
                  <CheckSquare className="h-5 w-5 mr-2" />
                  <span>Physical Install</span>
                </Link>
              </>
            )}
            {role === 'manager' && (
              <Link
                to="/relocation/manager"
                className="flex items-center px-3 py-4 rounded-xl border border-gray-300 hover:bg-gray-100 hover:border-blue-700 transition"
              >
                <CheckSquare className="h-5 w-5 mr-2" />
                <span>Relocation Manager Queue</span>
              </Link>
            )}

            {role === 'engineer' && (
              <Link
                to="/install/mine"
                className="flex items-center px-3 py-4 rounded-xl border border-gray-300 hover:bg-gray-100 hover:border-blue-700 transition"
              >
                <ClipboardList className="h-5 w-5 mr-2" />
                <span>My Install Requests</span>
              </Link>
            )}

            {role === 'admin' && (
              <>
                <Link
                  to="/relocation/admin"
                  className="flex items-center px-3 py-4 rounded-xl border border-gray-300 hover:bg-gray-100 hover:border-blue-700 transition"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  <span>Relocation Admin Queue</span>
                </Link>

                <Link
                  to="/relocation/physical"
                  className="flex items-center px-3 py-4 rounded-xl border border-gray-300 hover:bg-gray-100 hover:border-blue-700 transition"
                >
                  <CheckSquare className="h-5 w-5 mr-2" />
                  <span>Relocation Physical</span>
                </Link>
              </>
            )}

            {role === 'engineer' && (
              <Link
                to="/relocation/mine"
                className="flex items-center px-3 py-4 rounded-xl border border-gray-300 hover:bg-gray-100 hover:border-blue-700 transition"
              >
                <ClipboardList className="h-5 w-5 mr-2" />
                <span>My Relocation Requests</span>
              </Link>
            )}

          </div>
        )}
      </nav>

      <button onClick={handleLogout} className="bg-red-500 text-white py-2 rounded m-3">
        Logout
      </button>
    </div>
  );
}