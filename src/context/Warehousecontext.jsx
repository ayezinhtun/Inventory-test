import {supabase} from '../../supabase/supabase-client'

export const createWarehouse = async (warehouse) => {
    const {data, error} = await supabase
    .from('warehouses')
    .insert([warehouse])

    if(error) throw error;
    return data;
};

export const getWarehouse = async () => {
    const {data, error} = await supabase
    .from('warehouses')
    .select('*')
    .order('created_at', {ascending: false});

    if(error) throw error;

    return data;
};

export const updateWarehouse = async (id, values) => {
    const {data, error} = await supabase
    .from('warehouses')
    .update(values)
    .eq('id', id)

    if(error) throw error;
    return data;
};


export const deleteWarehouse = async  (id) => {
    const {error} = await supabase
    .from('warehouses')
    .delete()
    .eq('id', id)

    if(error) throw error;
}