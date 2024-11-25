import React, { useEffect, useState } from "react";
import StudentDoCSS from "../assets/css/studentdo.module.css";
import Form from "react-bootstrap/Form";
import axiosClientStudent from "../axoisclient/axios-client-student";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Confirmation from "../components/Confirmation";
import { toast, ToastContainer } from "react-toastify";
import ConfirmationLoad from "../components/ConfirmationLoad";
export default function StudentDoTest() {
    const { testId } = useParams(); // Get the testId from the URL

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});

    const [confirm, setConfirm] = useState(false);

    const [confirmLoading, setConfirmLoading] = useState(false);

    const navigate = useNavigate();

    const getQuestion = () => {
        axiosClientStudent
            .get(`/students/questions/${testId}`)
            .then(({ data }) => {
                setQuestions(data);
            })
            .catch((err) => console.log(err.response.data));
    };

    useEffect(() => {
        getQuestion();
    }, []);

    const handleAnswerChange = (
        questionId,
        studentAnswer,
        correctAnswer = null
    ) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: {
                studentAnswer,
                correctAnswer,
                testId,
            },
        }));
    };

    const onSubmit = () => {
        setConfirmLoading(true);

        const submissionData = {
            test_id: testId,
            answers: Object.entries(answers).map(
                ([questionId, answerData]) => ({
                    question_id: questionId,
                    answer: answerData.studentAnswer,
                    correct_answer: answerData.correctAnswer,
                })
            ),
        };

        axiosClientStudent
            .post(`/student/submit/test`, submissionData)
            .then(() => {
                console.log("Submission successful");
                navigate(-1);
            })
            .catch((err) => {
                const errorMsg =
                    err.response?.data?.message || "Submission failed!";
                toast.error(errorMsg);
            })
            .finally(() => setConfirmLoading(false));
    };

    const handleCloseConfirm = () => {
        setConfirm(false);
    };

    return (
        <>
            <div className={StudentDoCSS.doContainer}>
                <div className="container p-4">
                    <h1 className="text-center mb-3">Assessment Submission</h1>
                    <div className="row justify-content-center">
                        {questions.map((data, index) => (
                            <div className="col-12 mb-4" key={index}>
                                <div className={StudentDoCSS.questionContainer}>
                                    <span
                                        className={StudentDoCSS.typeContainer}
                                    >
                                        {data.type}
                                    </span>
                                    <h5 className="mt-3">
                                        {index + 1}. {data.title}
                                    </h5>

                                    {data.type === "multiple-choice" && (
                                        <div className="d-flex flex-column gap-2 mt-3">
                                            {data.choices.map((choice, i) => (
                                                <Form.Check
                                                    inline
                                                    label={choice.choice_text}
                                                    name={`group-${index}`}
                                                    type="radio"
                                                    key={i}
                                                    id={`choice-${index}-${i}`}
                                                    onChange={() =>
                                                        handleAnswerChange(
                                                            data.id,
                                                            choice.choice_text,
                                                            data.correct_answer
                                                        )
                                                    }
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {data.type === "essay" && (
                                        <Form.Group className="mb-3 mt-4">
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                placeholder="Write your essay here..."
                                                onChange={(e) =>
                                                    handleAnswerChange(
                                                        data.id,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </Form.Group>
                                    )}

                                    {data.type === "identification" && (
                                        <Form.Group className="mb-3 mt-4">
                                            <Form.Control
                                                type="text"
                                                placeholder="Answer:"
                                                onChange={(e) =>
                                                    handleAnswerChange(
                                                        data.id,
                                                        e.target.value,
                                                        data.correct_answer
                                                    )
                                                }
                                            />
                                        </Form.Group>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center pt-4 pb-4">
                        <Button
                            disabled={confirmLoading}
                            onClick={() => setConfirm(true)}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
                <ToastContainer />
                <ConfirmationLoad
                    show={confirm}
                    onHide={handleCloseConfirm}
                    confirm={onSubmit}
                    loading={confirmLoading}
                    title={
                        "Are you sure you want to submit the test? It cannot be undone."
                    }
                />
            </div>
        </>
    );
}
