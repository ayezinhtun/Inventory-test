//for migraion

// create table user_profile (
//   id uuid primary key references auth.users(id) on delete cascade,
//   email text not null,     
//   role text check (role in ('admin', 'manager', 'engineer', 'user')) default 'user',
//   regions text[],
//   warehouses text[],
//   created_at timestamp with time zone default now()
// );




import { useEffect, useState } from "react";
import {
    Search,
    Trash2,
    Save
} from "lucide-react";

import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableHeadCell,
    TableCell,
    Checkbox
} from "flowbite-react";

import { useUserProfiles } from "../context/UserProfileContext";

export default function UserManagement() {
    const {
        users,
        regions,
        warehouses,
        loading,
        updateUserPermission
    } = useUserProfiles();

    const [search, setSearch] = useState("");
    const [editState, setEditState] = useState({});

    // Initialize editable state when users load
    useEffect(() => {
        const init = {};
        users.forEach(u => {
            init[u.id] = {
                role: u.role,
                region: u.region || [],
                warehouse: u.warehouse || []
            };
        });
        setEditState(init);
    }, [users]);

    const filteredUsers = users.filter(u =>
        u.full_name.toLowerCase().includes(search.toLowerCase())
    );

    //this is for when click checkbox to add value and already have value to remove
    // userid, key is region or warehouse, vlaue is the value of region or warehouse
    const toggleArrayValue = (userId, key, value) => {
        setEditState(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],

                // aleready have to remove value and when not already have to add value
                [key]: prev[userId][key].includes(value)
                    ? prev[userId][key].filter(v => v !== value)
                    : [...prev[userId][key], value]
            }
        }));
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">User Management</h1>

            {/* Search */}
            <div className="flex items-center border rounded-lg px-4 py-2 w-[300px] mb-5">
                <Search className="w-5 h-5 text-gray-500 mr-2" />
                <input
                    type="text"
                    placeholder="Search by name"
                    className="flex-1 outline-none border-none focus:ring-0"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="bg-white border rounded-lg overflow-x-auto">
                <Table hoverable>
                    <TableHead>
                        <TableRow>
                            <TableHeadCell>Name</TableHeadCell>
                            <TableHeadCell>Role</TableHeadCell>
                            <TableHeadCell>Region</TableHeadCell>
                            <TableHeadCell>Warehouse</TableHeadCell>
                            <TableHeadCell>Action</TableHeadCell>
                        </TableRow>
                    </TableHead>

                    <TableBody className="divide-y">
                        {filteredUsers.map(user => {
                            const edit = editState[user.id];

                            if (!edit) return null;

                            return (
                                <TableRow key={user.id}>
                                    {/* Name */}
                                    <TableCell className="font-medium">
                                        {user.full_name}
                                    </TableCell>

                                    {/* Role */}
                                    <TableCell>
                                        <select
                                            value={edit.role}
                                            onChange={(e) =>
                                                setEditState(prev => ({
                                                    ...prev,
                                                    [user.id]: {
                                                        ...prev[user.id],
                                                        role: e.target.value
                                                    }
                                                }))
                                            }
                                            className="border rounded px-2 py-1"
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="manager">Manager</option>
                                            <option value="engineer">Engineer</option>
                                            <option value="user">User</option>
                                        </select>
                                    </TableCell>

                                    {/* Region */}
                                    <TableCell>
                                        <div className="flex flex-wrap gap-3">
                                            {regions.map(r => (
                                                <label
                                                    key={r}
                                                    className="flex items-center gap-2 text-sm"
                                                >
                                                    <Checkbox
                                                        checked={edit.region.includes(r)}
                                                        onChange={() =>
                                                            toggleArrayValue(user.id, "region", r)
                                                        }
                                                    />
                                                    <span>{r}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </TableCell>

                                    {/* Warehouse */}
                                    <TableCell>
                                        <div className="flex flex-wrap gap-3">
                                            {warehouses.map(w => (
                                                <label
                                                    key={w}
                                                    className="flex items-center gap-2 text-sm"
                                                >
                                                    <Checkbox
                                                        checked={edit.warehouse.includes(w)}
                                                        onChange={() =>
                                                            toggleArrayValue(user.id, "warehouse", w)
                                                        }
                                                    />
                                                    <span>{w}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </TableCell>

                                    {/* Action */}
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() =>
                                                    updateUserPermission(user.id, {
                                                        role: edit.role,
                                                        region: edit.region,
                                                        warehouse: edit.warehouse
                                                    })
                                                }
                                                className="flex items-center px-4 py-2 bg-[#26599F] text-white rounded-lg hover:bg-blue-900"
                                            >
                                                <Save className="w-4 h-4 mr-2" />
                                                Save
                                            </button>

                                            <Trash2 className="text-red-500 cursor-pointer" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
