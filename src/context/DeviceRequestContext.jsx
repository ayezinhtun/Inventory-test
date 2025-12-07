import { createContext, useContext, useMemo } from "react";
import { supabase } from "../../supabase/supabase-client";
import { useUserProfiles } from "./UserProfileContext";

const DeviceRequestContext = createContext();

export const DeviceRequestProvider = ({ children }) => {
    const { profile } = useUserProfiles();

    const api = useMemo(() => ({

        createDevice: async ({ name, model, serial_number, type, status = 'inactive' }) => {
            const { data, error } = await supabase
                .from("devices")
                .insert([{ name, model, serial_number, type, status }]) // no warehouse_id, rack_id, unit
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        
        // Devices
        listDevices: async () => {
            const { data, error } = await supabase
                .from("devices")
                .select(`
          id, name, model, serial_number, type, status, unit,
          rack: racks(name, id, warehouse: warehouses(name, id))
        `)
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data;
        },
        listDevicesAvailableForInstall: async () => {
            const { data, error } = await supabase
                .from("devices")
                .select("id, name, model, serial_number, type, status, warehouse_id, rack_id")
                .neq("status", "active"); // remove the IS NULL filters
            if (error) throw error;
            return data;
        },
        // Install flow
        createInstallRequest: async (payload) => {
            const { data, error } = await supabase
                .from("install_requests")
                .insert([{ ...payload, requested_by: profile.id }])
                .select().single();
            if (error) throw error; return data;
        },
        listInstallMine: async () => {
            const { data, error } = await supabase
                .from("install_requests")
                .select(`
          id, device_name, model, serial_number, type, status, unit,
          target_rack: racks(name, id, warehouse: warehouses(name, id)),
          created_at
        `).order("created_at", { ascending: false });
            if (error) throw error; return data;
        },
        listInstallManagerQueue: async () => {
            const { data, error } = await supabase
                .from("install_requests")
                .select(`id, device_name, model, serial_number, type, unit, status, target_rack: racks(name, id, warehouse: warehouses(name, id)), created_at`)
                .eq("status", "pending_approval");
            if (error) throw error; return data;
        },
        listInstallPhysicalQueue: async () => {
            const { data, error } = await supabase
                .from("install_requests")
                .select(`id, device_name, serial_number, status,
             target_rack: racks(name, id, warehouse: warehouses(name, id))`)
                .eq("status", "pending_physical_install");
            if (error) throw error;
            return data;
        },

        listDevicesEligibleForRelocation: async () => {
            const { data, error } = await supabase
                .from("devices")
                .select(`
      id, name, serial_number, type, status, unit,
      warehouse_id, rack_id,
      rack: racks(id, name, warehouse: warehouses(id, name))
    `)
                .eq("status", "active")
                .not("warehouse_id", "is", null)
                .not("rack_id", "is", null)
                .order("name", { ascending: true });
            if (error) throw error;
            return data;
        },
        managerApproveInstall: async (id) => {
            const { data, error } = await supabase.from("install_requests")
                .update({ status: "pending_admin_approval", manager_id: profile.id })
                .eq("id", id).select().single();
            if (error) throw error; return data;
        },
        managerRejectInstall: async (id) => {
            const { data, error } = await supabase.from("install_requests")
                .update({ status: "rejected_manager", manager_id: profile.id })
                .eq("id", id).select().single();
            if (error) throw error; return data;
        },
        listInstallAdminQueue: async () => {
            const { data, error } = await supabase.from("install_requests")
                .select(`id, device_name, model, serial_number, type, unit, status, target_rack: racks(name, id, warehouse: warehouses(name, id)), created_at`)
                .eq("status", "pending_admin_approval");
            if (error) throw error; return data;
        },
        adminApproveInstall: async (id) => {
            const { data, error } = await supabase.from("install_requests")
                .update({ status: "pending_physical_install", admin_id: profile.id })
                .eq("id", id).select().single();
            if (error) throw error; return data;
        },
        adminRejectInstall: async (id) => {
            const { data, error } = await supabase.from("install_requests")
                .update({ status: "rejected_admin", admin_id: profile.id })
                .eq("id", id).select().single();
            if (error) throw error; return data;
        },
        markPhysicalInstalled: async (id) => {
            const { data, error } = await supabase.from("install_requests")
                .update({ status: "complete", physical_by: profile.id })
                .eq("id", id).select().single();
            if (error) throw error; return data;
        },

        // Relocation flow
        createRelocationRequest: async (payload) => {
            const { data, error } = await supabase
                .from("relocation_requests")
                .insert([{ ...payload, requested_by: profile.id }])
                .select().single();
            if (error) throw error; return data;
        },
        listRelocationMine: async () => {
            const { data, error } = await supabase.from("relocation_requests")
                .select(`id, device:devices(name, serial_number), status, unit, target_rack: racks(name, id, warehouse: warehouses(name, id)), created_at`)
                .order("created_at", { ascending: false });
            if (error) throw error; return data;
        },
        listRelocationManagerQueue: async () => {
            const { data, error } = await supabase.from("relocation_requests")
                .select(`id, device:devices(name, serial_number), status, unit, target_rack: racks(name, id, warehouse: warehouses(name, id)), created_at`)
                .eq("status", "pending_approval");
            if (error) throw error; return data;
        },
        managerApproveRelocation: async (id) => {
            const { data, error } = await supabase.from("relocation_requests")
                .update({ status: "pending_admin_approval", manager_id: profile.id })
                .eq("id", id).select().single();
            if (error) throw error; return data;
        },
        managerRejectRelocation: async (id) => {
            const { data, error } = await supabase.from("relocation_requests")
                .update({ status: "rejected_manager", manager_id: profile.id })
                .eq("id", id).select().single();
            if (error) throw error; return data;
        },
        listRelocationAdminQueue: async () => {
            const { data, error } = await supabase.from("relocation_requests")
                .select(`id, device:devices(name, serial_number), status, unit, target_rack: racks(name, id, warehouse: warehouses(name, id)), created_at`)
                .eq("status", "pending_admin_approval");
            if (error) throw error; return data;
        },
        adminApproveRelocation: async (id) => {
            const { data, error } = await supabase.from("relocation_requests")
                .update({ status: "pending_physical_move", admin_id: profile.id })
                .eq("id", id).select().single();
            if (error) throw error; return data;
        },
        adminRejectRelocation: async (id) => {
            const { data, error } = await supabase.from("relocation_requests")
                .update({ status: "rejected_admin", admin_id: profile.id })
                .eq("id", id).select().single();
            if (error) throw error; return data;
        },

        listRelocationPhysicalQueue: async () => {
            const { data, error } = await supabase
                .from("relocation_requests")
                .select(`id, device:devices(name, serial_number), status,
             target_rack: racks(name, id, warehouse: warehouses(name, id))`)
                .eq("status", "pending_physical_move");
            if (error) throw error;
            return data;
        },
        markPhysicalMoved: async (id) => {
            const { data, error } = await supabase.from("relocation_requests")
                .update({ status: "complete", physical_by: profile.id })
                .eq("id", id).select().single();
            if (error) throw error; return data;
        },
    }), [profile?.id]);

    return (
        <DeviceRequestContext.Provider value={api}>
            {children}
        </DeviceRequestContext.Provider>
    );
};

export const useDeviceRequests = () => useContext(DeviceRequestContext);