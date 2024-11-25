import React, { useEffect, useState } from "react";
import axiosClientTeacher from "../axoisclient/axois-client-teacher";
import Announcement from "../components/Announcement";
import Dropdown from "react-bootstrap/Dropdown";

export default function TeacherAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [filter, setFilter] = useState("all"); // State to manage the filter

    useEffect(() => {
        getAnnounce();
    }, []);

    const getAnnounce = () => {
        axiosClientTeacher
            .get("/teacher/announcements")
            .then((response) => {
                console.log(response);
                setAnnouncements(response.data);
            })
            .catch((error) => {
                console.error("Error fetching announcements:", error);
            });
    };

    // Filter announcements based on the selected filter
    const filteredAnnouncements = announcements.filter((announcement) => {
        if (filter === "all") return true; // Show all announcements
        return announcement.owner === filter; // Show announcements by selected owner
    });

    return (
        <>
            <div className="list-body-container">
                <div style={{ gap: 40 }}>
                    <h2>Announcements</h2>
                    <Dropdown>
                        <Dropdown.Toggle variant="secondary">
                            Filter Announcements
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setFilter("all")}>
                                All Announcements
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter("admin")}>
                                From Admin
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => setFilter("principal")}
                            >
                                From Principal
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                {/* Render filtered announcements */}
                <div className="d-flex flex-column gap-4 mt-5">
                    {filteredAnnouncements.map((data) => (
                        <Announcement
                            key={data.id}
                            title={data.title}
                            desc={data.desc}
                            date={data.created_at}
                            owner={data.owner}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
