import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axiosClientAdmin from "../../axoisclient/axios-client-admin";
import { ToastContainer, toast } from "react-toastify";

export default function AdminEmployeeEdit({
    show,
    onHide,
    email: initialEmail,
    fname: initialFname,
    mname: initialMname,
    lname: initialLname,
    extension_name: initialEname,
    address: initialAddress,
    type: initialType,
    id,
    getEmployees,
}) {
    const [email, setEmail] = useState(initialEmail);
    const [fname, setFname] = useState(initialFname);
    const [mname, setMname] = useState(initialMname || "");
    const [lname, setLname] = useState(initialLname || "");
    const [extension_name, setExtensionName] = useState(initialEname || ""); // Added
    const [address, setAddress] = useState(initialAddress || "");
    const [type, setType] = useState(initialType);
    const [toastId, setToastId] = useState(null);
    const [confirmModal, setConfirmModal] = useState(false);
    const [file, setFile] = useState(null);

    useEffect(() => {
        setEmail(initialEmail);
        setFname(initialFname);
        setMname(initialMname || "");
        setLname(initialLname || "");
        setExtensionName(initialEname || ""); // Added
        setAddress(initialAddress || "");
        setType(initialType);
    }, [
        initialEmail,
        initialFname,
        initialMname,
        initialLname,
        initialEname, // Added
        initialAddress,
        initialType,
    ]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
        }
    };

    const handleShowConfirm = () => {
        if (email && fname && lname && address && type) {
            setConfirmModal(true);
        } else {
            const id = toast.error("Please fill in all required fields.");
            setToastId(id);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("email", email);
        formData.append("fname", fname);
        formData.append("mname", mname);
        formData.append("lname", lname);
        formData.append("extension_name", extension_name); // Added
        formData.append("address", address);
        formData.append("type", type);

        if (file) {
            formData.append("image", file);
        }

        axiosClientAdmin
            .post(`/employees/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(() => {
                onHide();
                getEmployees();
                setConfirmModal(false);
                const id = toast.success("Employee edited successfully");
                setToastId(id);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    const errors = Object.values(response.data.errors)
                        .flatMap((errors) => errors)
                        .join("\n");
                    toast.error(errors);
                } else {
                    console.error("Unexpected error:", err);
                }
            });
    };

    return (
        <>
            <Modal show={show && !confirmModal} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="alert alert-warning" role="alert">
                        <small>
                            Fields marked with an asterisk (*) are required.
                        </small>
                    </div>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                autoFocus
                                onChange={handleImageChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email address*</Form.Label>
                            <Form.Control
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="name@example.com"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name*</Form.Label>
                            <Form.Control
                                value={fname}
                                onChange={(e) => setFname(e.target.value)}
                                type="text"
                                placeholder="First Name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Middle Name</Form.Label>
                            <Form.Control
                                value={mname}
                                onChange={(e) => setMname(e.target.value)}
                                type="text"
                                placeholder="Middle Name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name*</Form.Label>
                            <Form.Control
                                value={lname}
                                onChange={(e) => setLname(e.target.value)}
                                type="text"
                                placeholder="Last Name"
                            />
                        </Form.Group>
                        {/* Added Extension Name */}
                        <Form.Group className="mb-3">
                            <Form.Label>Extension Name</Form.Label>
                            <Form.Control
                                value={extension_name}
                                onChange={(e) =>
                                    setExtensionName(e.target.value)
                                }
                                type="text"
                                placeholder="e.g., Jr., Sr., III"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Address*</Form.Label>
                            <Form.Control
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                type="text"
                                placeholder="Address"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Employee Type*</Form.Label>
                            <Form.Select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                {/* Options */}
                                <option value="Principal">Principal</option>
                                <option value="Finance">Finance</option>
                                <option value="Registrar">Registrar</option>
                                <option value="Teacher">Teacher</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleShowConfirm}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Confirmation Modal */}
            <Modal
                show={confirmModal}
                onHide={() => setConfirmModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Changes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Are you sure you want to update this employee's details?
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setConfirmModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={onSubmit}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
