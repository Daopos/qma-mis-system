import React, { useEffect, useRef, useState } from "react";
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
import { useParams } from "react-router-dom";
import TeacherEditES from "../components/teacher/TeacherEditES";
import TeacherEditIF from "../components/teacher/TeacherEditIF";
import TeacherEditMC from "../components/teacher/TeacherEditMC";
import { ToastContainer, toast } from "react-toastify";

export default function TeacherTestCreationEdit() {
    const [mcModal, setMCModal] = useState(false);
    const [ifModal, setIFModal] = useState(false);
    const [esModal, setESModal] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState(""); // State for status
    const [deadline, setDeadline] = useState(""); // State for deadline

    const [editingMCQuestion, setEditingMCQuestion] = useState(null);
    const [editingIFQuestion, setEditingIFQuestion] = useState(null);
    const [editingESQuestion, setEditingESQuestion] = useState(null);
    const { testId } = useParams(); // Get the testId from the URL

    const [mcAddModal, setMCAddModal] = useState(false);
    const [ifAddModal, setIFAddModal] = useState(false);
    const [esAddModal, setESAddModal] = useState(false);

    const getQuestion = () => {
        axiosClientTeacher
            .get(`/test/${testId}`)
            .then(({ data }) => {
                console.log(data);

                const { questions } = data;

                const formattedDeadline = data.deadline
                    ? data.deadline.replace(" ", "T").slice(0, 16)
                    : "";
                setTitle(data.title);
                setDescription(data.description);
                setStatus(data.status);
                setDeadline(formattedDeadline); // Set formatted deadline

                setQuestions(questions);
            })
            .catch((err) => {
                console.error(err.response.data);
            });
    };

    useEffect(() => {
        getQuestion();
    }, [testId]);

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

    const handleMCAddModalClose = () => {
        setMCAddModal(false);
    };

    const handleIFAddModalClose = () => {
        setIFAddModal(false);
    };

    const handleESAddModalClose = () => {
        setESAddModal(false);
    };

    const handleSaveQuestion = (questionData, type) => {
        if (type === "multiple-choice") {
            if (editingMCQuestion !== null) {
                const updatedQuestion = {
                    ...questionData,
                    id: questions[editingMCQuestion].id,
                };

                axiosClientTeacher
                    .put(
                        `/question/update/${updatedQuestion.id}`,
                        updatedQuestion
                    )
                    .then((response) => {
                        console.log(response.data.message);
                        const updatedQuestions = questions.map((q, index) =>
                            index === editingMCQuestion ? updatedQuestion : q
                        );
                        setQuestions(updatedQuestions);
                        handleMCModalClose();
                        toast.success("Question Updated");
                    })
                    .catch((error) => {
                        toast.error("Error occured");
                        console.error(error.response.data);
                    });
            } else {
                // Handle adding new questions
                console.log(questionData);
                axiosClientTeacher
                    .post("/multiple-choice/create", {
                        ...questionData,
                        type: "multiple-choice",
                        test_id: testId,
                        index_position: "1000",
                    })
                    .then((response) => {
                        console.log(response.data.message);
                        getQuestion();
                        setMCAddModal(false); // Close the modal after adding
                        toast.success("Question Created");
                    })
                    .catch((error) => {
                        console.error(error.response.data);
                        toast.error("Error occured");
                    });
            }
        } else if (type === "identification") {
            if (editingIFQuestion !== null) {
                const updatedQuestion = {
                    ...questionData,
                    id: questions[editingIFQuestion].id,
                };

                axiosClientTeacher
                    .put(
                        `/identification/update/${updatedQuestion.id}`,
                        updatedQuestion
                    )
                    .then((response) => {
                        console.log(response.data.message);
                        const updatedQuestions = questions.map((q, index) =>
                            index === editingIFQuestion ? updatedQuestion : q
                        );
                        setQuestions(updatedQuestions);
                        handleIFModalClose();
                        toast.success("Question Updated");
                    })
                    .catch((error) => {
                        console.error(error.response.data);
                        toast.error("Error occured");
                    });
            } else {
                // Handle adding new identification questions
                axiosClientTeacher
                    .post("/identification/create", {
                        ...questionData,
                        type: "identification",
                        test_id: testId,
                        index_position: "1000",
                    })
                    .then((response) => {
                        console.log(response.data.message);
                        getQuestion();
                        setIFAddModal(false); // Close the modal after adding
                        toast.success("Question Created");
                    })
                    .catch((error) => {
                        console.error(error.response.data);
                        toast.error("Error occured");
                    });
            }
        } else if (type === "essay") {
            if (editingESQuestion !== null) {
                const updatedQuestion = {
                    ...questionData,
                    id: questions[editingESQuestion].id,
                };

                axiosClientTeacher
                    .put(`/essay/update/${updatedQuestion.id}`, updatedQuestion)
                    .then((response) => {
                        console.log(response.data.message);
                        const updatedQuestions = questions.map((q, index) =>
                            index === editingESQuestion ? updatedQuestion : q
                        );
                        setQuestions(updatedQuestions);
                        handleESModalClose();
                        toast.success("Question Updated");
                    })
                    .catch((error) => {
                        console.error(error.response.data);
                        toast.error("Error Occured");
                    });
            } else {
                axiosClientTeacher
                    .post("/essay/create", {
                        ...questionData,
                        type: "essay",
                        test_id: testId,
                        index_position: "1000",
                    })
                    .then((response) => {
                        console.log(response.data.message);
                        getQuestion();
                        setESAddModal(false); // Close the modal after adding
                        toast.success("Question Created");
                    })
                    .catch((error) => {
                        console.error(error.response.data);
                        toast.success("Error Occured");
                    });
            }
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
        const formattedDeadline = deadline
            ? deadline.replace("T", " ") + ":00"
            : null;
        const payload = {
            title: title,
            description: description,
            status: status,
            deadline: formattedDeadline, // Use formatted deadline
        };
        axiosClientTeacher
            .put(`/test/update/${testId}`, payload)
            .then(() => {
                getQuestion();
                toast.success("Title and Description Updated");

                console.log("success");
            })
            .catch((err) => {
                toast.error("Error Occured");

                console.log("fail");
                console.log(err);
            });
    };

    const handleDelete = (questionId) => {
        // Prompt the user for confirmation
        const isConfirmed = window.confirm(
            "Are you sure you want to delete this question?"
        );

        if (isConfirmed) {
            // If confirmed, proceed with deletion
            axiosClientTeacher
                .delete(`/question/delete/${questionId}`)
                .then(() => {
                    getQuestion(); // Refresh the question list after deletion
                    toast.success("Deleted Successfully");
                })
                .catch((err) => {
                    console.log(err);
                    toast.error("Error Occurred");
                });
        } else {
            // If not confirmed, you can optionally show a message or do nothing
            toast.info("Deletion canceled");
        }
    };
    return (
        <>
            <div className="d-flex justify-content-center gap-3 p-3">
                <div>
                    <div className={TestCreationCSS.sideContainer}>
                        <div className={TestCreationCSS.sideBox}>
                            <div className={TestCreationCSS.titleContainer}>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formBasicEmail"
                                >
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        type="text"
                                        placeholder="Quiz 1"
                                    />
                                </Form.Group>

                                <Form.Group
                                    className="mb-3"
                                    controlId="formBasicPassword"
                                >
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        style={{ resize: "none" }}
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        placeholder="Answer this "
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="mb-2"
                                    controlId="formBasicStatus"
                                >
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(e.target.value)
                                        } // Update state
                                        aria-label="Default select example"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="open">Open</option>
                                        <option value="close">Close</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group
                                    className="mb-2"
                                    controlId="formBasicDeadline"
                                >
                                    <Form.Label>Deadline</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={deadline}
                                        onChange={(e) =>
                                            setDeadline(e.target.value)
                                        } // Update state
                                    />
                                </Form.Group>
                                <div>
                                    <Button onClick={handleSubmit}>Save</Button>
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
                                                handleDelete(question.id)
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
                                                        {choice.choice_text}
                                                        {choice.choice_text ===
                                                        question.correct_answer
                                                            ? " (Correct)"
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
                                title="Add A Question"
                            >
                                <Dropdown.Item
                                    onClick={() => {
                                        setMCAddModal(true);
                                    }}
                                >
                                    Multiple Choice
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => {
                                        setIFAddModal(true);
                                    }}
                                >
                                    Identification
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => {
                                        setESAddModal(true);
                                    }}
                                >
                                    Essay
                                </Dropdown.Item>
                            </DropdownButton>
                        </div>
                    </div>
                </div>
            </div>

            <TeacherEditMC
                show={mcModal}
                onHide={handleMCModalClose}
                onSave={(data) => handleSaveQuestion(data, "multiple-choice")}
                editingQuestion={
                    editingMCQuestion !== null
                        ? questions[editingMCQuestion]
                        : null
                }
            />

            <TeacherEditIF
                show={ifModal}
                onHide={handleIFModalClose}
                onSave={(data) => handleSaveQuestion(data, "identification")}
                editingQuestion={
                    editingIFQuestion !== null
                        ? questions[editingIFQuestion]
                        : null
                }
            />

            <TeacherEditES
                show={esModal}
                onHide={handleESModalClose}
                onSave={(data) => handleSaveQuestion(data, "essay")}
                editingQuestion={
                    editingESQuestion !== null
                        ? questions[editingESQuestion]
                        : null
                }
            />

            <TeacherAddMC
                show={mcAddModal}
                onHide={handleMCAddModalClose}
                onSave={(data) => handleSaveQuestion(data, "multiple-choice")}
                editingQuestion={
                    editingMCQuestion !== null
                        ? questions[editingMCQuestion]
                        : null
                }
            />

            <TeacherAddIF
                show={ifAddModal}
                onHide={handleIFAddModalClose}
                onSave={(data) => handleSaveQuestion(data, "identification")}
                editingQuestion={
                    editingIFQuestion !== null
                        ? questions[editingIFQuestion]
                        : null
                }
            />

            <TeacherAddES
                show={esAddModal}
                onHide={handleESAddModalClose}
                onSave={(data) => handleSaveQuestion(data, "essay")}
                editingQuestion={
                    editingESQuestion !== null
                        ? questions[editingESQuestion]
                        : null
                }
            />

            <ToastContainer />
        </>
    );
}
