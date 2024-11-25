import React, { useEffect, useState } from "react";
import DashboardBox from "../components/DashboardBox";
import Announcement from "../components/Announcement";
import axiosClientPrincipal from "../axoisclient/axios-client-principal";

export default function PrincipalDashboard() {
    const [enrolledCount, setEnrolledCount] = useState(0);
    const [announcements, setAnnouncements] = useState([]);
    const [teachersCount, setTeacherCount] = useState(0);
    const [classroomsCount, setClassroomsCount] = useState(0);

    const getCount = () => {
        axiosClientPrincipal.get("/count-students").then(({ data }) => {
            setEnrolledCount(data.count);
        });

        axiosClientPrincipal.get("/count/teachers").then(({ data }) => {
            setTeacherCount(data);
        });
        axiosClientPrincipal.get("/count/classrooms").then(({ data }) => {
            setClassroomsCount(data);
        });
    };

    const getAnnounce = () => {
        axiosClientPrincipal
            .get("/principal/announcements")
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
                    title="Students"
                    count={enrolledCount}
                />
                <DashboardBox
                    BoxColor="#6A1E55"
                    title="Teachers"
                    count={teachersCount}
                />
                <DashboardBox
                    BoxColor="#C63C51"
                    title="Classrooms"
                    count={classroomsCount}
                />
            </div>

            {/* Announcements Section */}
            <div className=" mt-3">
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
