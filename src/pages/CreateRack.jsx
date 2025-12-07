import { useEffect, useState } from "react";

import { getWarehouse } from '../context/Warehousecontext';

import { createRack } from "../context/RackContext";

const AddRack = ({ onClose, onAdd }) => {
    const [warehouses, setWarehouses] = useState([]);

    const [form, setForm] = useState({
        name: '',
        warehouse_id: '',
        capacity: '',
        description: ''
    })

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm({...form, [name]: value})
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            await createRack(form);
            setForm({name:'', warehouse_id:'', capacity:'', description:''});
            alert('Rack Added Success')
            onAdd();
            onClose();
        }catch (error) {
            console.error('Error Adding racks', error);
            alert('Failed to add Rack')
        }
    }
    const fetchWarehouse = async () => {
        const data = await getWarehouse();

        setWarehouses(data);
    }

    useEffect(() => {
        fetchWarehouse();
    }, []);
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

            <div className="relative z-10 bg-white backdrop-blur-md w-96 p-6 rounded-lg shadow-xl">
                <h1 className="text-center text-xl font-bold mb-5">Add Rack</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className="w-full mb-4 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select name="warehouse_id" value={form.warehouse_id} onChange={handleChange} id=""
                        className="w-full mb-4 border border-gray-300 rounded-lg p-2"
                    >
                        <option value="">
                            Select Warehouse
                        </option>
                        {warehouses.map((w) => (
                            <option key={w.id} value={w.id}>
                                {w.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        name="capacity"
                        value={form.capacity}
                        onChange={handleChange}
                        placeholder="Unit"
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
                            Add
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

export default AddRack;