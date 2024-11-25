import React, { useEffect, useState } from "react";
import axiosClientStudent from "../axoisclient/axios-client-student";
import { useParams } from "react-router-dom";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import DescriptionIcon from "@mui/icons-material/Description";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import studenttestCSS from "./StudentTest.module.css";

import Spinner from "react-bootstrap/Spinner";
import { useQuery } from "react-query";

export default function StudentStream() {
    const { subjectId } = useParams();

    const {
        data: tasks = [],
        isLoading: isTaskLoading,
        error: isTaskerror,
    } = useQuery(["tasksStudent", subjectId], async () => {
        const { data } = await axiosClientStudent.get(
            `/task/subject/${subjectId}`
        );

        console.log(data);
        return data;
    });

    const {
        data: subject = [],
        isLoading: isSubjectLoading,
        error: isSubjectError,
    } = useQuery(["subjectStudents", subjectId], async () => {
        const { data } = await axiosClientStudent.get(`/subjects/${subjectId}`);

        console.log(data);
        return data;
    });

    const formatDateTime = (datetime) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        };
        return new Date(datetime).toLocaleString("en-US", options);
    };

    const getFileIcon = (fileType) => {
        if (fileType.includes("image")) {
            return null; // No icon needed for image types
        } else if (fileType.includes("pdf")) {
            return <PictureAsPdfIcon fontSize="large" />;
        } else if (
            fileType.includes("presentation") ||
            fileType.includes("ppt")
        ) {
            return <SlideshowIcon fontSize="large" />;
        } else if (fileType.includes("word") || fileType.includes("document")) {
            return <DescriptionIcon fontSize="large" />;
        } else {
            return <DriveFolderUploadIcon fontSize="large" />; // Default icon for unsupported types
        }
    };

    if (isTaskLoading || isSubjectLoading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        ); // You can replace this with a spinner or loading component
    }

    if (isTaskerror || isSubjectError) {
        return <div>Error fetching data report it : {error.message}</div>;
    }
    const schedules = subject.schedules || [];

    return (
        <>
            <div className={studenttestCSS.streamContainer}>
                <div className={studenttestCSS.streamColumn}>
                    <div className={studenttestCSS.streamCard}>
                        <h1>{subject.title}</h1>
                        <h4>{`Grade ${subject.classroom?.grade_level || ""} - ${
                            subject.classroom?.title || ""
                        }`}</h4>
                        <div>
                            {schedules.length > 0 ? (
                                schedules.map((schedule, index) => (
                                    <p
                                        className="mb-2"
                                        key={index}
                                    >{`${schedule.day}: ${schedule.formatted_time}`}</p>
                                ))
                            ) : (
                                <p>No schedules available.</p>
                            )}
                        </div>
                    </div>

                    {tasks && tasks.length > 0 ? (
                        tasks.map((data, index) => (
                            <div
                                key={index}
                                className={studenttestCSS.taskContainer}
                            >
                                <div>
                                    <img
                                        src="/img/profile.png"
                                        alt="Profile"
                                        className={`${studenttestCSS.profileImage} img-fluid`}
                                    />
                                </div>
                                <div className={studenttestCSS.taskDetails}>
                                    <div className="d-flex justify-content-between">
                                        <h5>{data.title}</h5>
                                    </div>
                                    <p
                                        className={
                                            studenttestCSS.taskDescription
                                        }
                                    >
                                        {data.description}
                                    </p>
                                    <p className="program-font">
                                        Posted on{" "}
                                        {formatDateTime(data.created_at)}
                                    </p>
                                    <div>
                                        {data.file && (
                                            <div
                                                className={
                                                    studenttestCSS.fileContainer
                                                }
                                            >
                                                <div
                                                    className={
                                                        studenttestCSS.filePreview
                                                    }
                                                >
                                                    {data.file_url ? (
                                                        data.file_url.endsWith(
                                                            ".png"
                                                        ) ||
                                                        data.file_url.endsWith(
                                                            ".jpg"
                                                        ) ||
                                                        data.file_url.endsWith(
                                                            ".jpeg"
                                                        ) ? (
                                                            <img
                                                                src={
                                                                    data.file_url
                                                                }
                                                                style={{
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    objectFit:
                                                                        "cover",
                                                                }}
                                                                alt={
                                                                    data.file_name
                                                                }
                                                            />
                                                        ) : (
                                                            getFileIcon(
                                                                data.file_type
                                                            )
                                                        )
                                                    ) : (
                                                        <DriveFolderUploadIcon fontSize="large" />
                                                    )}
                                                </div>
                                                <div
                                                    className={
                                                        studenttestCSS.fileName
                                                    }
                                                >
                                                    <a href={data.file_url}>
                                                        {data.file_name}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
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
                                No Tasks yet
                            </h5>
                            <p style={{ fontSize: "14px", color: "#888" }}>
                                Please check back later for available Task.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
