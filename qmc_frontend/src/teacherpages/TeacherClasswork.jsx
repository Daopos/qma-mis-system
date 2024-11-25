import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";

import ButtonB from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Link, useNavigate, useParams } from "react-router-dom";

import axiosClientTeacher from "../axoisclient/axois-client-teacher";

import teacherquizCSS from "./TeacherQuiz.module.css";

import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import { useQuery } from "react-query";
import Confirmation from "../components/Confirmation";

import { format } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";

export default function TeacherClasswork() {
    const [show, setShow] = useState(false);

    const { subjectId } = useParams();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [score, setScore] = useState(100);
    const [deadline, setDeadline] = useState("");
    const [status, setStatus] = useState("");

    const [editMode, setEditMode] = useState(false);

    const [classworkId, setClassWorkId] = useState(null);

    const [confirmId, setConfirmId] = useState(null);
    const [confirm, setConfirm] = useState(false);

    const [confirmLoading, setConfirmLoading] = useState(false);

    let navigate = useNavigate();

    const handleCloseConfirm = () => {
        setConfirm(false);
        setConfirmId(null);
    };

    const {
        data: classwork = [],
        isLoading: isClassworkLoading,
        refetch,
    } = useQuery(["classworks", subjectId], async () => {
        const { data } = await axiosClientTeacher.get(
            `/classwork/${subjectId}`
        );
        return data;
    });

    const handleClose = () => {
        setShow(false);
        setTitle("");
        setDeadline(null);
        setStatus("");
        setDescription("");
        setScore(100);
        setEditMode(false);
    };

    const handleEditClick = (data) => {
        setEditMode(true);
        setClassWorkId(data.id);
        setTitle(data.title);
        setDescription(data.description);
        setScore(data.score);
        setDeadline(
            data.deadline
                ? format(new Date(data.deadline), "yyyy-MM-dd'T'HH:mm")
                : ""
        );
        setStatus(data.status);
        setShow(true);
    };

    const createClasswork = async () => {
        setConfirmLoading(true);

        const formattedDeadline = deadline
            ? format(new Date(deadline), "yyyy-MM-dd HH:mm:ss")
            : null; // Send null if no deadline is set

        const payload = {
            title: title,
            subject_id: subjectId,
            score: score,
            description: description,
            deadline: formattedDeadline,
            status: status,
        };

        console.log(payload);
        await axiosClientTeacher
            .post("/classworks", payload)
            .then(() => {
                refetch();
                resetForm();
                toast.success("Classwork created successfully!");
            })
            .catch((err) => {
                if (err.response && err.response.status === 422) {
                    const errors = err.response.data.errors;
                    const errorMessages = Object.values(errors)
                        .flat()
                        .join(" ");
                    toast.error(errorMessages); // Display all validation errors in a single toast
                }
            })
            .finally(() => setConfirmLoading(false));
    };

    const updateClassWork = async () => {
        setConfirmLoading(true);

        const formattedDeadline = deadline
            ? format(new Date(deadline), "yyyy-MM-dd HH:mm:ss")
            : null; // Send null if no deadline is set

        const payload = {
            title: title,
            score: score,
            description: description,
            deadline: formattedDeadline, // Pass deadline as null if not set
            status: status,
        };

        console.log(payload);
        await axiosClientTeacher
            .put(`/classworks/${classworkId}`, payload)
            .then(() => {
                resetForm();
                toast.success("Classwork updated successfully!");
                refetch();
            })
            .catch((err) => {
                if (err.response && err.response.status === 422) {
                    const errors = err.response.data.errors;
                    const errorMessages = Object.values(errors)
                        .flat()
                        .join(" ");
                    toast.error(errorMessages); // Display all validation errors in a single toast
                }
            })
            .finally(() => setConfirmLoading(false));
    };
    const viewClasswork = () => {};

    const deleteClasswork = async () => {
        console.log("test");
        await axiosClientTeacher
            .delete(`/classworks/${confirmId}`)
            .then(() => {
                refetch();
                toast.success("Classwork deleted successfully!");
                handleCloseConfirm();
            })
            .catch((err) => {
                toast.danger("Error occured!");
            });
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
    const resetForm = () => {
        setTitle("");
        setDeadline(null);
        setDescription("");
        setScore(100);
        setStatus("");
        setEditMode(false);
        setShow(false);
    };

    return (
        <>
            <div className="d-flex flex-column justify-content-center p-3 align-items-center">
                <div>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setShow(true)}
                    >
                        Create Classwork
                    </Button>
                </div>

                {classwork.map((data, index) => (
                    <div className="mt-4" key={index}>
                        <div className={teacherquizCSS.testCard}>
                            <div className="d-flex justify-content-end">
                                <VisibilityIcon
                                    className={teacherquizCSS.iconContainer}
                                    onClick={() => {
                                        navigate(
                                            `/teacher/classwork-submissions/${data.id}`
                                        );
                                    }}
                                />
                                <EditIcon
                                    className={teacherquizCSS.iconContainer}
                                    onClick={() => {
                                        handleEditClick(data);
                                    }}
                                />
                                <DeleteIcon
                                    className={teacherquizCSS.iconContainer}
                                    onClick={() => {
                                        setConfirmId(data.id);
                                        setConfirm(true);
                                    }}
                                />
                            </div>
                            <h4>Title: {data.title}</h4>
                            <small className="pb-2">
                                {data.description ? data.description : ""}
                            </small>
                            <h6>
                                total student submitted:{" "}
                                {data.submissions_count}
                            </h6>
                            <h6>Due Date: {formatDateTime(data.deadline)}</h6>
                            <h6>Status: {data.status}</h6>
                            <small className="mt-1">
                                posted on {formatDateTime(data.created_at)}
                            </small>
                        </div>
                    </div>
                ))}
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editMode ? "Edit Classwork" : "Add Classwork"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="questionTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="answer">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            style={{ resize: "none" }}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="answer">
                        <Form.Label>Score</Form.Label>
                        <Form.Control
                            type="text"
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="answer">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            aria-label="Default select example"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option>Status</option>
                            <option value="open">Open</option>
                            <option value="close">Close</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="answer">
                        <Form.Label>Deadline</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            placeholder="Optional"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <ButtonB variant="secondary" onClick={handleClose}>
                        Close
                    </ButtonB>
                    <ButtonB
                        variant="primary"
                        onClick={editMode ? updateClassWork : createClasswork}
                        disabled={confirmLoading}
                    >
                        {confirmLoading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                Save Changes...{" "}
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </ButtonB>
                </Modal.Footer>
            </Modal>

            <Confirmation
                show={confirm}
                onHide={handleCloseConfirm}
                confirm={deleteClasswork}
                title={
                    " Deleting this classwork will permanently remove all data associated with it, including the student submissions and grades. This action cannot be undone."
                }
            />

            <ToastContainer />
        </>
    );
}
