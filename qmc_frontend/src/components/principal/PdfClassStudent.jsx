import React, { useEffect, useRef, useState, useImperativeHandle } from "react";
import html2pdf from "html2pdf.js";
import axiosClientPrincipal from "../../axoisclient/axios-client-principal";
import Table from "react-bootstrap/Table";
import { Col, Container, Row } from "react-bootstrap";

const PdfClassStudent = (props, ref) => {
    const { classId, className, grade, adviser } = props;
    const pdfRef = useRef();
    const [studentList, setStudentList] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // For loading state
    const [pdfGenerated, setPdfGenerated] = useState(false);

    // Fetch student list
    const getStudentList = async () => {
        setIsLoading(true);
        try {
            const { data } = await axiosClientPrincipal.get(
                `/classlist/class/${classId}`
            );
            setStudentList(data.students || []);
        } catch (error) {
            console.error("Error fetching student list:", error);
            setStudentList([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Reset and fetch students when classId or grade changes
    useEffect(() => {
        if (classId) {
            setStudentList([]); // Clear existing data
            setPdfGenerated(false); // Reset PDF flag
            getStudentList();
        }
    }, [classId, grade]);

    // Generate the PDF
    const generatePDF = () => {
        const element = pdfRef.current;
        html2pdf()
            .from(element)
            .set({
                margin: [5, 0, 32, 0],
            })
            .toPdf()
            .get("pdf")
            .then((pdf) => {
                const blob = pdf.output("blob");
                const url = URL.createObjectURL(blob);

                const iframe = document.createElement("iframe");
                iframe.style.position = "absolute";
                iframe.style.width = "0px";
                iframe.style.height = "0px";
                iframe.style.border = "none";
                iframe.src = url;
                document.body.appendChild(iframe);

                iframe.contentWindow.print();
                window.close();
            });
    };

    // Trigger PDF generation only when student list is ready
    useEffect(() => {
        if (studentList.length > 0 && !pdfGenerated) {
            generatePDF();
            setPdfGenerated(true);
        }
    }, [studentList, pdfGenerated]);

    // Expose the resetAndPrint method
    useImperativeHandle(ref, () => ({
        resetAndPrint: () => {
            setStudentList([]); // Clear current students
            setPdfGenerated(false); // Reset PDF generation
            getStudentList(); // Fetch new data
        },
    }));

    if (isLoading) {
        return <div>Loading...</div>; // Show loading state
    }

    return (
        <div>
            <div ref={pdfRef}>
                <div className="d-flex justify-content-center gap-2 p-4">
                    <img src="/img/logo.png" alt="" width={100} />
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <h3>QUEZON MEMORIAL ACADEMY</h3>
                        <h6>Umingan, Pangasinan</h6>
                    </div>
                </div>
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
                                    {studentList.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="text-center"
                                            >
                                                No Students Available
                                            </td>
                                        </tr>
                                    ) : (
                                        studentList.map((data, index) => (
                                            <tr key={data.student.id}>
                                                <td>{index + 1}</td>
                                                <td>{data.student.lrn}</td>
                                                <td>{`${
                                                    data.student.surname
                                                }, ${data.student.firstname}${
                                                    data.student.middlename
                                                        ? `, ${data.student.middlename.charAt(
                                                              0
                                                          )}.`
                                                        : ""
                                                }${
                                                    data.student.extension_name
                                                        ? ` ${data.student.extension_name}`
                                                        : ""
                                                }`}</td>
                                                <td>{data.student.gender}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default React.forwardRef(PdfClassStudent);
