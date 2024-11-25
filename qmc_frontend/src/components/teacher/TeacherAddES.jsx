import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

export default function TeacherAddES({
    show,
    onHide,
    onSave,
    editingQuestion,
}) {
    const [questionTitle, setQuestionTitle] = useState("");
    const [pts, setPts] = useState(1);

    useEffect(() => {
        if (editingQuestion && editingQuestion.type === "essay") {
            // Populate the form with existing data when editing
            setQuestionTitle(editingQuestion.title);
            setPts(editingQuestion.pts || 1); // Load existing points or default to 1
        } else {
            // Reset form when not editing
            setQuestionTitle("");
            setPts(1);
        }
    }, [editingQuestion, show]);

    const handleSave = () => {
        // Validation checks
        if (questionTitle.trim() === "") {
            alert("Please enter a valid question.");
            return;
        }
        if (isNaN(pts) || pts <= 0) {
            alert("Please enter a valid point value greater than zero.");
            return;
        }

        const questionData = {
            type: "essay",
            title: questionTitle,
            pts: parseInt(pts), // Ensure pts is a number
        };

        if (editingQuestion !== null) {
            questionData.id = editingQuestion.id; // Pass the ID for editing
        }

        onSave(questionData); // Pass data to the parent component
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {editingQuestion
                        ? "Edit Essay Question"
                        : "Add Essay Question"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="questionTitle">
                    <Form.Label>Question</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        style={{ resize: "none" }}
                        value={questionTitle}
                        onChange={(e) => setQuestionTitle(e.target.value)}
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
