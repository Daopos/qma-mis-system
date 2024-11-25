import React, { useEffect, useRef, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import studentheaderCSS from "./studentheadersidebar.module.css";
import { Link } from "react-router-dom";
import axiosClientStudent from "../../axoisclient/axios-client-student";
import { useStateContext } from "../../context/ContextProvider";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BookIcon from "@mui/icons-material/Book";
import ReceiptIcon from "@mui/icons-material/Receipt";
import GradeIcon from "@mui/icons-material/Grade";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import CampaignIcon from "@mui/icons-material/Campaign";

export default function StudentHeader() {
    const { setUser, setStudentToken } = useStateContext();

    const [openNav, setOpenNav] = useState(false);
    const [profile, setProfile] = useState();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null); // Reference for notifications dropdown

    useEffect(() => {
        const intervalId = setInterval(getProfile, 5000); // Fetch profile every 5 seconds
        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    useEffect(() => {
        const fetchNotifications = () => {
            getNotifications(); // Fetch notifications
        };

        fetchNotifications(); // Initial fetch
        const intervalId = setInterval(fetchNotifications, 5000); // Poll every 5 seconds

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

    const getProfile = () => {
        axiosClientStudent
            .get("/student/profile")
            .then(({ data }) => {
                setProfile(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getNotifications = () => {
        axiosClientStudent
            .get("/student/notifications") // Adjust this endpoint based on your API
            .then(({ data }) => {
                setNotifications(data); // Assuming `data` is an array of notifications
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleNotificationClick = (notificationId) => {
        axiosClientStudent
            .patch(`/student/notifications/${notificationId}`, {
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
        axiosClientStudent.post("/logout").then(() => {
            setUser({});
            setStudentToken(null);
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
                    to="/student/dashboard"
                    onClick={handleCloseNav}
                >
                    <DashboardIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Dashboard</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/student/profile"
                    onClick={handleCloseNav}
                >
                    <AccountCircleIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Profile</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/student/subjects"
                    onClick={handleCloseNav}
                >
                    <BookIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Subjects</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/student/soa"
                    onClick={handleCloseNav}
                >
                    <ReceiptIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">SOA</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/student/grade"
                    onClick={handleCloseNav}
                >
                    <GradeIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Grades</span>
                </Link>
                {/* <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/student/announcements"
                    onClick={handleCloseNav}
                >
                    <CampaignIcon style={{ fontSize: 25 }} />
                    <span className="sidebar-name">Announcement</span>
                </Link> */}

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
                        src={profile?.image || "/img/profile.png"}
                        alt="Profile"
                        style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            objectFit: "cover",
                        }}
                    />
                    <h5>{`${profile?.firstname || ""} ${
                        profile?.surname || ""
                    }`}</h5>
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
                                            {formatDate(notif.created_at)}{" "}
                                            {/* Display the formatted date */}
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
