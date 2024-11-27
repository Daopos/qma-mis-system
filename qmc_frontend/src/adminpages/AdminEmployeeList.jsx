import React, { useEffect, useRef, useState } from "react";
import randomatic from "randomatic";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axiosClientAdmin from "../axoisclient/axios-client-admin";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AdminEmployeeView from "../components/admin/AdminEmployeeView";
import AdminEmployeeEdit from "../components/admin/AdminEmployeeEdit";
import Confirmationload from "../components/Confirmationload";

import ZoomInIcon from "@mui/icons-material/ZoomIn";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button, Spinner } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function AdminEmployeeList() {
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [toastId, setToastId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(10);
    const [selectedType, setSelectedType] = useState(""); // State for selected employee type
    const [sortBy, setSortBy] = useState(""); // State for currently sorted column
    const [sortDirection, setSortDirection] = useState("asc"); // State for sort direction

    const [showEmployee, setShowEmployee] = useState(false);
    const [EditEmployee, setEditEmployee] = useState(false);

    const [employeeView, setEmployeeView] = useState();
    const [employeeEdit, setEmployeeEdit] = useState();

    const [showConfirm, setShowConfirm] = useState(false);
    const [idConfirm, setIdConfirm] = useState(null);

    const [showRsetConfirm, settShowRsetConfirm] = useState(null);

    const [submitLoading, setSubmitLoading] = useState(false);

    const emailRef = useRef();
    const fnameRef = useRef();
    const mnameRef = useRef();
    const lnameRef = useRef();
    const extensionRef = useRef();
    const addressRef = useRef();
    const employeeTypeRef = useRef();
    const searchRef = useRef();
    const imageRef = useRef();

    const handleShowView = () => {
        setShowEmployee(true);
    };
    const handleCloseView = () => setShowEmployee(false);

    const handleShowEdit = () => {
        setEditEmployee(true);
    };

    const handleCloseEdit = () => {
        setEditEmployee(false);
    };

    const getEmployees = () => {
        axiosClientAdmin.get("/employees").then(({ data }) => {
            setEmployees(data.employees);
            setFilteredEmployees(data.employees); // Initialize with all employees
        });
    };

    useEffect(() => {
        getEmployees();
    }, []);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onSubmit = () => {
        setSubmitLoading(true);

        const newPassword = randomatic("A0", 11);

        // Create a FormData object
        const formData = new FormData();

        // Append other fields
        formData.append("email", emailRef.current.value);
        formData.append("password", newPassword);
        formData.append("fname", fnameRef.current.value);
        formData.append("mname", mnameRef.current.value);
        formData.append("lname", lnameRef.current.value);
        formData.append("address", addressRef.current.value);
        formData.append("type", employeeTypeRef.current.value);
        formData.append("extension_name", extensionRef.current.value);
        formData.append("desc", "desc");

        // Append the image file
        if (imageRef.current.files[0]) {
            formData.append("image", imageRef.current.files[0]);
        }

        if (
            formData.get("email") &&
            formData.get("password") &&
            formData.get("lname") &&
            formData.get("address") &&
            formData.get("type")
        ) {
            axiosClientAdmin
                .post(`/employee/register`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(() => {
                    getEmployees();
                    setShow(false);
                    setPassword(newPassword);
                    setShowPass(true);
                    toast.success("Employee created successfully");
                })
                .catch((err) => {
                    const response = err.response;

                    if (response && response.status === 422) {
                        const dataError = response.data.errors;

                        // Collect all error messages into a single string
                        const errorMessages = Object.values(dataError)
                            .flat()
                            .join("\n");

                        if (!toast.isActive(toastId)) {
                            const id = toast.error(errorMessages);
                            setToastId(id);
                        }
                    } else {
                        console.log(response);
                    }
                })
                .finally(() => setSubmitLoading(false));
        } else {
            if (!toast.isActive(toastId)) {
                const id = toast.error(
                    "Email Address, First Name, Last Name, Address, and Employee Type need to be filled out."
                );
                setToastId(id);
            }
        }
    };

    const handleClosePass = () => setShowPass(false);

    const onSearch = () => {
        const searchQuery = searchRef.current.value.trim().toLowerCase();
        const terms = searchQuery.split(" ");

        let filtered = employees.filter((employee) => {
            const fullName =
                `${employee.fname} ${employee.mname} ${employee.lname}`
                    .toLowerCase()
                    .replace(/\s+/g, " ");
            return terms.every((term) => fullName.includes(term));
        });

        // Filter by selected employee type if it's set
        if (selectedType) {
            filtered = filtered.filter(
                (employee) => employee.type.toLowerCase() === selectedType
            );
        }

        setFilteredEmployees(filtered);
    };

    // Pagination
    const pageNumbers = [];
    for (
        let i = 1;
        i <= Math.ceil(filteredEmployees.length / employeesPerPage);
        i++
    ) {
        pageNumbers.push(i);
    }

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle sorting by employee type
    const handleSortByType = (event) => {
        const selectedType = event.target.value.toLowerCase();
        setSelectedType(selectedType);

        // If no type is selected (All), reset filtered employees to all employees
        if (selectedType === "") {
            setFilteredEmployees(employees);
        } else {
            // Filter employees by selected type
            const filtered = employees.filter(
                (employee) => employee.type.toLowerCase() === selectedType
            );
            setFilteredEmployees(filtered);
        }

        // Reset pagination to first page
        setCurrentPage(1);
    };

    // Sort employees by column
    const sortEmployees = (column) => {
        let sortedEmployees = [...filteredEmployees];

        // Toggle sort direction if already sorting by the same column
        if (sortBy === column) {
            const direction = sortDirection === "asc" ? "desc" : "asc";
            setSortDirection(direction);
            sortedEmployees.reverse();
        } else {
            // Sort by the selected column
            sortedEmployees.sort((a, b) => {
                if (column === "No") {
                    return sortDirection === "asc" ? a.id - b.id : b.id - a.id;
                } else if (column === "Name") {
                    const nameA = `${a.fname} ${a.mname} ${a.lname}`;
                    const nameB = `${b.fname} ${b.mname} ${b.lname}`;
                    return sortDirection === "asc"
                        ? nameA.localeCompare(nameB)
                        : nameB.localeCompare(nameA);
                } else if (column === "Address") {
                    return sortDirection === "asc"
                        ? a.address.localeCompare(b.address)
                        : b.address.localeCompare(a.address);
                }
                return 0;
            });

            setSortBy(column);
            setSortDirection("asc");
        }

        setFilteredEmployees(sortedEmployees);
    };

    // Logic to get current employees for the current page
    // Pagination logic
    // Pagination logic
    const indexOfFirstEmployee = (currentPage - 1) * employeesPerPage;
    const indexOfLastEmployee = Math.min(
        indexOfFirstEmployee + employeesPerPage,
        filteredEmployees.length
    );
    const currentEmployees = filteredEmployees.slice(
        indexOfFirstEmployee,
        indexOfLastEmployee
    );

    const handleConfirm = (id) => {
        setIdConfirm(id);
        setShowConfirm(true);
    };

    const handleCloseConfirm = () => {
        setShowConfirm(false);
    };

    const handleResetPass = (id) => {
        setIdConfirm(id);
        settShowRsetConfirm(true);
    };

    const handleCloseResetPass = () => {
        settShowRsetConfirm(false);
    };

    const resetPassword = () => {
        setSubmitLoading(true);

        const newPassword = randomatic("A0", 11);
        const payload = {
            password: newPassword,
        };

        axiosClientAdmin
            .post(`/employee/reset/password/${idConfirm}`, payload)
            .then(() => {
                console.log(idConfirm);
                console.log("success");
                setPassword(newPassword);
                handleCloseResetPass();
                setShowPass(true);
            })
            .finally(() => setSubmitLoading(false));
    };

    const archive = () => {
        setSubmitLoading(true);

        axiosClientAdmin
            .delete(`/employees/${idConfirm}`)
            .then(() => {
                console.log("test");
                getEmployees();
                handleCloseConfirm();
            })
            .catch(() => {
                console.log("error");
            })
            .finally(() => setSubmitLoading(false));
    };

    const [anchorEl, setAnchorEl] = useState({});

    const handleClick = (event, id) => {
        setAnchorEl((prevState) => ({
            ...prevState,
            [id]: event.currentTarget,
        }));
    };

    const handleCloseClick = (id) => {
        setAnchorEl((prevState) => ({
            ...prevState,
            [id]: null,
        }));
    };

    return (
        <>
            <div className="list-body-container">
                <div>
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search.."
                        ref={searchRef}
                        onChange={onSearch} // Call onSearch when the input value changes
                    />
                    <Button
                        className="search-input-btn"
                        variant="outline-secondary"
                        onClick={onSearch}
                    >
                        <SearchIcon />
                    </Button>
                </div>
                <div style={{ marginTop: 25 }}>
                    <select
                        id="sortBy"
                        onChange={handleSortByType}
                        value={selectedType}
                    >
                        <option value="">All</option>
                        <option value="principal">Principal</option>
                        <option value="teacher">Teacher</option>
                        <option value="registrar">Registrar</option>
                        <option value="finance">Finance</option>
                    </select>
                </div>
                <div className="list-container">
                    <div className="d-flex justify-content-between list-title-container">
                        <h2>Employee List</h2>
                        <button
                            className="button-list button-blue"
                            onClick={handleShow}
                        >
                            <AddIcon sx={{ color: "#000000" }} />
                            Add Employee
                        </button>
                    </div>
                    <div>
                        <table className="list-table">
                            <thead>
                                <tr>
                                    <th
                                        style={{ cursor: "pointer" }}
                                        onClick={() => sortEmployees("No")}
                                    >
                                        No{" "}
                                        {sortBy === "No" && (
                                            <span>
                                                {sortDirection === "asc" ? (
                                                    <ArrowDropUpIcon
                                                        style={{ fontSize: 18 }}
                                                    />
                                                ) : (
                                                    <ArrowDropDownIcon
                                                        style={{ fontSize: 18 }}
                                                    />
                                                )}
                                            </span>
                                        )}
                                    </th>
                                    <th
                                        style={{ cursor: "pointer" }}
                                        onClick={() => sortEmployees("Name")}
                                    >
                                        Name{" "}
                                        {sortBy === "Name" && (
                                            <span>
                                                {sortDirection === "asc" ? (
                                                    <ArrowDropUpIcon
                                                        style={{ fontSize: 18 }}
                                                    />
                                                ) : (
                                                    <ArrowDropDownIcon
                                                        style={{ fontSize: 18 }}
                                                    />
                                                )}
                                            </span>
                                        )}
                                    </th>

                                    <th
                                        style={{ cursor: "pointer" }}
                                        onClick={() => sortEmployees("Address")}
                                    >
                                        Address{" "}
                                        {sortBy === "Address" && (
                                            <span>
                                                {sortDirection === "asc" ? (
                                                    <ArrowDropUpIcon
                                                        style={{ fontSize: 18 }}
                                                    />
                                                ) : (
                                                    <ArrowDropDownIcon
                                                        style={{ fontSize: 18 }}
                                                    />
                                                )}
                                            </span>
                                        )}
                                    </th>
                                    <th>Type</th>
                                    <th>Option</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEmployees.map((data, index) => {
                                    // Calculate the correct index based on current page and sorting
                                    let employeeIndex =
                                        indexOfFirstEmployee + index + 1; // Starting index

                                    // Adjust for descending order
                                    if (sortDirection === "desc") {
                                        employeeIndex =
                                            filteredEmployees.length -
                                            employeeIndex +
                                            1;
                                    }

                                    return (
                                        <tr key={index}>
                                            <td data-label="No">
                                                {employeeIndex}
                                            </td>
                                            <td data-label="Name">
                                                {`${data.lname}, ${data.fname}${
                                                    data.mname
                                                        ? `, ${data.mname.charAt(
                                                              0
                                                          )}.`
                                                        : ""
                                                }${
                                                    data.extension_name
                                                        ? ` ${data.extension_name}`
                                                        : ""
                                                }`}
                                            </td>
                                            <td data-label="Address ">
                                                {data.address}
                                            </td>
                                            <td data-label="Type ">
                                                {data.type}
                                            </td>
                                            <td data-label="Option">
                                                <OverlayTrigger
                                                    key="top"
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip id="tooltip-$top">
                                                            View Employee Info
                                                        </Tooltip>
                                                    }
                                                >
                                                    <button
                                                        className="button-list button-blue"
                                                        onClick={() => {
                                                            setEmployeeView({
                                                                image: data.image_url,
                                                                email: data.email,
                                                                fname: data.fname,
                                                                extension_name:
                                                                    data.extension_name,
                                                                mname: data.mname,
                                                                lname: data.lname,
                                                                address:
                                                                    data.address,
                                                                type: data.type,
                                                            });
                                                            handleShowView();
                                                        }}
                                                    >
                                                        <ZoomInIcon />
                                                    </button>
                                                </OverlayTrigger>
                                                <OverlayTrigger
                                                    key="top"
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip id="tooltip-top">
                                                            Edit Employee Info
                                                        </Tooltip>
                                                    }
                                                >
                                                    <button
                                                        className="button-list button-orange"
                                                        onClick={() => {
                                                            setEmployeeEdit({
                                                                email: data.email,
                                                                fname: data.fname,
                                                                mname: data.mname,
                                                                lname: data.lname,
                                                                extension_name:
                                                                    data.extension_name,
                                                                address:
                                                                    data.address,
                                                                type: data.type,
                                                                id: data.id,
                                                            });
                                                            handleShowEdit();
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </button>
                                                </OverlayTrigger>

                                                <IconButton
                                                    aria-label="more"
                                                    id={`long-button-${data.id}`}
                                                    aria-controls={
                                                        anchorEl[data.id]
                                                            ? `long-menu-${data.id}`
                                                            : undefined
                                                    }
                                                    aria-expanded={
                                                        anchorEl[data.id]
                                                            ? "true"
                                                            : undefined
                                                    }
                                                    aria-haspopup="true"
                                                    onClick={(event) =>
                                                        handleClick(
                                                            event,
                                                            data.id
                                                        )
                                                    }
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                                <Menu
                                                    id={`long-menu-${data.id}`}
                                                    elevation={1}
                                                    MenuListProps={{
                                                        "aria-labelledby": `long-button-${data.id}`,
                                                        sx: { py: 0 },
                                                    }}
                                                    anchorEl={anchorEl[data.id]}
                                                    open={Boolean(
                                                        anchorEl[data.id]
                                                    )}
                                                    onClose={() =>
                                                        handleCloseClick(
                                                            data.id
                                                        )
                                                    }
                                                    slotProps={{
                                                        paper: {
                                                            style: {},
                                                        },
                                                    }}
                                                >
                                                    <MenuItem
                                                        onClick={() => {
                                                            handleResetPass(
                                                                data.id
                                                            );

                                                            console.log("test");

                                                            handleCloseClick(
                                                                data.id
                                                            );
                                                        }}
                                                    >
                                                        Reset Password
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={() => {
                                                            handleConfirm(
                                                                data.id
                                                            );
                                                            handleCloseClick(
                                                                data.id
                                                            );
                                                        }}
                                                    >
                                                        Archive
                                                    </MenuItem>
                                                </Menu>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Pagination */}
            <div className="pagination-container d-flex justify-content-center pb-5">
                <Button
                    style={{ borderRadius: 0 }}
                    variant="outline-primary"
                    onClick={() =>
                        paginate(currentPage > 1 ? currentPage - 1 : 1)
                    }
                    disabled={currentPage === 1}
                >
                    <span aria-hidden="true">&laquo;</span>
                </Button>
                {pageNumbers.map((number) => (
                    <Button
                        style={{ borderRadius: 0 }}
                        key={number}
                        variant="outline-primary"
                        className={currentPage === number ? "active" : ""}
                        onClick={() => paginate(number)}
                    >
                        {number}
                    </Button>
                ))}
                <Button
                    style={{ borderRadius: 0 }}
                    variant="outline-primary"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={indexOfLastEmployee >= filteredEmployees.length}
                >
                    <span aria-hidden="true">&raquo;</span>
                </Button>
            </div>
            <ToastContainer limit={1} />
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Employee</Modal.Title>
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
                                ref={imageRef}
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>Email address*</Form.Label>
                            <Form.Control
                                ref={emailRef}
                                type="email"
                                placeholder="name@example.com"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>First Name*</Form.Label>
                            <Form.Control
                                ref={fnameRef}
                                type="text"
                                placeholder="first name"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>Middle Name</Form.Label>
                            <Form.Control
                                ref={mnameRef}
                                type="text"
                                placeholder="middle name"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>Last Name*</Form.Label>
                            <Form.Control
                                ref={lnameRef}
                                type="text"
                                placeholder="last name"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>Extension Name</Form.Label>
                            <Form.Control
                                ref={extensionRef}
                                type="text"
                                placeholder="extension name"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>Address*</Form.Label>
                            <Form.Control
                                ref={addressRef}
                                type="text"
                                placeholder="address"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>Employee Type*</Form.Label>
                            <Form.Select ref={employeeTypeRef}>
                                <option value="">Select Employee Type</option>
                                <option value="Principal">Principal</option>
                                <option value="Finance">Finance</option>
                                <option value="Registrar">Registrar</option>
                                <option value="Teacher">Teacher</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={onSubmit}
                        disabled={submitLoading}
                    >
                        {submitLoading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />{" "}
                                Loading...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal
                centered
                show={showPass}
                onHide={handleClosePass}
                animation={true}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Employee Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                    >
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="text"
                            disabled
                            autoFocus
                            value={password}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Modal>
            {/* Employee View */}
            {employeeView && (
                <AdminEmployeeView
                    show={showEmployee}
                    onHide={handleCloseView}
                    image={employeeView.image}
                    email={employeeView.email}
                    fname={employeeView.fname}
                    mname={employeeView.mname}
                    lname={employeeView.lname}
                    address={employeeView.address}
                    type={employeeView.type}
                    extension_name={employeeView.extension_name}
                />
            )}

            {employeeEdit && (
                <AdminEmployeeEdit
                    getEmployees={getEmployees}
                    show={EditEmployee}
                    onHide={handleCloseEdit}
                    id={employeeEdit.id}
                    email={employeeEdit.email}
                    fname={employeeEdit.fname}
                    mname={employeeEdit.mname}
                    lname={employeeEdit.lname}
                    address={employeeEdit.address}
                    type={employeeEdit.type}
                    extension_name={employeeEdit.extension_name}
                />
            )}

            <Confirmationload
                show={showRsetConfirm}
                onHide={handleCloseResetPass}
                confirm={resetPassword}
                title={
                    "Resetting this employee's password will revoke their current access. They will need to use the new password provided to log in. Ensure this action is necessary and communicate the new password securely."
                }
                loading={submitLoading}
            />

            <Confirmationload
                show={showConfirm}
                onHide={handleCloseConfirm}
                confirm={archive}
                title={
                    "Archiving this employee will deactivate their account and restrict access to all system features. Ensure that all necessary data is backed up and that you have communicated this change to the employee before proceeding."
                }
                loading={submitLoading}
            />
        </>
    );
}
