import React, { useEffect, useState } from "react";
import DashboardBox from "../components/DashboardBox";
import axiosClientFinance from "../axoisclient/axios-client-finance";
import Announcement from "../components/Announcement";

export default function FinanceDashboard() {
    const [enrolledCount, setEnrolledCount] = useState(0);
    const [announcements, setAnnouncements] = useState([]);

    const getCount = () => {
        axiosClientFinance
            .get("/count/all/finance/students")
            .then(({ data }) => {
                setEnrolledCount(data);
            });
    };

    const getAnnounce = () => {
        axiosClientFinance
            .get("/finance/announcements")
            .then((response) => {
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
        <div style={{ padding: "20px 30px 40px 30px" }}>
            <div
                className="d-flex gap-5 flex-wrap justify-content-lg-start justify-content-sm-center justify-content-center"
                style={{ padding: "0px 0px 20px 0px" }}
            >
                <DashboardBox
                    BoxColor="#6987EA"
                    title="Students"
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
