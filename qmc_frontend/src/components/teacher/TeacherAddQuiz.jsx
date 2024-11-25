import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import ButtonB from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function TeacherAddQuiz({ show, onHide }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [questionType, setQuestionType] = useState(null); // State to track the selected question type
    const [questions, setQuestions] = useState([]); // State to store all added questions
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        console.log(questions);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Handle adding a question type
    const handleAddQuestionType = (type) => {
        setQuestionType(type);
        handleClose();
    };

    // Function to render the appropriate question form
    const renderQuestionForm = () => {
        if (!questionType) return null; // No question type selected

        switch (questionType) {
            case "Multiple Choice":
                return <MultipleChoiceForm onAddQuestion={handleAddQuestion} />;
            case "Essay":
                return <EssayForm onAddQuestion={handleAddQuestion} />;
            case "Identification":
                return <IdentificationForm onAddQuestion={handleAddQuestion} />;
            case "Check boxes":
                return <CheckboxesForm onAddQuestion={handleAddQuestion} />;
            default:
                return null;
        }
    };

    // Handle adding a question to the list
    const handleAddQuestion = (question) => {
        setQuestions([...questions, question]); // Append the new question to the existing array
        setQuestionType(null); // Reset the question type after adding
    };

    return (
        <>
            <Modal show={show} onHide={onHide} fullscreen={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-center">
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            id="basic-button"
                            aria-controls={open ? "basic-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={handleClick}
                        >
                            Add Question
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                "aria-labelledby": "basic-button",
                            }}
                        >
                            <MenuItem
                                onClick={() =>
                                    handleAddQuestionType("Multiple Choice")
                                }
                            >
                                Multiple Choice
                            </MenuItem>
                            <MenuItem
                                onClick={() => handleAddQuestionType("Essay")}
                            >
                                Essay
                            </MenuItem>
                            <MenuItem
                                onClick={() =>
                                    handleAddQuestionType("Identification")
                                }
                            >
                                Identification
                            </MenuItem>
                            <MenuItem
                                onClick={() =>
                                    handleAddQuestionType("Check boxes")
                                }
                            >
                                Check boxes
                            </MenuItem>
                        </Menu>
                    </div>

                    <div>{renderQuestionForm()}</div>

                    {/* Display the list of added questions */}
                    <div>
                        <h5>Added Questions</h5>
                        <ul>
                            {questions.map((q, index) => (
                                <li key={index}>
                                    <strong>{q.type}:</strong> {q.question}
                                </li>
                            ))}
                        </ul>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

// Multiple Choice Form Component
const MultipleChoiceForm = ({ onAddQuestion }) => {
    const [question, setQuestion] = useState("");
    const [choices, setChoices] = useState(["", "", "", ""]);
    const [correctAnswer, setCorrectAnswer] = useState("");

    const handleSubmit = () => {
        onAddQuestion({
            type: "Multiple Choice",
            question,
            choices,
            correctAnswer,
        });
    };

    return (
        <div>
            <h5>Multiple Choice Question</h5>
            <input
                type="text"
                placeholder="Enter your question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />
            {choices.map((choice, index) => (
                <input
                    key={index}
                    type="text"
                    placeholder={`Choice ${index + 1}`}
                    value={choice}
                    onChange={(e) =>
                        setChoices([
                            ...choices.slice(0, index),
                            e.target.value,
                            ...choices.slice(index + 1),
                        ])
                    }
                />
            ))}
            <ButtonB onClick={handleSubmit}>Add Question</ButtonB>
        </div>
    );
};

// Essay Form Component
const EssayForm = ({ onAddQuestion }) => {
    const [question, setQuestion] = useState("");

    const handleSubmit = () => {
        onAddQuestion({
            type: "Essay",
            question,
        });
    };

    return (
        <div>
            <h5>Essay Question</h5>
            <input
                type="text"
                placeholder="Enter your question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />
            <ButtonB onClick={handleSubmit}>Add Question</ButtonB>
        </div>
    );
};

// Identification Form Component
const IdentificationForm = ({ onAddQuestion }) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const handleSubmit = () => {
        onAddQuestion({
            type: "Identification",
            question,
            answer,
        });
    };

    return (
        <div>
            <h5>Identification Question</h5>
            <input
                type="text"
                placeholder="Enter your question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />
            <input
                type="text"
                placeholder="Enter the correct answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
            />
            <ButtonB onClick={handleSubmit}>Add Question</ButtonB>
        </div>
    );
};

// Checkboxes Form Component
const CheckboxesForm = ({ onAddQuestion }) => {
    const [question, setQuestion] = useState("");
    const [choices, setChoices] = useState(["", "", "", ""]);
    const [correctAnswers, setCorrectAnswers] = useState([]);

    const handleCheckboxChange = (choice) => {
        if (correctAnswers.includes(choice)) {
            setCorrectAnswers(correctAnswers.filter((c) => c !== choice));
        } else {
            setCorrectAnswers([...correctAnswers, choice]);
        }
    };

    const handleSubmit = () => {
        onAddQuestion({
            type: "Check boxes",
            question,
            choices,
            correctAnswers,
        });
    };

    return (
        <div>
            <h5>Checkboxes Question</h5>
            <input
                type="text"
                placeholder="Enter your question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />
            {choices.map((choice, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder={`Choice ${index + 1}`}
                        value={choice}
                        onChange={(e) =>
                            setChoices([
                                ...choices.slice(0, index),
                                e.target.value,
                                ...choices.slice(index + 1),
                            ])
                        }
                    />
                    <input
                        type="checkbox"
                        checked={correctAnswers.includes(choice)}
                        onChange={() => handleCheckboxChange(choice)}
                    />
                </div>
            ))}
            <ButtonB onClick={handleSubmit}>Add Question</ButtonB>
        </div>
    );
};
