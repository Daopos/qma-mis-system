import React, { useEffect, useState } from "react";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import DescriptionIcon from "@mui/icons-material/Description"; // For documents (e.g., DOC, DOCX)
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"; // For PDF files
import SlideshowIcon from "@mui/icons-material/Slideshow"; // For PPT, PPTX files
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import axiosClientTeacher from "../axoisclient/axois-client-teacher";
import { useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

import ZoomInIcon from "@mui/icons-material/ZoomIn";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { ToastContainer, toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import { useQuery } from "react-query";

export default function TeacherStreamArchived() {
    const [Stoggle, setStoggle] = useState(false);
    const [file, setFile] = useState(null);
    const [fileInfo, setFileInfo] = useState({ name: "", type: "" });
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const { subjectId } = useParams();

    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editFile, setEditFile] = useState(null);
    const [editFileInfo, setEditFileInfo] = useState({ name: "", type: "" });
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const [toastId, setToastId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [subject, setSubject] = useState({});

    // Fetch tasks using React Query
    const {
        data: tasks = [],
        isLoading: isTasksLoading,
        refetch,
    } = useQuery(["tasks", subjectId], async () => {
        const { data } = await axiosClientTeacher.get(
            `/task/subject/${subjectId}`
        );
        return data;
    });

    // Fetch subject using React Query
    const { data: subjectData, isLoading: isSubjectLoading } = useQuery(
        ["subject", subjectId],
        async () => {
            const { data } = await axiosClientTeacher.get(
                `/subject/archive/class/${subjectId}`
            );
            console.log(data);
            return data;
        },
        {
            enabled: !!subjectId, // Only run if subjectId exists
        }
    );

    const handleEdit = (task) => {
        console.log("Task:", task); // Log the task to verify its structure

        setEditTitle(task.title);
        setEditDescription(task.description);

        if (task.file) {
            setEditFile(task.file);
            setEditFileInfo({
                name: task.file_name,
                type: task.file_type,
            });
        } else {
            setEditFile(null);
            setEditFileInfo({ name: "", type: "" });
        }

        setEditingTaskId(task.id);
    };

    const handleCancelEdit = () => {
        setEditingTaskId(null);
        setEditFile(null);
        setEditFileInfo({ name: "", type: "" });
    };

    const handleEditFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setEditFile(selectedFile);
            setEditFileInfo({
                name: selectedFile.name,
                type: selectedFile.type,
            });
        }
    };

    const handleEditRemoveFile = () => {
        setEditFile(null);
        setEditFileInfo({ name: "", type: "" });
    };

    const getEditFileIcon = (fileName) => {
        if (!fileName) {
            // Default icon if fileName is not provided
            return <DriveFolderUploadIcon fontSize="large" />;
        }

        // Check for image file extensions
        const extension = fileName.split(".").pop().toLowerCase();
        if (["png", "jpg", "jpeg"].includes(extension)) {
            return null; // Return null so the image can be handled separately
        } else if (extension === "pdf") {
            return <PictureAsPdfIcon fontSize="large" />;
        } else if (["ppt", "pptx"].includes(extension)) {
            return <SlideshowIcon fontSize="large" />;
        } else if (["doc", "docx"].includes(extension)) {
            return <DescriptionIcon fontSize="large" />;
        } else {
            return <DriveFolderUploadIcon fontSize="large" />; // Default icon for unsupported types
        }
    };

    const getTasks = async () => {
        try {
            const { data } = await axiosClientTeacher.get(
                `/task/subject/${subjectId}`
            );
            setTasks(data);
        } catch (err) {
            console.log(err);
        }
    };

    const getSubject = async () => {
        try {
            const { data } = await axiosClientTeacher.get(
                `/subjects/${subjectId}`
            );
            console.log(data);
            setSubject(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (subjectData) {
            setSubject(subjectData);
        }
    }, [subjectData]);

    // Check if loading before rendering the rest of the component

    // Handle file upload
    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            setFileInfo({
                name: uploadedFile.name,
                type: uploadedFile.type,
            });
        }
    };

    // Determine the icon based on file type
    const getFileIcon = (fileType) => {
        if (fileType.includes("image")) {
            // Check if it's an image file type
            return (
                <img
                    src={URL.createObjectURL(file)}
                    alt="Uploaded Image"
                    style={{ height: "100%", width: "auto" }}
                />
            );
        } else if (fileType.includes("pdf")) {
            return <PictureAsPdfIcon fontSize="large" />;
        } else if (
            fileType.includes("presentation") ||
            fileType.includes("ppt")
        ) {
            return <SlideshowIcon fontSize="large" />;
        } else if (fileType.includes("word") || fileType.includes("document")) {
            return <DescriptionIcon fontSize="large" />;
        } else {
            return <DriveFolderUploadIcon fontSize="large" />; // Default icon for unsupported types
        }
    };

    const handleStoggle = () => {
        setStoggle(!Stoggle);
    };

    // Function to remove the attached file
    const handleRemoveFile = () => {
        setFile(null);
        setFileInfo({ name: "", type: "" });
    };

    // Function to submit data using axios
    const handleSubmit = async () => {
        if (!title || !description) {
            alert("Please fill all fields and upload a file.");
            return;
        }

        // Create FormData object
        const formData = new FormData();

        if (file) {
            formData.append("file", file);
        }
        formData.append("title", title);
        formData.append("description", description);
        formData.append("subject_id", subjectId);

        try {
            // Send POST request using axios
            const response = await axiosClientTeacher
                .post("/tasks", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(() => {
                    console.log("success");
                    handleStoggle();
                    refetch();
                    getTasks();
                    setFile(null);
                    setFileInfo({ name: "", type: "" });
                    setTitle("");
                    setDescription("");
                    setEditingTaskId(null);
                    toast.success("Created successfully");
                })
                .catch((err) => {
                    const response = err.response;

                    if (response && response.status === 422) {
                        const dataErrors = response.data.errors;
                        console.log(dataErrors);

                        let errorMessage = "";
                        // Loop through each field's errors and concatenate them into a single message
                        Object.keys(dataErrors).forEach((field) => {
                            dataErrors[field].forEach((message) => {
                                errorMessage += `${message}\n`;
                            });
                        });

                        if (!toast.isActive(toastId)) {
                            const id = toast.error(errorMessage.trim());
                            setToastId(id);
                        }
                    } else {
                        console.log(response);
                    }
                });

            // Handle successful response
            console.log("File uploaded successfully:", response.data);

            // Reset form fields
        } catch (error) {
            // Handle error response
            console.error("Error uploading file:", error);
        }
    };

    const formatDateTime = (datetime) => {
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

    const [anchorEl, setAnchorEl] = useState({});

    const handleClick = (event, id) => {
        setAnchorEl((prevState) => ({
            ...prevState,
            [id]: event.currentTarget,
        }));
    };

    const handleClose = (id) => {
        setAnchorEl((prevState) => ({
            ...prevState,
            [id]: null,
        }));
    };

    const editTask = () => {
        // Create FormData object
        const formData = new FormData();

        formData.append("_method", "PUT");

        if (editFile) {
            formData.append("file", editFile);
        }
        formData.append("title", editTitle);
        formData.append("description", editDescription);

        console.log(editFile);
        console.log(editTitle);
        console.log(editDescription);

        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        axiosClientTeacher
            .post(`/task/edit/${editingTaskId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(() => {
                console.log("success");
                getTasks();
                refetch();

                setEditDescription(null);
                setEditTitle(null);
                setEditingTaskId(null);
                setEditFile(null);

                toast.success("Edited successfully");
            })
            .catch((err) => {
                console.log("failt");
                console.error(err.response.data); // Log detailed server-side error

                const response = err.response;

                if (response && response.status === 422) {
                    const dataErrors = response.data.errors;
                    console.log(dataErrors);

                    let errorMessage = "";
                    // Loop through each field's errors and concatenate them into a single message
                    Object.keys(dataErrors).forEach((field) => {
                        dataErrors[field].forEach((message) => {
                            errorMessage += `${message}\n`;
                        });
                    });

                    if (!toast.isActive(toastId)) {
                        const id = toast.error(errorMessage.trim());
                        setToastId(id);
                    }
                } else {
                    console.log(response);
                }
            });

        // Handle successful response

        // Reset form fields
    };

    const deleteTask = (id) => {
        axiosClientTeacher
            .delete(`/tasks/${id}`)
            .then(() => {
                console.log("success");
                refetch();

                toast.success("Deleted successfully");

                getTasks();
            })
            .catch((err) => {
                console.log(err.response.data);

                const response = err.response;

                if (response && response.status === 422) {
                    const dataErrors = response.data.errors;
                    console.log(dataErrors);

                    let errorMessage = "";
                    // Loop through each field's errors and concatenate them into a single message
                    Object.keys(dataErrors).forEach((field) => {
                        dataErrors[field].forEach((message) => {
                            errorMessage += `${message}\n`;
                        });
                    });

                    if (!toast.isActive(toastId)) {
                        const id = toast.error(errorMessage.trim());
                        setToastId(id);
                    }
                } else {
                    console.log(response);
                }
            });
    };

    if (isTasksLoading || isSubjectLoading) {
        return (
            <div className="d-flex justify-content-center pt-4">
                <Spinner animation="border" variant="primary" />
            </div>
        ); // Using Placeholder for loading UI
    }
    return (
        <>
            <div className="d-flex justify-content-center p-3">
                <div className="d-flex flex-column gap-3">
                    <div
                        className="p-4 d-flex flex-column gap-2 rounded"
                        style={{
                            backgroundColor: "#124076",
                            color: "White",
                            width: "700px",
                        }}
                    >
                        <h1>{subject.title}</h1>
                        <h4>
                            {`Grade ${subject.classroom?.grade_level || ""} - ${
                                subject.classroom?.title || ""
                            }`}
                        </h4>
                        <h4>{subject.formatted_time}</h4>
                    </div>

                    {/* <div
                        className="border border-dark p-2 rounded d-flex gap-2"
                        style={{
                            width: "700px",
                        }}
                    >
                        <img src="/img/profile.png" alt="" width={50} />
                        <div>
                            <p>
                                Jobele Dollente posted new module: Science
                                module 1
                            </p>
                            <p>January 10, 2420</p>
                        </div>
                    </div> */}

                    {tasks.map((data) => (
                        <div
                            className="border border-dark p-2 rounded d-flex gap-2"
                            style={{ width: "700px" }}
                            key={data.id}
                        >
                            {editingTaskId === data.id ? (
                                <div className="form-outline mt-3 flex-grow-1">
                                    <Button
                                        onClick={handleCancelEdit}
                                        variant="danger"
                                    >
                                        Cancel
                                    </Button>
                                    <Form.Group
                                        className="mb-3 mt-3"
                                        controlId="formTitle"
                                    >
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) =>
                                                setEditTitle(e.target.value)
                                            }
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="formDescription"
                                    >
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={editDescription}
                                            onChange={(e) =>
                                                setEditDescription(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Group>
                                    <div>
                                        <div className="d-flex justify-content-between mt-3 px-4">
                                            <label
                                                htmlFor="file-upload"
                                                style={{ cursor: "pointer" }}
                                            >
                                                <DriveFolderUploadIcon fontSize="large" />
                                            </label>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                style={{ display: "none" }}
                                                onChange={handleEditFileChange}
                                            />
                                            <Button onClick={() => editTask()}>
                                                Submit
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <img
                                            src="/img/profile.png"
                                            alt="Profile"
                                            className="img-fluid"
                                            style={{ maxWidth: "50px" }}
                                        />
                                    </div>
                                    <div
                                        style={{ flexGrow: 1 }}
                                        className="d-flex flex-column gap-2"
                                    >
                                        <div className="d-flex justify-content-between">
                                            <h5>{data.title}</h5>
                                        </div>
                                        <p
                                            style={{
                                                wordBreak: "break-all",
                                                whiteSpace: "normal",
                                                fontSize: "0.90em",
                                            }}
                                        >
                                            {data.description}
                                        </p>
                                        <h6>
                                            {formatDateTime(data.created_at)}
                                        </h6>
                                        {data.file && (
                                            <div>
                                                <div
                                                    className="d-flex gap-4"
                                                    style={{
                                                        border: "1px solid black",
                                                        height: 80,
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            height: "100%",
                                                            width: "100px",
                                                            display: "flex",
                                                            justifyContent:
                                                                "center",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        {[
                                                            "png",
                                                            "jpg",
                                                            "jpeg",
                                                        ].includes(
                                                            data.file_name
                                                                .split(".")
                                                                .pop()
                                                                .toLowerCase()
                                                        ) ? (
                                                            // Display image if the file is an image
                                                            <img
                                                                src={
                                                                    data.file_url
                                                                }
                                                                alt={
                                                                    data.file_name
                                                                }
                                                                style={{
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    objectFit:
                                                                        "cover",
                                                                }}
                                                            />
                                                        ) : (
                                                            // Display icon for non-image files
                                                            getEditFileIcon(
                                                                data.file_name
                                                            )
                                                        )}
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <a href={data.file_url}>
                                                            {data.file_name}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <ToastContainer limit={1} />
        </>
    );
}
