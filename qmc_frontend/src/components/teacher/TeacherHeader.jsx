import React, { useEffect, useState, useRef } from "react";
import { useStateContext } from "../../context/ContextProvider";
import axiosClientTeacher from "../../axoisclient/axois-client-teacher";
import studentheaderCSS from "./teacherheadersidebar.module.css";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SubjectIcon from "@mui/icons-material/Subject";
import GroupIcon from "@mui/icons-material/Group";
import ArchiveIcon from "@mui/icons-material/Archive";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function TeacherHeader() {
    const { user, token, notification, setUser, setTeacherToken } =
        useStateContext();

    const [profile, setProfile] = useState();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [openNav, setOpenNav] = useState(false);

    const notificationRef = useRef(null); // Reference for notifications dropdown

    useEffect(() => {
        const intervalId = setInterval(getProfile, 5000); // Fetch profile every 5 seconds
        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close dropdown if clicking outside the notification dropdown
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }
        };

        // Add event listener
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup the event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchNotifications = () => {
            getNotifications(); // Fetch notifications
        };

        fetchNotifications(); // Initial fetch
        const intervalId = setInterval(fetchNotifications, 5000); // Poll every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    const getProfile = () => {
        axiosClientTeacher
            .get("/employee/profile")
            .then(({ data }) => {
                setProfile(data.employee);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getNotifications = () => {
        axiosClientTeacher
            .get("/teacher/notifications") // Adjust this endpoint based on your API
            .then(({ data }) => {
                setNotifications(data); // Assuming `data` is an array of notifications
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleNotificationClick = (notificationId) => {
        axiosClientTeacher
            .patch(`/teacher/notifications/${notificationId}`, {
                is_read: true,
            }) // Make sure this endpoint exists
            .then(() => {
                // Update the local state to reflect the change
                setNotifications((prev) =>
                    prev.map((notif) =>
                        notif.id === notificationId
                            ? { ...notif, is_read: true }
                            : notif
                    )
                );
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

    const toggleNotifications = () => {
        setShowNotifications((prev) => !prev);
    };

    const onLogout = (ev) => {
        ev.preventDefault();
        axiosClientTeacher.post("/logout").then(() => {
            setTeacherToken(null);
        });
    };

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
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
                    to="/teacher/dashboard"
                    onClick={handleCloseNav}
                >
                    <DashboardIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Dashboard</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/teacher/subjects"
                    onClick={handleCloseNav}
                >
                    <SubjectIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Subject List</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/teacher/advisory-list"
                    onClick={handleCloseNav}
                >
                    <GroupIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Advisory</span>
                </Link>

                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/teacher/subjects/archived"
                    onClick={handleCloseNav}
                >
                    <ArchiveIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Subject List Archived</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/teacher/profile"
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
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            objectFit: "cover",
                        }}
                    />
                    <h5>{profile?.fname || ""}</h5>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <Badge
                        badgeContent={
                            notifications.filter((notif) => !notif.is_read)
                                .length
                        }
                        color="error"
                        onClick={toggleNotifications}
                        style={{ cursor: "pointer" }}
                        className={
                            showNotifications
                                ? studentheaderCSS.activeNotification
                                : ""
                        }
                    >
                        <NotificationsIcon
                            className={studentheaderCSS.notificationIcon}
                        />
                    </Badge>

                    {showNotifications && (
                        <div
                            ref={notificationRef} // Attach the ref here
                            className={studentheaderCSS.notificationsDropdown}
                            style={{
                                animation: "fadeIn 0.3s ease",
                            }}
                        >
                            {notifications.length === 0 ? (
                                <div
                                    className={
                                        studentheaderCSS.notificationItem
                                    }
                                >
                                    No new notifications
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={
                                            studentheaderCSS.notificationItem
                                        }
                                        onClick={() =>
                                            handleNotificationClick(notif.id)
                                        }
                                        style={{
                                            cursor: "pointer",
                                            fontWeight: notif.is_read
                                                ? "normal"
                                                : "bold",
                                        }}
                                    >
                                        <div>{notif.message}</div>
                                        <div
                                            style={{
                                                fontSize: "0.8em",
                                                color: "#888",
                                            }}
                                        >
                                            {formatDate(notif.created_at)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    <button
                        className={studentheaderCSS.logoutInvi}
                        onClick={onLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}
