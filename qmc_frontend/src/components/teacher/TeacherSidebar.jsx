import React from "react";
import { Link, useLocation } from "react-router-dom";

// Importing MUI icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import SubjectIcon from "@mui/icons-material/Subject";
import GroupIcon from "@mui/icons-material/Group";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import ArchiveIcon from "@mui/icons-material/Archive";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

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

export default function TeacherSidebar() {
    const links = [
        {
            to: "/teacher/dashboard",
            Icon: DashboardIcon,
            label: "Dashboard",
        },
        {
            to: "/teacher/subjects",
            Icon: SubjectIcon,
            label: "Subject List",
        },
        {
            to: "/teacher/advisory-list",
            Icon: GroupIcon,
            label: "Advisory",
        },
        // {
        //     to: "/teacher/announcements",
        //     Icon: AnnouncementIcon,
        //     label: "Announcement",
        // },
        {
            to: "/teacher/subjects/archived",
            Icon: ArchiveIcon,
            label: "Subject List Archived",
        },
        {
            to: "/teacher/profile",
            Icon: AccountCircleIcon,
            label: "Profile",
        },
    ];

    return (
        <div className="sidebar">
            <div>
                <img src="/img/logo.png" alt="Logo" width={50} />
                <h2>Teacher</h2>
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
