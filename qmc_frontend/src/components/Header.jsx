import React from "react";
import "./admin/AdminSidebarHeader.css";
import axiosClient from "../axoisclient/axios-client-admin";
import { useStateContext } from "../context/ContextProvider";

export default function Header() {
    const { user, token, notification, setUser, setToken } = useStateContext();

    const onLogout = (ev) => {
        ev.preventDefault();

        axiosClient.post("/logout").then(() => {
            setUser({});
            setToken(null);
            window.location.reload();
        });
    };
    return (
        <div className="header-container">
            <img src="/img/profile.png" alt="" width={50} />
            <button onClick={onLogout}>Logout</button>
        </div>
    );
}
