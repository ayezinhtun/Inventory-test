import { createContext, useContext, useEffect, useState } from "react";

import {supabase} from '../../supabase/supabase-client';
import {useAuth} from './AuthContext';

const UserPorfileContext = createContext();

export const UserPorfileProvider = ({children}) => {
    const {user} = useAuth();

    const [profile, setProfile] = useState(null);
    const [users, setUsers] = useState([]);
    const [regions, setRegions] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchProfile = async () => {
        if(!user) return;

        const {data} = await supabase
            .from("user_profile")
            .select('*')
            .eq('id', user.id)
            .single();

        setProfile(data);
    };

    const fetchUsers = async () => {
        const {data} = await supabase
            .from("user_profile")
            .select('*')

            setUsers(data || []);
    };

    const fetchRegions = async () => {
        const {data} = await supabase
            .from('region')
            .select("name");

        setRegions(data?.map(r => r.name ) || []);
    };


    const fetchWarehouses = async () => {
        const {data} = await supabase
            .from('warehouse')
            .select('name')

        setWarehouses(data?.map(w=> w.name) || [])
    };



    const updateUserPermission = async (id, updates) => {
        const perv = users.find(u => u.id === id);

        setUsers(prevUsers => 
            prevUsers.map(u => u.id === id ? {...u, ...updates} : u)
        );

        const {error} = await supabase
            .from("user_profile")
            .update(updates)
            .eq('id', id);
        if(error) {
            setUsers(prevUsers =>
                prevUsers.map(u => u.id === id ? prev : u)
            );

            alert(error.message);
        }

    };

    useEffect(() => {
        if(user) {
            fetchProfile();
            fetchUsers();
            fetchRegions();
            fetchWarehouses();
            setLoading(false);
        }

    }, [user]);


    return (
        <UserPorfileContext.Provider value={{profile, users, regions, warehouses, loading, updateUserPermission}}>
            {children}
        </UserPorfileContext.Provider>
    )

}

export const useUserProfiles = () => useContext(UserPorfileContext);

