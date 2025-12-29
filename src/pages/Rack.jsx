import { Search, Warehouse } from "lucide-react";

import { useEffect, useState } from "react";
import { getRacks, deleteRack } from "../context/RackContext";


import AddRack from "./CreateRack";

import { UpdateRack } from "./UpdateRack";

import { getWarehouse } from "../context/Warehousecontext";

export default function RackPage() {

    const [racks, setRacks] = useState([]);

    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const [showUpdatedModal, setShowUpdateModal] = useState(false);

    const [selectedRack, setSelectedRack] = useState(null);

    const [warehousedata, setWarehousedata] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");


    const fetchRacks = async () => {
        try {
            const data = await getRacks();
            setRacks(data);
        } catch (error) {
            alert(error.message);
        }
    }

    const fetchWarehouses = async () => {
        try {
            const data = await getWarehouse();
            setWarehousedata(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure to delte this rack?");

        if (!isConfirmed) return;

        try {
            await deleteRack(id);
            fetchRacks();
        } catch (error) {
            alert('Failed to delete rack');
        }
    }

    const handleEdit = (rack) => {
        setSelectedRack(rack);
        setShowUpdateModal(true);
    }

    const filterRack = racks.filter((r) => 
      r.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    useEffect(() => {
        fetchRacks();
        fetchWarehouses();

    }, [])

    return (
        <div className="flex flex-col">

            <div className="text-end mb-3">
                <button onClick={() => setShowModal(true)} className="bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg">Add Rack</button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="bg-white shadow p-3 rounded-sm">
                    <p className="font-bold text-lg text-gray-700">Total Racks</p>

                    <p className="font-semibold text-gray-600">{racks.length}</p>
                </div>
            </div>




            <div className="bg-white shadow rounded-lg overflow-auto">
                <div className="flex me-2 items-center justify-end py-3 border-b border-gray-200">
                    <div className="flex items-center border border-gray-300 rounded-lg p-2 w-[500px] focus-within:ring-1 focus-within:ring-blue-500">
                        <Search className="w-5 h-5 text-gray-400 mr-2" />

                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name..." className="flex-1 outline-none border-none focus:border-none focus:ring-0" />

                    </div>
                </div>


                <table className="min-w-full divide-y divide-blue-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse Name</th>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-blue-200">
                        {filterRack.map((r) => (
                            <tr key={r.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-700">{r.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-700">{r.warehouses?.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-700">{r.capacity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-700">{r.description}</td>
                                <td>
                                    <button className="bg-blue-700 me-3 py-2 px-4 text-white rounded-lg hover:bg-blue-600" onClick={() => handleEdit(r)} >Update</button>
                                    <button className="bg-red-700 py-2 px-4 text-white rounded-lg hover:bg-red-600" onClick={() => handleDelete(r.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal &&
                <AddRack onClose={() => setShowModal(false)} onAdd={fetchRacks}
                />}

            {showUpdatedModal &&
                <UpdateRack
                    rack={selectedRack}
                    onClose={() => setShowUpdateModal(false)}
                    warehousedata={warehousedata}
                    onUpdate={fetchRacks}
                />
            }

        </div>



    )
}