import { useEffect, useState } from "react";

import { useDeviceRequests } from "../context/DeviceRequestContext";

import { supabase } from "../../supabase/supabase-client";

export default function InstallRequestCreate() {
    const { createInstallRequests, listDevicesAvailableForInstall } = useDeviceRequests();

    const [warehouses, setWarehouses] = useState([]);

    const [racks, setRacks] = useState([]);

    const [availableDevices, setAvailableDevices] = useState([]);

    const [selectedDeviceId, setSelectedDeviceId] = useState("");

    const [unitBusy, setUnitBusy] = useState(false);

    const [unitMsg, setUnitMsg] = useState("");

    const [rackCapacity, setRackCapacity] = useState(null);

    const [rackFull, setRackFull] = useState(false);

    const [rackFullMsg, setRackFullMsg] = useState("");


    const [form, setForm] = useState({
        device_name: "",
        model: "",
        serial_nubmer: "",
        type: "",
        target_warehouse_id: "",
        target_rack_id: "",
        unit: ""
    });

    useEffect(() => {
        (async () => {
            if(!form.target_rack_id) {
                setRackCapacity(null);
                setRackFull(false);
                setRackFullMsg("");
                return;
            }

            const {data: rack, error: rackErr} = await supabase
                .from('racks')
                .select("id, name, capacity")
                .eg("id", form.target_rack_id)
                .single();

            if(rackErr) {
                console.log("load rack capacity failed", rackErr);
                setRackCapacity(null);
                setRackFull(false);
                setRackFullMsg("");
                return;
            }

            setRackCapacity(rack?.capacity ?? null);


            const {count, error: cntErr} =  await supabase
                .from('devices')
                .select('id', {count: 'exact', head: true})
                .eq('rack_id', form.target_rack_id)
                .eq('status', 'active')
                .not('unit', 'is', null);

            if(cntErr) {
                console.error("count devices failed", cntErr);
                setRackFull(false);
                setRackFullMsg("");
                return;
            }

            const capacity = Number(rack?.capacity || 0);
            const used = Number(count || 0);

            const full = capacity > 0 && used>=capacity;

            setRackFull(full);
            setRackFullMsg(
                full ? `Rack is full (${used}/${capacity}). Choose another rack.`: ""
            )

        }) ();
    }, [form.target_rack_id]);

    useEffect(() => {
        (async () => {
            const {data: wh} = await supabase.from('warehouses').select('id, name');
            setWarehouses(wh || []);
            

            const devs = await listDevicesAvailableForInstall();
            setAvailableDevices(devs || []);
        }) ();
    }, []);

    useEffect(() => {
        (async () => {
            if(!form.target_warehouse_id) {setRacks([]); return}
            const {data: rk} = await supabase
                .from("racks")
                .select("id, name, warehouse_id")
                .eq("warehouse_id", form.target_warehouse_id);
            setRacks(rk || []);
        }) ();



    }, [form.target_warehouse_id]);

    const onSelectDevice = (id) => {
        setSelectedDeviceId(id);
    }


    const submit = async (e) => {
        e.preventDefault();

        try {
            await createInstallRequests(form);
            alert("Install request submited (status: pending_approval)");
            selectedDeviceId("");
            setForm({
                device_name: "", model: "", serial_number: "", type: "",
                target_warehouse_id: "", target_rack_id: "", unit: ""
            });
        }catch (err) {
            alert(err?.message || "Failed");
            console.error(err);
        }
    }
}