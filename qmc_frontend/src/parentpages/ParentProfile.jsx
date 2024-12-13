import React, { useRef, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useQuery } from "react-query";
import axiosClientParent from "../axoisclient/axios-client-parent";
import { toast, ToastContainer } from "react-toastify";
import Button from "react-bootstrap/Button";

export default function ParentProfile() {
    const [showPasswordReset, setShowPasswordReset] = useState(false); // Track if password reset fields should show
    const passwordRef = useRef(null);
    const newPasswordRef = useRef(null);
    const [isEditing, setIsEditing] = useState(null); // Track which field is being edited
    const [editedData, setEditedData] = useState({});

    const {
        data: profile = {},
        isLoading,
        isError,
        refetch,
    } = useQuery("pareProfile", async () => {
        const { data } = await axiosClientParent.get("/parent/student/profile");
        return data;
    });

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center pt-4">
                <Spinner animation="border" variant="primary" />
            </div>
        ); // Using Placeholder for loading UI
    }
    const resetPassword = () => {
        const payload = {
            current_password: passwordRef.current.value,
            new_password: newPasswordRef.current.value,
        };

        axiosClientParent
            .put("/parent/reset/profile/password", payload)
            .then(() => {
                toast.success("Password reset successful!"); // Success notification

                setShowPasswordReset(false); // Hide password reset fields after success
            })
            .catch((err) => {
                if (
                    err.response &&
                    err.response.data &&
                    err.response.data.message
                ) {
                    // Display the error message from the response
                    toast.error(err.response.data.message);
                } else {
                    // Display a generic error message if response data is unavailable
                    toast.error("Failed to reset password. Please try again.");
                }
            });
    };

    const renderPasswordReset = () => (
        <>
            {showPasswordReset && (
                <div className="mt-3">
                    <div className="d-flex">
                        <div style={{ width: 250 }}>
                            <h6>Current Password:</h6>
                        </div>
                        <div style={{ width: 300 }}>
                            <input
                                type="password"
                                ref={passwordRef}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="d-flex mt-2">
                        <div style={{ width: 250 }}>
                            <h6>New Password:</h6>
                        </div>
                        <div style={{ width: 300 }}>
                            <input
                                type="password"
                                ref={newPasswordRef}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="d-flex mt-3">
                        <Button variant="primary" onClick={resetPassword}>
                            Save Password
                        </Button>
                        &nbsp;
                        <Button
                            variant="secondary"
                            onClick={() => setShowPasswordReset(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
    return (
        <>
            <div className="p-4">
                <div>
                    <h1>Parent Profile</h1>
                </div>
                <div
                    className="mt-3 p-3 d-flex flex-column gap-3"
                    style={{
                        border: "1px solid black",
                        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                    }}
                >
                    <h5>Father's Profile Information</h5>
                    <div className="d-flex flex-lg-row flex-sm-row flex-md-row flex-column gap-2 gap-lg-0 gap-md-0 gap-sm-0">
                        <div style={{ width: 250 }}>
                            <h6>
                                <b>Name</b>
                            </h6>
                        </div>
                        <div>
                            : &nbsp;&nbsp;&nbsp;&nbsp;
                            {profile?.father_name || "N/A"}
                        </div>
                    </div>
                    <div className="d-flex flex-lg-row flex-sm-row flex-md-row flex-column gap-2 gap-lg-0 gap-md-0 gap-sm-0">
                        <div style={{ width: 250 }}>
                            <h6>
                                <b>Contact Number</b>
                            </h6>
                        </div>
                        <div>
                            : &nbsp;&nbsp;&nbsp;&nbsp;
                            {profile?.father_contact || "N/A"}
                        </div>
                    </div>
                    <div className="d-flex flex-lg-row flex-sm-row flex-md-row flex-column gap-2 gap-lg-0 gap-md-0 gap-sm-0">
                        <div style={{ width: 250 }}>
                            <h6>
                                <b>Social Media</b>
                            </h6>
                        </div>
                        <div>
                            : &nbsp;&nbsp;&nbsp;&nbsp;
                            {profile?.father_social || "N/A"}
                        </div>
                    </div>
                    <h5>Mother's Profile Information</h5>
                    <div className="d-flex flex-lg-row flex-sm-row flex-md-row flex-column gap-2 gap-lg-0 gap-md-0 gap-sm-0">
                        <div style={{ width: 250 }}>
                            <h6>
                                <b>Name</b>
                            </h6>
                        </div>
                        <div>
                            : &nbsp;&nbsp;&nbsp;&nbsp;
                            {profile?.mother_name || "N/A"}
                        </div>
                    </div>
                    <div className="d-flex flex-lg-row flex-sm-row flex-md-row flex-column gap-2 gap-lg-0 gap-md-0 gap-sm-0">
                        <div style={{ width: 250 }}>
                            <h6>
                                <b>Contact Number</b>
                            </h6>
                        </div>
                        <div>
                            : &nbsp;&nbsp;&nbsp;&nbsp;
                            {profile?.mother_contact || "N/A"}
                        </div>
                    </div>
                    <div className="d-flex flex-lg-row flex-sm-row flex-md-row flex-column gap-2 gap-lg-0 gap-md-0 gap-sm-0">
                        <div style={{ width: 250 }}>
                            <h6>
                                <b>Social Media</b>
                            </h6>
                        </div>
                        <div>
                            : &nbsp;&nbsp;&nbsp;&nbsp;
                            {profile?.mother_social || "N/A"}
                        </div>
                    </div>
                    <h5>Guardian's Profile Information</h5>
                    <div className="d-flex flex-lg-row flex-sm-row flex-md-row flex-column gap-2 gap-lg-0 gap-md-0 gap-sm-0">
                        <div style={{ width: 250 }}>
                            <h6>
                                <b>Name</b>
                            </h6>
                        </div>
                        <div>
                            : &nbsp;&nbsp;&nbsp;&nbsp;
                            {profile?.guardian_name || "N/A"}
                        </div>
                    </div>
                    <div className="d-flex flex-lg-row flex-sm-row flex-md-row flex-column gap-2 gap-lg-0 gap-md-0 gap-sm-0">
                        <div style={{ width: 250 }}>
                            <h6>
                                <b>Contact Number</b>
                            </h6>
                        </div>
                        <div>
                            : &nbsp;&nbsp;&nbsp;&nbsp;
                            {profile?.guardian_contact || "N/A"}
                        </div>
                    </div>
                    <div className="d-flex flex-lg-row flex-sm-row flex-md-row flex-column gap-2 gap-lg-0 gap-md-0 gap-sm-0">
                        <div style={{ width: 250 }}>
                            <h6>
                                <b>Social Media</b>
                            </h6>
                        </div>
                        <div>
                            : &nbsp;&nbsp;&nbsp;&nbsp;
                            {profile?.guardian_social || "N/A"}
                        </div>
                    </div>
                    {/* Add the rest of the fields similarly */}
                    <div className="mt-4">
                        {!showPasswordReset && (
                            <Button
                                variant="warning"
                                onClick={() => setShowPasswordReset(true)}
                            >
                                Change Password
                            </Button>
                        )}
                        {renderPasswordReset()}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}
