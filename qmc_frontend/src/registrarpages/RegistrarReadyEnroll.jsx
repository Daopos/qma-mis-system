import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import axiosClientRegistrar from "../axoisclient/axios-client-registrar";
import Confirmation from "../components/Confirmation";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import randomatic from "randomatic";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import Pagination from "react-bootstrap/Pagination"; // Import Pagination component

export default function RegistrarReadyEnroll() {
    const [students, setStudents] = useState([]);
    const [showConfirm, setConfirm] = useState(false);
    const [StudentId, setStudentId] = useState(null);
    const [password, setPassword] = useState();
    const [showPass, setShowPass] = useState(false);

    const [activeTab, setActiveTab] = useState("grade7");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [studentsPerPage] = useState(1);
    const [pagination, setPagination] = useState({
        grade7: { currentPage: 1, totalPages: 1 },
        grade8: { currentPage: 1, totalPages: 1 },
        grade9: { currentPage: 1, totalPages: 1 },
        grade10: { currentPage: 1, totalPages: 1 },
        grade11: { currentPage: 1, totalPages: 1 },
        grade12: { currentPage: 1, totalPages: 1 },
    });

    const [showConfirmCancel, setShowConfirmCancel] = useState(false);
    const [idConfirm, setIdConfirm] = useState(null);

    const handleClosePass = () => {
        setShowPass(false);
    };

    const handleCloseConfirm = () => {
        setConfirm(false);
    };

    const handleShowConfirm = (id) => {
        setStudentId(id);
        setConfirm(true);
    };

    const handleCloseConfirmCancel = () => {
        setShowConfirmCancel(false);
    };

    const handleShowConfirmCancel = (id) => {
        setIdConfirm(id);
        setShowConfirmCancel(true);
    };

    const getStudents = () => {
        axiosClientRegistrar.get(`/student/confirm/`).then(({ data }) => {
            setStudents(data.students);
            setFilteredStudents(data.students);
        });
    };

    useEffect(() => {
        getStudents();
    }, []);

    const enrollStudent = () => {
        const newPassword = randomatic("A0", 11);

        const payload = {
            password: newPassword,
        };

        axiosClientRegistrar
            .post(`/student/enroll/${StudentId}`, payload)
            .then(() => {
                getStudents();
                setConfirm(false);
                setPassword(newPassword);
                setShowPass(true);
            })
            .catch((err) => {});
    };

    const handleCancel = () => {
        axiosClientRegistrar
            .get(`/student/cancel/${idConfirm}`)
            .then(() => {
                console.log("Success");
                getStudents();
                handleCloseConfirmCancel();
            })
            .catch(() => {
                console.log("fail");
            });
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
                            return (
                                <tr key={index + 1}>
                                    <td>{startIndex + index + 1}</td>
                                    <td>{data.lrn}</td>
                                    <td>{`${data.surname}${
                                        data.extension_name
                                            ? ` ${data.extension_name}`
                                            : ""
                                    }, ${data.firstname}${
                                        data.middlename
                                            ? `, ${data.middlename.charAt(0)}.`
                                            : ""
                                    }`}</td>
                                    <td>{data.grade_level}</td>
                                    <td>{data.gender}</td>
                                    <td>
                                        <button
                                            className="button-list button-green"
                                            onClick={() =>
                                                handleShowConfirm(data.id)
                                            }
                                        >
                                            Approved
                                        </button>
                                        {/* <button className="button-list button-orange">
                                                Edit
                                            </button> */}
                                        <button
                                            className="button-list button-red"
                                            onClick={() =>
                                                handleShowConfirmCancel(data.id)
                                            }
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
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
                        <h2>Students Ready for Enrollment</h2>
                        {/* <button className="button-list button-blue">
                    <AddIcon sx={{ color: "#000000" }} />
                    Add Class
                </button> */}
                    </div>
                    <div>
                        <Tabs
                            activeKey={activeTab}
                            onSelect={(k) => setActiveTab(k)}
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
            <Confirmation
                show={showConfirm}
                onHide={handleCloseConfirm}
                confirm={enrollStudent}
            />

            <Confirmation
                show={showConfirmCancel}
                onHide={handleCloseConfirmCancel}
                confirm={handleCancel}
            />

            <Modal
                centered
                show={showPass}
                onHide={handleClosePass}
                animation={true}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Student Password</Modal.Title>
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
        </>
    );
}
