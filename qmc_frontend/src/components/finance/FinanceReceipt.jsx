import React from "react";
import { useReactToPrint } from "react-to-print";
import Table from "react-bootstrap/Table";

const FinanceReceipt = React.forwardRef(
    (
        { payAmounts, desc, financeName, studentName, transactionNumber },
        ref
    ) => {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString("en-PH"); // Philippine date format
        const formattedTime = currentDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        }); // Get the current time

        return (
            <div
                ref={ref}
                style={{
                    padding: "20px",
                    maxWidth: "400px",
                    margin: "0 auto",
                    backgroundColor: "#fff",
                    fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                }}
            >
                <div className="d-flex justify-content-center gap-2 pb-4">
                    <img src="/img/logo.png" alt="" width={100} />
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <h6>QUEZON MEMORIAL ACADEMY</h6>
                        <h6>Umingan, Pangasinan</h6>
                    </div>
                </div>
                <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
                    Official Receipt
                </h2>
                <h5 style={{ textAlign: "center", marginBottom: "5px" }}>
                    Date: {formattedDate}
                </h5>
                <h5 style={{ textAlign: "center", marginBottom: "20px" }}>
                    Time: {formattedTime}
                </h5>

                {/* Payment Description and Amount */}
                {/* <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <h3 style={{ margin: "0" }}>{desc}</h3>
                    <h4 style={{ margin: "0", color: "#28a745" }}>
                        ₱{payAmounts.toLocaleString("en-PH")}{" "}
                    </h4>
                </div> */}

                {/* Payment Details Table */}
                <Table
                    striped
                    bordered
                    hover
                    style={{ marginTop: "20px", fontSize: "14px" }}
                >
                    <thead>
                        <tr>
                            <th style={{ textAlign: "left" }}>Description</th>
                            <th style={{ textAlign: "left" }}>Amount</th>
                            <th style={{ textAlign: "left" }}>Tr. No.</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{desc}</td> {/* Description of the payment */}
                            <td style={{ textAlign: "left" }}>
                                ₱{payAmounts.toLocaleString("en-PH")}
                            </td>
                            <td style={{ textAlign: "left" }}>
                                {transactionNumber}
                            </td>
                            {/* Payment amount */}
                        </tr>
                    </tbody>
                </Table>

                {/* Total Amount */}
                <div
                    style={{
                        textAlign: "right",
                        marginTop: "20px",
                        fontWeight: "bold",
                        fontSize: "16px",
                    }}
                >
                    Total Amount: ₱{payAmounts.toLocaleString("en-PH")}
                </div>
                <div className="d-flex flex-column justify-content-end align-items-end">
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <div
                            style={{
                                textAlign: "right",
                                marginTop: "5px",
                                fontWeight: "bold",
                                fontSize: "16px",
                                textDecoration: "underline",
                            }}
                        >
                            {financeName}
                        </div>
                        <div
                            style={{
                                textAlign: "right",
                                fontSize: "16px",
                            }}
                        >
                            Encoder:
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column justify-content-start  align-items-start ">
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <div
                            style={{
                                textAlign: "right",
                                marginTop: "5px",
                                fontWeight: "bold",
                                fontSize: "16px",
                                textDecoration: "underline",
                            }}
                        >
                            {studentName}
                        </div>
                        <div
                            style={{
                                textAlign: "right",
                                fontSize: "16px",
                            }}
                        >
                            Student:
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

export default FinanceReceipt;
