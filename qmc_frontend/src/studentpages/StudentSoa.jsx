import React from "react";
import axiosClientStudent from "../axoisclient/axios-client-student";
import { useQuery } from "react-query";
import Spinner from "react-bootstrap/Spinner";
import parentGradeCSS from "../parentpages/ParentGrades.module.css";

export default function StudentSoa() {
    const {
        data: balance,
        isLoading: isBalanceLoadiing,
        error: isBalanceError,
    } = useQuery("studentBalance", async () => {
        const response = await axiosClientStudent.get("/student/own/balance");
        return response.data.total_fee;
    });

    const {
        data: paymentHistory = [],
        isLoading,
        error,
    } = useQuery(["studentSoa"], async () => {
        const response = await axiosClientStudent.get("/student/soa");
        return response.data;
    });

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return <div>Error fetching payment history: {error.message}</div>;
    }

    if (!paymentHistory.length) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        width: "300px",
                        margin: "auto",
                        height: "200px",
                        backgroundColor: "#f9f9f9",
                        color: "#555",
                        textAlign: "center",
                        padding: "20px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <h5 style={{ marginBottom: "10px" }}>
                        No Payment History yet
                    </h5>
                    <p style={{ fontSize: "14px", color: "#888" }}>
                        Please check back later for available Payment History.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={parentGradeCSS.parentGradeContainer}>
            {/* Total Balance Section */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px",
                    marginBottom: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    backgroundColor: "#f1f1f1",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <h5 style={{ margin: 0 }}>Remaining Balance:</h5>
                <h3
                    style={{
                        color: "#d9534f",
                        margin: 0,
                        fontWeight: "bold",
                    }}
                >
                    ₱{balance.toLocaleString()}
                </h3>
            </div>

            {/* Payment History Table */}
            <div>
                <table className={parentGradeCSS.parentTable}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Encoder</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentHistory.map((yearData, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td
                                        colSpan="4"
                                        style={{
                                            textAlign: "center",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Academic Year &nbsp;
                                        {yearData.academic_year}
                                    </td>
                                </tr>
                                {yearData.payments.map(
                                    (payment, paymentIndex) => (
                                        <tr key={paymentIndex}>
                                            <td data-label="Date">
                                                {new Intl.DateTimeFormat(
                                                    "en-US",
                                                    {
                                                        month: "long",
                                                        day: "2-digit",
                                                        year: "numeric",
                                                    }
                                                ).format(
                                                    new Date(payment.created_at)
                                                )}
                                            </td>
                                            <td data-label="Description">
                                                {payment.desc}
                                            </td>
                                            <td data-label="Amount">
                                                ₱
                                                {payment.amount.toLocaleString()}
                                            </td>
                                            <td data-label="Encoder">
                                                {payment.encoder}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
