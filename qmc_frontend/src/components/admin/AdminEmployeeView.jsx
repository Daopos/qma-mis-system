import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

export default function AdminEmployeeView({
    show,
    onHide,
    image,
    fname,
    mname,
    lname,
    extension_name,
    address,
    type,
    email,
}) {
    return (
        <Modal
            show={show}
            onHide={onHide}
            aria-labelledby="example-custom-modal-styling-title"
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    Employee
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column align-items-center">
                    {/* /img/profile.png */}
                    <img
                        src={image || "/img/profile.png"}
                        alt=""
                        width={160}
                        height={160}
                    />
                </div>
                <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type="text"
                        value={email || ""}
                        autoFocus
                        disabled
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={fname || ""}
                        autoFocus
                        disabled
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Middle Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={mname || "N/A"}
                        autoFocus
                        disabled
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={lname || "N/A"}
                        autoFocus
                        disabled
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Extension Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={extension_name || "N/A"}
                        autoFocus
                        disabled
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        value={address || ""}
                        autoFocus
                        disabled
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Employee type</Form.Label>
                    <Form.Control
                        type="text"
                        value={type || ""}
                        autoFocus
                        disabled
                    />
                </Form.Group>
            </Modal.Body>
        </Modal>
    );
}
