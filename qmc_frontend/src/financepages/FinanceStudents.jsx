import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Pagination from "react-bootstrap/Pagination"; // Import Pagination component
import Button from "react-bootstrap/Button"; // Import Pagination component
import axiosClientFinance from "../axoisclient/axios-client-finance";
import Accordion from "react-bootstrap/Accordion";
import PaymentIcon from "@mui/icons-material/Payment";
import Table from "react-bootstrap/Table";
import { useReactToPrint } from "react-to-print";
import FinanceReceipt from "../components/finance/FinanceReceipt";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

export default function FinanceStudents() {
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

    const [isConfirmed, setIsConfirmed] = useState(false);

    const [balanceModal, setBalanceModal] = useState(false);

    const [studentFee, setStudentFee] = useState([]);
    const [payAmounts, setPayAmounts] = useState({});
    const [studentFeeDetails, setStudentFeeDetails] = useState({});

    const [paymentHistory, setPaymentHistory] = useState([]);

    const paymentRef = useRef();
    const descRef = useRef();

    const [payAmount, setPayAmount] = useState("");
    const [description, setDescription] = useState("");

    const [countByGrade, setCountByGrade] = useState({});

    const [loading, setLoading] = useState(false);

    const getCountByGrade = () => {
        axiosClientFinance
            .get("/count/finance/students")
            .then(({ data }) => {
                console.log(data);
                setCountByGrade(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handlePaymentChange = () => {
        setPayAmount(paymentRef.current.value);
        setDescription(descRef.current.value);
    };

    useEffect(() => {
        if (paymentRef.current && descRef.current) {
            setPayAmount(paymentRef.current.value);
            setDescription(descRef.current.value);
        }
    }, [isConfirmed]);

    const handleCloseBalanceModal = () => {
        setBalanceModal(false);
    };

    const showBalanceModal = (id) => {
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
                        setBalanceModal(true);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });

        axiosClientFinance
            .get(`/student/payment/history/${id}`)
            .then(({ data }) => {
                console.log(data);
                setPaymentHistory(data);
            })
            .catch((err) => console.log(err));
    };

    const calculateBalance = () => {
        const totalAmount = studentFee.reduce(
            (acc, fee) => acc + parseFloat(fee.amount),
            0
        );

        return totalAmount;
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

        setLoading(true);

        axiosClientFinance
            .post(`/finance/makepayment`, payload)
            .then(() => {
                handleCloseBalanceModal();
                getStudents();
                printReceipt();
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setLoading(false));
    };

    const getStudents = () => {
        axiosClientFinance.get("/finance/students").then(({ data }) => {
            setStudents(data);
            setFilteredStudents(data);
        });
    };

    useEffect(() => {
        getStudents();
        getCountByGrade();
    }, []);

    const printReceipt = useReactToPrint({
        content: () => receiptRef.current,
    });

    const receiptRef = React.useRef();

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
                                <td>{startIndex + index + 1}</td>
                                <td>{data.lrn}</td>
                                <td>{`${data.surname}, ${data.firstname}`}</td>
                                <td>{data.grade_level}</td>
                                <td>{data.gender}</td>
                                <td>
                                    {/* Render buttons and other elements as before */}
                                    <OverlayTrigger
                                        key="top1"
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id="tooltip-$top"
                                                style={{ position: "fixed" }}
                                            >
                                                View Balance
                                            </Tooltip>
                                        }
                                    >
                                        <button
                                            className="button-list button-blue"
                                            onClick={() =>
                                                showBalanceModal(data.id)
                                            }
                                        >
                                            <PaymentIcon />
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
                        <h2>Students</h2>
                        <div className="mb-3">
                            <DropdownButton
                                id="dropdown-basic-button"
                                title="Report"
                                variant="secondary"
                            >
                                <Dropdown.Item
                                    href="/printstudentwithbalance"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Students with Balance
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

            {studentFee && (
                <Modal
                    show={balanceModal}
                    onHide={handleCloseBalanceModal}
                    size="lg"
                >
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
                                        onChange={handlePaymentChange}
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
                                        onChange={handlePaymentChange}
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
                                                <td
                                                    style={{
                                                        textAlign: "right",
                                                    }}
                                                >
                                                    Total Amount:
                                                </td>
                                                <td>{calculateBalance()}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                        <Accordion defaultActiveKey="1" className="mt-3">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                    View Payment History
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Desc</th>
                                                <th>Amount</th>
                                                <th>Encoder</th>
                                                <th>DateTime</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paymentHistory.map(
                                                (yearData, index) => (
                                                    <React.Fragment key={index}>
                                                        {/* Row for Academic Year */}
                                                        <tr>
                                                            <td
                                                                colSpan={4}
                                                                style={{
                                                                    textAlign:
                                                                        "center",
                                                                    fontWeight:
                                                                        "bold",
                                                                    backgroundColor:
                                                                        "#f2f2f2",
                                                                }}
                                                            >
                                                                {
                                                                    yearData.academic_year
                                                                }
                                                            </td>
                                                        </tr>
                                                        {/* Rows for Payments */}
                                                        {yearData.payments.map(
                                                            (
                                                                payment,
                                                                paymentIndex
                                                            ) => (
                                                                <tr
                                                                    key={
                                                                        paymentIndex
                                                                    }
                                                                >
                                                                    <td>
                                                                        {
                                                                            payment.desc
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            payment.amount
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            payment.encoder
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            payment.created_at
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                        {/* Total Amount Row */}
                                                        <tr>
                                                            <td
                                                                colSpan={1}
                                                                style={{
                                                                    textAlign:
                                                                        "right",
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                            >
                                                                Total Amount
                                                                Paid:
                                                            </td>
                                                            <td colSpan={3}>
                                                                {yearData.payments
                                                                    .reduce(
                                                                        (
                                                                            total,
                                                                            payment
                                                                        ) =>
                                                                            total +
                                                                            Number(
                                                                                payment.amount
                                                                            ),
                                                                        0
                                                                    )
                                                                    .toLocaleString(
                                                                        undefined,
                                                                        {
                                                                            minimumFractionDigits: 2,
                                                                            maximumFractionDigits: 2,
                                                                        }
                                                                    )}
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>
                                                )
                                            )}
                                        </tbody>
                                    </Table>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={handleCloseBalanceModal}
                        >
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                payFee(studentFee[0].student_id); // Assuming all fees belong to the same student
                                setIsConfirmed(true);
                            }}
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
            )}

            {isConfirmed && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <FinanceReceipt
                        ref={receiptRef}
                        studentFee={studentFee}
                        payAmounts={payAmount}
                        desc={description}
                        balance={calculateBalance()}
                    />
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
