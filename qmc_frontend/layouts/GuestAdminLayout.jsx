import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../src/context/ContextProvider";

export default function GuestAdminLayout() {
    const { user, token } = useStateContext();

    if (token) {
        return <Navigate to="/admin/home" />;
    }

    return (
        <div id="guestLayout">
            <Outlet />
        </div>
    );
}
