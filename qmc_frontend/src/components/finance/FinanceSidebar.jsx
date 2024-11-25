import React from "react";
import { Link, useLocation } from "react-router-dom";

// Importing MUI icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleIcon from "@mui/icons-material/People";

const SidebarLink = ({ to, Icon, label }) => {
    const { pathname } = useLocation();
    const isActive = pathname === to;
    const activeStyles = { backgroundColor: "white", color: "#124076" };

    return (
        <Link
            className="sidebar-item d-flex align-items-center gap-2"
            to={to}
            style={isActive ? activeStyles : {}}
        >
            <Icon style={{ fontSize: 30 }} />
            <span>{label}</span>
        </Link>
    );
};

export default function FinanceSidebar() {
    const links = [
        {
            to: "/finance/dashboard",
            Icon: DashboardIcon,
            label: "Dashboard",
        },
        {
            to: "/finance/students",
            Icon: PeopleIcon,
            label: "Students",
        },
        {
            to: "/finance/profile",
            Icon: AccountCircleIcon,
            label: "Profile",
        },
    ];

    return (
        <div className="sidebar">
            <div>
                <img src="/img/logo.png" alt="Logo" width={50} />
                <h2>Finance</h2>
            </div>
            {links.map((link, index) => (
                <SidebarLink
                    key={index}
                    to={link.to}
                    Icon={link.Icon}
                    label={link.label}
                />
            ))}
        </div>
    );
}

// {
//     to: "/finance/pendingstudents",
//     icon: "/img/pending_student.png",
//     label: "Pending Students",
// },
// {
//     to: "/finance/confirmedstudents",
//     icon: "/img/class_list.png",
//     label: "Confirm Students",
// },
// {
//     to: "/finance/announcements",
//     icon: "/img/announcement.png",
//     label: "Announcement",
// },
