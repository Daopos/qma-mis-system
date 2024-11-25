import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

export default function TeacherEditIF({
    show,
    onHide,
    onSave,
    editingQuestion,
}) {
    const [questionTitle, setQuestionTitle] = useState("");
    const [correct_answer, setCorrectAnswer] = useState("");
    const [points, setPoints] = useState("");

    useEffect(() => {
        if (editingQuestion) {
            setQuestionTitle(editingQuestion.title);
            setCorrectAnswer(editingQuestion.correct_answer);
            setPoints(editingQuestion.pts || "");
        } else {
            setQuestionTitle("");
            setCorrectAnswer("");
            setPoints("");
        }
    }, [editingQuestion]);

    const handleSave = () => {
        const questionData = {
            title: questionTitle,
            correct_answer: correct_answer,
            pts: points,
            type: "identification",
        };
        onSave(questionData); // Pass data to the parent component
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {editingQuestion
                        ? "Edit Identification Question"
                        : "Add Identification Question"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="questionTitle">
                    <Form.Label>Question Title</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={questionTitle}
                        onChange={(e) => setQuestionTitle(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="correctAnswer">
                    <Form.Label>Correct Answer</Form.Label>
                    <Form.Control
                        type="text"
                        value={correct_answer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="points">
                    <Form.Label>Points</Form.Label>
                    <Form.Control
                        type="number"
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
