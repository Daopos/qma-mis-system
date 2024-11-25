import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClientStudent from "../axoisclient/axios-client-student";
import studenttestCSS from "./StudentTest.module.css";
import { useQuery } from "react-query";
import Spinner from "react-bootstrap/Spinner";

export default function StudentTest() {
    const { subjectId } = useParams();

    const {
        data: tests = [],
        isLoading,
        error,
    } = useQuery(
        ["TestStudent", subjectId],
        async () => {
            const { data } = await axiosClientStudent.get(
                `/test/subject/${subjectId}`
            );
            return data;
        },
        {
            // Refetch when subjectId changes
            enabled: !!subjectId, // Ensure query runs only if subjectId is valid
        }
    );

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

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        ); // You can replace this with a spinner or loading component
    }

    if (error) {
        return <div>Error fetching payment history: {error.message}</div>;
    }

    if (!tests.length) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    width: "300px",
                    margin: "auto",
                    height: "200px",
                    backgroundColor: "#f9f9f9",
                    color: "#555",
                    textAlign: "center",
                    padding: "20px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    marginTop: "30px",
                }}
            >
                <h5 style={{ marginBottom: "10px" }}>No Assessments yet</h5>
                <p style={{ fontSize: "14px", color: "#888" }}>
                    Please check back later for available assessment.
                </p>
            </div>
        );
    }
    return (
        <>
            <div className="p-4">
                <div className="d-flex flex-column align-items-center gap-3">
                    {tests.map((test, index) => (
                        <div
                            key={index}
                            className={studenttestCSS.cardContainer}
                        >
                            {test.submitted ? (
                                <>
                                    <h5>{test.title}</h5>
                                    <p className="pb-2">{test.description}</p>
                                    <p>Score: {test.score}</p>
                                    <small>
                                        Posted on{" "}
                                        {formatDateTime(test.created_at)}
                                    </small>
                                </>
                            ) : (
                                <>
                                    {test.status === "closed" ? (
                                        <div>
                                            <h5>{test.title}</h5>
                                            <p className="pb-2">
                                                {test.description}
                                            </p>
                                            <h6>{test.status}</h6>
                                            <h6>
                                                Due Date:{" "}
                                                {formatDateTime(test.deadline)}
                                            </h6>
                                            <small>
                                                Posted on{" "}
                                                {formatDateTime(
                                                    test.created_at
                                                )}
                                            </small>
                                        </div>
                                    ) : (
                                        <Link
                                            className={
                                                studenttestCSS.linkContainer
                                            }
                                            to={`/student/subject/test/${test.id}`}
                                        >
                                            <h5 className="mb-2">
                                                {test.title}
                                            </h5>
                                            <span className="pb-2">
                                                {test.description}
                                            </span>
                                            <h6
                                                className={`mt-2 ${
                                                    test.status === "open"
                                                        ? studenttestCSS.open
                                                        : studenttestCSS.close
                                                }`}
                                            >
                                                Status: {test.status}
                                            </h6>
                                            <h6 className="mt-2">
                                                Due Date:{" "}
                                                {formatDateTime(test.deadline)}
                                            </h6>
                                            <small>
                                                Posted on{" "}
                                                {formatDateTime(
                                                    test.created_at
                                                )}
                                            </small>
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
