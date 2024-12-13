import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

export default function ConfirmationArchived({
    show,
    onHide,
    confirm,
    title,
    loading,
}) {
    const [remarkType, setRemarkType] = useState("resigned"); // Default action
    const [remarkDate, setRemarkDate] = useState(""); // Store the date

    const handleRemarkTypeChange = (e) => {
        setRemarkType(e.target.value);
    };

    const handleRemarkDateChange = (e) => {
        setRemarkDate(e.target.value);
    };

    return (
        <Modal
            show={show}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={onHide}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Confirmation
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Danger Alert */}
                <div className="alert alert-danger" role="alert">
                    <h6>Note!</h6>
                    <small>{title}</small>
                </div>

                {/* Form to choose remark type and date */}
                <Form>
                    <Form.Group className="mb-3" controlId="remarkType">
                        <Form.Label>Remark Type</Form.Label>
                        <Form.Control
                            as="select"
                            value={remarkType}
                            onChange={handleRemarkTypeChange}
                        >
                            <option value="resigned">Resigned</option>
                            <option value="retired">Retired</option>
                            <option value="fired">Fired</option>
                            <option value="other">Other</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="remarkDate">
                        <Form.Label>Remark Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={remarkDate}
                            onChange={handleRemarkDateChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={() => confirm(remarkType, remarkDate)} // Pass values to the confirm function
                    disabled={loading} // Disable the button during loading
                >
                    {loading ? "Loading..." : "Save Changes"}{" "}
                    {/* Show loading text */}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
