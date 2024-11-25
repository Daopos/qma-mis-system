import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axiosClientRegistrar from "../axoisclient/axios-client-registrar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SchoolIcon from "@mui/icons-material/School";
import ArchiveIcon from "@mui/icons-material/Archive";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const SidebarLink = ({ to, Icon, label, count }) => {
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
            {count !== undefined && (
                <span className="badge bg-danger ms-auto">{count}</span>
            )}
        </Link>
    );
};

export default function RegistrarSidebar() {
    const [preEnrolledCount, setPreEnrolledCount] = useState(0);
    const [readyEnrollCount, setReadyEnrollCount] = useState(0);

    // Fetch counts when the component mounts
    useEffect(() => {
        const getCount = () => {
            axiosClientRegistrar
                .get("/count/pre-enrolled/students")
                .then(({ data }) => {
                    setPreEnrolledCount(data);
                })
                .catch((error) => {
                    console.error("Error fetching pre-enrolled count:", error);
                });

            axiosClientRegistrar
                .get("/count/confirmed/students")
                .then(({ data }) => {
                    setReadyEnrollCount(data);
                })
                .catch((error) => {
                    console.error(
                        "Error fetching ready enrollment count:",
                        error
                    );
                });
        };

        getCount();
    }, []);

    const links = [
        {
            to: "/registrar/dashboard",
            Icon: DashboardIcon,
            label: "Dashboard",
        },
        {
            to: "/registrar/addnew",
            Icon: PersonAddIcon,
            label: "Enroll New Student",
        },
        {
            to: "/registrar/addold",
            Icon: PersonAddIcon,
            label: "Enroll Old Student",
        },
        {
            to: "/registrar/enrolled",
            Icon: SchoolIcon,
            label: "Enrolled",
            // count: readyEnrollCount, // Add count here if applicable
        },
        {
            to: "/registrar/profile",
            Icon: AccountCircleIcon,
            label: "Profile",
        },
        {
            to: "/registrar/archives",
            Icon: ArchiveIcon,
            label: "Archives",
        },
    ];

    return (
        <div className="sidebar">
            <div>
                <img src="/img/logo.png" alt="Logo" width={50} />
                <h2>Registrar</h2>
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
//     to: "/registrar/announcements",
//     icon: "/img/announcement.png",
//     label: "Announcement",
// },

// {
//     to: "/registrar/pre-enrolled",
//     icon: "/img/pre_enrolled_student.png",
//     label: "Pre-Enrolled Student",
//     count: preEnrolledCount, // Pass fetched count
// },
// {
//     to: "/registrar/ready-for-enrollment",
//     icon: "/img/ready_for_enrollment.png",
//     label: "Ready for Enrollment",
//     count: readyEnrollCount, // Pass fetched count
// },
