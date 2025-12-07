import { useEffect, useState } from "react";
import { useDeviceRequests } from "../context/DeviceRequestContext";

export default function InstallMyRequests() {
  const { listInstallMine } = useDeviceRequests();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await listInstallMine();
      console.log('install mine:', data);
      setRows(data);
    })();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">My Install Requests</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Device</th>
            <th className="px-4 py-2 text-left">Model</th>
            <th className="px-4 py-2 text-left">Serial</th>
            <th className="px-4 py-2 text-left">Target</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.map(r => (
            <tr key={r.id}>
              <td className="px-4 py-2">{r.device_name}</td>
              <td className="px-4 py-2">{r.model || "-"}</td>
              <td className="px-4 py-2">{r.serial_number || "-"}</td>
              <td className="px-4 py-2">
                {r.target_rack?.warehouse?.name || "-"} / {r.target_rack?.name || "-"}
              </td>
              <td className="px-4 py-2">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}