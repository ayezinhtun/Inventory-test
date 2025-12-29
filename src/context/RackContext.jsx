import { data } from "react-router-dom";
import { supabase } from "../../supabase/supabase-client";

export const getRacks = async () => {
    const {data, error} = await supabase
    .from('racks')
    .select(`
        id,
        name, 
        capacity,
        description,
        warehouse_id,
        warehouses(name)    
    `)
    .order('created_at', {ascending: false})

    if(error) throw error;

    return data;
}


export const createRack = async (rack) => {
    const {data, error } = await supabase
    .from('racks')
    .insert([rack])
    .select();


    if(error) throw error;

    return data;
}


export const deleteRack = async (id) => {
    const {error} = await supabase
    .from('racks')
    .delete()
    .eq('id', id);

    if(error) {
        console.log('Error in delete rack', error) 
    }
}

export const updateRack = async (id, values) => {
    const {data, error} = await supabase
    .from('racks')
    .update(values)
    .eq('id', id)

    if(error) throw error;
    return data;
}