import React, { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClientPrincipal from "../axoisclient/axios-client-principal";
import { ToastContainer, toast } from "react-toastify";
import { Button, Modal, Spinner, Form, Alert } from "react-bootstrap"; // Import Modal from React Bootstrap

export default function PrincipalLogin() {
    const navigate = useNavigate();
    const emailRef = useRef();
    const passwordRef = useRef();

    const { user, principalToken } = useStateContext();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [modalShow, setModalShow] = useState(false); // Modal state
    const [activationErrors, setActivationErrors] = useState(null); // State for activation errors

    if (principalToken) {
        return <Navigate to="/principal/dashboard" />;
    }

    const { setUser, setPrincipalToken } = useStateContext();

    const onSubmit = (ev) => {
        ev.preventDefault();
        setLoading(true);
        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        setErrors(null);
        setActivationErrors(null);

        axiosClientPrincipal
            .post("/employee/principal/login", payload)
            .then(({ data }) => {
                setUser(data.user);
                setPrincipalToken(data.token);
                navigate("/principal/dashboard");
            })
            .catch((err) => {
                const response = err.response;

                if (response.status === 403) {
                    setModalShow(true); // Show modal if the account is not activated
                } else if (response.status === 401 || response.status === 422) {
                    setErrors(
                        response.data.errors || {
                            general: [response.data.message],
                        }
                    );
                } else {
                    toast.error("Invalid Credentials!");
                }
            })
            .finally(() => {
                setLoading(false); // Set loading to false when request finishes
            });
    };

    // Function to handle account activation
    const handleActivation = (ev) => {
        ev.preventDefault();
        const payload = {
            email: emailRef.current.value,
            password: ev.target.password.value,
            password_confirmation: ev.target.password_confirmation.value,
        };

        axiosClientPrincipal
            .post("/activate/employee", payload)
            .then((response) => {
                toast.success(response.data.message);
                setModalShow(false); // Hide modal on success
            })
            .catch((err) => {
                const response = err.response;
                // Check for specific errors related to password confirmation
                if (response && response.status === 422) {
                    setActivationErrors(
                        response.data.errors || {
                            general: [response.data.message],
                        }
                    );
                } else {
                    setActivationErrors({
                        general: ["An error occurred. Please try again."],
                    });
                }
            });
    };

    return (
        <div
            style={{
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "100vh",
                backgroundImage: "url(/img/accessbg.png)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div className="access-container">
                <div>
                    <img src="/img/logo.png" alt="" width={200} />
                    <h2>Principal</h2>
                </div>
                <div>
                    <img
                        src="/img/logo.png"
                        alt=""
                        width={100}
                        className="mob-logo"
                    />
                    <h2 className="mob-h">Principal</h2>
                    <div className="mob-line"></div>
                    <form onSubmit={onSubmit}>
                        <h1>Log in</h1>
                        <div>
                            <label style={errors && { color: "#761212" }}>
                                {errors ? "Email Invalid." : "Email"}
                            </label>
                            <input
                                ref={emailRef}
                                type="text"
                                placeholder="Enter your email"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label style={errors && { color: "#761212" }}>
                                {errors ? "Password Invalid." : "Password"}
                            </label>
                            <input
                                ref={passwordRef}
                                type="password"
                                placeholder="Enter your password"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />{" "}
                                    Logging in...
                                </>
                            ) : (
                                "Log in"
                            )}
                        </button>
                    </form>
                </div>
            </div>
            {/* Modal for Account Activation */}
            <Modal show={modalShow} onHide={() => setModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Activate Your Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleActivation}>
                        <Form.Group controlId="formPassword">
                            <Form.Label
                                style={
                                    activationErrors ? { color: "#761212" } : {}
                                }
                            >
                                {activationErrors
                                    ? "Password reset error."
                                    : "New Password"}
                            </Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Enter a new password"
                                required
                                isInvalid={!!activationErrors}
                            />
                            <Form.Control.Feedback type="invalid">
                                {activationErrors &&
                                    activationErrors.password &&
                                    activationErrors.password.join(", ")}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formPasswordConfirmation">
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password_confirmation"
                                placeholder="Confirm new password"
                                required
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            className="mt-3"
                        >
                            Activate Account
                        </Button>
                        {activationErrors && (
                            <Alert variant="danger" className="mt-3">
                                {activationErrors.general
                                    ? activationErrors.general.join(", ")
                                    : ""}
                            </Alert>
                        )}
                    </Form>
                </Modal.Body>
            </Modal>
            <ToastContainer limit={1} />
        </div>
    );
}
