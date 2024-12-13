import React, { useEffect, useRef, useState, useImperativeHandle } from "react";
import html2pdf from "html2pdf.js";
import axiosClientRegistrar from "../../axoisclient/axios-client-registrar";
import Table from "react-bootstrap/Table";
import "./printable.css"; // Import a CSS file for custom styles

const PrintNoTranscript = (props, ref) => {
    const pdfRef = useRef();
    const [studentList, setStudentList] = useState([]);
    const [pdfGenerated, setPdfGenerated] = useState(false); // State to track if PDF has been generated

    const getStudentList = () => {
        axiosClientRegistrar
            .get(`/student/without-transcript-record`)
            .then(({ data }) => {
                setStudentList(data);
                // Check if there are no students and close the page
                if (data.length === 0) {
                    window.close();
                }
            })
            .catch((error) => {
                console.error("Error fetching student list:", error);
            });
    };

    const generatePDF = () => {
        const element = pdfRef.current;

        html2pdf()
            .from(element)
            .set({
                margin: [5, 0, 32, 0], // top, left, bottom, right margins
            })
            .toPdf()
            .get("pdf")
            .then((pdf) => {
                const blob = pdf.output("blob");
                const url = URL.createObjectURL(blob);

                // Open the print dialog directly
                const iframe = document.createElement("iframe");
                iframe.style.position = "absolute";
                iframe.style.width = "0px";
                iframe.style.height = "0px";
                iframe.style.border = "none";
                iframe.src = url;
                document.body.appendChild(iframe);

                // Trigger the print dialog
                iframe.contentWindow.print();

                // Close the current page
                window.close();
            });
    };

    useEffect(() => {
        getStudentList();
    }, []);

    useEffect(() => {
        if (studentList.length > 0 && !pdfGenerated) {
            generatePDF();
            setPdfGenerated(true); // Mark PDF as generated
        }
    }, [studentList, pdfGenerated]);

    // Expose the reset and print method to the parent component
    useImperativeHandle(ref, () => ({
        resetAndPrint: () => {
            setPdfGenerated(false); // Reset the state before generating the PDF again
            getStudentList(); // Re-fetch the student list to trigger PDF generation
        },
    }));

    return (
        <div>
            <div ref={pdfRef} className="pdf-container">
                <div className="d-flex justify-content-center gap-2 pb-4">
                    <img src="/img/logo.png" alt="" width={100} />
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <h3>QUEZON MEMORIAL ACADEMY</h3>
                        <h6>Umingan, Pangasinan</h6>
                    </div>
                </div>
                <h1 className="report-title">
                    Student Report: No Transcript of Record
                </h1>
                <Table bordered className="student-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>LRN</th>
                            <th>Name</th>
                            <th>Grade Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentList.map((data, index) => (
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
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default React.forwardRef(PrintNoTranscript);
