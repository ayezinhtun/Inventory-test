import { useEffect, useState } from "react";

import { getWarehouse } from "../context/Warehousecontext";

import AddWarehouse from "./CreateWarehouse";

import { deleteWarehouse } from "../context/Warehousecontext";

import UpdateWarehouseModal from "./UpdateWarehouse";

import { Search } from "lucide-react";


export default function Dashboard() {
    const [warehouses, setWarehouses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    cosnt [selectedWarehouse, setSelectedWarehouses] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchWarehouse = async () => {
        try {
            const data = await getWarehouse();

            setWarehouses(data);
        }catch {
            console.error('Error fetching warehouse:', error);
        }
    }

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure to delete this warehouse");

        if(!isConfirmed) return;

        try{
            await deleteWarehouse(id);
            fetchWarehouse();
        }catch (error) {
            console.error(error);
            alert('Failed to delete warehouse');
        }
    }

    const handleEdit = (warehouse) => {
        setSelectedWarehouses(warehouse);
        setShowUpdateModal(true);
    }

    const filterWarehouses = warehouses.filter((w) => 
        w.name.toLowerCase().includes(searchTerm.toLocaleLowerCase())
    )

    useEffect(() => {
        fetchWarehouse();
    }, []);

    return (
        <div>
            
        </div>
    )
}