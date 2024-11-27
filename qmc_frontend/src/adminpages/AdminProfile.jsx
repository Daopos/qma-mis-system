import React, { useRef, useState } from "react";
import "../assets/css/profile.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axiosClientAdmin from "../axoisclient/axios-client-admin";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useStateContext } from "../context/ContextProvider";

export default function AdminProfile() {
    const { user } = useStateContext();
    const [show, setShow] = useState(false);

    const newEmailRef = useRef();
    const newUsernameRef = useRef();
    const currentPasswordRef = useRef();
    const newPasswordRef = useRef();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onSubmit = () => {
        const payload = {
            new_username: newUsernameRef.current.value || null,
            email: newEmailRef.current.value || null,
            current_password: currentPasswordRef.current.value,
            new_password: newPasswordRef.current.value || null,
        };

        axiosClientAdmin
            .put(`/admin/reset`, payload)
            .then(() => {
                toast.success("Your profile has been updated successfully!", {
                    autoClose: 3000,
                });
                handleClose();
            })
            .catch((err) => {
                const response = err.response;

                if (response && response.status === 422) {
                    // Display validation errors
                    const errors = response.data.errors;
                    Object.entries(errors).forEach(([field, messages]) => {
                        toast.error(
                            `${field.replace("_", " ")}: ${messages[0]}`,
                            { autoClose: 3000 }
                        );
                    });
                } else if (response && response.status === 403) {
                    toast.error("Current password is incorrect.", {
                        autoClose: 3000,
                    });
                } else {
                    toast.error(
                        "An unexpected error occurred. Please try again.",
                        {
                            autoClose: 3000,
                        }
                    );
                }
            });
    };

    return (
        <>
            <div style={{ padding: "50px 50px" }}>
                <div className="profile-container">
                    <img src="/img/profile.png" alt="" width={100} />

                    <div className="input-container">
                        <label htmlFor="">Username</label>
                        <input
                            type="text"
                            disabled
                            value={user?.username || "*****"}
                        />
                    </div>

                    <div className="input-container">
                        <label htmlFor="">Password</label>
                        <input type="text" disabled value={"*****"} />
                    </div>

                    <button onClick={handleShow}>Edit Profile</button>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="newEmail">
                            <Form.Label>New Email Address</Form.Label>
                            <Form.Control
                                ref={newEmailRef}
                                type="email"
                                placeholder="name@example.com"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="newUsername">
                            <Form.Label>New Username</Form.Label>
                            <Form.Control
                                ref={newUsernameRef}
                                type="text"
                                placeholder="Ex. Abc"
                            />
                        </Form.Group>

                        <Form.Group
                            className="mb-3"
                            controlId="currentPassword"
                        >
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control
                                ref={currentPasswordRef}
                                type="password"
                                placeholder="Enter your current password"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="newPassword">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                ref={newPasswordRef}
                                type="password"
                                placeholder="Enter a new password"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={onSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer limit={3} />
        </>
    );
}
