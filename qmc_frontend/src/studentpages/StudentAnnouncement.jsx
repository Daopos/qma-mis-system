import React from "react";
import { useQuery } from "react-query";
import Announcement from "../components/Announcement";
import axiosClientStudent from "../axoisclient/axios-client-student";
import Dropdown from "react-bootstrap/Dropdown";
import Spinner from "react-bootstrap/Spinner";
export default function StudentAnnouncement() {
    // Fetch announcements using React Query
    const {
        data: announcements = [],
        error,
        isLoading,
    } = useQuery("announcements", () =>
        axiosClientStudent.get("/student/announcements").then((res) => res.data)
    );

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center pt-4">
                <Spinner animation="border" variant="primary" />
            </div>
        ); // Using Placeholder for loading UI
    }
    if (error) return <div>Error fetching announcements: {error.message}</div>;

    return (
        <>
            <div className="list-body-container">
                <div style={{ gap: 40 }}>
                    <h2>Announcements</h2>
                </div>

                {/* Render filtered announcements */}
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
