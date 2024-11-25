import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import axiosClientAdmin from "../../axoisclient/axios-client-admin";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import studentheaderCSS from "../student/studentheadersidebar.module.css";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import TimelineIcon from "@mui/icons-material/Timeline";
import ArchiveIcon from "@mui/icons-material/Archive";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CampaignIcon from "@mui/icons-material/Campaign";

export default function AdminHeader() {
    const { user, token, notification, setUser, setAdminToken } =
        useStateContext();

    const onLogout = (ev) => {
        ev.preventDefault();

        axiosClientAdmin.post("/logout").then(() => {
            setUser({});
            setAdminToken(null);
        });
    };
    const [openNav, setOpenNav] = useState(false);

    const handleOpenNav = () => {
        setOpenNav(!openNav);
    };

    const handleCloseNav = () => {
        setOpenNav(false);
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
                    to="/admin/home"
                    onClick={handleCloseNav}
                >
                    <DashboardIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Dashbaord</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/admin/academicyear"
                    onClick={handleCloseNav}
                >
                    <CalendarTodayIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Academic Year</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/admin/gradelistfee"
                    onClick={handleCloseNav}
                >
                    <AttachMoneyIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Grade List Fee</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/admin/studentlist"
                    onClick={handleCloseNav}
                >
                    <PeopleIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Student List</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/admin/employee"
                    onClick={handleCloseNav}
                >
                    <PeopleIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Employee</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/admin/announcement"
                    onClick={handleCloseNav}
                >
                    <CampaignIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Announcement</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/admin/employeearchive"
                    onClick={handleCloseNav}
                >
                    <ArchiveIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Employee Archive</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/admin/audit"
                    onClick={handleCloseNav}
                >
                    <TimelineIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Audit Trail</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/admin/profile"
                    onClick={handleCloseNav}
                >
                    <AccountCircleIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Profile</span>
                </Link>
            </div>
            <div className="header-container">
                <div className="d-flex align-items-center gap-2">
                    <div className={studentheaderCSS.burgerMenu}>
                        <MenuIcon onClick={handleOpenNav} />
                    </div>
                    <img src="/img/profile.png" alt="" width={50} />
                    <h5>Admin</h5>
                </div>
                <button onClick={onLogout}>Logout</button>
            </div>
        </>
    );
}
