import React, { useState } from "react";
import studenttestCSS from "./StudentTest.module.css";
import axiosClientStudent from "../axoisclient/axios-client-student";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

export default function StudentClasswork() {
    const { subjectId } = useParams();

    // Query to fetch classwork data
    const {
        data: classwork = [],
        isLoading,
        error,
    } = useQuery(["classworks", subjectId], async () => {
        const { data } = await axiosClientStudent.get(
            `/classwork/student/${subjectId}`
        );

        console.log(data);
        return data;
    });

    // State for accordion toggle and files
    const [activeIndex, setActiveIndex] = useState(null);
    const [files, setFiles] = useState([]); // Store files for each classwork

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    // Handle file drag and drop
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, classworkId) => {
        e.preventDefault();
        const droppedFiles = e.dataTransfer.files;
        addFiles(classworkId, droppedFiles);
    };

    const handleFileChange = (e, classworkId) => {
        const selectedFiles = e.target.files;
        addFiles(classworkId, selectedFiles);
    };

    const addFiles = (classworkId, newFiles) => {
        const fileArray = Array.from(newFiles);
        setFiles((prevFiles) => ({
            ...prevFiles,
            [classworkId]: prevFiles[classworkId]
                ? [...prevFiles[classworkId], ...fileArray]
                : fileArray,
        }));
    };

    const handleFileRemove = (classworkId, fileIndex) => {
        setFiles((prevFiles) => ({
            ...prevFiles,
            [classworkId]: prevFiles[classworkId].filter(
                (_, i) => i !== fileIndex
            ),
        }));
    };

    const handleFileSubmit = async (classworkId) => {
        if (!files[classworkId] || files[classworkId].length === 0) {
            alert("Please select files to submit.");
            return;
        }

        const formData = new FormData();
        files[classworkId].forEach((file) => {
            formData.append("files[]", file); // Sending multiple files for a specific classwork
        });

        try {
            await axiosClientStudent.post(
                `/classwork/submit/${classworkId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            alert("Files uploaded successfully for this classwork!");
            setFiles((prevFiles) => ({ ...prevFiles, [classworkId]: [] }));
        } catch (error) {
            console.error(error);
            alert("Error uploading files");
        }
    };

    const formatDateTime = (datetime) => {
        if (!datetime) return "No deadline"; // Return "No deadline" if it's null or empty

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
    if (isLoading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        ); // You can replace this with a spinner or loading component
    }

    if (error) {
        return <div>Error fetching payment history: {error.message}</div>;
    }

    if (!classwork.length) {
        return (
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
                    marginTop: "30px",
                }}
            >
                <h5 style={{ marginBottom: "10px" }}>No Classworks yet</h5>
                <p style={{ fontSize: "14px", color: "#888" }}>
                    Please check back later for available Classwork.
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 d-flex justify-content-center">
            <div className={studenttestCSS.accordionContainer}>
                {classwork.map((data) => (
                    <div className={studenttestCSS.accordionItem} key={data.id}>
                        <div
                            className={studenttestCSS.accordionItem}
                            key={data.id}
                        >
                            <div
                                className={studenttestCSS.accordionHeader}
                                onClick={() => toggleAccordion(data.id)}
                            >
                                {/* Status badge in the top-right corner */}
                                {data.submissions &&
                                    data.submissions.length > 0 && (
                                        <div
                                            className={
                                                data.submissions[0].score !==
                                                    null &&
                                                data.submissions[0].score !==
                                                    undefined
                                                    ? studenttestCSS.checkedBadge
                                                    : studenttestCSS.pendingBadge
                                            }
                                        >
                                            {data.submissions[0].score !==
                                                null &&
                                            data.submissions[0].score !==
                                                undefined
                                                ? "Checked"
                                                : "Pending"}
                                        </div>
                                    )}

                                <h4>{data.title || `Classwork ${data.id}`}</h4>
                                <p className="pb-2">
                                    {data.description ? data.description : ""}
                                </p>
                                <h5 className="mt-2">
                                    {data.submissions &&
                                    data.submissions.length > 0 &&
                                    data.submissions[0].score
                                        ? data.submissions[0].score
                                        : "0"}
                                    /{data.score}
                                </h5>
                                <h6
                                    className={`mt-2 ${
                                        data.status === "open"
                                            ? studenttestCSS.open
                                            : studenttestCSS.close
                                    }`}
                                >
                                    Status: {data.status}
                                </h6>

                                <h6 className="mt-1 mb-2">
                                    Due Date: {formatDateTime(data.deadline)}
                                </h6>
                                <small className="mt-2">
                                    posted on {formatDateTime(data.created_at)}
                                </small>
                            </div>
                        </div>
                        <div
                            className={
                                activeIndex === data.id
                                    ? `${studenttestCSS.accordionBody} ${studenttestCSS.active}`
                                    : studenttestCSS.accordionBody
                            }
                        >
                            {/* Display submitted files */}
                            {data.submissions?.length > 0 ? (
                                <div className={studenttestCSS.fileList}>
                                    <h6>Submitted Files:</h6>
                                    <ul>
                                        {data.submissions.map((submission) =>
                                            submission.student_classworks
                                                ?.length > 0 ? (
                                                submission.student_classworks.map(
                                                    (file) => (
                                                        <li
                                                            key={file.id}
                                                            className={
                                                                studenttestCSS.wrapList
                                                            }
                                                        >
                                                            <a
                                                                href={
                                                                    file.file_url
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                {file.file
                                                                    .split("/")
                                                                    .pop()}
                                                            </a>
                                                        </li>
                                                    )
                                                )
                                            ) : (
                                                <li key={submission.id}>
                                                    No files submitted.
                                                </li>
                                            )
                                        )}
                                    </ul>
                                    <span className="text-success">
                                        Files already submitted for this
                                        classwork.
                                    </span>
                                </div>
                            ) : (
                                <div>
                                    {/* Only show the file upload if no submission exists */}
                                    <div
                                        class="alert alert-danger"
                                        role="alert"
                                    >
                                        You can only submit once. Once
                                        submitted, it cannot be edited or
                                        resubmitted. Please review all
                                        information carefully before submitting.
                                    </div>
                                    <div
                                        className={`${studenttestCSS.carddContainer}`}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, data.id)}
                                    >
                                        <h6>Drag & Drop your files here</h6>
                                        <input
                                            type="file"
                                            onChange={(e) =>
                                                handleFileChange(e, data.id)
                                            }
                                            style={{
                                                display: "block",
                                                margin: "10px 0",
                                            }}
                                            multiple
                                            disabled={data.status === "close"} // Disable input if status is 'close'
                                        />
                                    </div>

                                    {files[data.id] &&
                                        files[data.id].length > 0 && (
                                            <div
                                                className={
                                                    studenttestCSS.fileList
                                                }
                                            >
                                                <h6>Selected Files:</h6>
                                                <ul>
                                                    {files[data.id].map(
                                                        (file, fileIndex) => (
                                                            <li
                                                                key={fileIndex}
                                                                className={
                                                                    studenttestCSS.wrapList
                                                                }
                                                            >
                                                                {file.name}
                                                                <span
                                                                    className={
                                                                        studenttestCSS.removeFile
                                                                    }
                                                                    onClick={() =>
                                                                        handleFileRemove(
                                                                            data.id,
                                                                            fileIndex
                                                                        )
                                                                    }
                                                                >
                                                                    &times;
                                                                </span>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                                <button
                                                    onClick={() =>
                                                        handleFileSubmit(
                                                            data.id
                                                        )
                                                    }
                                                    className="btn btn-primary mt-3"
                                                    disabled={
                                                        data.status === "close"
                                                    } // Disable button if status is 'close'
                                                >
                                                    Submit All Files
                                                </button>
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
