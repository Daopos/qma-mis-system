import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import axiosClientTeacher from "../axoisclient/axois-client-teacher";
import TeacherQuizCSS from "./TeacherQuiz.module.css";

export default function ViewStudentSubmission({
    show,
    handleClose,
    testId,
    studentId,
}) {
    const [submissionDetails, setSubmissionDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    const getSubmissionDetails = () => {
        setLoading(true); // Reset loading state
        setError(null); // Reset error state

        axiosClientTeacher
            .get(`/test/${testId}/student/${studentId}/submission`)
            .then(({ data }) => {
                console.log(data);
                setSubmissionDetails(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(null); // Do not set error when there's no submission, only when the request fails
                setLoading(false);
            });
    };

    useEffect(() => {
        if (show) {
            getSubmissionDetails(); // Fetch submission details when modal is shown
        } else {
            setSubmissionDetails(null); // Reset the submission details when the modal is closed
        }
    }, [testId, studentId, show]);

    const handleScoreChange = (questionId, newScore) => {
        if (!submissionDetails?.answers) return;
        if (isNaN(newScore) || newScore < 0) {
            return; // Prevent non-numeric or negative values
        }

        setSubmissionDetails((prevDetails) => ({
            ...prevDetails,
            answers: prevDetails.answers.map((answer) =>
                answer.question.id === questionId
                    ? { ...answer, score: parseInt(newScore, 10) }
                    : answer
            ),
        }));
    };

    const handleSave = () => {
        if (saving) return; // Prevent multiple save clicks
        setSaving(true); // Set saving state to true

        const updatedAnswers = submissionDetails.answers.map((answer) => ({
            answerId: answer.id,
            questionId: answer.question.id,
            score: parseInt(answer.score, 10),
        }));

        axiosClientTeacher
            .post(`/test/${testId}/student/${studentId}/submission/update`, {
                updatedAnswers,
            })
            .then((response) => {
                alert("Scores updated successfully!");
                setSaving(false); // Reset saving state
                handleClose(); // Close the modal after saving
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to update scores.");
                setSaving(false); // Reset saving state
            });
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : submissionDetails ? (
                        `Submission by ${submissionDetails.student.surname}, ${submissionDetails.student.firstname}`
                    ) : (
                        "No submission available"
                    )}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : error || !submissionDetails ? (
                    <p>No submission found.</p> // Show "No submission found" when there is no submission
                ) : (
                    <div className={TeacherQuizCSS.tableResponsiveContainer}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Question</th>
                                    <th>Correct Answer</th>
                                    <th>Answer</th>
                                    <th>Pts</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissionDetails.answers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5">
                                            No answers submitted for this test.
                                        </td>
                                    </tr>
                                ) : (
                                    submissionDetails.answers.map(
                                        (answer, index) => (
                                            <tr key={index}>
                                                <td>{answer.question.type}</td>
                                                <td>{answer.question.title}</td>
                                                <td>
                                                    {
                                                        answer.question
                                                            .correct_answer
                                                    }
                                                </td>
                                                <td>{answer.answer}</td>
                                                <td>{answer.question.pts}</td>

                                                <td>
                                                    <input
                                                        type="number"
                                                        value={answer.score}
                                                        onChange={(e) =>
                                                            handleScoreChange(
                                                                answer.question
                                                                    .id,
                                                                e.target.value
                                                            )
                                                        }
                                                        min="0"
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={handleClose}
                    disabled={saving}
                >
                    Close
                </Button>
                {submissionDetails && (
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            "Save Scores"
                        )}
                    </Button>
                )}
                {error && <p className="text-danger">{error}</p>}
            </Modal.Footer>
        </Modal>
    );
}
