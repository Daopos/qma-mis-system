import React, { useRef, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import TeacherAddMC from "../components/teacher/TeacherAddMC";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import TeacherAddIF from "../components/teacher/TeacherAddIF";
import TeacherAddES from "../components/teacher/TeacherAddES";
import axiosClientTeacher from "../axoisclient/axois-client-teacher";

import TestCreationCSS from "../assets/css/testcreation.module.css";

import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationLoad from "../components/ConfirmationLoad";

export default function TeacherTestCreation() {
    const [mcModal, setMCModal] = useState(false);
    const [ifModal, setIFModal] = useState(false);
    const [esModal, setESModal] = useState(false);
    const [questions, setQuestions] = useState([]);

    const [editingMCQuestion, setEditingMCQuestion] = useState(null);
    const [editingIFQuestion, setEditingIFQuestion] = useState(null);
    const [editingESQuestion, setEditingESQuestion] = useState(null);

    const { subjectId } = useParams(); // Get the subjectId from the URL

    const [loading, setLoading] = useState(false);

    const titleTextRef = useRef();
    const descTextRef = useRef();
    const statusTextRef = useRef();
    const deadlineRef = useRef();

    const [confirm, setConfirm] = useState(false);

    const navigate = useNavigate();

    const handleMCModalClose = () => {
        setMCModal(false);
        setEditingMCQuestion(null);
    };

    const handleIFModalClose = () => {
        setIFModal(false);
        setEditingIFQuestion(null);
    };

    const handleESModalClose = () => {
        setESModal(false);
        setEditingESQuestion(null);
    };

    const handleSaveQuestion = (questionData, type) => {
        if (type === "multiple-choice") {
            if (editingMCQuestion !== null) {
                const updatedQuestions = questions.map((q, index) =>
                    index === editingMCQuestion ? questionData : q
                );
                setQuestions(updatedQuestions);
            } else {
                setQuestions([...questions, questionData]);
            }
            handleMCModalClose();
        } else if (type === "identification") {
            if (editingIFQuestion !== null) {
                const updatedQuestions = questions.map((q, index) =>
                    index === editingIFQuestion ? questionData : q
                );
                setQuestions(updatedQuestions);
            } else {
                setQuestions([...questions, questionData]);
            }
            handleIFModalClose();
        } else if (type === "essay") {
            if (editingESQuestion !== null) {
                const updatedQuestions = questions.map((q, index) =>
                    index === editingESQuestion ? questionData : q
                );
                setQuestions(updatedQuestions);
            } else {
                setQuestions([...questions, questionData]);
            }
            handleESModalClose();
        }
    };

    const handleEditQuestion = (index, type) => {
        if (type === "multiple-choice") {
            setEditingMCQuestion(index);
            setMCModal(true);
        } else if (type === "identification") {
            setEditingIFQuestion(index);
            setIFModal(true);
        } else if (type === "essay") {
            setEditingESQuestion(index);
            setESModal(true);
        }
    };

    const handleRemoveQuestion = (index) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
    };
    const handleSubmit = () => {
        const title = titleTextRef.current.value;
        const desc = descTextRef.current.value;
        const status = statusTextRef.current.value;
        const deadline = deadlineRef.current.value;

        const formattedDeadline = deadline ? formatDate(deadline) : null;

        setLoading(true);

        axiosClientTeacher
            .post("/teacher/create/test", {
                subject_id: subjectId,
                title: title,
                description: desc,
                questions: questions,
                status: status,
                deadline: formattedDeadline, // Use the formatted deadline
            })
            .then(() => {
                navigate(-1);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => setLoading(false));
    };

    const handleCloseConfirm = () => setConfirm(false);

    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const day = String(d.getDate()).padStart(2, "0");
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        const seconds = String(d.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    return (
        <>
            <div className="d-flex justify-content-center gap-3 p-3">
                <div>
                    <div className={TestCreationCSS.sideContainer}>
                        <div className={TestCreationCSS.sideBox}>
                            <div className={TestCreationCSS.titleContainer}>
                                <Form.Group
                                    className="mb-2"
                                    controlId="formBasicEmail"
                                >
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        ref={titleTextRef}
                                        type="text"
                                        placeholder="Quiz 1"
                                    />
                                </Form.Group>

                                <Form.Group
                                    className="mb-2"
                                    controlId="formBasicPassword"
                                >
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        style={{ resize: "none" }}
                                        ref={descTextRef}
                                        placeholder="Answer this "
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="mb-2"
                                    controlId="formBasicPassword"
                                >
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        aria-label="Default select example"
                                        ref={statusTextRef}
                                    >
                                        <option value="">Status</option>
                                        <option value="open">Open</option>
                                        <option value="close">Close</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group
                                    className="mb-2"
                                    controlId="formBasicPassword"
                                >
                                    <Form.Label>Deadline</Form.Label>
                                    <Form.Control
                                        ref={deadlineRef}
                                        type="datetime-local"
                                    />
                                </Form.Group>
                                <div>
                                    <Button onClick={() => setConfirm(true)}>
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={TestCreationCSS.mainContainer}>
                    <div className="d-flex flex-column align-items-center gap-3">
                        <h3>Questions:</h3>
                        {questions.map((question, index) => (
                            <div
                                key={index}
                                className={`'mb-3' ${TestCreationCSS.QAContainer}`}
                            >
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <span
                                            className={
                                                TestCreationCSS.typeContainer
                                            }
                                        >
                                            {question.type}
                                        </span>{" "}
                                        <small className={TestCreationCSS.pts}>
                                            {`${question.pts} point`}
                                        </small>
                                    </div>
                                    <div>
                                        <EditIcon
                                            className={
                                                TestCreationCSS.iconContainer
                                            }
                                            onClick={() =>
                                                handleEditQuestion(
                                                    index,
                                                    question.type
                                                )
                                            }
                                        />
                                        <DeleteIcon
                                            className={
                                                TestCreationCSS.iconContainer
                                            }
                                            onClick={() =>
                                                handleRemoveQuestion(index)
                                            }
                                        />
                                    </div>
                                </div>
                                <p className={TestCreationCSS.titleText}>
                                    {`${index + 1}. ${question.title}`}
                                </p>

                                {question.type === "multiple-choice" && (
                                    <>
                                        <p className="mt-1">choices:</p>
                                        <ul className={TestCreationCSS.choices}>
                                            {question.choices.map(
                                                (choice, idx) => (
                                                    <li key={idx}>
                                                        {choice}{" "}
                                                        {choice ===
                                                        question.correct_answer
                                                            ? "(Correct)"
                                                            : ""}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </>
                                )}
                                {question.type === "identification" && (
                                    <p>Answer: {question.correct_answer}</p>
                                )}
                                {/* {question.type === "essay" && (
                            <p>Question: {question.title}</p>
                        )} */}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <div className={TestCreationCSS.sideContainer}>
                        <div className={TestCreationCSS.sideBox}>
                            <DropdownButton
                                id="dropdown-basic-button"
                                title="Create A Question"
                            >
                                <Dropdown.Item
                                    onClick={() => {
                                        setMCModal(true);
                                    }}
                                >
                                    Multiple Choice
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => {
                                        setIFModal(true);
                                    }}
                                >
                                    Identification
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => {
                                        setESModal(true);
                                    }}
                                >
                                    Essay
                                </Dropdown.Item>
                            </DropdownButton>
                        </div>
                    </div>
                </div>
            </div>

            <TeacherAddMC
                show={mcModal}
                onHide={handleMCModalClose}
                onSave={(data) => handleSaveQuestion(data, "multiple-choice")}
                editingQuestion={
                    editingMCQuestion !== null
                        ? questions[editingMCQuestion]
                        : null
                }
            />

            <TeacherAddIF
                show={ifModal}
                onHide={handleIFModalClose}
                onSave={(data) => handleSaveQuestion(data, "identification")}
                editingQuestion={
                    editingIFQuestion !== null
                        ? questions[editingIFQuestion]
                        : null
                }
            />

            <TeacherAddES
                show={esModal}
                onHide={handleESModalClose}
                onSave={(data) => handleSaveQuestion(data, "essay")}
                editingQuestion={
                    editingESQuestion !== null
                        ? questions[editingESQuestion]
                        : null
                }
            />

            <ConfirmationLoad
                show={confirm}
                onHide={handleCloseConfirm}
                confirm={handleSubmit}
                title={
                    <>
                        {"Are you sure you want to save the test you created?"}
                        <br />
                        {"This action cannot be undone."}
                    </>
                }
                loading={loading}
            />
        </>
    );
}
