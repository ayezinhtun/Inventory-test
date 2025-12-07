import { useEffect, useState } from "react";
import { useDeviceRequests } from "../context/DeviceRequestContext";

export default function InstallManagerQueue() {
  const { listInstallManagerQueue, managerApproveInstall, managerRejectInstall } = useDeviceRequests();
  const [rows, setRows] = useState([]);

  const load = async () => setRows(await listInstallManagerQueue());
  useEffect(() => { load(); }, []);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Install Requests (Manager)</h2>
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
          {rows.map(r => (
            <tr key={r.id}>
              <td className="px-4 py-2">{r.device_name}</td>
              <td className="px-4 py-2">{r.serial_number || "-"}</td>
              <td className="px-4 py-2">{r.target_rack?.warehouse?.name} / {r.target_rack?.name}</td>
              <td className="px-4 py-2 space-x-2">
                <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={async () => { await managerApproveInstall(r.id); await load(); }}>
                  Approve
                </button>
                <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={async () => { await managerRejectInstall(r.id); await load(); }}>
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