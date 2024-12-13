import React, { useEffect, useRef, useState, useImperativeHandle } from "react";
import html2pdf from "html2pdf.js";
import axiosClientPrincipal from "../../axoisclient/axios-client-principal";
import Table from "react-bootstrap/Table";
import { Col, Container, Row } from "react-bootstrap";

const PdfClassSubjects = (props, ref) => {
    const { classId, className, grade } = props;
    const pdfRef = useRef();
    const [subjects, setSubjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // For loading state
    const [pdfGenerated, setPdfGenerated] = useState(false);

    // Fetch subject list
    const getSubjectList = async () => {
        setIsLoading(true);
        try {
            const { data } = await axiosClientPrincipal.get(
                `/class/subjects/${classId}`
            );
            setSubjects(data.subjects || []);
        } catch (error) {
            console.error("Error fetching subjects:", error);
            setSubjects([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Reset and fetch subjects when classId or grade changes
    useEffect(() => {
        if (classId) {
            setSubjects([]); // Clear existing data
            setPdfGenerated(false); // Reset PDF flag
            getSubjectList();
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

    // Trigger PDF generation only when subjects are ready
    useEffect(() => {
        if (subjects.length > 0 && !pdfGenerated) {
            generatePDF();
            setPdfGenerated(true);
        }
    }, [subjects, pdfGenerated]);

    // Expose the resetAndPrint method
    useImperativeHandle(ref, () => ({
        resetAndPrint: () => {
            setSubjects([]); // Clear current subjects
            setPdfGenerated(false); // Reset PDF generation
            getSubjectList(); // Fetch new data
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
                                    {subjects.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="text-center"
                                            >
                                                No Subjects Available
                                            </td>
                                        </tr>
                                    ) : (
                                        subjects.map((subject, index) => (
                                            <tr key={subject.id}>
                                                <td>{index + 1}</td>
                                                <td>{subject.title}</td>
                                                <td>
                                                    {subject.schedules &&
                                                    subject.schedules.length >
                                                        0 ? (
                                                        subject.schedules.map(
                                                            (schedule) => (
                                                                <div
                                                                    key={
                                                                        schedule.id
                                                                    }
                                                                >
                                                                    {
                                                                        schedule.day
                                                                    }{" "}
                                                                    -{" "}
                                                                    {
                                                                        schedule.start
                                                                    }{" "}
                                                                    to{" "}
                                                                    {
                                                                        schedule.end
                                                                    }
                                                                </div>
                                                            )
                                                        )
                                                    ) : (
                                                        <div>No Schedules</div>
                                                    )}
                                                </td>
                                                <td>
                                                    {`${
                                                        subject.teacher_lname ||
                                                        ""
                                                    }, ${
                                                        subject.teacher_fname ||
                                                        ""
                                                    }, ${
                                                        subject.teacher_mname
                                                            ? subject.teacher_mname.charAt(
                                                                  0
                                                              )
                                                            : ""
                                                    }`}
                                                </td>
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

export default React.forwardRef(PdfClassSubjects);
