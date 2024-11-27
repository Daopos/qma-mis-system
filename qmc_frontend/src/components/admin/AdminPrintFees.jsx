import React from "react";
import Table from "react-bootstrap/Table";

const AdminPrintFees = React.forwardRef(({ fees, gradeType }, ref) => {
    // Calculate the total amount of fees
    const totalAmount = fees.reduce((total, fee) => total + fee.amount, 0);

    return (
        <div
            ref={ref}
            style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}
        >
            <div className="d-flex justify-content-center gap-2">
                <img src="/img/logo.png" alt="" width={100} />
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <h3>QUEZON MEMORIAL ACADEMY</h3>
                    <h6>Umingan, Pangasinan</h6>
                </div>
            </div>
            <h2 style={{ textAlign: "center", marginTop: 20 }}>
                Fee Breakdown for Grade {gradeType}
            </h2>
            <Table bordered style={{ marginTop: "20px" }}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {fees.map((fee, index) => (
                        <tr key={index}>
                            <td>{fee.title}</td>
                            <td>{fee.amount.toFixed(2)} PHP</td>{" "}
                            {/* Format amount with two decimal places */}
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td style={{ fontWeight: "bold" }}>Total:</td>
                        <td style={{ fontWeight: "bold" }}>
                            {totalAmount.toFixed(2)} PHP
                        </td>
                    </tr>
                </tfoot>
            </Table>
        </div>
    );
});

export default AdminPrintFees;
