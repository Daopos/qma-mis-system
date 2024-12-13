import React, { useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import axiosClientAll from "../axoisclient/axios-client-all";
import { useNavigate } from "react-router-dom";

export default function StudentResetForm() {
    const [step, setStep] = useState(1); // Step 1: Request Code, Step 2: Reset Password
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Handle sending reset code to email
    const handleSendCode = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await axiosClientAll.post("/resetcode/student", {
                email,
            });
            setMessage(response.data.message || "Code sent to email!");
            setStep(2); // Move to next step
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to send code.");
        }

        setLoading(false);
    };

    // Handle resetting the password
    const handleResetPassword = async (e) => {
        e.preventDefault();

        setLoading(true);

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }
        try {
            const response = await axiosClientAll.post("/resetpass/student", {
                email,
                code,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            });
            setMessage(response.data.message || "Password reset successfully!");

            setCode("");
            setEmail("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Failed to reset password."
            );
        }

        setLoading(false);
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
        >
            <div
                style={{
                    maxWidth: "400px",
                    padding: "20px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                }}
            >
                <h2 style={{ textAlign: "center" }}>
                    {step === 1 ? "Request Reset Code" : "Reset Password"}
                </h2>
                {message && (
                    <p style={{ color: "red", textAlign: "center" }}>
                        {message}
                    </p>
                )}

                {step === 1 && (
                    <form onSubmit={handleSendCode}>
                        <div style={{ marginBottom: "15px" }}>
                            <label
                                htmlFor="email"
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                }}
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                }}
                                autoComplete="off"
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                width: "100%",
                                padding: "10px",
                                backgroundColor: "#007BFF",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">
                                        Loading...
                                    </span>
                                </Spinner>
                            ) : (
                                "Send Reset Code"
                            )}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword}>
                        <div style={{ marginBottom: "15px" }}>
                            <label
                                htmlFor="code"
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                }}
                            >
                                Reset Code
                            </label>
                            <input
                                type="text"
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                autoComplete="off"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: "15px" }}>
                            <label
                                htmlFor="newPassword"
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                }}
                            >
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                autoComplete="off"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: "15px" }}>
                            <label
                                htmlFor="confirmPassword"
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                }}
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="newPasswordConfirmation"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                                autoComplete="off"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                width: "100%",
                                padding: "10px",
                                backgroundColor: "#28a745",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">
                                        Loading...
                                    </span>
                                </Spinner>
                            ) : (
                                "Reset Password"
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
