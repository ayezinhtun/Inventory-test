// src/pages/InstallAdminQueue.jsx
import { useEffect, useState } from "react";
import { useDeviceRequests } from "../context/DeviceRequestContext";

export default function InstallAdminQueue() {
  const { listInstallAdminQueue, adminApproveInstall, adminRejectInstall } = useDeviceRequests();
  const [rows, setRows] = useState([]);

  const load = async () => setRows(await listInstallAdminQueue());
  useEffect(() => { load(); }, []);


  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Install Requests (Admin)</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Device</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.map(r => (
            <tr key={r.id}>
              <td className="px-4 py-2">{r.device_name}</td>
              <td className="px-4 py-2">{r.status}</td>
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
    </div>
  );
}