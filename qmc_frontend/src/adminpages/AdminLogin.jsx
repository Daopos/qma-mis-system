import React, { useRef, useState } from "react";
import "../assets/css/access.css";
import { Navigate, useNavigate } from "react-router-dom";
import axiosClientAdmin from "../axoisclient/axios-client-admin";

import { useStateContext } from "../context/ContextProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Spinner } from "react-bootstrap"; // Import React Bootstrap components

export default function AdminLogin() {
    const navigate = useNavigate();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const { user, adminToken } = useStateContext();

    if (adminToken) {
        return <Navigate to="/admin/home" />;
    }

    const { setUser, setAdminToken } = useStateContext();
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state

    const onSubmit = (ev) => {
        ev.preventDefault();
        setLoading(true); // Set loading to true when request starts
        const payload = {
            username: usernameRef.current.value,
            password: passwordRef.current.value,
        };

        setErrors(null);

        axiosClientAdmin
            .post("/admin/login", payload)
            .then(({ data }) => {
                setUser(data.user);
                setAdminToken(data.token);
                navigate("/admin/home");
            })
            .catch((err) => {
                const response = err.response;

                if (
                    (response && response.status === 401) ||
                    (response && response.status === 422)
                ) {
                    if (response.data.errors) {
                        console.log(response.data.errors);
                        setErrors(response.data.errors);
                    } else {
                        setErrors({
                            general: [response.data.message],
                        });
                    }
                } else {
                    toast.error("Invalid Credentials!");
                }
            })
            .finally(() => {
                setLoading(false); // Set loading to false when request finishes
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
                    <h2>Admin</h2>
                </div>
                <div>
                    <form onSubmit={onSubmit}>
                        <h1>Log in</h1>
                        <div>
                            <label style={errors && { color: "#761212" }}>
                                {errors ? "Username Invalid." : "Username"}
                            </label>
                            <input
                                ref={usernameRef}
                                type="text"
                                placeholder="Enter your username"
                                disabled={loading} // Disable input when loading
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
                                disabled={loading} // Disable input when loading
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
            <ToastContainer limit={1} />
        </div>
    );
}
