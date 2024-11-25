import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

export default function TeacherEditMC({
    show,
    onHide,
    onSave,
    editingQuestion,
}) {
    const [questionTitle, setQuestionTitle] = useState("");
    const [choices, setChoices] = useState([]);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [pts, setPts] = useState("");

    useEffect(() => {
        if (editingQuestion) {
            setQuestionTitle(editingQuestion.title);
            setChoices(
                editingQuestion.choices.map((choice) => choice.choice_text)
            );
            setCorrectAnswer(editingQuestion.correct_answer);
            setPts(editingQuestion.pts || 1); // Set default points if not provided
        } else {
            setQuestionTitle("");
            setChoices([]);
            setCorrectAnswer("");
            setPts("");
        }
    }, [editingQuestion]);

    const handleAddChoice = () => {
        setChoices([...choices, ""]);
    };

    const handleChoiceChange = (index, event) => {
        const newChoices = [...choices];
        newChoices[index] = event.target.value;
        setChoices(newChoices);

        // Update the correct answer if it was changed
        if (correctAnswer === choices[index]) {
            setCorrectAnswer(event.target.value);
        }
    };

    const handleCorrectAnswerChange = (choice) => {
        setCorrectAnswer(choice);
    };

    const handleRemoveChoice = (index) => {
        const newChoices = choices.filter((_, i) => i !== index);
        setChoices(newChoices);

        // Update the correct answer if it was removed
        if (choices[index] === correctAnswer) {
            setCorrectAnswer("");
        }
    };

    const handleSave = () => {
        if (questionTitle.trim() === "") {
            alert("Please enter a valid question title.");
            return;
        }
        if (isNaN(pts) || pts <= 0) {
            alert("Please enter a valid point value greater than zero.");
            return;
        }
        if (
            choices.length === 0 ||
            choices.some((choice) => choice.trim() === "")
        ) {
            alert("Please provide at least one valid choice.");
            return;
        }
        if (correctAnswer === "") {
            alert("Please select the correct answer.");
            return;
        }
        const questionData = {
            title: questionTitle,
            choices: choices.map((choice) => ({
                choice_text: choice,
                correct_answer: choice === correctAnswer,
            })),
            correct_answer: correctAnswer,
            type: "multiple-choice",
            pts: parseInt(pts),
        };
        onSave(questionData); // Pass data to the parent component
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {editingQuestion
                        ? "Edit Multiple Choice Question"
                        : "Add Multiple Choice Question"}
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

                {choices.map((choice, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                        <Form.Check
                            type="radio"
                            name="correctAnswer"
                            checked={correctAnswer === choice}
                            onChange={() => handleCorrectAnswerChange(choice)}
                            className="me-2"
                        />
                        <Form.Control
                            type="text"
                            value={choice}
                            onChange={(event) =>
                                handleChoiceChange(index, event)
                            }
                            placeholder={`Choice ${index + 1}`}
                            className="me-2"
                        />
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveChoice(index)}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
                <Form.Group className="mb-3" controlId="pts">
                    <Form.Label>Pts</Form.Label>
                    <Form.Control
                        type="number"
                        value={pts}
                        onChange={(e) => setPts(e.target.value)}
                    />
                </Form.Group>
                <Button onClick={handleAddChoice} className="mt-3">
                    Add Choice
                </Button>
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
