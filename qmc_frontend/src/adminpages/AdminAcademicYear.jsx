import React, { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axiosClientAdmin from "../axoisclient/axios-client-admin";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminAcademicYear() {
    const [academicYear, setAcademicYear] = useState([]);
    const [confirmId, setConfirmId] = useState(null);
    const [confirmText, setConfirmText] = useState("");
    const [show, setShow] = useState(false);
    const [showAct, setShowAct] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(true);

    const handleClose = () => setShow(false);
    const handleCloseAct = () => {
        setConfirmText("");
        setShowAct(false);
    };
    const handleShow = () => setShow(true);

    const startRef = useRef();
    const endRef = useRef();

    useEffect(() => {
        getAcademicYear();
    }, []); // Added dependency array to avoid infinite loop

    useEffect(() => {
        // Enable the Add button only when both fields are filled and valid
        const startYear = parseInt(startRef.current?.value, 10);
        const endYear = parseInt(endRef.current?.value, 10);
        setIsAddDisabled(!startYear || !endYear || endYear <= startYear);
    }, [startRef.current?.value, endRef.current?.value]);

    const getAcademicYear = () => {
        axiosClientAdmin
            .get("/academic-year")
            .then(({ data }) => {
                setAcademicYear(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const addAcademicYear = () => {
        if (!startRef.current.value || !endRef.current.value) {
            toast.error("Please fill out all Start Year and End Year."); // Notify user
            return; // Exit the function early
        }
        const academicYear = `${startRef.current.value}-${endRef.current.value}`;

        const payload = {
            academic_year: academicYear,
        };

        axiosClientAdmin
            .post("/academic-year", payload)
            .then(() => {
                toast.success("Academic year added successfully!"); // Success notification
                getAcademicYear(); // Refresh the list after adding
                handleClose(); // Close modal after success
            })
            .catch((err) => {
                if (
                    err.response &&
                    err.response.data &&
                    err.response.data.message
                ) {
                    // Display the error message from the response
                    toast.error(err.response.data.message);
                } else {
                    // Display a generic error message if response data is unavailable
                    toast.error(
                        "Failed to add academic year. Please try again."
                    );
                }
            });
    };
    const activateAcademicYear = () => {
        const payload = {
            id: confirmId,
        };

        axiosClientAdmin
            .post(`/activate/academic-year`, payload)
            .then(({ data }) => {
                toast.success("Academic year activated successfully!");
                getAcademicYear(); // Refresh the list after activation
                handleCloseAct(); // Close modal after success
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteAcademicYear = (id) => {
        axiosClientAdmin
            .delete(`/academic-year/delete/${id}`)
            .then(() => {
                toast.success("Academic year delete successfully!");
                getAcademicYear(); // Refresh the list after activation
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <div className="list-body-container">
                <div>
                    {/* <input
                        className="search-input"
                        type="text"
                        placeholder="Search.."
                    />
                    <button className="search-input-btn">
                        <SearchIcon />
                    </button> */}
                </div>
                <div className="list-container">
                    <div className="d-flex justify-content-between list-title-container">
                        <h2>Academic Year List</h2>
                        <button
                            className="button-list button-blue"
                            onClick={handleShow}
                        >
                            <AddIcon sx={{ color: "#000000" }} />
                            New Academic Year
                        </button>
                    </div>
                    <div>
                        <table className="list-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Academic Year</th>
                                    <th>Status</th>
                                    <th>Option</th>
                                </tr>
                            </thead>
                            <tbody>
                                {academicYear.map((data, index) => (
                                    <tr key={index}>
                                        <td data-label="No">{index + 1}</td>
                                        <td data-label="Academic Year">
                                            {data.academic_year}
                                        </td>
                                        <td data-label="Status">
                                            {data.status}
                                        </td>
                                        <td data-label="Option">
                                            {data.status !== "Deactivated" &&
                                                data.status !== "Active" && ( // Render button only if status is not "Deactivated" or "Active"
                                                    <button
                                                        className="button-list button-green"
                                                        onClick={() => {
                                                            setConfirmId(
                                                                data.id
                                                            );
                                                            setShowAct(true);
                                                        }}
                                                    >
                                                        Activate
                                                    </button>
                                                )}
                                            {data.status === "Inactive" && (
                                                <button
                                                    className="button-list button-red"
                                                    onClick={() =>
                                                        deleteAcademicYear(
                                                            data.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Academic Year Modal */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Academic Year</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="startYear">
                        <Form.Label>Start Year</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter start year"
                            min="2000" // Example: year range
                            max="3000"
                            ref={startRef}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="endYear">
                        <Form.Label>End Year</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter end year"
                            min="1900"
                            max="2100"
                            ref={endRef}
                        />
                    </Form.Group>

                    {/* Danger Alert */}
                    <div className="alert alert-success" role="alert">
                        <h6>Note!</h6>
                        <small>
                            Creating an academic year is the first essential
                            step in setting up the school management information
                            system (MIS), as it establishes the timeline for all
                            academic activities..
                        </small>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addAcademicYear}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Activate Academic Year Modal */}
            <Modal show={showAct} onHide={handleCloseAct}>
                <Modal.Header closeButton>
                    <Modal.Title>Activate Academic Year</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="alert alert-danger" role="alert">
                        <h6>Note!</h6>
                        <small>
                            Activating a new academic year will deactivate the
                            current academic year, archive all associated data,
                            and prevent any further changes. Please ensure that
                            all necessary information is backed up before
                            proceeding.
                        </small>
                    </div>
                    <Form.Group className="mb-3">
                        <Form.Label>To Confirm, Type "Confirm"</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Confirm"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)} // Handle input change
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAct}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={activateAcademicYear}
                        disabled={confirmText !== "Confirm"} // Disable if the confirmation text is not correct
                    >
                        Activate
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </>
    );
}
