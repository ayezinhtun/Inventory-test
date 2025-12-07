import { useEffect, useState } from "react";
import { useDeviceRequests } from "../context/DeviceRequestContext";

export default function InstallPhysicalQueue() {
  const { listInstallPhysicalQueue, markPhysicalInstalled } = useDeviceRequests();
  const [rows, setRows] = useState([]);
  const load = async () => setRows(await listInstallPhysicalQueue());
  useEffect(() => { load(); }, []);
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Awaiting Physical Install</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Device</th>
            <th className="px-4 py-2 text-left">Target</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.map(r => (
            <tr key={r.id}>
              <td className="px-4 py-2">{r.device_name}</td>
              <td className="px-4 py-2">{r.target_rack?.warehouse?.name} / {r.target_rack?.name}</td>
              <td className="px-4 py-2">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={async () => { await markPhysicalInstalled(r.id); await load(); }}
                >
                  Mark Installed
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}