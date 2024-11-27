import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import axiosClientAdmin from "../axoisclient/axios-client-admin";
import Modal from "react-bootstrap/Modal";
import ZoomInIcon from "@mui/icons-material/ZoomIn";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination"; // Import Pagination component

export default function AdminStudentList() {
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

    const [show, setShow] = useState(false);
    const [profile, setProfile] = useState({});

    const onView = (id) => {
        axiosClientAdmin.get(`/students/${id}`).then((data) => {
            setProfile(data.data.student);
            setShow(true);
        });
    };

    const getStudents = () => {
        axiosClientAdmin.get(`/student/enrolled`).then(({ data }) => {
            setStudents(data.students);
            setFilteredStudents(data.students);
        });
    };

    useEffect(() => {
        getStudents();
    }, []);

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

    const renderTable = (studentsToRender) => (
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
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{data.lrn}</td>
                            <td>{`${data.surname}, ${data.firstname}${
                                data.middlename
                                    ? `, ${data.middlename.charAt(0)}.`
                                    : ""
                            }${
                                data.extension_name
                                    ? ` ${data.extension_name}`
                                    : ""
                            }`}</td>
                            <td>{data.grade_level}</td>
                            <td>{data.gender}</td>
                            <td>
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
                        <h2>Student List</h2>
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
                                    <div className="d-flex  pt-4 gap-5">
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
                                                    <u>{`${
                                                        profile.track || "N/A"
                                                    }`}</u>
                                                </h5>
                                            </div>{" "}
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Strand</h6>
                                                <h5>
                                                    <u>{`${
                                                        profile.strand || "N/A"
                                                    }`}</u>
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
                                                        {`${profile.street}, ${profile.barangay}, ${profile.municipality}, ${profile.province}`}
                                                    </u>
                                                </h5>
                                            </div>{" "}
                                        </div>
                                        <div className="d-flex flex-column gap-4">
                                            <div className="d-flex flex-column gap-1">
                                                <div className="d-flex flex-column gap-1">
                                                    <h6>Birthdate</h6>
                                                    <h5>
                                                        <u>
                                                            {profile.birthdate ||
                                                                "N/A"}
                                                        </u>
                                                    </h5>
                                                </div>
                                                <h6>Born in</h6>
                                                <h5>
                                                    <u>
                                                        {`${
                                                            profile.birth_municipality ||
                                                            "N/A"
                                                        }, ${
                                                            profile.birth_province ||
                                                            "N/A"
                                                        }`}
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
                                <div className="">
                                    <h3>Family Information</h3>
                                    <div className="d-flex  pt-4 justify-content-between">
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
                                                            "N/A"}{" "}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Social Media</h6>
                                                <h5>
                                                    <u>
                                                        {profile.father_social ||
                                                            "N/A"}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Email Address</h6>
                                                <h5>
                                                    <u>
                                                        {profile.father_email ||
                                                            "N/A"}
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
                                                        {profile.mother_social ||
                                                            "N/A"}
                                                    </u>
                                                </h5>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <h6>Email Address</h6>
                                                <h5>
                                                    <u>
                                                        {profile.mother_email ||
                                                            "N/A"}
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
                                                        {profile.guardian_social ||
                                                            "N/A"}
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
                                    <h3>Previous Information</h3>
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
                                                            {
                                                                profile.previous_school_name
                                                            }
                                                        </u>
                                                    </li>
                                                    <li>
                                                        School Address:
                                                        <u>
                                                            {
                                                                profile.previous_school_address
                                                            }
                                                        </u>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
}
