import React from "react";
import { Link, useLocation } from "react-router-dom";

// Importing MUI icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import ClassIcon from "@mui/icons-material/Class";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleIcon from "@mui/icons-material/People";
import CampaignIcon from "@mui/icons-material/Campaign";

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

export default function PrincipalSidebar() {
    const links = [
        {
            to: "/principal/dashboard",
            Icon: DashboardIcon,
            label: "Dashboard",
        },
        {
            to: "/principal/class-list",
            Icon: ClassIcon,
            label: "Classroom List",
        },
        {
            to: "/principal/announcements",
            Icon: CampaignIcon,
            label: "Announcement",
        },
        {
            to: "/principal/teacher-list",
            Icon: PeopleIcon,
            label: "Teacher List",
        },
        {
            to: "/principal/profile",
            Icon: AccountCircleIcon,
            label: "Profile",
        },
    ];

    return (
        <div className="sidebar">
            <div>
                <img src="/img/logo.png" alt="Logo" width={50} />
                <h2>Principal</h2>
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
//     to: "/principal/subject-list",
//     icon: "/img/class_list_fee.png",
//     label: "Subject List",
// },
// {
//     to: "/principal/teacher-list",
//     icon: "/img/class_list_fee.png",
//     label: "Teacher List",
// },
