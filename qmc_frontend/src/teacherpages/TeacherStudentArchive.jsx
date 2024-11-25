import React, { useEffect, useRef, useState } from "react";
import axiosClientTeacher from "../axoisclient/axois-client-teacher";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner"; // Import Spinner

export default function TeacherStudentArchive() {
    const { subjectId } = useParams(); // Get the subjectId from the URL

    const [students, setStudents] = useState([]);
    const [show, setShow] = useState(false);
    const [studentId, setStudentId] = useState();
    const [grade, setGrade] = useState({
        first_quarter: "",
        second_quarter: "",
        third_quarter: "",
        fourth_quarter: "",
    });
    const [loading, setLoading] = useState(false); // Loading state

    const getStudents = () => {
        axiosClientTeacher
            .get(`/subject/students/${subjectId}`)
            .then(({ data }) => {
                setStudents(data);
            });
    };

    const getStudentGrade = (studentId) => {
        setLoading(true); // Set loading to true when fetching grades
        axiosClientTeacher
            .get(`/teacher/grade/${studentId}/${subjectId}`)
            .then(({ data }) => {
                if (data) {
                    setGrade({
                        first_quarter: data.first_quarter || "",
                        second_quarter: data.second_quarter || "",
                        third_quarter: data.third_quarter || "",
                        fourth_quarter: data.fourth_quarter || "",
                    });
                } else {
                    // Clear the form if no grade is found
                    setGrade({
                        first_quarter: "",
                        second_quarter: "",
                        third_quarter: "",
                        fourth_quarter: "",
                    });
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false); // Set loading to false after fetching grades
            });
    };

    const openGradeModal = (studentId) => {
        setStudentId(studentId);
        setShow(true);
        getStudentGrade(studentId); // Fetch the student's grades
    };

    const addOrUpdateGrade = () => {
        const payload = {
            student_id: studentId,
            subject_id: subjectId,
            first_quarter: grade.first_quarter,
            second_quarter: grade.second_quarter,
            third_quarter: grade.third_quarter,
            fourth_quarter: grade.fourth_quarter,
        };

        axiosClientTeacher
            .post("/teacher/make/grade", payload)
            .then(() => {
                console.log("Grade saved successfully");
                handleClose();
                getStudents(); // Refresh the student list to show updated grades
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        getStudents();
    }, []);

    const handleClose = () => {
        setShow(false);
        setGrade({
            first_quarter: "",
            second_quarter: "",
            third_quarter: "",
            fourth_quarter: "",
        }); // Clear grades when closing the modal
    };

    return (
        <>
            <div className="p-3">
                <div className="list-container">
                    <div className="d-flex justify-content-between list-title-container">
                        <h2>Student List</h2>
                    </div>
                    <div>
                        <table className="list-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>LRN</th>
                                    <th>Name</th>
                                    <th>Gender</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((data, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{data.lrn}</td>
                                        <td>{`${data.surname}${
                                            data.extension_name
                                                ? ` ${data.extension_name}`
                                                : ""
                                        }, ${data.firstname}${
                                            data.middlename
                                                ? `, ${data.middlename.charAt(
                                                      0
                                                  )}.`
                                                : ""
                                        }`}</td>
                                        <td>{data.gender}</td>
                                        <td>
                                            <button
                                                className="button-list button-blue"
                                                onClick={() =>
                                                    openGradeModal(data.id)
                                                }
                                            >
                                                Grade
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Student Grade</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? ( // Show spinner while loading
                        <div className="text-center">
                            <Spinner animation="border" />
                        </div>
                    ) : (
                        <>
                            <Form.Group
                                className="mb-3"
                                controlId="firstQuarter"
                            >
                                <Form.Label>First Quarter</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="number"
                                    value={grade.first_quarter}
                                    onChange={(e) =>
                                        setGrade((prev) => ({
                                            ...prev,
                                            first_quarter: e.target.value,
                                        }))
                                    }
                                />
                            </Form.Group>
                            <Form.Group
                                className="mb-3"
                                controlId="secondQuarter"
                            >
                                <Form.Label>Second Quarter</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="number"
                                    value={grade.second_quarter}
                                    onChange={(e) =>
                                        setGrade((prev) => ({
                                            ...prev,
                                            second_quarter: e.target.value,
                                        }))
                                    }
                                />
                            </Form.Group>
                            <Form.Group
                                className="mb-3"
                                controlId="thirdQuarter"
                            >
                                <Form.Label>Third Quarter</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="number"
                                    value={grade.third_quarter}
                                    onChange={(e) =>
                                        setGrade((prev) => ({
                                            ...prev,
                                            third_quarter: e.target.value,
                                        }))
                                    }
                                />
                            </Form.Group>
                            <Form.Group
                                className="mb-3"
                                controlId="fourthQuarter"
                            >
                                <Form.Label>Fourth Quarter</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="number"
                                    value={grade.fourth_quarter}
                                    onChange={(e) =>
                                        setGrade((prev) => ({
                                            ...prev,
                                            fourth_quarter: e.target.value,
                                        }))
                                    }
                                />
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={addOrUpdateGrade}
                        disabled={loading}
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
