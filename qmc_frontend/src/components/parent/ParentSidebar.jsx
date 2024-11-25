import React from "react";
import { Link, useLocation } from "react-router-dom";

// Importing MUI icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GradeIcon from "@mui/icons-material/Grade";
import ReceiptIcon from "@mui/icons-material/Receipt";

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
            <span className="sidebar-name">{label}</span>
        </Link>
    );
};

export default function ParentSidebar() {
    const links = [
        {
            to: "/parent/dashboard",
            Icon: DashboardIcon,
            label: "Dashboard",
        },
        {
            to: "/parent/profile",
            Icon: AccountCircleIcon,
            label: "Profile",
        },
        {
            to: "/parent/grades",
            Icon: GradeIcon,
            label: "Grades",
        },
        {
            to: "/parent/soa",
            Icon: ReceiptIcon,
            label: "SOA",
        },
    ];

    return (
        <div className="sidebar">
            <div>
                <img src="/img/logo.png" alt="Logo" width={50} />
                <h2>Parent</h2>
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
//     to: "/parent/schedules",
//     icon: "/img/class_list.png",
//     label: "Subjects",
// },

// {
//     to: "/student/announcements",
//     icon: "/img/class_list_fee.png",
//     label: "Announcement",
// },
