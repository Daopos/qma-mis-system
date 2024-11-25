import React, { useEffect, useRef, useState } from "react";
import axiosClientPrincipal from "../../axoisclient/axios-client-principal";
import { useStateContext } from "../../context/ContextProvider";
import studentheaderCSS from "./principalheadersidebar.module.css";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleIcon from "@mui/icons-material/People";
import CampaignIcon from "@mui/icons-material/Campaign";
import ClassIcon from "@mui/icons-material/Class";

export default function PrincipalHeader() {
    const { user, token, notification, setUser, setPrincipalToken } =
        useStateContext();

    const [profile, setProfile] = useState();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [openNav, setOpenNav] = useState(false);

    const notificationRef = useRef(null); // Reference for notifications dropdown

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = () => {
        axiosClientPrincipal
            .get("/employee/profile")
            .then(({ data }) => {
                setProfile(data.employee);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleOpenNav = () => {
        setOpenNav(!openNav);
    };

    const handleCloseNav = () => {
        setOpenNav(false);
    };

    const onLogout = (ev) => {
        ev.preventDefault();
        axiosClientPrincipal.post("/logout").then(() => {
            setPrincipalToken(null);
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
                    to="/principal/dashboard"
                    onClick={handleCloseNav}
                >
                    <DashboardIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Dashboard</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/principal/class-list"
                    onClick={handleCloseNav}
                >
                    <ClassIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Classroom List</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/principal/announcements"
                    onClick={handleCloseNav}
                >
                    <CampaignIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Announcement</span>
                </Link>

                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/principal/subjects/teacher-list"
                    onClick={handleCloseNav}
                >
                    <PeopleIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Teacher List</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/principal/profile"
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
