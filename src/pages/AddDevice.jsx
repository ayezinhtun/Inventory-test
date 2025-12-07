import { useState } from "react";
import { useDeviceRequests } from "../context/DeviceRequestContext";

export default function AddDevice() {
  const { createDevice } = useDeviceRequests();
  const [form, setForm] = useState({
    name: "",
    model: "",
    serial_number: "",
    type: "",
    status: "inactive"
  });
  

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createDevice({
        name: form.name,
        model: form.model || null,
        serial_number: form.serial_number || null,
        type: form.type || null,
        status: form.status
      });
      alert("Device added (no location). Use Install Request to place it.");
      setForm({ name:"", model:"", serial_number:"", type:"", status:"inactive" });
    } catch (err) {
      alert(err?.message || "Failed to add device");
      console.error(err);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Add Device</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="border rounded p-2 w-full" placeholder="Name"
          value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <div className="grid grid-cols-3 gap-3">
          <input className="border rounded p-2" placeholder="Model"
            value={form.model} onChange={e=>setForm({...form, model:e.target.value})}/>
          <input className="border rounded p-2" placeholder="Serial Number"
            value={form.serial_number} onChange={e=>setForm({...form, serial_number:e.target.value})}/>
          <input className="border rounded p-2" placeholder="Type"
            value={form.type} onChange={e=>setForm({...form, type:e.target.value})}/>
        </div>
        <select className="border rounded p-2 w-full"
          value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
          <option value="inactive">Inactive</option>
          <option value="active">Active</option>
          <option value="retired">Retired</option>
        </select>
        <div className="text-right">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
        </div>
      </form>
    </div>
  );
}