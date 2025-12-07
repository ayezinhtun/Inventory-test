import { useEffect, useState } from "react"
import { getWarehouse } from "../context/Warehousecontext"
import AddWarehouse from "./CreateWarehouse";
import { deleteWarehouse } from "../context/Warehousecontext";
import UpdateWarehouseModal from "./UpdateWarehouse";
import { Search } from "lucide-react";



export default function Dashboard() {
    const [warehouses, setWarehouses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

   

    const fetchWarehouse = async () => {
        try {
            const data = await getWarehouse();

            setWarehouses(data);
        } catch {
            console.error('Error feching warehouse:', error);
        }
    }

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure to delete this warehouse");

        if (!isConfirmed) return;

        try {
            await deleteWarehouse(id);
            fetchWarehouse();
        } catch (error) {
            console.error(error);
            alert('Failed to delete warehouse');
        }
    }

    const handleEdit = (warehouse) => {
        setSelectedWarehouse(warehouse);
        setShowUpdateModal(true);
    }

    const filterWarehouses  = warehouses.filter((w) => 
        w.name.toLowerCase().includes(searchTerm.toLocaleLowerCase())
    )


     useEffect(() => {
        fetchWarehouse();
    }, []);
    
    return (
        <div className="flex flex-col">

            <div className="text-end mb-3">
                <button onClick={() => setShowModal(true)} className="bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg">Add Warehouse</button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="bg-white shadow p-3 rounded-sm">
                    <p className="font-bold text-lg text-gray-700">Total Warehouse</p>

                    <p className="font-semibold text-gray-600">{warehouses.length}</p>
                </div>
            </div>




            <div className="bg-white shadow rounded-lg overflow-auto">
                <div className="flex me-2 items-center justify-end py-3 border-b border-gray-200">
                    <div className="flex items-center border border-gray-300 rounded-lg p-2 w-[500px] focus-within:ring-1 focus-within:ring-blue-500">
                        <Search className="w-5 h-5 text-gray-400 mr-2" />

                        <input type="text" placeholder="Search by Name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 outline-none border-none focus:border-none focus:ring-0" />

                    </div>
                </div>


                <table className="min-w-full divide-y divide-blue-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>Action</th>

                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-blue-200">
                        {filterWarehouses.length === 0 ? (
                            <tr>
                                <td className="px-6 py-4 text-center text-gray-500" colSpan={3}>
                                    No warehouse found
                                </td>
                            </tr>
                        ) : (
                            filterWarehouses.map((w) => (
                                <tr key={w.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-700">{w.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-700">{w.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-700">{w.description}</td>
                                    <td>
                                        <button className="bg-blue-700 me-3 py-2 px-4 text-white rounded-lg hover:bg-blue-600" onClick={() => handleEdit(w)}>Update</button>
                                        <button className="bg-red-700 py-2 px-4 text-white rounded-lg hover:bg-red-600" onClick={() => handleDelete(w.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))

                        )}


                    </tbody>
                </table>
            </div>

            {showModal && (
                <AddWarehouse onClose={() => setShowModal(false)} onAdd={fetchWarehouse} />
            )}

            {showUpdateModal && selectedWarehouse && (
                <UpdateWarehouseModal
                    warehouse={selectedWarehouse}
                    onClose={() => setShowUpdateModal(false)}
                    onUpdate={fetchWarehouse}
                />
            )}

        </div>
    )
}