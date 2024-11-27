import { useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import axiosClientPrincipal from "../../axoisclient/axios-client-principal";
import Table from "react-bootstrap/Table";
import { Col, Container, Row } from "react-bootstrap";

export default function PdfClassSubjects() {
    const location = useLocation();
    const { classId, className, grade } = location.state || {
        classId: "",
        className: "",
        grade: "",
    }; // default to empty if not set
    const pdfRef = useRef();
    const [subjects, setSubjects] = useState([]);
    const [pdfGenerated, setPdfGenerated] = useState(false); // State to track if PDF has been generated

    // Function to fetch student list
    const getSubjectList = () => {
        axiosClientPrincipal
            .get(`/class/subjects/${classId}`)
            .then(({ data }) => {
                setSubjects(data.subjects);
            })
            .catch((error) => {
                console.error("Error fetching subjects:", error);
            });
    };

    // Fetch the student list when component mounts
    useEffect(() => {
        getSubjectList();
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
        if (subjects.length > 0 && !pdfGenerated) {
            generatePDF();
            setPdfGenerated(true); // Mark PDF as generated
        }
    }, [subjects, pdfGenerated]); // Add pdfGenerated to dependency array

    return (
        <div>
            <div ref={pdfRef}>
                <div className="d-flex justify-content-center gap-2 p-4">
                    <img src="/public/img/logo.png" alt="" width={100} />
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <h3>QUEZON MEMORIAL ACADEMY</h3>
                        <h6>Umingan, Pangasinan</h6>
                    </div>
                </div>
                <Container>
                    <Row>
                        <Col className="text-center">
                            <h1>{`Grade ${grade} - ${className}`}</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Title</th>
                                        <th>Schedule</th>
                                        <th>Teacher</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjects.map((subject, index) => (
                                        <tr key={subject.id}>
                                            <td>{index + 1}</td>
                                            <td>{subject.title}</td>
                                            <td>
                                                {`${data.student.surname}, ${
                                                    data.student.firstname
                                                }${
                                                    data.student.middlename
                                                        ? `, ${data.student.middlename.charAt(
                                                              0
                                                          )}.`
                                                        : ""
                                                }${
                                                    data.student.extension_name
                                                        ? ` ${data.student.extension_name}`
                                                        : ""
                                                }`}
                                            </td>
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
