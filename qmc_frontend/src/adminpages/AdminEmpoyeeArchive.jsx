import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Button from "react-bootstrap/Button";
import axiosClientAdmin from "../axoisclient/axios-client-admin";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Confirmation from "../components/Confirmation";

export default function AdminEmpoyeeArchive() {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [toastId, setToastId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(10);
    const [selectedType, setSelectedType] = useState(""); // State for selected employee type
    const [sortBy, setSortBy] = useState(""); // State for currently sorted column
    const [sortDirection, setSortDirection] = useState("asc"); // State for sort direction

    const [showRecover, setShowRecover] = useState(false);
    const [RecoverId, setRecoverId] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const [DeleteId, setDeleteId] = useState(null);

    const searchRef = useRef();

    const getEmployees = () => {
        axiosClientAdmin.get("/employee/archive").then(({ data }) => {
            setEmployees(data.employees);
            setFilteredEmployees(data.employees); // Initialize with all employees
        });
    };

    useEffect(() => {
        getEmployees();
    }, []);

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

    const handleShowRecover = (id) => {
        setRecoverId(id);
        setShowRecover(true);
    };

    const handleCloseRecover = () => {
        setShowRecover(false);
        setRecoverId(null);
    };

    const recoverEmployee = (id) => {
        axiosClientAdmin
            .get(`/employee/recover/${RecoverId}`)
            .then(() => {
                console.log("test");
                getEmployees();
                handleCloseRecover();
            })
            .catch(() => {
                console.log("error");
            });
    };

    const handleShowDelete = (id) => {
        setDeleteId(id);
        setShowDelete(true);
    };

    const handleCloseDelete = () => {
        setShowDelete(false);
        setDeleteId(null);
    };
    const deleteEmployee = () => {
        axiosClientAdmin
            .delete(`/employees/${DeleteId}`)
            .then(() => {
                getEmployees();
                handleCloseDelete();
            })
            .catch(() => {
                console.log("error");
            });
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
                        <h2>Employee List History</h2>
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
                                            <td>{employeeIndex}</td>
                                            <td>
                                                {data.fname} {data.mname}{" "}
                                                {data.lname}
                                            </td>
                                            <td>{data.address}</td>
                                            <td>{data.type}</td>
                                            <td>
                                                <button
                                                    className="button-list button-blue"
                                                    onClick={() =>
                                                        handleShowRecover(
                                                            data.id
                                                        )
                                                    }
                                                >
                                                    Recover
                                                </button>
                                                <button
                                                    className="button-list button-red"
                                                    onClick={() =>
                                                        handleShowDelete(
                                                            data.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
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

            <Confirmation
                show={showRecover}
                onHide={handleCloseRecover}
                confirm={recoverEmployee}
                title={
                    "Recovering this employee will reactivate their account and restore access to all system features. Ensure that their role, permissions, and any required updates are reviewed to reflect current organizational needs before completing the recovery process."
                }
            />

            <Confirmation
                show={showDelete}
                onHide={handleCloseDelete}
                confirm={deleteEmployee}
                title={""}
            />
        </>
    );
}
