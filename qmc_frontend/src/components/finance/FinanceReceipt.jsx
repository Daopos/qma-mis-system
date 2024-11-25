import React from "react";
import { useReactToPrint } from "react-to-print";
import Table from "react-bootstrap/Table";

const FinanceReceipt = React.forwardRef(({ payAmounts, desc }, ref) => {
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
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: "#fff",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
                Official Receipt
            </h2>
            <h5 style={{ textAlign: "center", marginBottom: "5px" }}>
                Date: {formattedDate}
            </h5>
            <h5 style={{ textAlign: "center", marginBottom: "20px" }}>
                Time: {formattedTime}
            </h5>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: "0" }}>{desc}</h3>
                <h4 style={{ margin: "0", color: "#28a745" }}>
                    ₱{payAmounts.toLocaleString("en-PH")}{" "}
                    {/* Format amount with peso sign */}
                </h4>
            </div>

            <Table
                striped
                bordered
                hover
                style={{ marginTop: "20px", fontSize: "14px" }}
            >
                <thead>
                    <tr>
                        <th style={{ textAlign: "left" }}>Description</th>
                        <th style={{ textAlign: "right" }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{desc}</td> {/* Description of the payment */}
                        <td style={{ textAlign: "right" }}>
                            ₱{payAmounts.toLocaleString("en-PH")}
                        </td>{" "}
                        {/* Payment amount */}
                    </tr>
                </tbody>
            </Table>

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
        </div>
    );
});

export default FinanceReceipt;
