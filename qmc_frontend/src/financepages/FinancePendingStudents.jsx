import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import axiosClientFinance from "../axoisclient/axios-client-finance";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { useReactToPrint } from "react-to-print";
import FinanceReceipt from "../components/finance/FinanceReceipt";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Accordion from "react-bootstrap/Accordion";
import Pagination from "react-bootstrap/Pagination"; // Import Pagination component

export default function FinancePendingStudents() {
    const [students, setStudents] = useState([]);
    const [studentFee, setStudentFee] = useState([]);
    const [payAmounts, setPayAmounts] = useState({});
    const [show, setShow] = useState(false);
    const [studentsPerPage] = useState(3);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("grade7");
    const [pagination, setPagination] = useState({
        grade7: { currentPage: 1, totalPages: 1 },
        grade8: { currentPage: 1, totalPages: 1 },
        grade9: { currentPage: 1, totalPages: 1 },
        grade10: { currentPage: 1, totalPages: 1 },
        grade11: { currentPage: 1, totalPages: 1 },
        grade12: { currentPage: 1, totalPages: 1 },
    });

    const [studentFeeDetails, setStudentFeeDetails] = useState({});

    const paymentRef = useRef();
    const descRef = useRef();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getStudents = () => {
        axiosClientFinance.get("/student/preenrolled").then(({ data }) => {
            console.log(data.students);
            setStudents(data.students);
            setFilteredStudents(data.students);
        });
    };

    useEffect(() => {
        getStudents();
    }, []);

    const confirmStudent = (id) => {
        axiosClientFinance
            .get(`/student/balance/${id}`)
            .then(({ data }) => {
                setStudentFeeDetails(data);

                axiosClientFinance
                    .get(`/studentfee/${id}`)
                    .then(({ data }) => {
                        setStudentFee(data);
                        const initialPayAmounts = {};
                        data.forEach((fee) => {
                            initialPayAmounts[fee.id] = 0;
                        });
                        setPayAmounts(initialPayAmounts);
                        setIsConfirmed(false);
                        handleShow();
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const test = (id) => {
        axiosClientFinance
            .get(`/student/confirm/${id}`)
            .then(() => {
                getStudents();
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const payFee = (id) => {
        const feesToUpdate = studentFee.map((fee) => ({
            id: fee.id,
            amount: payAmounts[fee.id],
        }));

        const payload = {
            student_id: id,
            payment: paymentRef.current.value,
            desc: descRef.current.value,
            encoder: "finance",
        };

        axiosClientFinance
            .post(`/finance/makepayment`, payload)
            .then(() => {
                handleClose();
                getStudents();
                printReceipt();
                axiosClientFinance
                    .get(`/student/confirm/${id}`)
                    .then(() => {
                        getStudents();
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const calculateBalance = () => {
        const totalAmount = studentFee.reduce(
            (acc, fee) => acc + parseFloat(fee.amount),
            0
        );

        return totalAmount;
    };

    const printReceipt = useReactToPrint({
        content: () => receiptRef.current,
    });

    const receiptRef = React.useRef();

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = students.filter((student) => {
            const fullName =
                `${student.surname} ${student.firstname} ${student.middlename}`.toLowerCase();
            return (
                student.surname.toLowerCase().includes(query) ||
                student.firstname.toLowerCase().includes(query) ||
                student.middlename.toLowerCase().includes(query) ||
                fullName.includes(query)
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
                            <th className="small-column">No</th>
                            <th>LRN</th>
                            <th>Name</th>
                            <th>Sex</th>
                            <th>Grade Level</th>
                            <th>Option</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentsToRender.map((data, index) => (
                            <tr key={index + 1}>
                                <td className="small-column">{index + 1}</td>
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
                                <td>{data.gender}</td>
                                <td>{data.grade_level}</td>
                                <td>
                                    <button
                                        className="button-list button-blue"
                                        onClick={() => confirmStudent(data.id)}
                                    >
                                        Confirm
                                    </button>
                                    <button className="button-list button-red">
                                        Cancel
                                    </button>
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

            {studentFee && (
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Student Fee Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="p-4 border rounded shadow-sm d-flex flex-column gap-2">
                            <h5 className="font-weight-bold">
                                Student LRN:&nbsp;{studentFeeDetails.lrn}
                            </h5>
                            <h5 className="font-weight-bold">
                                Name:&nbsp;
                                {`${studentFeeDetails.surname}, ${
                                    studentFeeDetails.firstname
                                }${
                                    studentFeeDetails.middlename
                                        ? `, ${studentFeeDetails.middlename.charAt(
                                              0
                                          )}.`
                                        : "."
                                }`}
                            </h5>
                            <h5 className="font-weight-bold">
                                Grade Level:&nbsp;
                                {studentFeeDetails.grade_level}
                            </h5>
                            <h5 className="font-weight-bold">
                                Remaining Balance:&nbsp;
                                {studentFeeDetails.total_fee}
                            </h5>

                            <div className="mt-4">
                                <Form.Group
                                    className="mb-3"
                                    controlId="paymentInput"
                                >
                                    <Form.Label>Payment Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter payment amount"
                                        ref={paymentRef}
                                        className="form-control-lg"
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="descriptionInput"
                                >
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter a brief description"
                                        ref={descRef}
                                        className="form-control-lg"
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <Accordion defaultActiveKey="1" className="mt-4">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                    View Breakdown
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentFee.map((fee, index) => (
                                                <tr key={index}>
                                                    <td>{fee.title}</td>
                                                    <td>{fee.amount}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td className="text-end ">
                                                    <b>Total Ammount:</b>
                                                </td>
                                                <td>{calculateBalance()}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                payFee(studentFee[0].student_id); // Assuming all fees belong to the same student
                                setIsConfirmed(true);
                            }}
                        >
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {isConfirmed && studentFee.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center", // Center the button and the receipt
                    }}
                >
                    <FinanceReceipt
                        ref={receiptRef}
                        studentFee={studentFee}
                        payAmounts={paymentRef.current.value}
                        desc={descRef.current.value}
                        balance={calculateBalance()}
                    />
                    {/* Add Reprint Button */}
                    <button
                        onClick={printReceipt}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginBottom: "20px",
                        }}
                    >
                        Reprint Receipt
                    </button>
                </div>
            )}
        </>
    );
}
