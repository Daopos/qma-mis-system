import { useEffect, useRef, useState } from "react";

import html2pdf from "html2pdf.js";
import Table from "react-bootstrap/Table";
import axiosClientFinance from "../../axoisclient/axios-client-finance";
export default function PrintWithBalance() {
    const pdfRef = useRef();
    const [studentList, setStudentList] = useState([]);
    const [pdfGenerated, setPdfGenerated] = useState(false); // State to track if PDF has been generated

    const getStudentList = () => {
        axiosClientFinance
            .get(`/student/with/balance`)
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
                <div className="d-flex justify-content-center gap-2 pb-4">
                    <img src="/img/logo.png" alt="" width={100} />
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <h3>QUEZON MEMORIAL ACADEMY</h3>
                        <h6>Umingan, Pangasinan</h6>
                    </div>
                </div>
                <h1 className="report-title">
                    Student Report: Student With Balance
                </h1>
                <Table bordered className="student-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>LRN</th>
                            <th>Name</th>
                            <th>Grade Level</th>
                            <th>Amount</th>
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
                                <td>{data.total_fee}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}
