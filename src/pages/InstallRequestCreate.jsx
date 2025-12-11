import { useEffect, useState } from "react";
import { useDeviceRequests } from "../context/DeviceRequestContext";
import { supabase } from "../../supabase/supabase-client";

export default function InstallRequestCreate() {
  const { createInstallRequest, listDevicesAvailableForInstall } = useDeviceRequests();
  const [warehouses, setWarehouses] = useState([]);
  const [racks, setRacks] = useState([]);

  const [availableDevices, setAvailableDevices] = useState([]);
  
  const [selectedDeviceId, setSelectedDeviceId] = useState("");

  const [unitBusy, setUnitBusy] = useState(false);
  const [unitMsg, setUnitMsg] = useState("");

  //for valide not to exceed to the max unit in the rack

  const [rackCapacity, setRackCapacity] = useState(null);
  const [rackFull, setRackFull] = useState(false);
  const [rackFullMsg, setRackFullMsg] = useState("");


  const [form, setForm] = useState({
    device_name: "",
    model: "",
    serial_number: "",
    type: "",
    target_warehouse_id: "",
    target_rack_id: "",
    unit: ""
  });


  //for validate that  in the rack have full unit or not

  useEffect(() => {
    (async () => {
      // Reset when no rack chosen
      if (!form.target_rack_id) {
        setRackCapacity(null);
        setRackFull(false);
        setRackFullMsg("");
        return;
      }

      // Fetch rack capacity
      const { data: rack, error: rackErr } = await supabase
        .from("racks")
        .select("id, name, capacity")
        .eq("id", form.target_rack_id)
        .single();

      if (rackErr) {
        console.error("load rack capacity failed", rackErr);
        setRackCapacity(null);
        setRackFull(false);
        setRackFullMsg("");
        return;
      }
      setRackCapacity(rack?.capacity ?? null);

      // Count currently occupied units (active devices with non-null unit)
      const { count, error: cntErr } = await supabase
        .from("devices")
        .select("id", { count: "exact", head: true })
        .eq("rack_id", form.target_rack_id)
        .eq("status", "active")
        .not("unit", "is", null);

      if (cntErr) {
        console.error("count devices failed", cntErr);
        setRackFull(false);
        setRackFullMsg("");
        return;
      }

      const capacity = Number(rack?.capacity || 0);
      const used = Number(count || 0);
      const full = capacity > 0 && used >= capacity;

      setRackFull(full);
      setRackFullMsg(
        full ? `Rack is full (${used}/${capacity}). Choose another rack.` : ""
      );
    })();
  }, [form.target_rack_id]);


  // Load warehouses and available devices
  useEffect(() => {
    (async () => {
      const { data: wh } = await supabase.from("warehouses").select("id,name");
      setWarehouses(wh || []);
      const devs = await listDevicesAvailableForInstall();
      setAvailableDevices(devs || []);
    })();
  }, []);

  // Load racks when warehouse changes
  useEffect(() => {
    (async () => {
      if (!form.target_warehouse_id) { setRacks([]); return; }
      const { data: rk } = await supabase
        .from("racks")
        .select("id,name,warehouse_id")
        .eq("warehouse_id", form.target_warehouse_id);
      setRacks(rk || []);
    })();
  }, [form.target_warehouse_id]);

  // When a device is selected, prefill the form fields
  const onSelectDevice = (id) => {
    setSelectedDeviceId(id);
    if (!id) {
      setForm((f) => ({ ...f, device_name: "", model: "", serial_number: "", type: "" }));
      return;
    }
    const d = availableDevices.find(x => x.id === id);
    if (d) {
      setForm((f) => ({
        ...f,
        device_name: d.name || "",
        model: d.model || "",
        serial_number: d.serial_number || "",
        type: d.type || ""
      }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createInstallRequest(form);
      alert("Install request submitted (status: pending_approval)");
      setSelectedDeviceId("");
      setForm({
        device_name: "", model: "", serial_number: "", type: "",
        target_warehouse_id: "", target_rack_id: "", unit: ""
      });
    } catch (err) {
      alert(err?.message || "Failed");
      console.error(err);
    }
  };

  useEffect(() => {
    if (!form.target_rack_id || !form.unit?.trim()) {
      setUnitBusy(false);
      setUnitMsg("");
      return;
    }

    const unitNumber = Number(form.unit);

    if (rackCapacity && unitNumber > rackCapacity) {
      setUnitBusy(true);
      setUnitMsg(`Unit exceeds rack capacity (${rackCapacity}).`);
      return;
    }


    (async () => {
      const { data, error } = await supabase
        .from("devices")
        .select("id")
        .eq("rack_id", form.target_rack_id)
        .eq("unit", unitNumber)
        .eq("status", "active")
        .limit(1);

      if (error) {
        console.error("install unit check failed", error);
        setUnitBusy(false);
        setUnitMsg("");
        return;
      }

      const occupied = (data?.length ?? 0) > 0;
      setUnitBusy(occupied);
      setUnitMsg(
        occupied ? "This rack/unit is already occupied. Choose another unit." : ""
      );
    })();
  }, [form.target_rack_id, form.unit, rackCapacity]);



  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">New Install Request</h2>

      {/* Device selector: choose existing (no location) OR leave blank for manual entry */}
      <div className="mb-3">
        <label className="block text-sm text-gray-700 mb-1">Select existing device (optional)</label>
        <select
          className="border rounded p-2 w-full"
          value={selectedDeviceId}
          onChange={(e) => onSelectDevice(e.target.value)}
        >
          <option value=""> None (enter details manually) </option>
          {availableDevices.map(d => (
            <option key={d.id} value={d.id}>
              {d.name} {d.serial_number ? `(${d.serial_number})` : ""}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={submit} className="space-y-3">
        <input
          className="border rounded p-2 w-full"
          placeholder="Device Name"
          value={form.device_name}
          onChange={e => setForm({ ...form, device_name: e.target.value })}
        />
        <div className="grid grid-cols-3 gap-3">
          <input className="border rounded p-2" placeholder="Model"
            value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} />
          <input className="border rounded p-2" placeholder="Serial Number"
            value={form.serial_number} onChange={e => setForm({ ...form, serial_number: e.target.value })} />
          <input className="border rounded p-2" placeholder="Type"
            value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} />
        </div>

        <select className="border rounded p-2 w-full" value={form.target_warehouse_id}
          onChange={e => setForm({ ...form, target_warehouse_id: e.target.value, target_rack_id: "" })}>
          <option value="">Select Warehouse</option>
          {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>

        <select className="border rounded p-2 w-full" value={form.target_rack_id}
          onChange={e => setForm({ ...form, target_rack_id: e.target.value })} disabled={!racks.length}>
          <option value="">Select Rack</option>
          {racks.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>

        <input className="border rounded p-2 w-full" placeholder="Unit (optional)" type="number"
          value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} />

        {unitBusy && (
          <p className="text-sm text-red-600">{unitMsg}</p>
        )}

        {rackFull && (
          <p className="text-sm text-red-600">{rackFullMsg}</p>
        )}

        <div className="text-right">
          <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={unitBusy || rackFull}>Submit</button>
        </div>
      </form>
    </div>
  );
}