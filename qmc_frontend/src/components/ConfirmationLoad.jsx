import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function ConfirmationLoad({
    show,
    onHide,
    confirm,
    title,
    loading,
}) {
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
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={confirm}
                    disabled={loading} // Disable the button during loading
                >
                    {loading ? "Loading..." : "Save Changes"}{" "}
                    {/* Show loading text */}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
