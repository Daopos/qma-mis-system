import React, { useEffect, useRef, useState } from "react";

import { useStateContext } from "../../context/ContextProvider";
import axiosClientFinance from "../../axoisclient/axios-client-finance";

import DashboardIcon from "@mui/icons-material/Dashboard";
import studentheaderCSS from "./financeheadersidebar.module.css";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleIcon from "@mui/icons-material/People";

export default function FInanceHeader() {
    const { setUser, setFinanceToken } = useStateContext();
    const [profile, setProfile] = useState();

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [openNav, setOpenNav] = useState(false);

    const notificationRef = useRef(null);

    useEffect(() => {
        const intervalId = setInterval(getProfile, 5000); // Fetch every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    const handleOpenNav = () => {
        setOpenNav(!openNav);
    };

    const handleCloseNav = () => {
        setOpenNav(false);
    };

    const getProfile = () => {
        axiosClientFinance
            .get("/employee/profile")
            .then(({ data }) => {
                setProfile(data.employee);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onLogout = (ev) => {
        ev.preventDefault();

        axiosClientFinance.post("/logout").then(() => {
            setUser({});
            setFinanceToken(null);
        });
    };

    return (
        <>
            <div
                id="mySidenav"
                className={`${studentheaderCSS.sidenav} ${
                    openNav ? studentheaderCSS.sidenavOpen : ""
                }`}
            >
                <a
                    className={studentheaderCSS.closebtn}
                    onClick={handleCloseNav}
                >
                    &times;
                </a>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/finance/dashboard"
                    onClick={handleCloseNav}
                >
                    <DashboardIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Dashboard</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/finance/students"
                    onClick={handleCloseNav}
                >
                    <PeopleIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Students</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/finance/profile"
                    onClick={handleCloseNav}
                >
                    <AccountCircleIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Profile</span>
                </Link>

                {/* Logout button at the bottom */}
                <div className={studentheaderCSS.sidebarFooter}>
                    <button
                        className={studentheaderCSS.logoutButton}
                        onClick={onLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
            <div className="header-container">
                <div className="d-flex align-items-center gap-2">
                    <div className={studentheaderCSS.burgerMenu}>
                        <MenuIcon onClick={handleOpenNav} />
                    </div>
                    <img
                        src={profile?.image_url || "/img/profile.png"}
                        alt="Profile"
                        style={{
                            width: "50px", // Set your desired width
                            height: "50px", // Set the same value as width for a circle
                            borderRadius: "50%",
                            objectFit: "cover", // Ensures the image covers the entire circle
                        }}
                    />
                    <h5>{profile?.fname || ""}</h5>
                </div>
                <button
                    className={studentheaderCSS.logoutInvi}
                    onClick={onLogout}
                >
                    Logout
                </button>
            </div>
        </>
    );
}
