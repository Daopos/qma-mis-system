import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import axiosClientRegistrar from "../axoisclient/axios-client-registrar";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import RegistrarEditStudent from "../components/registrar/RegistrarEditStudent";
import Button from "react-bootstrap/Button";

import ZoomInIcon from "@mui/icons-material/ZoomIn";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import randomatic from "randomatic";
import Confirmation from "../components/Confirmation";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Pagination from "react-bootstrap/Pagination"; // Import Pagination component
import PrintIcon from "@mui/icons-material/Print";
import ConfirmationLoad from "../components/Confirmationload";
export default function RegistrarEnrolled() {
    const [show, setShow] = useState(false);
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [activeTab, setActiveTab] = useState("grade7");
    const [studentsPerPage] = useState(10);
    const [pagination, setPagination] = useState({
        grade7: { currentPage: 1, totalPages: 1 },
        grade8: { currentPage: 1, totalPages: 1 },
        grade9: { currentPage: 1, totalPages: 1 },
        grade10: { currentPage: 1, totalPages: 1 },
        grade11: { currentPage: 1, totalPages: 1 },
        grade12: { currentPage: 1, totalPages: 1 },
    });

    const [profile, setProfile] = useState({});

    const [showEdit, setEdit] = useState(false);

    const [editStudent, setEditStudent] = useState();

    const [showConfirm, setShowConfirm] = useState(false);
    const [idConfirm, setIdConfirm] = useState(null);
    const [confirmType, setConfirmType] = useState("");

    const [password, setPassword] = useState();
    const [showPass, setShowPass] = useState(false);

    const handleClosePass = () => setShowPass(false);

    const [countByGrade, setCountByGrade] = useState({});

    const [resetLoading, setResetLoading] = useState(false);

    const getCountByGrade = () => {
        axiosClientRegistrar
            .get("/count/enrolled/students")
            .then(({ data }) => {
                console.log(data);
                setCountByGrade(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleConfirm = (id, type) => {
        setIdConfirm(id);
        setConfirmType(type); // Set type as either "student" or "parent"
        console.log(id, type);
        setShowConfirm(true);
    };

    const handleCloseConfirm = () => {
        setShowConfirm(false);
    };

    const resetPassword = () => {
        const newPassword = randomatic("A0", 11);
        const payload = {
            password: newPassword,
        };

        setResetLoading(true);

        const endpoint =
            confirmType === "student"
                ? `/student/reset/password/${idConfirm}`
                : `/parent/reset/password/${idConfirm}`; // Adjust endpoint based on type

        axiosClientRegistrar
            .post(endpoint, payload)
            .then(() => {
                console.log(idConfirm);
                console.log("success");
                setPassword(newPassword);
                handleCloseConfirm();
                setShowPass(true);
            })
            .catch(() => {
                console.log("fail");
            })
            .finally(() => setResetLoading(false));
    };

    const getStudents = () => {
        axiosClientRegistrar.get("/student/enrolled").then(({ data }) => {
            setStudents(data.students);
            setFilteredStudents(data.students);
        });
    };

    useEffect(() => {
        getCountByGrade();
        getStudents();
    }, []);

    const onView = (id) => {
        axiosClientRegistrar.get(`/students/${id}`).then((data) => {
            setProfile(data.data.student);
            setShow(true);
        });
    };

    const handleShowEdit = () => {
        setEdit(true);
    };

    const handleCloseEdit = () => {
        setEdit(false);
    };

    const handleEditClick = (data) => {
        setEditStudent(data); // Pass complete student data
        handleShowEdit();
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = students.filter((student) => {
            const middleName = student.middlename
                ? student.middlename.toLowerCase()
                : "";
            const fullName =
                `${student.surname} ${student.firstname} ${middleName}`
                    .trim()
                    .toLowerCase();
            const lrn = student.lrn.toString().toLowerCase(); // Convert LRN to string for search

            return (
                student.surname.toLowerCase().includes(query) ||
                student.firstname.toLowerCase().includes(query) ||
                middleName.includes(query) ||
                fullName.includes(query) ||
                lrn.includes(query) // Search for LRN as well
            );
        });

        setFilteredStudents(filtered);
        if (filtered.length > 0) {
            const gradeLevel = filtered[0].grade_level.toString();
            setActiveTab(`grade${gradeLevel}`);
        }
    };

    const [anchorEl, setAnchorEl] = useState({});

    const handleClick = (event, id) => {
        setAnchorEl((prevState) => ({
            ...prevState,
            [id]: event.currentTarget,
        }));
    };

    const handleClose = (id) => {
        setAnchorEl((prevState) => ({
            ...prevState,
            [id]: null,
        }));
    };

    const renderTable = (studentsToRender) => {
        // Calculate the starting index based on the current page
        const currentPage = pagination[activeTab].currentPage;
        const startIndex = (currentPage - 1) * studentsPerPage;

        return (
            <>
                <table className="list-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>LRN</th>
                            <th>Name</th>
                            <th>Grade Level</th>
                            <th>Gender</th>
                            <th>Option</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentsToRender.map((data, index) => (
                            <tr key={index + 1}>
                                {/* Adjust index to reflect the correct number based on the page */}
                                <td data-label="No">
                                    {startIndex + index + 1}
                                </td>
                                <td data-label="LRN">{data.lrn}</td>
                                <td data-label="Name">{`${data.surname}, ${
                                    data.firstname
                                }${
                                    data.middlename
                                        ? `, ${data.middlename.charAt(0)}.`
                                        : ""
                                }${
                                    data.extension_name
                                        ? ` ${data.extension_name}`
                                        : ""
                                }`}</td>
                                <td data-label="Grade Level">
                                    {data.grade_level}
                                </td>
                                <td data-label="Gender">{data.gender}</td>
                                <td data-label="Option">
                                    {/* Render buttons and other elements as before */}
                                    <OverlayTrigger
                                        key="top"
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id="tooltip-top"
                                                style={{ position: "fixed" }}
                                            >
                                                View Student Info
                                            </Tooltip>
                                        }
                                    >
                                        <button
                                            className="button-list button-blue"
                                            onClick={() => onView(data.id)}
                                        >
                                            <ZoomInIcon />
                                        </button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        key="top"
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id="tooltip-top"
                                                style={{ position: "fixed" }}
                                            >
                                                Edit Student Info
                                            </Tooltip>
                                        }
                                    >
                                        <button
                                            className="button-list button-orange"
                                            onClick={() =>
                                                handleEditClick(data)
                                            }
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
                                            handleClick(event, data.id)
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
                                        open={Boolean(anchorEl[data.id])}
                                        onClose={() => handleClose(data.id)}
                                        // slotProps={{
                                        //     paper: {
                                        //         style: {
                                        //             maxHeight: 15 * 4.5,
                                        //         },
                                        //     },
                                        // }}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                handleConfirm(
                                                    data.id,
                                                    "student"
                                                );
                                                handleClose(data.id);
                                            }}
                                        >
                                            Reset Password
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleConfirm(
                                                    data.id,
                                                    "parent"
                                                );
                                                handleClose(data.id);
                                            }}
                                        >
                                            Reset Parent Password
                                        </MenuItem>
                                    </Menu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination-container d-flex justify-content-center pb-3 pt-3">
                    {renderPagination()}
                </div>
            </>
        );
    };

    const renderPagination = () => {
        const { currentPage, totalPages } = pagination[activeTab];
        const items = [];
        const pageRange = 2; // Number of pages to show on either side of the current page

        // Add "First" button
        items.push(
            <Pagination.First
                key="first"
                onClick={() => paginate(activeTab, 1)}
                disabled={currentPage === 1}
            />
        );

        // Add "Prev" button
        items.push(
            <Pagination.Prev
                key="prev"
                onClick={() => paginate(activeTab, currentPage - 1)}
                disabled={currentPage === 1}
            />
        );

        // Add pages around the current page
        const startPage = Math.max(1, currentPage - pageRange);
        const endPage = Math.min(totalPages, currentPage + pageRange);

        if (totalPages <= 2 * pageRange + 1) {
            // If the number of total pages is small, show all pages
            for (let number = 1; number <= totalPages; number++) {
                items.push(
                    <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => paginate(activeTab, number)}
                    >
                        {number}
                    </Pagination.Item>
                );
            }
        } else {
            // Show "First" page if needed
            if (currentPage > pageRange + 2) {
                items.push(
                    <Pagination.Item
                        key={1}
                        onClick={() => paginate(activeTab, 1)}
                    >
                        1
                    </Pagination.Item>
                );
                items.push(<Pagination.Ellipsis key="ellipsis-start" />);
            }

            // Add pages around the current page
            for (let number = startPage; number <= endPage; number++) {
                items.push(
                    <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => paginate(activeTab, number)}
                    >
                        {number}
                    </Pagination.Item>
                );
            }

            // Show "Last" page if needed
            if (currentPage < totalPages - pageRange - 1) {
                items.push(<Pagination.Ellipsis key="ellipsis-end" />);
                items.push(
                    <Pagination.Item
                        key={totalPages}
                        onClick={() => paginate(activeTab, totalPages)}
                    >
                        {totalPages}
                    </Pagination.Item>
                );
            }
        }

        // Add "Next" button
        items.push(
            <Pagination.Next
                key="next"
                onClick={() => paginate(activeTab, currentPage + 1)}
                disabled={currentPage === totalPages}
            />
        );

        // Add "Last" button
        items.push(
            <Pagination.Last
                key="last"
                onClick={() => paginate(activeTab, totalPages)}
                disabled={currentPage === totalPages}
            />
        );

        return <Pagination>{items}</Pagination>;
    };

    const paginate = (grade, pageNumber) => {
        setPagination((prev) => ({
            ...prev,
            [grade]: { ...prev[grade], currentPage: pageNumber },
        }));
    };

    const getPaginatedData = (studentsToPaginate) => {
        const indexOfLast = pagination[activeTab].currentPage * studentsPerPage;
        const indexOfFirst = indexOfLast - studentsPerPage;
        return studentsToPaginate.slice(indexOfFirst, indexOfLast);
    };

    const updatePagination = (grade) => {
        const studentsForGrade = filteredStudents.filter(
            (student) => student.grade_level === grade
        );
        const totalPages = Math.ceil(studentsForGrade.length / studentsPerPage);
        setPagination((prev) => ({
            ...prev,
            [`grade${grade}`]: { ...prev[`grade${grade}`], totalPages },
        }));
    };

    const studentsByGrade = {
        grade7: filteredStudents.filter(
            (student) => student.grade_level === "7"
        ),
        grade8: filteredStudents.filter(
            (student) => student.grade_level === "8"
        ),
        grade9: filteredStudents.filter(
            (student) => student.grade_level === "9"
        ),
        grade10: filteredStudents.filter(
            (student) => student.grade_level === "10"
        ),
        grade11: filteredStudents.filter(
            (student) => student.grade_level === "11"
        ),
        grade12: filteredStudents.filter(
            (student) => student.grade_level === "12"
        ),
    };

    useEffect(() => {
        updatePagination("7");
        updatePagination("8");
        updatePagination("9");
        updatePagination("10");
        updatePagination("11");
        updatePagination("12");
    }, [filteredStudents]);

    return (
        <>
            <div className="list-body-container">
                <div className="grade-cards-container">
                    {[
                        { grade: 7, count: countByGrade["grade_7"] },
                        { grade: 8, count: countByGrade["grade_8"] },
                        { grade: 9, count: countByGrade["grade_9"] },
                        { grade: 10, count: countByGrade["grade_10"] },
                        { grade: 11, count: countByGrade["grade_11"] },
                        { grade: 12, count: countByGrade["grade_12"] },
                    ].map(({ grade, count }) => (
                        <div className="grade-card" key={grade}>
                            <h3>Grade {grade}</h3>
                            <p>{count} students</p>
                        </div>
                    ))}
                </div>

                <div>
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search.."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <button className="search-input-btn">
                        <SearchIcon />
                    </button>
                </div>

                <div className="list-container">
                    <div className="d-flex justify-content-between list-title-container">
                        <h2>Enrolled Students</h2>
                        {/* <button className="button-list button-blue">
                    <AddIcon sx={{ color: "#000000" }} />
                    Add Class
                </button> */}
                        <div className="mb-3">
                            <DropdownButton
                                id="dropdown-basic-button"
                                title="Report"
                                variant="secondary"
                            >
                                <Dropdown.Item
                                    href="/printpdfgoodmoral"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Students without Good Moral
                                </Dropdown.Item>
                                <Dropdown.Item
                                    href="/printpdftranscript"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Students without Transcript
                                </Dropdown.Item>
                                <Dropdown.Item
                                    href="/printpdfreportcard"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Students without Report Card
                                </Dropdown.Item>
                                <Dropdown.Item
                                    href="/printpdfpsa"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Students without PSA
                                </Dropdown.Item>
                            </DropdownButton>
                        </div>
                    </div>
                    <div>
                        <Tabs
                            activeKey={activeTab}
                            onSelect={(k) => {
                                setActiveTab(k);
                                paginate(k, 1); // Reset pagination on tab change
                            }}
                            id="uncontrolled-tab-example"
                            className="mb-3 tab-title"
                        >
                            <Tab eventKey="grade7" title="Grade 7">
                                {renderTable(
                                    getPaginatedData(studentsByGrade.grade7)
                                )}
                            </Tab>
                            <Tab eventKey="grade8" title="Grade 8">
                                {renderTable(
                                    getPaginatedData(studentsByGrade.grade8)
                                )}
                            </Tab>
                            <Tab eventKey="grade9" title="Grade 9">
                                {renderTable(
                                    getPaginatedData(studentsByGrade.grade9)
                                )}
                            </Tab>
                            <Tab eventKey="grade10" title="Grade 10">
                                {renderTable(
                                    getPaginatedData(studentsByGrade.grade10)
                                )}
                            </Tab>
                            <Tab eventKey="grade11" title="Grade 11">
                                {renderTable(
                                    getPaginatedData(studentsByGrade.grade11)
                                )}
                            </Tab>
                            <Tab eventKey="grade12" title="Grade 12">
                                {renderTable(
                                    getPaginatedData(studentsByGrade.grade12)
                                )}
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>

            {profile && (
                <Modal
                    show={show}
                    onHide={() => setShow(false)}
                    dialogClassName="modal-80w"
                    aria-labelledby="example-custom-modal-styling-title"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                            Student
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: "#f7f7f9" }}>
                        <Tabs
                            defaultActiveKey="home"
                            id="justify-tab-example"
                            className="mb-3"
                            justify
                        >
                            <Tab
                                eventKey="home"
                                title="Student Information"
                                style={{
                                    backgroundColor: "white",
                                    padding: "20px 60px",
                                }}
                            >
                                <div className="">
                                    <h3>Personal Information</h3>
                                    <div className="d-flex  pt-4 gap-5 flex-wrap">
                                        <div className="d-flex flex-column gap-4">
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Lrn</h6>
                                                <h5>
                                                    <u>{profile.lrn || ""}</u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Name</h6>
                                                <h5>
                                                    <u>
                                                        {`${
                                                            profile.firstname
                                                        } ${
                                                            profile.middlename ||
                                                            ""
                                                        } ${profile.surname} ${
                                                            profile.extension_name ||
                                                            ""
                                                        }`
                                                            .replace(
                                                                /\s+/g,
                                                                " "
                                                            )
                                                            .trim()}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Track</h6>
                                                <h5>
                                                    <u>
                                                        {profile.track &&
                                                        profile.track !== "null"
                                                            ? profile.track
                                                            : "N/A"}
                                                    </u>
                                                </h5>
                                            </div>{" "}
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Strand</h6>
                                                <h5>
                                                    <u>
                                                        {profile.strand &&
                                                        profile.strand !==
                                                            "null"
                                                            ? profile.strand
                                                            : "N/A"}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Grade Level</h6>
                                                <h5>
                                                    <u>{`${
                                                        profile.grade_level ||
                                                        "N/A"
                                                    }`}</u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Address</h6>
                                                <h5>
                                                    <u>
                                                        {`${
                                                            profile.street ||
                                                            "N/A"
                                                        }, ${
                                                            profile.barangay ||
                                                            "N/A"
                                                        }, ${
                                                            profile.municipality ||
                                                            "N/A"
                                                        }, ${
                                                            profile.province ||
                                                            "N/A"
                                                        }`}
                                                    </u>
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-column gap-4">
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Birthdate</h6>
                                                <h5>
                                                    <u>
                                                        {profile.birthdate ||
                                                            "N/A"}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Born in</h6>
                                                <h5>
                                                    <u>
                                                        {`${profile.birth_municipality}, ${profile.birth_province}`}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Gender</h6>
                                                <h5>
                                                    <u>
                                                        {profile.gender ||
                                                            "N/A"}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Religion</h6>
                                                <h5>
                                                    <u>
                                                        {profile.religion ||
                                                            "N/A"}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Contacts</h6>
                                                <ul>
                                                    <li>
                                                        <u>
                                                            {profile.contact ||
                                                                "N/A"}
                                                        </u>
                                                    </li>
                                                    <li>
                                                        <u>
                                                            {profile.email ||
                                                                "N/A"}
                                                        </u>
                                                    </li>
                                                    <li>
                                                        <u>
                                                            {profile.social_media ||
                                                                "N/A"}
                                                        </u>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                            <Tab
                                eventKey="profile"
                                title="Family Members"
                                style={{
                                    backgroundColor: "white",
                                    padding: "20px 60px",
                                }}
                            >
                                <div>
                                    <h3>Family Information</h3>
                                    <div className="d-flex  pt-4 justify-content-between flex-wrap">
                                        <div className="d-flex flex-column gap-4">
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Father's Name</h6>
                                                <h5>
                                                    <u>
                                                        {profile.father_name ||
                                                            "N/A"}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Occupation</h6>
                                                <h5>
                                                    <u>
                                                        {profile.father_occupation ||
                                                            "N/A"}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Contact Number</h6>
                                                <h5>
                                                    <u>
                                                        {profile.father_contact ||
                                                            "N/A"}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Social Media</h6>
                                                <h5>
                                                    <u>
                                                        {profile.father_social &&
                                                        profile.father_social !==
                                                            "null"
                                                            ? profile.father_social
                                                            : "N/A"}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Email Address</h6>
                                                <h5>
                                                    <u>
                                                        {profile.father_email &&
                                                        profile.father_email !==
                                                            "null"
                                                            ? profile.father_email
                                                            : "N/A"}
                                                    </u>
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-column gap-4">
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Mother's Name</h6>
                                                <h5>
                                                    <u>
                                                        {profile.mother_name ||
                                                            "N/A"}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Occupation</h6>
                                                <h5>
                                                    <u>
                                                        {profile.mother_occupation ||
                                                            "N/A"}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Contact Number</h6>
                                                <h5>
                                                    <u>
                                                        {profile.mother_contact ||
                                                            "N/A"}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Social Media</h6>
                                                <h5>
                                                    <u>
                                                        {profile.mother_social &&
                                                        profile.mother_email !==
                                                            "null"
                                                            ? profile.mother_email
                                                            : "N/A"}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Email Address</h6>
                                                <h5>
                                                    <u>
                                                        {profile.mother_email &&
                                                        profile.mother_email !==
                                                            "null"
                                                            ? profile.mother_email
                                                            : "N/A"}
                                                    </u>
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-column gap-4">
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Guardian's Name</h6>
                                                <h5>
                                                    <u>
                                                        {profile.guardian_name ||
                                                            "N/A"}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Occupation</h6>
                                                <h5>
                                                    <u>
                                                        {profile.guardian_occupation ||
                                                            "N/A"}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Contact Number</h6>
                                                <h5>
                                                    <u>
                                                        {profile.guardian_contact ||
                                                            "N/A"}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Social Media</h6>
                                                <h5>
                                                    <u>
                                                        {profile.guardian_social &&
                                                        profile.guardian_social !==
                                                            "null"
                                                            ? profile.guardian_social
                                                            : "N/A"}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Email Address</h6>
                                                <h5>
                                                    <u>
                                                        {profile.guardian_email ||
                                                            "N/A"}
                                                    </u>
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                            <Tab
                                eventKey="longer-tab"
                                title="Requirements"
                                style={{
                                    backgroundColor: "white",
                                    padding: "20px 60px",
                                }}
                            >
                                <div className="">
                                    <h3>Additional Information</h3>
                                    <div className="d-flex  pt-4 gap-5">
                                        <div className="d-flex flex-column gap-4">
                                            <div className="d-flex flex-column gap-1">
                                                <h6>
                                                    School Previously Attended
                                                </h6>
                                                <ul>
                                                    <li>
                                                        School Name:
                                                        <u>
                                                            {profile.previous_school_name ||
                                                                "N/A"}
                                                        </u>
                                                    </li>
                                                    <li>
                                                        School Address:
                                                        <u>
                                                            {profile.previous_school_address ||
                                                                "N/A"}
                                                        </u>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Birth Certificate (PSA)</h6>
                                                <h5>
                                                    <u>
                                                        {profile.birth_url
                                                            ? "PASSED"
                                                            : "NONE"}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Report Card</h6>
                                                <h5>
                                                    <u>
                                                        {profile.report_url
                                                            ? "PASSED"
                                                            : "NONE"}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Transcript of Record</h6>
                                                <h5>
                                                    <u>
                                                        {profile.transcript_url
                                                            ? "PASSED"
                                                            : "NONE"}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>
                                                    Certificate of Good Moral
                                                </h6>
                                                <h5>
                                                    <u>
                                                        {profile.moral_url
                                                            ? "PASSED"
                                                            : "NONE"}
                                                    </u>
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                </Modal>
            )}
            {editStudent && (
                <RegistrarEditStudent
                    show={showEdit}
                    onHide={handleCloseEdit}
                    initialValues={editStudent}
                    getStudents={getStudents}
                />
            )}

            <Modal
                centered
                show={showPass}
                onHide={handleClosePass}
                animation={true}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {confirmType === "student"
                            ? "Student Password"
                            : "Parent Password"}
                    </Modal.Title>
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

            <ConfirmationLoad
                show={showConfirm}
                onHide={handleCloseConfirm}
                confirm={resetPassword}
                title={
                    "Resetting this password will revoke their current access. They will need to use the new password provided to log in. Ensure this action is necessary and communicate the new password securely."
                }
                loading={resetLoading}
            />
        </>
    );
}
