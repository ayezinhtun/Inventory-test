import { createContext, useContext, useEffect, useState } from "react";

import { supabase } from "../../supabase/supabase-client";
import { useAuth } from "./AuthContext";

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {

    const { user } = useAuth();

    const [profile, setProfile] = useState(null);

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    // this is for profile page
    const fetchProfile = async () => {
        if (!user) {
            setProfile(null);
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from('user_profile')
            .select('*')
            .eq('id', user.id)
            .single()

        if (!error) setProfile(data);
        setLoading(false);
    }

    
    // this is for to shwo user list in usermanagement
    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("user_profile").select("*");

        if (error) console.error("Error fetching users:", error.message);
        else setUsers(data);

        setLoading(false);
    }

    //update role

    // const updateUserRole = async(id, newRole) => {
    //     const {error} = await supabase.from("user_profile").update({role: newRole}).eq("id", id);

    //     if(error) {
    //         alert("Failed to udpate role: " + error.message);
    //         return false;
    //     }

    //     setUsers(prev => prev.map(u=> u.id === id ? {...u, role: newRole} : u));


    //     alert("Role udpated successfully");
    //     return true;
    // }


    // In UserProfileContext.jsx
    const updateUserRole = async (id, newRole) => {
        // Backup current role
        const currentRole = users.find(u => u.id === id)?.role;

        // Optimistic update
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));

        const { error } = await supabase
            .from("user_profile")
            .update({ role: newRole })
            .eq("id", id);

        if (error) {
            // Rollback if failed , meaning when failed to place in the user with the old current role
            setUsers(prev => prev.map(u => u.id === id ? { ...u, role: currentRole } : u));
            alert("Failed to update role: " + error.message);
            return false;
        }

        alert("Role updated successfully");

        // setRoleChanges(prev => {
        //     const updated = { ...prev };
        //     delete updated[id];
        //     return updated;
        // });

        // if (!success) {
        //     alert("Failed to update role");
        // }
        
        return true;
    };

    //delete user

    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure to delete this user?")) return;
        const { error } = await supabase.from("user_profile").delete().eq("id", id);
        if (error) alert(error.message);
        else setUsers(prev => prev.filter(u => u.id !== id));
    }


    useEffect(() => {
        fetchProfile();
        fetchUsers();
    }, [user]);

    return (
        <UserProfileContext.Provider value={{ profile, users, loading, fetchUsers, updateUserRole, deleteUser }}>
            {children}
        </UserProfileContext.Provider>
    )
};

export const useUserProfiles = () => useContext(UserProfileContext);