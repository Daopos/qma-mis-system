import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosClientPrincipal from "../../axoisclient/axios-client-principal";

export default function PrincipalSubjectView({ show, onHide, classId }) {
    const [showAddSubject, setShowAddSubject] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [formValues, setFormValues] = useState({
        title: "",
        teacher_id: "",
        schedules: [{ start: "", end: "", day: "" }],
    });

    useEffect(() => {
        if (show) {
            getTeachers();
            getSubjects();
        }
    }, [show]);

    const handleCloseAddSubject = () => {
        setShowAddSubject(false);
        resetForm();
    };

    const resetForm = () => {
        setFormValues({
            title: "",
            teacher_id: "",
            schedules: [{ start: "", end: "", day: "" }],
        });
        setIsEditMode(false);
        setSelectedSubjectId(null);
    };

    const getSubjects = () => {
        axiosClientPrincipal
            .get(`/class/subjects/${classId}`)
            .then(({ data }) => setSubjects(data.subjects))
            .catch((error) => console.error("Error fetching subjects:", error));
    };

    const getTeachers = () => {
        axiosClientPrincipal
            .get("/all/teacher")
            .then(({ data }) => setTeachers(data.teachers))
            .catch((error) => console.error("Error fetching teachers:", error));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleScheduleChange = (index, e) => {
        const { name, value } = e.target;
        const schedules = [...formValues.schedules];
        schedules[index][name] = value;
        setFormValues({ ...formValues, schedules });
    };

    const addSchedule = () => {
        if (formValues.schedules.length < 3) {
            setFormValues((prevValues) => ({
                ...prevValues,
                schedules: [
                    ...prevValues.schedules,
                    { start: "", end: "", day: "" },
                ],
            }));
        } else {
            toast.warning("You can only add up to 3 schedules.");
        }
    };

    const removeSchedule = (index) => {
        const schedules = formValues.schedules.filter((_, i) => i !== index);
        setFormValues({ ...formValues, schedules });
    };

    const handleSubmit = () => {
        const payload = {
            ...formValues,
            classroom_id: classId,
        };

        const apiCall = isEditMode
            ? axiosClientPrincipal.put(
                  `/subjects/${selectedSubjectId}`,
                  payload
              )
            : axiosClientPrincipal.post("/subjects", payload);

        apiCall
            .then(() => {
                getSubjects();
                handleCloseAddSubject();
                toast.success(
                    isEditMode
                        ? "Subject updated successfully!"
                        : "Subject added successfully!"
                );
            })
            .catch((err) => {
                console.error(err);
                const errorMessage =
                    err.response?.data?.error || "Error processing subject.";
                toast.error(errorMessage);
            });
    };

    const handleEdit = (subject) => {
        setIsEditMode(true);
        setSelectedSubjectId(subject.id);
        setFormValues({
            title: subject.title,
            teacher_id: subject.teacher_id || "",
            schedules:
                subject.schedules && subject.schedules.length > 0
                    ? subject.schedules
                    : [{ start: "", end: "", day: "" }],
        });
        setShowAddSubject(true);
    };

    const handleDelete = (subjectId) => {
        if (window.confirm("Are you sure you want to delete this subject?")) {
            axiosClientPrincipal
                .delete(`/subjects/${subjectId}`)
                .then(() => {
                    getSubjects();
                    toast.success("Subject deleted successfully!");
                })
                .catch((error) => {
                    console.error("Error deleting subject:", error);
                    toast.error("Error deleting subject.");
                });
        }
    };

    return (
        <>
            <Modal
                show={showAddSubject}
                aria-labelledby="contained-modal-title-vcenter"
                onHide={handleCloseAddSubject}
                dialogClassName="modal-60w"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {isEditMode ? "Edit Subject" : "Add Subject"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                name="title"
                                type="text"
                                placeholder="Ex. Science"
                                value={formValues.title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        {formValues.schedules.map((schedule, index) => (
                            <div key={index} className="mb-3">
                                <h5>Schedule {index + 1}</h5>
                                <div className="d-flex mb-2">
                                    <Form.Group className="me-2 flex-fill">
                                        <Form.Label>Time Start</Form.Label>
                                        <Form.Control
                                            name="start"
                                            type="time"
                                            value={schedule.start}
                                            onChange={(e) =>
                                                handleScheduleChange(index, e)
                                            }
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="me-2 flex-fill">
                                        <Form.Label>Time End</Form.Label>
                                        <Form.Control
                                            name="end"
                                            type="time"
                                            value={schedule.end}
                                            onChange={(e) =>
                                                handleScheduleChange(index, e)
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </div>
                                <Form.Group className="mb-3">
                                    <Form.Label>Day</Form.Label>
                                    <Form.Select
                                        name="day"
                                        value={schedule.day}
                                        onChange={(e) =>
                                            handleScheduleChange(index, e)
                                        }
                                        required
                                    >
                                        <option value="">Select Day</option>
                                        <option value="Monday">Monday</option>
                                        <option value="Tuesday">Tuesday</option>
                                        <option value="Wednesday">
                                            Wednesday
                                        </option>
                                        <option value="Thursday">
                                            Thursday
                                        </option>
                                        <option value="Friday">Friday</option>
                                    </Form.Select>
                                </Form.Group>
                                <Button
                                    variant="danger"
                                    onClick={() => removeSchedule(index)}
                                >
                                    Remove Schedule
                                </Button>
                            </div>
                        ))}
                        <Button
                            variant="secondary"
                            onClick={addSchedule}
                            className="mb-3"
                        >
                            Add Schedule
                        </Button>
                        <Form.Group className="mb-3">
                            <Form.Label>Teacher</Form.Label>
                            <Form.Select
                                name="teacher_id"
                                value={formValues.teacher_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Teacher</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.lname}, {teacher.fname}{" "}
                                        {teacher.mname
                                            ? teacher.mname.charAt(0) + "."
                                            : ""}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddSubject}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {isEditMode ? "Update Subject" : "Add Subject"}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={show} onHide={onHide} dialogClassName="modal-80w">
                <Modal.Header closeButton>
                    <Modal.Title>Subjects</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setShowAddSubject(true);
                            resetForm();
                        }}
                    >
                        Add Subject
                    </Button>
                    <Table striped bordered hover className="mt-3">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Subject Title</th>
                                <th>Teacher</th>
                                <th>Schedules</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject, index) => (
                                <tr key={subject.id}>
                                    <td>{index + 1}</td>
                                    <td>{subject.title}</td>
                                    <td>
                                        {subject.teacher_fname
                                            ? `${subject.teacher_lname}, ${
                                                  subject.teacher_fname
                                              } ${
                                                  subject.teacher_mname
                                                      ? subject.teacher_mname.charAt(
                                                            0
                                                        ) + "."
                                                      : ""
                                              }`
                                            : "No teacher assigned"}
                                    </td>
                                    <td>
                                        {subject.schedules &&
                                        subject.schedules.length > 0 ? (
                                            subject.schedules.map(
                                                (schedule, i) => (
                                                    <div key={i}>
                                                        {schedule.day}:{" "}
                                                        {schedule.start} -{" "}
                                                        {schedule.end}
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <div>No schedule available</div>
                                        )}
                                    </td>
                                    <td className="d-flex flex-wrap gap-2">
                                        <Button
                                            variant="warning"
                                            onClick={() => handleEdit(subject)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() =>
                                                handleDelete(subject.id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </>
    );
}
