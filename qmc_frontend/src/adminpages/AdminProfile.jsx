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
    const { user, token } = useStateContext();
    const [toastId, setToastId] = useState(null);
    const [show, setShow] = useState(false);

    const newEmailRef = useRef();
    const newUsernameRef = useRef();
    const currentPasswordRef = useRef();
    const newPasswordRef = useRef();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onSubmit = () => {
        const payload = {
            new_username: newUsernameRef.current.value,
            email: newEmailRef.current.value,
            current_password: currentPasswordRef.current.value,
            new_password: newPasswordRef.current.value,
        };

        axiosClientAdmin
            .put(`/admins/${user.id}`, payload)
            .then(() => {
                handleClose();
            })
            .catch((err) => {
                const response = err.response;

                if (response && response.status === 422) {
                    const dataError = response.data.errors;
                    console.log(dataError);
                    if (!toast.isActive(toastId)) {
                        const id = toast.error(
                            "Email Address, New Username, Current Password, and New Password need to be filled out."
                        );
                        setToastId(id);
                    }
                } else {
                    console.log(response.data);
                    if (!toast.isActive(toastId)) {
                        const id = toast.error(response.data.error.toString());
                        setToastId(id);
                    }
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
                        <input type="text" disabled value={"*****"} />
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
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>New Email address*</Form.Label>
                            <Form.Control
                                ref={newEmailRef}
                                type="email"
                                placeholder="name@example.com"
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>New Username*</Form.Label>
                            <Form.Control
                                ref={newUsernameRef}
                                type="text"
                                placeholder="Ex. Abc"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>Current Password*</Form.Label>
                            <Form.Control
                                ref={currentPasswordRef}
                                type="password"
                                placeholder="Ex. password"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>New Password*</Form.Label>
                            <Form.Control
                                ref={newPasswordRef}
                                type="password"
                                placeholder="Ex. ABC"
                                autoFocus
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
            <ToastContainer limit={1} />
        </>
    );
}
