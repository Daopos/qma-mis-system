import { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import axiosClientRegistrar from "../../axoisclient/axios-client-registrar";
import Table from "react-bootstrap/Table";
import "./printable.css"; // Import a CSS file for custom styles

export default function PrintNoGoodMoral() {
    const pdfRef = useRef();
    const [studentList, setStudentList] = useState([]);
    const [pdfGenerated, setPdfGenerated] = useState(false); // State to track if PDF has been generated

    const getStudentList = () => {
        axiosClientRegistrar
            .get(`/student/without-good-moral`)
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

    useEffect(() => {
        getStudentList();
    }, []);

    const generatePDF = () => {
        const element = pdfRef.current;

        html2pdf()
            .from(element)
            .toPdf()
            .get("pdf")
            .then((pdf) => {
                const blob = pdf.output("blob");
                const url = URL.createObjectURL(blob);
                console.log("Generated PDF Blob URL:", url);

                // Attempt to open the PDF in a new tab
                const newTab = window.open(url);
                if (!newTab) {
                    // Fallback to download if new tab fails to open
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "student_report.pdf";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }

                // Close the current page
                window.close();
            });
    };

    useEffect(() => {
        if (studentList.length > 0 && !pdfGenerated) {
            generatePDF();
            setPdfGenerated(true); // Mark PDF as generated
        }
    }, [studentList, pdfGenerated]);

    return (
        <div>
            <div ref={pdfRef} className="pdf-container">
                <h1 className="report-title">Student Report: No Good Moral</h1>
                <Table striped bordered hover className="student-table">
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
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}
