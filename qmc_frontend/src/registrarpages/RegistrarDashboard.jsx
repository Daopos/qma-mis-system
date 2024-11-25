import React, { useEffect, useState } from "react";
import DashboardBox from "../components/DashboardBox";
import Announcement from "../components/Announcement";
import axiosClientRegistrar from "../axoisclient/axios-client-registrar";

export default function RegistrarDashboard() {
    const [enrolledCount, setEnrolledCount] = useState(0);
    const [announcements, setAnnouncements] = useState([]);

    const getCount = () => {
        axiosClientRegistrar.get("/count-students").then(({ data }) => {
            setEnrolledCount(data.count);
        });
    };

    const getAnnounce = () => {
        axiosClientRegistrar
            .get("/registrar/announcements")
            .then((response) => {
                console.log(response);
                setAnnouncements(response.data);
            })
            .catch((error) => {
                console.error("Error fetching announcements:", error);
            });
    };

    useEffect(() => {
        getCount();
        getAnnounce();
    }, []);

    return (
        <div style={{ padding: "20px 30px" }}>
            <div
                className="d-flex gap-5 flex-wrap justify-content-lg-start justify-content-sm-center justify-content-center"
                style={{ padding: "0px 0px 20px 0px" }}
            >
                <DashboardBox
                    BoxColor="#6987EA"
                    title="Students Enrolled"
                    count={enrolledCount}
                />
            </div>

            {/* Announcements Section */}
            <div className="mt-3">
                <h2>Announcements</h2>
                <div className="d-flex flex-column gap-4 mt-3">
                    {announcements.length > 0 ? (
                        announcements.map((data) => (
                            <Announcement
                                key={data.id}
                                title={data.title}
                                desc={data.desc}
                                date={data.created_at}
                                owner={data.owner}
                            />
                        ))
                    ) : (
                        <p>No announcements available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
