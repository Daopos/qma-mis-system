import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";

import ButtonB from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TeacherAddQuiz from "../components/teacher/TeacherAddQuiz";
import { Link, useNavigate, useParams } from "react-router-dom";

import axiosClientTeacher from "../axoisclient/axois-client-teacher";

import teacherquizCSS from "./TeacherQuiz.module.css";

import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import { useQuery } from "react-query";
import Confirmation from "../components/Confirmation";

import { format } from "date-fns";

export default function TeacherClassworkArchive() {
    const [show, setShow] = useState(false);

    const { subjectId } = useParams();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [score, setScore] = useState("");
    const [deadline, setDeadline] = useState("");
    const [status, setStatus] = useState("");

    const [editMode, setEditMode] = useState(false);

    const [classworkId, setClassWorkId] = useState(null);

    const [confirmId, setConfirmId] = useState(null);
    const [confirm, setConfirm] = useState(false);

    let navigate = useNavigate();

    const handleCloseConfirm = () => {
        setConfirm(false);
        setConfirmId(null);
    };

    const {
        data: classwork = [],
        isLoading: isClassworkLoading,
        refetch,
    } = useQuery(["classworks", subjectId], async () => {
        const { data } = await axiosClientTeacher.get(
            `/classwork/${subjectId}`
        );
        return data;
    });

    const handleClose = () => {
        setShow(false);
        setTitle("");
        setDeadline(null);
        setStatus("");
        setDescription("");
        setScore(null);
        setEditMode(false);
    };

    const handleEditClick = (data) => {
        setEditMode(true);
        setClassWorkId(data.id);
        setTitle(data.title);
        setDescription(data.description);
        setScore(data.score);
        setDeadline(
            data.deadline
                ? format(new Date(data.deadline), "yyyy-MM-dd'T'HH:mm")
                : ""
        );
        setStatus(data.status);
        setShow(true);
    };

    const createClasswork = async () => {
        const formattedDeadline = deadline
            ? format(new Date(deadline), "yyyy-MM-dd HH:mm:ss")
            : null; // Send null if no deadline is set

        const payload = {
            title: title,
            subject_id: subjectId,
            score: score,
            description: description,
            deadline: formattedDeadline,
            status: status,
        };

        console.log(payload);
        await axiosClientTeacher
            .post("/classworks", payload)
            .then(() => {
                refetch();
                resetForm();
                console.log("success");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const updateClassWork = async () => {
        const formattedDeadline = deadline
            ? format(new Date(deadline), "yyyy-MM-dd HH:mm:ss")
            : null; // Send null if no deadline is set

        const payload = {
            title: title,
            score: score,
            description: description,
            deadline: formattedDeadline, // Pass deadline as null if not set
            status: status,
        };

        console.log(payload);
        await axiosClientTeacher
            .put(`/classworks/${classworkId}`, payload)
            .then(() => {
                refetch();
                resetForm();
                console.log("success");
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const viewClasswork = () => {};

    const deleteClasswork = async () => {
        console.log("test");
        await axiosClientTeacher
            .delete(`/classworks/${confirmId}`)
            .then(() => {
                refetch();
                handleCloseConfirm();
            })
            .catch((err) => {
                console.log(err);
                console.log(fail);
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
    const resetForm = () => {
        setTitle("");
        setDeadline(null);
        setDescription("");
        setScore(null);
        setStatus("");
        setEditMode(false);
        setShow(false);
    };

    return (
        <>
            <div className="d-flex flex-column justify-content-center p-3 align-items-center">
                {classwork.map((data, index) => (
                    <div className="mt-4" key={index}>
                        <div className={teacherquizCSS.testCard}>
                            <div className="d-flex justify-content-end">
                                <VisibilityIcon
                                    className={teacherquizCSS.iconContainer}
                                    onClick={() => {
                                        navigate(
                                            `/teacher/classwork-submissions/${data.id}`
                                        );
                                    }}
                                />
                            </div>
                            <h4>Title: {data.title}</h4>
                            <small className="pb-2">
                                {data.description ? data.description : ""}
                            </small>
                            <h6>
                                total student submitted:{" "}
                                {data.submissions_count}
                            </h6>
                            <h6>Due Date: {formatDateTime(data.deadline)}</h6>
                            <h6>Status: {data.status}</h6>
                            <small className="mt-1">
                                posted on {formatDateTime(data.created_at)}
                            </small>
                        </div>
                    </div>
                ))}
            </div>

            <Confirmation
                show={confirm}
                onHide={handleCloseConfirm}
                confirm={deleteClasswork}
            />
        </>
    );
}
