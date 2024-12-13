import React, { useRef, useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import axiosClientAdmin from "../axoisclient/axios-client-admin";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

import AdminPrintFees from "../components/admin/AdminPrintFees";
import { useReactToPrint } from "react-to-print";
import Confirmation from "../components/Confirmation";

export default function AdminClassListFee() {
    const titleRef = useRef();
    const amountRef = useRef();
    const gradetypeRef = useRef();

    const [showConfirm, setShowConfirm] = useState(false);
    const [idConfirm, setIdConfirm] = useState(null);

    const [loading, setLoading] = useState(false);

    const handleConfirm = (id) => {
        setIdConfirm(id);
        setShowConfirm(true);
    };

    const handleCloseConfirm = () => {
        setShowConfirm(false);
        setSelectedId(null);
    };

    const [gradefees, setGradeFees] = useState([]);
    const [fees, setFees] = useState([]);
    const [show, setShow] = useState(false);
    const [showView, setShowView] = useState(false);
    const [toastId, setToastId] = useState(null);
    const [viewFees, setViewFees] = useState([]);
    const [selectedGradeType, setSelectedGradeType] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [editableFee, setEditableFee] = useState({
        title: "",
        amount: 0,
        id: null,
    });

    const printableRef = useRef();
    const [printReady, setPrintReady] = useState(false);

    const getGradeFees = () => {
        axiosClientAdmin.get("/gradefees").then(({ data }) => {
            setGradeFees(data.gradefees);
        });
    };

    const getFeesByGradeType = (type) => {
        axiosClientAdmin.get(`/gradefee/type/${type}`).then(({ data }) => {
            setViewFees(data.gradefees);
            setShowView(true);
        });
    };

    useEffect(() => {
        getGradeFees();
    }, []);

    const calculateTotalAmountByGradeType = () => {
        const totalsMap = new Map();

        gradefees.forEach((fee) => {
            const { gradetype, amount } = fee;
            if (totalsMap.has(gradetype)) {
                totalsMap.set(gradetype, totalsMap.get(gradetype) + amount);
            } else {
                totalsMap.set(gradetype, amount);
            }
        });

        const totalsArray = Array.from(
            totalsMap,
            ([gradetype, totalAmount]) => ({
                gradetype,
                totalAmount,
            })
        );

        return totalsArray;
    };

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const onSubmitFee = () => {
        const payload = {
            title: titleRef.current.value,
            amount: parseFloat(amountRef.current.value), // Parse as a float
        };
        if (isNaN(payload.amount)) {
            // Check if it's not a valid number
            if (!toast.isActive(toastId)) {
                const id = toast.error("Amount must be a valid number");
                setToastId(id);
            }
            return;
        }
        if (!payload.title || !payload.amount) {
            if (!toast.isActive(toastId)) {
                const id = toast.error("Please fill in all fields");
                setToastId(id);
            }
            return;
        }

        setFees((prevFees) => [...prevFees, payload]);
    };

    const onRemoveFee = (index) => {
        setFees((prevFees) => prevFees.filter((_, i) => i !== index));
    };

    const calculateTotalFee = () => {
        return fees.reduce((total, fee) => total + fee.amount, 0);
    };

    const onSubmit = () => {
        const gradetype = gradetypeRef.current.value;

        if (!gradetype) {
            if (!toast.isActive(toastId)) {
                const id = toast.error("Please select a grade type");
                setToastId(id);
            }
            return;
        }

        const feesWithGradeType = fees.map((fee) => ({
            ...fee,
            gradetype,
        }));

        setLoading(true);

        axiosClientAdmin
            .post(`/gradefees`, feesWithGradeType)
            .then(() => {
                toast.success("Fees submitted successfully");
                setFees([]);
                getGradeFees();
                handleClose();
            })
            .catch((err) => {
                const response = err.response;

                if (!toast.isActive(toastId)) {
                    const id = toast.error(response.data.error.toString());
                    setToastId(id);
                }
            })
            .finally(() => setLoading(false));
    };

    const handleShowView = (gradetype) => {
        setSelectedGradeType(gradetype);
        getFeesByGradeType(gradetype);
    };
    const handleCloseView = () => setShowView(false);

    const handleEdit = (index) => {
        setEditIndex(index);
        setEditableFee({
            title: viewFees[index].title,
            amount: viewFees[index].amount,
            id: viewFees[index].id, // Assuming there's an 'id' field
        });
    };

    const handleSaveEdit = () => {
        const updatedFee = { ...editableFee };

        axiosClientAdmin
            .put(`/gradefees/${editableFee.id}`, updatedFee)
            .then((test) => {
                // Update viewFees with the new data
                const updatedFees = viewFees.map((fee, index) =>
                    index === editIndex ? updatedFee : fee
                );
                setViewFees(updatedFees);
                setEditIndex(null);
                toast.success("Fee updated successfully");
                getGradeFees();
            })
            .catch((err) => {
                const response = err.response;

                if (!toast.isActive(toastId)) {
                    const id = toast.error(response.data.error.toString());
                    setToastId(id);
                }
            });
    };

    const handleDelete = () => {
        axiosClientAdmin
            .delete(`/gradefees/${idConfirm}`)
            .then(() => {
                toast.success("Fee deleted successfully");
                getGradeFees();

                setViewFees((prevFees) =>
                    prevFees.filter((fee) => fee.id !== idConfirm)
                );
                handleCloseConfirm();
            })
            .catch((err) => {
                console.log("test");
                const response = err.response;
                if (!toast.isActive(toastId)) {
                    const id = toast.error(response.data.error.toString());
                    setToastId(id);
                }
            });
    };

    const handlePrint = async (gradetype) => {
        console.log(gradetype);
        try {
            const { data } = await axiosClientAdmin.get(
                `/gradefee/type/${gradetype}`
            );
            setFees(data.gradefees);
            setSelectedGradeType(gradetype);
            setPrintReady(true); // Trigger print readiness
        } catch (error) {
            console.error("Error fetching grade fees:", error);
        }
    };

    // Use `useEffect` to trigger the print dialog when printReady is true
    useEffect(() => {
        if (printReady) {
            printContent();
            setPrintReady(false); // Reset print readiness
        }
    }, [printReady]);

    // Setup react-to-print
    const printContent = useReactToPrint({
        content: () => printableRef.current,
        documentTitle: `Fee Breakdown for ${selectedGradeType}`,
    });
    return (
        <>
            <div className="list-body-container">
                <div>
                    {/* <input
                        className="search-input"
                        type="text"
                        placeholder="Search.."
                    />
                    <Button
                        className="search-input-btn"
                        variant="outline-secondary"
                    >
                        <SearchIcon />
                    </Button> */}
                </div>

                <div className="list-container">
                    <div className="d-flex justify-content-between list-title-container">
                        <h2>Grade List Fee</h2>
                        <button
                            className="button-list button-blue"
                            onClick={handleShow}
                        >
                            <AddIcon sx={{ color: "#000000" }} />
                            Add Fee
                        </button>
                    </div>
                    <div>
                        <table className="list-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Class Level</th>
                                    <th>Total Fee</th>
                                    <th>Option</th>
                                </tr>
                            </thead>
                            <tbody>
                                {calculateTotalAmountByGradeType().map(
                                    (item, index) => (
                                        <tr key={index}>
                                            <td data-label="No">{index + 1}</td>
                                            <td data-label="Class Level">
                                                Grade {item.gradetype}
                                            </td>
                                            <td data-label="Total Fee">
                                                {item.totalAmount.toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    }
                                                )}
                                            </td>
                                            <td data-label="Option">
                                                <button
                                                    className="button-list button-blue"
                                                    onClick={() =>
                                                        handleShowView(
                                                            item.gradetype
                                                        )
                                                    }
                                                >
                                                    View Break Down
                                                </button>
                                                <button
                                                    className="button-list button-green"
                                                    onClick={() =>
                                                        handlePrint(
                                                            item.gradetype
                                                        )
                                                    }
                                                >
                                                    Print
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div style={{ display: "none" }}>
                <AdminPrintFees
                    ref={printableRef}
                    fees={fees}
                    gradeType={selectedGradeType}
                />
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Fee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>Item*</Form.Label>
                            <Form.Control
                                ref={titleRef}
                                type="text"
                                placeholder="Ex. Tuition Fee"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>Amount*</Form.Label>
                            <Form.Control
                                ref={amountRef}
                                type="text"
                                placeholder="Ex. 10000"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>Grade Type*</Form.Label>
                            <Form.Select ref={gradetypeRef}>
                                <option value="">Select Grade Type</option>
                                <option value="7">Grade 7</option>
                                <option value="8">Grade 8</option>
                                <option value="9">Grade 9</option>
                                <option value="10">Grade 10</option>
                                <option value="11">Grade 11</option>
                                <option value="12">Grade 12</option>
                            </Form.Select>
                        </Form.Group>
                        <Button onClick={onSubmitFee}>Add Fee</Button>
                        <div>
                            <Table striped>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Item</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fees.map((fee, index) => (
                                        <tr key={index}>
                                            <td>
                                                <Button
                                                    className="btn-danger"
                                                    onClick={() =>
                                                        onRemoveFee(index)
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </Button>
                                            </td>
                                            <td>{fee.title}</td>
                                            <td>{fee.amount}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td></td>
                                        <td>Total:</td>
                                        <td>{calculateTotalFee()}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={onSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />{" "}
                                Save Changes
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer limit={1} />

            <Modal show={showView} onHide={handleCloseView} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        Fees for Grade {selectedGradeType}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Item</th>
                                <th>Fee Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {viewFees.map((fee, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <Form.Control
                                            type="text"
                                            placeholder="Disabled input"
                                            aria-label="Disabled input example"
                                            disabled={editIndex !== index}
                                            readOnly={editIndex !== index}
                                            value={
                                                editIndex === index
                                                    ? editableFee.title
                                                    : fee.title
                                            }
                                            onChange={(e) =>
                                                setEditableFee({
                                                    ...editableFee,
                                                    title: e.target.value,
                                                })
                                            }
                                        />
                                    </td>
                                    <td>
                                        <Form.Control
                                            type="text"
                                            placeholder="Disabled input"
                                            aria-label="Disabled input example"
                                            disabled={editIndex !== index}
                                            readOnly={editIndex !== index}
                                            value={
                                                editIndex === index
                                                    ? editableFee.amount
                                                    : fee.amount.toLocaleString(
                                                          undefined,
                                                          {
                                                              minimumFractionDigits: 2,
                                                              maximumFractionDigits: 2,
                                                          }
                                                      )
                                            }
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d*\.?\d*$/.test(value)) {
                                                    setEditableFee({
                                                        ...editableFee,
                                                        amount: value,
                                                    });
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>
                                        {editIndex === index ? (
                                            <>
                                                <Button
                                                    className="btn-primary"
                                                    onClick={handleSaveEdit}
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    className="btn-secondary"
                                                    onClick={() =>
                                                        setEditIndex(null)
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    className="button-list button-orange"
                                                    onClick={() =>
                                                        handleEdit(index)
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    className="button-list button-red"
                                                    onClick={() =>
                                                        handleConfirm(fee.id)
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseView}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Confirmation
                show={showConfirm}
                onHide={handleCloseConfirm}
                confirm={handleDelete}
                title={
                    "Warning: Deleting the grade list fee will erase all linked fee details. This action is irreversible. Are you sure you want to continue?"
                }
            />
        </>
    );
}
