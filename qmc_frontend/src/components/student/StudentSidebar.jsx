import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BookIcon from "@mui/icons-material/Book";
import ReceiptIcon from "@mui/icons-material/Receipt";
import GradeIcon from "@mui/icons-material/Grade";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import { colors } from "@mui/material";
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
            <Icon style={{ fontSize: 25 }} />
            <span className="sidebar-name">{label}</span>
        </Link>
    );
};

export default function StudentSidebar() {
    const links = [
        { to: "/student/dashboard", Icon: DashboardIcon, label: "Dashboard" },
        { to: "/student/profile", Icon: AccountCircleIcon, label: "Profile" },
        { to: "/student/subjects", Icon: BookIcon, label: "Subjects" },
        { to: "/student/soa", Icon: ReceiptIcon, label: "SOA" },
        { to: "/student/grade", Icon: GradeIcon, label: "Grades" },
        // {
        //     to: "/student/announcements",
        //     Icon: CampaignIcon,
        //     label: "Announcement",
        // },
    ];

    return (
        <div className="sidebar">
            <div>
                <img src="/img/logo.png" alt="Logo" width={50} />
                <h2>Student</h2>
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
