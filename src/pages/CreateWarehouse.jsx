import { useState } from "react";

import { createWarehouse } from "../context/Warehousecontext";
import { useNavigate } from "react-router-dom";


const AddWarehouse = ({ onClose, onAdd }) => {

    const [form, setForm] = useState({
        name: '',
        location: '',
        description: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createWarehouse(form);
            setForm({ name: '', location: '', description: '' });
            alert("Warehouse Added success!");
            onAdd();
            onClose();

        } catch (error) {
            console.error('Error adding warehouse', error);
            alert("failed to add Warehouse");
        }
    }

    const handleCancel = () => {
        navigate('/');
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay: slightly dark + blur */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

            {/* Modal content */}
            <div className="relative z-10 bg-white backdrop-blur-md w-96 p-6 rounded-lg shadow-xl">
                <h1 className="text-center text-xl font-bold mb-5">Add Warehouse</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className="w-full mb-4 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="Location"
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

export default AddWarehouse;