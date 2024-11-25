import React, { useEffect, useState } from "react";
import axiosClientTeacher from "../axoisclient/axois-client-teacher";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { useQuery } from "react-query";
import randomColor from "randomcolor"; // Import the randomcolor package
import moment from "moment"; // Import moment.js for date manipulation

export default function TeacherSubject() {
    const [subjectColors, setSubjectColors] = useState([]); // State to hold colors
    const {
        data: subjects = [],
        isLoading,
        error,
    } = useQuery("teacherSubjects", async () => {
        const response = await axiosClientTeacher.get("/teacher/subjects");
        console.log("test");
        console.log(response.data.subjects);
        return response.data.subjects;
    });

    useEffect(() => {
        // Generate random colors only when subjects are fetched
        console.log("Fetching subjects...");
        if (subjects.length > 0) {
            const colors = subjects.map(() =>
                randomColor({
                    luminosity: "dark",
                })
            );
            setSubjectColors(colors);
        }
    }, [subjects]);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        ); // You can replace this with a spinner or loading component
    }

    if (error) {
        return <div>Error fetching: {error.message}</div>;
    }
    return (
        <div style={{ padding: "40px 30px" }}>
            <div className="d-flex gap-5 flex-wrap">
                {subjects.length === 0 ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            width: "300px",
                            margin: "auto",
                            height: "200px",
                            backgroundColor: "#f9f9f9",
                            color: "#555",
                            textAlign: "center",
                            padding: "20px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <h5 style={{ marginBottom: "10px" }}>
                            No Subject Schedules yet
                        </h5>
                        <p style={{ fontSize: "14px", color: "#888" }}>
                            Please check back later for available schedules.
                        </p>
                    </div>
                ) : (
                    subjects.map((data, index) => (
                        <Link
                            key={index}
                            to={`/teacher/subjects/${data.id}/all`} // Navigate to SubjectDetail with subjectId
                            style={{ textDecoration: "none" }} // Remove underline from the link
                        >
                            <div
                                style={{
                                    border: "1px solid black",
                                    borderRadius: "10px",
                                    width: "300px",
                                    height: "200px",
                                    backgroundColor: "#f9f9f9",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center", // Center horizontally
                                        alignItems: "center", // Center vertically
                                        flexDirection: "column",
                                        height: "60%",
                                        gap: "4px",
                                    }}
                                >
                                    <h6>{`Grade ${data.grade_level} - Section ${data.classroom_title}`}</h6>
                                    {/* Display schedules with start and end times in AM/PM format */}
                                    {data.schedules.map(
                                        (schedule, scheduleIndex) => {
                                            const startTime = moment(
                                                schedule.start,
                                                "HH:mm:ss"
                                            ).format("hh:mm A");
                                            const endTime = moment(
                                                schedule.end,
                                                "HH:mm:ss"
                                            ).format("hh:mm A");
                                            const day = schedule.day;
                                            // Get the day of the week
                                            return (
                                                <p
                                                    key={scheduleIndex}
                                                    style={{ margin: 0 }}
                                                >
                                                    {`${day}, ${startTime} - ${endTime}`}
                                                </p>
                                            );
                                        }
                                    )}
                                </div>
                                <div
                                    style={{
                                        backgroundColor: subjectColors[index], // Use the stored random color
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "40%",
                                        borderRadius: "0 0 10px 10px",
                                    }}
                                >
                                    <h3
                                        style={{
                                            color: "white",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {data.title}
                                    </h3>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
