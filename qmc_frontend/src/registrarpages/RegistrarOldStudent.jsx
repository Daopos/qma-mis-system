import React, { useEffect, useState } from "react";
import "../assets/css/list.css";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import axiosClientRegistrar from "../axoisclient/axios-client-registrar";
import { useNavigate } from "react-router-dom";
import RegistrarEditStudent from "../components/registrar/RegistrarEditStudent";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Confirmation from "../components/Confirmation";
import OldStudentForm from "../components/registrar/OldStudentForm";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Pagination from "react-bootstrap/Pagination";

export default function RegistrarOldStudent() {
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

    const [showEdit, setEdit] = useState(false);
    const [editStudent, setEditStudent] = useState();

    const handleShowEdit = () => setEdit(true);
    const handleCloseEdit = () => setEdit(false);

    const [showConfirm, setShowConfirm] = useState(false);
    const [idConfirm, setIdConfirm] = useState(null);

    const [countByGrade, setCountByGrade] = useState({});

    const getCountByGrade = () => {
        axiosClientRegistrar
            .get("/count/unenrolled/students")
            .then(({ data }) => {
                console.log(data);
                setCountByGrade(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleConfirm = (id) => {
        setIdConfirm(id);
        setShowConfirm(true);
    };

    const handleCloseConfirm = () => {
        setShowConfirm(false);
        setIdConfirm(null);
    };

    const getStudents = () => {
        axiosClientRegistrar.get("/unenrolled/students").then(({ data }) => {
            setStudents(data);
            setFilteredStudents(data);
            console.log(data);
        });
    };

    useEffect(() => {
        getStudents();
        getCountByGrade();
    }, []);

    const handleEditClick = (data) => {
        setEditStudent(data);
        handleShowEdit();
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = students.filter((student) => {
            const middleName = student.student.middlename
                ? student.student.middlename.toLowerCase()
                : "";
            const fullName =
                `${student.student.surname} ${student.student.firstname} ${middleName}`
                    .trim()
                    .toLowerCase();
            const lrn = student.student.lrn.toString().toLowerCase(); // Convert LRN to string for search

            return (
                student.student.surname.toLowerCase().includes(query) ||
                student.student.firstname.toLowerCase().includes(query) ||
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

    const renderTable = (studentsToRender) => {
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
                        {studentsToRender.map((data, index) => {
                            const studentName = `${data.student.surname}, ${
                                data.student.firstname
                            }${
                                data.student.middlename
                                    ? `, ${data.student.middlename.charAt(0)}.`
                                    : ""
                            }${
                                data.student.extension_name
                                    ? ` ${data.student.extension_name}`
                                    : ""
                            }`;

                            return (
                                <OverlayTrigger
                                    key={index + 1}
                                    placement="top"
                                    overlay={
                                        <Tooltip
                                            id={`tooltip-${index + 1}`}
                                            style={{ position: "fixed" }}
                                        >
                                            <img
                                                src={
                                                    data?.student.image_url ||
                                                    "/img/profile.png"
                                                }
                                                alt="Profile"
                                                width={50}
                                            />
                                            <div>
                                                <strong>Full Name:</strong>{" "}
                                                {studentName} <br />
                                                <strong>LRN:</strong>{" "}
                                                {data.student.lrn} <br />
                                                <strong>Gender:</strong>{" "}
                                                {data.student.gender} <br />
                                                <strong>
                                                    Grade Level:
                                                </strong>{" "}
                                                {data.grade_level}
                                            </div>
                                        </Tooltip>
                                    }
                                >
                                    <tr>
                                        <td data-label="No">
                                            {startIndex + index + 1}
                                        </td>
                                        <td data-label="LRN">
                                            {data.student.lrn}
                                        </td>
                                        <td data-label="Name">{studentName}</td>
                                        <td data-label="Grade Level">
                                            {data.grade_level}
                                        </td>
                                        <td data-label="Gender">
                                            {data.student.gender}
                                        </td>
                                        <td data-label="Option">
                                            <button
                                                className="button-list button-orange"
                                                onClick={() =>
                                                    handleEditClick(
                                                        data.student
                                                    )
                                                }
                                            >
                                                Re-enroll
                                            </button>
                                        </td>
                                    </tr>
                                </OverlayTrigger>
                            );
                        })}
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
                        <h2>Old Students</h2>
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
                            {/* <Tab eventKey="grade12" title="Grade 12">
                                {renderTable(
                                    getPaginatedData(studentsByGrade.grade12)
                                )}
                            </Tab> */}
                        </Tabs>
                    </div>
                </div>
            </div>
            {editStudent && (
                <OldStudentForm
                    show={showEdit}
                    onHide={handleCloseEdit}
                    initialValues={editStudent}
                    getStudents={getStudents}
                    getCount={getCountByGrade}
                />
            )}
        </>
    );
}
