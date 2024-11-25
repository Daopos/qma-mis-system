import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PrincipalSidebar from "../src/components/principal/PrincipalSidebar";
import { useStateContext } from "../src/context/ContextProvider";
import PrincipalHeader from "../src/components/principal/PrincipalHeader";

export default function PrincipalLayout() {
    const { user, principalToken, notification, setUser, setToken } =
        useStateContext();

    if (!principalToken) {
        return <Navigate to="/principal/login" />;
    }
    return (
        <div className="d-flex">
            <PrincipalSidebar />
            <div className="d-flex flex-column " style={{ width: "100%" }}>
                <PrincipalHeader />
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
