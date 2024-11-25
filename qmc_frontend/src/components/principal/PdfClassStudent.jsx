import { useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import axiosClientPrincipal from "../../axoisclient/axios-client-principal";
import Table from "react-bootstrap/Table";
import { Container, Row, Col } from "react-bootstrap";

export default function PdfClassStudent() {
    const location = useLocation();
    const { classId, className, grade, adviser } = location.state || {
        classId: "",
        className: "",
        grade: "",
        adviser: "",
    }; // default to empty if not set
    const pdfRef = useRef();
    const [studentList, setStudentList] = useState([]);
    const [pdfGenerated, setPdfGenerated] = useState(false); // State to track if PDF has been generated

    // Function to fetch student list
    const getStudentList = () => {
        axiosClientPrincipal
            .get(`/classlist/class/${classId}`)
            .then(({ data }) => {
                setStudentList(data.students);
            })
            .catch((error) => {
                console.error("Error fetching student list:", error);
            });
    };

    // Fetch the student list when component mounts
    useEffect(() => {
        getStudentList();
    }, [classId]);

    // Function to generate the PDF
    const generatePDF = () => {
        const element = pdfRef.current;

        // Generate the PDF as a blob
        html2pdf()
            .from(element)
            .toPdf()
            .get("pdf")
            .then((pdf) => {
                // Create a blob URL
                const blob = pdf.output("blob");
                const url = URL.createObjectURL(blob);

                // Open the PDF in a new tab
                window.open(url);
            });
    };

    // Generate PDF once the student list is loaded and not already generated
    useEffect(() => {
        if (studentList.length > 0 && !pdfGenerated) {
            generatePDF();
            setPdfGenerated(true); // Mark PDF as generated
        }
    }, [studentList, pdfGenerated]); // Add pdfGenerated to dependency array

    return (
        <div>
            <div ref={pdfRef}>
                <Container>
                    <Row>
                        <Col className="text-center">
                            <h1>{`Grade ${grade} - ${className}`}</h1>
                            <h3>{`Adviser: ${adviser || "Not Assigned"}`}</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>LRN</th>
                                        <th>Name</th>
                                        <th>Sex</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentList.map((data, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{data.student.lrn}</td>
                                            <td>{`${data.student.surname}${
                                                data.student.extension_name
                                                    ? ` ${data.student.extension_name}`
                                                    : ""
                                            }, ${data.student.firstname}${
                                                data.student.middlename
                                                    ? `, ${data.student.middlename.charAt(
                                                          0
                                                      )}.`
                                                    : ""
                                            }`}</td>
                                            <td>{data.student.gender}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}
