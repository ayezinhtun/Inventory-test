import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase-client";
import { useUserProfiles } from "../context/UserProfileContext";

export default function UserManagement() {

    const { users, updateUserRole, deleteUser } = useUserProfiles();

    const [filterUser, setFilterUser] = useState('');

    const [roleChanges, setRoleChanges] = useState({});

    const handleRoleChange = (id, role) => {
        setRoleChanges((prev) => ({
            ...prev,
            [id]: role
        }));
    }

    const saveRole = async (id) => {
        const newRole = roleChanges[id];
        if (!newRole) return;

        const success = await updateUserRole(id, newRole);

        if (success) {
            // Remove saved change after success
            setRoleChanges(prev => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });
        } else {
            // Rollback in roleChanges too so dropdown shows original role
            setRoleChanges(prev => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });
        }
    };



    const filteredUsers = users.filter(u => u.full_name.toLowerCase().includes(filterUser.toLowerCase()));

    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="bg-white shadow p-3 rounded-sm">
                    <p className="font-bold text-lg text-gray-700">Total User</p>

                    <p className="font-semibold text-gray-600">{users.length}</p>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-auto">
                <div className="flex me-2 items-center justify-end py-3 border-b border-gray-200">
                    <div className="flex items-center border border-gray-300 rounded-lg p-2 w-[500px] focus-within:ring-1 focus-within:ring-blue-500">
                        <Search className="w-5 h-5 text-gray-400 mr-2" />

                        <input type="text" placeholder="Search..." value={filterUser} onChange={(e) => setFilterUser(e.target.value)} className="flex-1 outline-none border-none focus:border-none focus:ring-0" />

                    </div>
                </div>


                <table className="min-w-full divide-y divide-blue-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>Action</th>

                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-blue-200">
                        {filteredUsers.map((u) => (
                            <tr key={u.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-700">{u.full_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-700">{u.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-700">
                                    <select name="" id="" value={roleChanges[u.id] || u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)} className="border rounded p-1">
                                        <option value="admin">Admin</option>
                                        <option value="manager">Manager</option>
                                        <option value="engineer">Engineer</option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        onClick={() => saveRole(u.id)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg me-3 hover:bg-blue-500"
                                    >
                                        Save
                                    </button>
                                    <button onClick={() => DeleteUser(u.id)} className="bg-red-700 py-2 px-4 text-white rounded-lg hover:bg-red-600">Delete</button>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>

        </div>
    )
}