import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";

import ButtonB from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TeacherAddQuiz from "../components/teacher/TeacherAddQuiz";
import { Link, useNavigate, useParams } from "react-router-dom";

import axiosClientTeacher from "../axoisclient/axois-client-teacher";

import teacherquizCSS from "./TeacherQuiz.module.css";

import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import Confirmation from "../components/Confirmation";
import { useQuery } from "react-query";
export default function TeacherQuizArchive() {
    let navigate = useNavigate();
    const { subjectId } = useParams();

    const [confirm, setConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const {
        data: tests = [],
        isloading: isTestsLoading,
        refetch,
        error,
    } = useQuery(["tests", subjectId], async () => {
        const { data } = await axiosClientTeacher.get(
            `/test/subject/${subjectId}`
        );
        console.log(data);
        return data;
    });

    const handleCloseDelete = () => {
        setDeleteId(null);
        setConfirm(false);
    };

    const handleOpenShowAdd = () => {
        navigate(`/teacher/test-creation/${subjectId}`);
    };

    const handleCloseSHowAdd = () => {
        setShowAdd(false);
    };

    const onEdit = (id) => {
        navigate(`/teacher/test-creation/edit/${id}`);
    };

    const deleteTest = async () => {
        await axiosClientTeacher
            .delete(`/test/delete/${deleteId}`)
            .then(() => {
                refetch();
                handleCloseDelete();
                console.log("success");
            })
            .catch((err) => {
                console.log(err);
                console.log("fail");
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

    return (
        <>
            <div className="d-flex flex-column justify-content-center p-3 align-items-center">
                {tests.map((data, index) => {
                    // Parse the created_at date
                    const createdAt = new Date(data.created_at);

                    // Format the date to "Month Day, Year at Hour:Minutes AM/PM"
                    const formattedDate = createdAt.toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                    });

                    return (
                        <div className="mt-4" key={index}>
                            <div className={teacherquizCSS.testCard}>
                                <div className="d-flex justify-content-end">
                                    <VisibilityIcon
                                        className={teacherquizCSS.iconContainer}
                                        onClick={() =>
                                            navigate(
                                                `/teacher/test-submissions/${data.id}`
                                            )
                                        }
                                    />
                                </div>
                                <h4>Title: {data.title}</h4>
                                <span className="pb-2">{data.description}</span>
                                <h6>total question: {data.total_questions}</h6>
                                <h6>
                                    total student submitted:{" "}
                                    {data.submission_count}
                                </h6>
                                <h6>
                                    Due date: {formatDateTime(data.deadline)}
                                </h6>
                                <h6>Status: {data.status}</h6>

                                <small>posted on {formattedDate}</small>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Confirmation
                show={confirm}
                onHide={handleCloseDelete}
                confirm={deleteTest}
            />
        </>
    );
}
