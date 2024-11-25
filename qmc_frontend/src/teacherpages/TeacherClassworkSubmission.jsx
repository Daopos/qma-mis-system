import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axiosClientTeacher from "../axoisclient/axois-client-teacher";
import { useQuery } from "react-query";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";

export default function TeacherClassworkSubmission() {
    const { classworkId } = useParams();
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [score, setScore] = useState(0);
    const [submissionId, setSubmissionId] = useState(null);
    const [filter, setFilter] = useState("all"); // For filtering options
    const [searchQuery, setSearchQuery] = useState(""); // For search functionality

    const { data: classwork, isLoading: classworkLoading } = useQuery(
        ["classwork", classworkId],
        async () => {
            const { data } = await axiosClientTeacher.get(
                `/classworks/${classworkId}`
            );
            return data;
        }
    );

    const {
        data: submissions,
        isLoading,
        error,
        refetch,
    } = useQuery(["classworkSubmissions", classworkId], async () => {
        const { data } = await axiosClientTeacher.get(
            `/classwork/${classworkId}/submissions`
        );

        console.log(data);
        return data;
    });

    if (isLoading || classworkLoading)
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    if (error) return <div>Error loading submissions</div>;

    const handleViewSubmission = (submission) => {
        setSelectedSubmission(submission);
        setShowModal(true);
        setSubmissionId(submission?.id || null);
        setScore(submission?.score || 0);
    };

    const handleSubmitScore = async () => {
        try {
            await axiosClientTeacher.post(`/submission/${submissionId}/score`, {
                score,
            });
            refetch();
            setShowModal(false);
            toast.success("Score Saved");
        } catch (error) {
            console.error("Error updating score:", error);
            toast.error("The score is higher than the average overall score");
        }
    };

    // Filter and Search Logic
    const filteredSubmissions = submissions.filter((data) => {
        const hasSubmission = !!data.submission;

        // Filter by submission status
        if (filter === "submitted" && !hasSubmission) return false;
        if (filter === "notSubmitted" && hasSubmission) return false;

        // Search by name or LRN
        const searchLower = searchQuery.toLowerCase();
        const studentName =
            `${data.student.firstname} ${data.student.surname}`.toLowerCase();
        const lrn = data.student.lrn.toLowerCase();

        return studentName.includes(searchLower) || lrn.includes(searchLower);
    });

    return (
        <>
            <div className="p-3">
                <div className="list-container">
                    <div className="d-flex justify-content-between list-title-container align-items-center">
                        <h2>{classwork?.title}</h2>
                    </div>
                    <div className="d-flex justify-content-between list-title-container align-items-center">
                        <h2>Classwork Submissions</h2>
                        <h5>Overall Score: {classwork?.score}</h5>
                    </div>
                    {/* Filter and Search Section */}
                    <div className="d-flex justify-content-between my-3 flex-wrap gap-2 p-2">
                        <Form.Select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            style={{ width: "200px" }}
                        >
                            <option value="all">All Students</option>
                            <option value="submitted">Submitted</option>
                            <option value="notSubmitted">Not Submitted</option>
                        </Form.Select>
                        <Form.Control
                            type="text"
                            placeholder="Search by name or LRN"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: "300px" }}
                        />
                    </div>
                    <div>
                        <table className="list-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Status</th>
                                    <th>Student LRN</th>
                                    <th>Student Name</th>
                                    <th>Submission Date</th>
                                    <th>Score</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSubmissions.map((data, index) => (
                                    <tr key={index}>
                                        <td data-label="NO">{index + 1}</td>
                                        <td data-label="status">
                                            {data.submission ? (
                                                data.submission.score ===
                                                null ? (
                                                    <PendingIcon
                                                        color="warning"
                                                        titleAccess="Pending"
                                                    />
                                                ) : (
                                                    <CheckCircleIcon
                                                        color="success"
                                                        titleAccess="Submitted"
                                                    />
                                                )
                                            ) : (
                                                <CancelIcon
                                                    color="error"
                                                    titleAccess="Not Submitted"
                                                />
                                            )}
                                        </td>
                                        <td data-label="Lrn">
                                            {data.student.lrn}
                                        </td>
                                        <td data-label="name">
                                            {data.student.firstname}{" "}
                                            {data.student.surname}
                                        </td>
                                        <td data-label="Date">
                                            {data.submission
                                                ? new Date(
                                                      data.submission.created_at
                                                  ).toLocaleString()
                                                : "No submission"}
                                        </td>
                                        <td data-label="Score">
                                            {data.submission
                                                ? data.submission.score
                                                : "N/A"}
                                        </td>
                                        <td data-label="Option">
                                            <button
                                                onClick={() =>
                                                    handleViewSubmission(
                                                        data.submission
                                                    )
                                                }
                                                className="button-list button-blue"
                                                disabled={!data.submission}
                                            >
                                                {data.submission
                                                    ? "View"
                                                    : "No Submission"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal to display files */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Submission Files</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedSubmission && (
                        <Carousel interval={null}>
                            {selectedSubmission.student_classworks.map(
                                (fileData, idx) => {
                                    const fileUrl = fileData.file_url;

                                    return (
                                        <Carousel.Item key={idx}>
                                            {fileData.file.endsWith(".docx") ? (
                                                <div
                                                    className="text-center"
                                                    style={{ height: "500px" }}
                                                >
                                                    <p>
                                                        This document is not
                                                        viewable directly.{" "}
                                                        <a
                                                            href={fileUrl}
                                                            download
                                                        >
                                                            Download here
                                                        </a>
                                                        .
                                                    </p>
                                                </div>
                                            ) : (
                                                <iframe
                                                    title={`File ${idx}`}
                                                    src={fileUrl}
                                                    style={{
                                                        width: "100%",
                                                        height: "500px",
                                                        border: "none",
                                                    }}
                                                ></iframe>
                                            )}
                                        </Carousel.Item>
                                    );
                                }
                            )}
                        </Carousel>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <input
                        type="number"
                        placeholder="Enter score"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        disabled={!submissionId}
                    />
                    <Button
                        variant="primary"
                        onClick={handleSubmitScore}
                        disabled={!submissionId}
                    >
                        Save Score
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </>
    );
}
