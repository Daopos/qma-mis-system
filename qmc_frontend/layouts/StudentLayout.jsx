import React from "react";
import { useStateContext } from "../src/context/ContextProvider";
import StudentSidebar from "../src/components/student/StudentSidebar";
import StudentHeader from "../src/components/student/StudentHeader";
import { Navigate, Outlet } from "react-router-dom";
import axiosClientStudent from "../src/axoisclient/axios-client-student";

export default function StudentLayout() {
    const { user, studentToken } = useStateContext();

    if (!studentToken) {
        return <Navigate to="/student/login" />;
    }

    return (
        <div className="d-flex">
            <StudentSidebar />
            <div className="d-flex flex-column " style={{ width: "100%" }}>
                <StudentHeader />
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
