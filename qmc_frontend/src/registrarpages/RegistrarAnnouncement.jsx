import React, { useEffect, useState } from "react";
import Announcement from "../components/Announcement";
import axiosClientRegistrar from "../axoisclient/axios-client-registrar";

export default function RegistrarAnnouncement() {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        getAnnounce();
    }, []);

    const getAnnounce = () => {
        axiosClientRegistrar
            .get("/employee/announcements")
            .then((response) => {
                console.log(response);
                setAnnouncements(response.data);
            })
            .catch((error) => {
                console.error("Error fetching announcements:", error);
            });
    };

    return (
        <>
            <div className="list-body-container">
                <div style={{ gap: 40 }}>
                    <h2>Announcements</h2>
                </div>

                {/* Render all announcements */}
                <div className="d-flex flex-column gap-4 mt-5">
                    {announcements.map((data) => (
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
