import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../src/components/Header";
import { useStateContext } from "../src/context/ContextProvider";
import AdminSidebar from "../src/components/admin/AdminSidebar";
import AdminHeader from "../src/components/admin/AdminHeader";

export default function AdminLayout() {
    const { user, adminToken, notification, setUser, setToken } =
        useStateContext();

    if (!adminToken) {
        return <Navigate to="/admin/login" />;
    }

    return (
        <div className="d-flex">
            <AdminSidebar />
            <div className="d-flex flex-column " style={{ width: "100%" }}>
                <AdminHeader />
                <main>
                    <Outlet />
                </main>

                <div
                    className="d-flex justify-content-between"
                    style={{ padding: "0 20px 5px 20px" }}
                >
                    <h6>Team@Envisioneers</h6>
                    <h6>QMA-2024</h6>
                </div>
            </div>
        </div>
    );
}
