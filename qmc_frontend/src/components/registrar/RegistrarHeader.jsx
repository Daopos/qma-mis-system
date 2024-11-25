import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import axiosClientRegistrar from "../../axoisclient/axios-client-registrar";
import studentheaderCSS from "./registrarheadersidebar.module.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Link } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SchoolIcon from "@mui/icons-material/School";
import ArchiveIcon from "@mui/icons-material/Archive";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";

export default function RegistrarHeader() {
    const { setUser, setRegistrarToken } = useStateContext();
    const [profile, setProfile] = useState();

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [openNav, setOpenNav] = useState(false);

    const notificationRef = useRef(null);

    useEffect(() => {
        const intervalId = setInterval(getProfile, 5000); // Fetch every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    const getProfile = () => {
        axiosClientRegistrar
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

        axiosClientRegistrar.post("/logout").then(() => {
            setUser({});
            setRegistrarToken(null);
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
                    to="/registrar/dashboard"
                    onClick={handleCloseNav}
                >
                    <DashboardIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Dashboard</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/registrar/addnew"
                    onClick={handleCloseNav}
                >
                    <PersonAddIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Enroll New Student</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/registrar/addold"
                    onClick={handleCloseNav}
                >
                    <PersonAddIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Enroll Old Student</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/registrar/enrolled"
                    onClick={handleCloseNav}
                >
                    <SchoolIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Enrolled</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/registrar/profile"
                    onClick={handleCloseNav}
                >
                    <AccountCircleIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Profile</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/registrar/archives"
                    onClick={handleCloseNav}
                >
                    <ArchiveIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Archives</span>
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
