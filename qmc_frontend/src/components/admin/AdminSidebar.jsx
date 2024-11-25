import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./AdminSidebarHeader.css";
import Accordion from "react-bootstrap/Accordion";

// Importing MUI icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SubjectIcon from "@mui/icons-material/Subject";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import TimelineIcon from "@mui/icons-material/Timeline";
import ArchiveIcon from "@mui/icons-material/Archive";
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

export default function AdminSidebar() {
    const links = [
        { to: "/admin/home", Icon: DashboardIcon, label: "Dashboard" },
        // { to: "/admin/classlist", Icon: ListAltIcon, label: "Class List" },
        {
            to: "/admin/academicyear",
            Icon: CalendarTodayIcon,
            label: "Academic Year",
        },
        {
            to: "/admin/gradelistfee",
            Icon: AttachMoneyIcon,
            label: "Grade List Fee",
        },
        // { to: "/admin/subjectlist", Icon: SubjectIcon, label: "Subject List" },

        { to: "/admin/studentlist", Icon: PeopleIcon, label: "Student List" },
        { to: "/admin/employee", Icon: PeopleIcon, label: "Employee" },
        {
            to: "/admin/announcement",
            Icon: CampaignIcon,
            label: "Announcement",
        },

        { to: "/admin/audit", Icon: TimelineIcon, label: "Audit Trail" },

        {
            to: "/admin/employeearchive",
            Icon: ArchiveIcon,
            label: "Employee Archive",
        },
        // { to: "/admin/test", Icon: ArchiveIcon, label: "Student Archive" },
        { to: "/admin/profile", Icon: AccountCircleIcon, label: "Profile" },
    ];

    return (
        <div className="sidebar">
            <div>
                <img src="/img/logo.png" alt="Logo" width={50} />
                <h2>Admin</h2>
            </div>

            {/* Render the sidebar links */}
            {links.map((link, index) => (
                <SidebarLink
                    key={index}
                    to={link.to}
                    Icon={link.Icon}
                    label={link.label}
                />
            ))}

            {/* Example Accordion */}
            {/* <Accordion className="accordion-flush accordion-test">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Archive</Accordion.Header>
                    <Accordion.Body>
                        <SidebarLink
                            to={links[10].to}
                            Icon={links[10].Icon}
                            label={links[10].label}
                        />
                        <SidebarLink
                            to={links[11].to}
                            Icon={links[11].Icon}
                            label={links[11].label}
                        />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion> */}
        </div>
    );
}
