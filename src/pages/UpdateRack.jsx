import { useEffect, useState } from "react"

import { getWarehouse } from "../context/Warehousecontext";

import { updateRack } from "../context/RackContext";

export const UpdateRack = ({ rack, onClose, warehousedata, onUpdate }) => {

    const [form, setForm] = useState({
        name: rack.name || '',
        warehouse_id: rack.warehouse_id || '',
        capacity: rack.capacity || '',
        description: rack.description || ''
    })

    
    const handleChange = (e) => {
        const {name, value} = e.target;

        setForm({...form, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            await updateRack(rack.id, form);
            alert('Rack Updated success!');
            onUpdate();
            onClose();
        }catch(error){
            console.log('Error update rack', error);
            alert('failed to udpate rack')
        }
    }
    

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

            <div className="relative z-10 bg-white backdrop-blur-md w-96 p-6 rounded-lg shadow-xl">
                <h1 className="text-center text-xl font-bold mb-5">Update Rack</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className="w-full mb-4 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                        <select
                            name="warehouse_id"
                            value={form.warehouse_id}
                            onChange={handleChange}
                            className="w-full mb-4 border border-gray-300 rounded-lg p-2"
                        >
                            {warehousedata.map((w) => (
                                <option value={w.id} key={w.id}>
                                    {w.name}
                                </option>
                            ))}
                        </select>

                    <input
                        type="number"
                        name="capacity"
                        value={form.capacity}
                        onChange={handleChange}
                        placeholder="Capacity"
                        className="w-full mb-4 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Description"
                        className="w-full mb-4 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex justify-end gap-3">
                        <button
                            type="submit"
                            className="bg-blue-700 text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-600 transition"
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-700 text-white py-2 px-4 rounded-lg font-bold hover:bg-red-600 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )
}

