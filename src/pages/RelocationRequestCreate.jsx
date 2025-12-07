import { useEffect, useState } from "react";
import { useDeviceRequests } from "../context/DeviceRequestContext";
import { supabase } from "../../supabase/supabase-client";

export default function RelocationRequestCreate() {
  const { createRelocationRequest, listDevicesEligibleForRelocation } = useDeviceRequests();

  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [selectedDevice, setSelectedDevice] = useState(null);

  const [warehouses, setWarehouses] = useState([]);
  const [racks, setRacks] = useState([]);

  const [unitBusy, setUnitBusy] = useState(false);
  const [unitMsg, setUnitMsg] = useState("");

  const [rackCapacity, setRackCapacity] = useState(null);
  const [rackFull, setRackFull] = useState(false);
  const [rackFullMsg, setRackFullMsg] = useState("");

  const [form, setForm] = useState({
    device_id: "",
    target_warehouse_id: "",
    target_rack_id: "",
    unit: ""
  });
  useEffect(() => {
    (async () => {
      if (!form.target_rack_id) {
        setRackCapacity(null);
        setRackFull(false);
        setRackFullMsg("");
        return;
      }

      // Capacity
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

      //  Count used (exclude the device being moved if it is already in this rack)
      const filters = supabase
        .from("devices")
        .select("id", { count: "exact", head: true })
        .eq("rack_id", form.target_rack_id)
        .eq("status", "active")
        .not("unit", "is", null);

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

  // Load eligible devices and warehouses
  useEffect(() => {
    (async () => {
      const list = await listDevicesEligibleForRelocation();
      setDevices(list || []);
      const { data: wh } = await supabase.from("warehouses").select("id,name");
      setWarehouses(wh || []);
    })();
  }, []);

  // Load racks for the chosen target warehouse
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

  // Handle device select: set selectedDevice and form.device_id
  const onSelectDevice = (id) => {
    setSelectedDeviceId(id);
    setForm(f => ({ ...f, device_id: id }));
    const d = devices.find(x => x.id === id);
    setSelectedDevice(d || null);
  };

  const sameLocation =
    selectedDevice &&
    form.target_warehouse_id &&
    form.target_rack_id &&
    selectedDevice.rack?.warehouse?.id === form.target_warehouse_id &&
    selectedDevice.rack?.id === form.target_rack_id;

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (!form.device_id) throw new Error("Select a device to relocate");
      if (!form.target_warehouse_id || !form.target_rack_id) throw new Error("Select target warehouse and rack");
      if (sameLocation) throw new Error("Target location is the same as current location");

      await createRelocationRequest(form);
      alert("Relocation request submitted (status: pending_approval)");
      setSelectedDeviceId("");
      setSelectedDevice(null);
      setForm({ device_id: "", target_warehouse_id: "", target_rack_id: "", unit: "" });
      setRacks([]);
    } catch (err) {
      alert(err?.message || "Failed");
      console.error(err);
    }
  };

  useEffect(() => {
    (async () => {
      if (!form.target_rack_id || !form.unit?.trim()) {
        setUnitBusy(false);
        setUnitMsg("");
        return;
      }

      const { data, error } = await supabase
        .from('devices')
        .select('id')
        .eq('unit', form.unit.trim())
        .eq('status', 'active')
        .limit(1);

      if (error) {
        console.error('unit check failed', error);
        setUnitBusy(false);
        setUnitMsg("");
        return;
      }

      const occupied = (data?.length ?? 0) > 0 && (!selectedDevice || data[0].id !== selectedDevice.id);
      setUnitBusy(occupied);
      setUnitMsg(occupied ? "This rack/unit is already occupied. Choose another unit" : "");

    })();
  }, [form.target_rack_id, form.unit, selectedDevice?.id]);


  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">New Relocation Request</h2>

      {/* Device selector: only active + has old location */}
      <div className="mb-3">
        <label className="block text-sm text-gray-700 mb-1">Select Device</label>
        <select
          className="border rounded p-2 w-full"
          value={selectedDeviceId}
          onChange={(e) => onSelectDevice(e.target.value)}
        >
          <option value="">-- Select Device --</option>
          {devices.map(d => (
            <option key={d.id} value={d.id}>
              {d.name} {d.serial_number ? `(${d.serial_number})` : ""} — {d.rack?.warehouse?.name}/{d.rack?.name}
            </option>
          ))}
        </select>
      </div>

      {/* Old location panel */}
      {selectedDevice && (
        <div className="mb-4 p-3 border rounded bg-gray-50">
          <div className="font-medium mb-1">Current Location</div>
          <div className="text-sm text-gray-700">
            Warehouse: {selectedDevice.rack?.warehouse?.name || "-"}
          </div>
          <div className="text-sm text-gray-700">
            Rack: {selectedDevice.rack?.name || "-"}
          </div>
          <div className="text-sm text-gray-700">
            Unit: {selectedDevice.unit || "-"}
          </div>
        </div>
      )}

      <form onSubmit={submit} className="space-y-3">

        {/* Target location */}
        <label className="block text-sm text-gray-700">Target Warehouse</label>
        <select className="border rounded p-2 w-full" value={form.target_warehouse_id}
          onChange={e => setForm({ ...form, target_warehouse_id: e.target.value, target_rack_id: "" })}>
          <option value="">Select Warehouse</option>
          {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>

        <label className="block text-sm text-gray-700">Target Rack</label>
        <select className="border rounded p-2 w-full" value={form.target_rack_id}
          onChange={e => setForm({ ...form, target_rack_id: e.target.value })} disabled={!racks.length}>
          <option value="">Select Rack</option>
          {racks.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>

        <input className="border rounded p-2 w-full" placeholder="Unit (optional)" type="number"
          value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} />

        {
          unitBusy && (
            <p className="text-sm text-red-600">{unitMsg}</p>
          )
        }

        {rackFull && (
          <p className="text-sm text-red-600">{rackFullMsg}</p>
        )}

        {sameLocation && (
          <p className="text-sm text-red-600">Target location is the same as current location.</p>
        )}

        <div className="text-right">
          <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={sameLocation || unitBusy || rackFull}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}