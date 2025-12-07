
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
    return (
        <div className="flex h-screen bg-gray-100">

            <Sidebar />

            <div className="flex-1 ml-64 flex flex-col overflow-auto">
                <Header />

                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
