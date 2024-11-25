import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

export default function TeacherAddIF({
    show,
    onHide,
    onSave,
    editingQuestion,
}) {
    const [questionTitle, setQuestionTitle] = useState("");
    const [answer, setAnswer] = useState("");
    const [pts, setPts] = useState(1);

    useEffect(() => {
        if (editingQuestion && editingQuestion.type === "identification") {
            // Populate the form with existing data when editing
            setQuestionTitle(editingQuestion.title);
            setAnswer(editingQuestion.correct_answer);
            setPts(editingQuestion.pts || 1); // Set default points if not available
        } else {
            // Reset form when not editing
            setQuestionTitle("");
            setAnswer("");
            setPts(1);
        }
    }, [editingQuestion, show]);

    const handleSave = () => {
        // Validation checks
        if (questionTitle.trim() === "") {
            alert("Please enter a valid question.");
            return;
        }
        if (answer.trim() === "") {
            alert("Please provide a valid answer.");
            return;
        }
        if (isNaN(pts) || pts <= 0) {
            alert("Please enter a valid point value greater than zero.");
            return;
        }

        const questionData = {
            type: "identification",
            title: questionTitle,
            correct_answer: answer,
            pts: parseInt(pts), // Ensure pts is a number
        };

        if (editingQuestion !== null) {
            questionData.id = editingQuestion.id; // Pass the ID for editing
        }

        onSave(questionData); // Pass data to the parent component

        // Clear form fields after saving
        setQuestionTitle("");
        setAnswer("");
        setPts(1);

        // Close the modal
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
                    <Form.Label>Question</Form.Label>
                    <Form.Control
                        type="text"
                        value={questionTitle}
                        onChange={(e) => setQuestionTitle(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="answer">
                    <Form.Label>Answer</Form.Label>
                    <Form.Control
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="pts">
                    <Form.Label>Pts</Form.Label>
                    <Form.Control
                        type="number"
                        value={pts}
                        onChange={(e) => setPts(e.target.value)}
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
