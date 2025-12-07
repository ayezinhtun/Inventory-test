import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase-client";

export default function UserManagement() {

    const [user, setUser] = useState([]);

    const [filterUser, setFilterUser] = useState('');

    const [roleChanges, setRoleChanges] = useState({});


    const fetchUser = async () => {
        const { data, error } = await supabase.from('user_profile').select('*')

        if (error) {
            console.log('Error in Fetching User ', error.message);
        } else {
            setUser(data);
        }
    }

    const SearchUser = user.filter((fu) =>
        fu.full_name.toLowerCase().includes(filterUser.toLowerCase())
    );


    const DeleteUser = async (id) => {
        const isConfirmed = window.confirm('Are you sure to delete this user');

        if (!isConfirmed) return;

        const { error } = await supabase
            .from('user_profile')
            .delete()
            .eq('id', id)

        if (error) throw new Error(error.message);

        return fetchUser();
    }

    // const UpdateUserRole = async (id, newRole) => {
    //     const {error} = await supabase
    //     .from('user_profile')
    //     .update({role: newRole})
    //     .eq('id', id);

    //     if(error) {
    //         console.error("Error udating role:", error.message);
    //     }else{
    //         fetchUser();
    //     }
    // }

    const handleRoleChange = (id, newRole) => {
        setRoleChanges((prev) => ({
            ...prev,
            [id]: newRole
        }));
    }

    const saveRole = async (id) => {
        const newRole = roleChanges[id];

        if (!newRole) return;

        const { error } = await supabase
            .from('user_profile')
            .update({ role: newRole })
            .eq('id', id);

        if (error) {
            console.error("Error updating role: ", error.message);
            alert("Failed to update role: " + error.message);
        } else {
            alert("Role updated successfully!");


            //this is for ui update
            setUser((prev) =>
                prev.map((u) =>
                    u.id === id ? { ...u, role: newRole } : u
                )
            );


            //this is to remove from tempory value 
            setRoleChanges((prev) => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });

            fetchUser();
        }
    }

    useEffect(() => {
        fetchUser();
    }, [])

    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="bg-white shadow p-3 rounded-sm">
                    <p className="font-bold text-lg text-gray-700">Total User</p>

                    <p className="font-semibold text-gray-600">{user.length}</p>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-auto">
                <div className="flex me-2 items-center justify-end py-3 border-b border-gray-200">
                    <div className="flex items-center border border-gray-300 rounded-lg p-2 w-[500px] focus-within:ring-1 focus-within:ring-blue-500">
                        <Search className="w-5 h-5 text-gray-400 mr-2" />

                        <input type="text" placeholder="Search..." onChange={(e) => setFilterUser(e.target.value)} className="flex-1 outline-none border-none focus:border-none focus:ring-0" />

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
                        {SearchUser.map((u) => (
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