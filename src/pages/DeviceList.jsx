import { useEffect, useState } from "react";
import { useDeviceRequests } from "../context/DeviceRequestContext";

export default function DeviceList() {
  const { listDevices } = useDeviceRequests();
  const [rows, setRows] = useState([]);

  useEffect(() => { (async () => setRows(await listDevices()))(); }, []);

  
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Devices</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Model</th>
            <th className="px-4 py-2 text-left">Serial</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Warehouse</th>
            <th className="px-4 py-2 text-left">Rack</th>
            <th className="px-4 py-2 text-left">Unit</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.map(d => (
            <tr key={d.id}>
              <td className="px-4 py-2">{d.name}</td>
              <td className="px-4 py-2">{d.model || "-"}</td>
              <td className="px-4 py-2">{d.serial_number || "-"}</td>
              <td className="px-4 py-2">{d.type || "-"}</td>
              <td className="px-4 py-2">{d.status}</td>
              <td className="px-4 py-2">{d.rack?.warehouse?.name || "-"}</td>
              <td className="px-4 py-2">{d.rack?.name || "-"}</td>
              <td className="px-4 py-2">{d.unit || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}