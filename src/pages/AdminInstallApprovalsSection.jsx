import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserProfiles } from "../context/UserProfileContext";
import { useDeviceRequests } from "../context/DeviceRequestContext";

export default function AdminInstallApprovalsSection() {
  const { profile } = useUserProfiles();
  const { listInstallAdminQueue, adminApproveInstall, adminRejectInstall } = useDeviceRequests();
  const [rows, setRows] = useState([]);

  const load = async () => {
    const data = await listInstallAdminQueue();
    // Only show items waiting for Admin (manager already approved)
    const pendingOnly = (data || []).filter(r => r.status === "pending_admin_approval");
    setRows(pendingOnly);
  };

  useEffect(() => { load(); }, []);

  // Only admins should see this block
  if (profile?.role !== "admin") return null;

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Manager-approved Install Requests</h2>
        <Link to="/install/admin" className="text-blue-600 underline">
          Open Admin Queue
        </Link>
      </div>

      <p className="text-sm text-gray-600 mb-2">
        {rows.length} request(s) awaiting admin approval
      </p>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">No requests to review.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Device</th>
              <th className="px-4 py-2 text-left">Serial</th>
              <th className="px-4 py-2 text-left">Target</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {rows.slice(0, 5).map(r => (
              <tr key={r.id}>
                <td className="px-4 py-2">{r.device_name}</td>
                <td className="px-4 py-2">{r.serial_number || "-"}</td>
                <td className="px-4 py-2">{r.target_rack?.warehouse?.name || "-"} / {r.target_rack?.name || "-"}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded"
                    onClick={async () => { await adminApproveInstall(r.id); await load(); }}
                  >
                    Approve → Physical
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={async () => { await adminRejectInstall(r.id); await load(); }}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}