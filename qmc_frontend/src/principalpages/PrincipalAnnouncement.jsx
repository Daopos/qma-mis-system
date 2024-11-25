import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Announcement from "../components/Announcement";
import AddIcon from "@mui/icons-material/Add";
import axiosClientPrincipal from "../axoisclient/axios-client-principal";
import Dropdown from "react-bootstrap/Dropdown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "react-query";
import Spinner from "react-bootstrap/Spinner";
import Add from "@mui/icons-material/Add";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function PrincipalAnnouncement() {
    const [show, setShow] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
    const [selectedRecipients, setSelectedRecipients] = useState([]); // State for selected recipients
    const titleRef = useRef(null);
    const descRef = useRef(null);

    const recipientOptions = ["teacher", "student", "parent"];

    const {
        data: announcements = [],
        isLoading,
        isError,
        refetch,
    } = useQuery("principalAnnouncement", async () => {
        const { data } = await axiosClientPrincipal.get(
            "/principal/own/announcements"
        );
        return data;
    });

    const handleClose = () => {
        setShow(false);
        setIsEditMode(false);
        setCurrentAnnouncement(null);
        setSelectedRecipients([]); // Reset selected recipients
    };

    const handleShow = () => {
        setShow(true);
    };

    const addAnn = () => {
        const payload = {
            title: titleRef.current?.value || null,
            desc: descRef.current?.value || null,
            to: selectedRecipients.join("-"), // Join selected recipients with a hyphen
            owner: "principal",
        };

        if (isEditMode && currentAnnouncement) {
            axiosClientPrincipal
                .put(`/announcements/${currentAnnouncement.id}`, payload)
                .then((response) => {
                    refetch();
                    handleClose();
                    toast.success(
                        response.data.message ||
                            "Announcement saved successfully"
                    );
                })
                .catch((error) => {
                    console.error("Error updating announcement:", error);
                    toast.error(
                        error.response?.data?.message ||
                            "Failed to save announcement"
                    );
                });
        } else {
            axiosClientPrincipal
                .post("/announcements", payload)
                .then((response) => {
                    refetch();
                    handleClose();
                    toast.success(
                        response.data.message ||
                            "Announcement saved successfully"
                    );
                })
                .catch((error) => {
                    console.error("Error creating announcement:", error);
                    toast.error(
                        error.response?.data?.message ||
                            "Failed to save announcement"
                    );
                });
        }
    };

    const editAnn = (announcement) => {
        setIsEditMode(true);
        setCurrentAnnouncement(announcement);
        if (titleRef.current && descRef.current) {
            titleRef.current.value = announcement.title;
            descRef.current.value = announcement.desc;
            setSelectedRecipients(announcement.to.split("-")); // Set selected recipients for editing
        } else {
            console.error("Refs are not attached properly.");
        }
        handleShow();
    };

    const handleRecipientChange = (recipient) => {
        setSelectedRecipients((prev) =>
            prev.includes(recipient)
                ? prev.filter((item) => item !== recipient)
                : [...prev, recipient]
        );
    };

    const deleteAnn = (id) => {
        axiosClientPrincipal
            .delete(`/announcements/${id}`)
            .then((response) => {
                refetch();
                toast.success(
                    response.data.message || "Announcement deleted successfully"
                );
            })
            .catch((error) => {
                console.error("Error deleting announcement:", error);
                toast.error(
                    error.response?.data?.message ||
                        "Failed to delete announcement"
                );
            });
    };

    const handleEdit = (announcement) => {
        editAnn(announcement);
    };

    const handleDelete = (id) => {
        deleteAnn(id);
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center pt-4">
                <Spinner animation="border" variant="primary" />
            </div>
        ); // Using Placeholder for loading UI
    }

    if (isError) {
        return <div>Error fetching : {error.message}</div>;
    }
    return (
        <>
            <div className="list-body-container">
                <div className="gap-4">
                    <h2>Announcement </h2>
                    <div className="d-flex justify-content-between align-items-center flex-lg-row flex-column gap-lg-0 gap-2">
                        <OverlayTrigger
                            placement="top" // You can change placement to 'top', 'right', 'bottom', or 'left'
                            overlay={
                                <Tooltip
                                    id="tooltip-add"
                                    style={{ position: "fixed" }}
                                >
                                    Make New Announcement
                                </Tooltip> // Tooltip text
                            }
                        >
                            <button
                                className="button-list button-blue"
                                onClick={handleShow}
                            >
                                <Add sx={{ color: "white" }} />
                            </button>
                        </OverlayTrigger>
                    </div>
                </div>

                <div className="d-flex flex-column gap-4 mt-5">
                    {announcements.map((data) => (
                        <Announcement
                            key={data.id}
                            title={data.title}
                            desc={data.desc}
                            date={data.created_at}
                            owner={data.owner}
                            onEdit={() => handleEdit(data)}
                            onDelete={() => handleDelete(data.id)}
                            currentUserRole={"principal"}
                            recipient={data.to}
                        />
                    ))}
                </div>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {isEditMode
                            ? "Edit Announcement"
                            : "Create an Announcement"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                ref={titleRef}
                                type="text"
                                placeholder="Ex. Meeting"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                ref={descRef}
                                as="textarea"
                                rows={8}
                                style={{ resize: "none" }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Recipients</Form.Label>
                            <div className="d-flex flex-wrap">
                                {recipientOptions.map((recipient) => (
                                    <div key={recipient} className="me-3 mb-2">
                                        <Form.Check
                                            type="checkbox"
                                            label={
                                                recipient
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                recipient.slice(1)
                                            }
                                            checked={selectedRecipients.includes(
                                                recipient
                                            )}
                                            onChange={() =>
                                                handleRecipientChange(recipient)
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addAnn}>
                        {isEditMode ? "Save Changes" : "Create Announcement"}
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </>
    );
}
