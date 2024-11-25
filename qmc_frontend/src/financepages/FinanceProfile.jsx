import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axiosClientFinance from "../axoisclient/axios-client-finance";
import { useQuery } from "react-query";
import Spinner from "react-bootstrap/Spinner";
import EditIcon from "@mui/icons-material/Edit";

export default function FinanceProfile() {
    const [isEditing, setIsEditing] = useState(null); // Track which field is being edited
    const [editedData, setEditedData] = useState({}); // Track edited data
    const [selectedFile, setSelectedFile] = useState(null); // Track the selected image file
    const [showPasswordReset, setShowPasswordReset] = useState(false); // Track if password reset fields should show
    const passwordRef = useRef(null);
    const newPasswordRef = useRef(null);

    const {
        data: profile = {},
        isLoading,
        isError,
        refetch,
    } = useQuery("financeProfile", async () => {
        const { data } = await axiosClientFinance.get("/employee/profile");
        return data.employee;
    });

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center pt-4">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    const handleEdit = (field) => {
        setIsEditing(field); // Set the field to edit mode
        setEditedData({ ...profile }); // Initialize edited data with current profile values
    };

    const handleCancel = () => {
        setIsEditing(null); // Exit edit mode
        setEditedData({}); // Reset edited data
        setSelectedFile(null); // Reset selected file
    };

    const handleChange = (e, field) => {
        setEditedData({
            ...editedData,
            [field]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]); // Store the selected file
    };

    const handleSave = async () => {
        const formData = new FormData();

        formData.append("_method", "PUT");
        formData.append("email", editedData.email); // Always save the email

        if (selectedFile) {
            formData.append("image", selectedFile); // Append the image file if it's changed
        }

        // Send the data to the server using axios
        await axiosClientFinance
            .post("/employee/update/profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(() => {
                toast.success("Updated Successfully!"); // Success notification
            })
            .catch((err) => {
                // Display a generic error message if response data is unavailable
                toast.error("Failed to change email. Please try again.");
            });

        setIsEditing(null); // Exit edit mode after saving
        refetch(); // Refetch the updated profile
    };

    const resetPassword = () => {
        const payload = {
            current_password: passwordRef.current.value,
            new_password: newPasswordRef.current.value,
        };

        axiosClientFinance
            .put("/employee/reset/password", payload)
            .then((data) => {
                alert("Password reset successful!");
                setShowPasswordReset(false); // Hide password reset fields after success
            });
    };

    const renderField = (field, label, value, editable = false) => (
        <div className="d-flex flex-lg-row flex-sm-row flex-md-row flex-column gap-2 gap-lg-0 gap-md-0 gap-sm-0">
            <div style={{ width: 250 }}>
                <h6>
                    <b>{label}</b>
                </h6>
            </div>
            <div style={{ width: 300 }}>
                {isEditing === field ? (
                    <input
                        type="text"
                        value={editedData[field]}
                        onChange={(e) => handleChange(e, field)}
                        className="form-control"
                    />
                ) : (
                    <>: &nbsp;&nbsp;&nbsp;&nbsp;{value || "N/A"}</>
                )}
            </div>
            {editable && (
                <div>
                    &nbsp;&nbsp;&nbsp;
                    {isEditing === field ? (
                        <>
                            <Button variant="primary" onClick={handleSave}>
                                Save
                            </Button>
                            &nbsp;
                            <Button variant="secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <EditIcon
                            onClick={() => handleEdit(field)}
                            style={{ cursor: "pointer" }}
                        />
                    )}
                </div>
            )}
        </div>
    );

    const renderImage = () => (
        <div className="d-flex flex-lg-row flex-sm-row flex-md-row flex-column gap-2 gap-lg-0 gap-md-0 gap-sm-0">
            <div style={{ width: 250 }}>
                <h6>
                    <b>Profile Image</b>
                </h6>
            </div>
            <div style={{ width: 300 }}>
                {isEditing === "image" ? (
                    <>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="form-control"
                        />
                    </>
                ) : (
                    <>
                        <img
                            src={profile?.image_url || ""}
                            alt="Profile"
                            width={120}
                        />
                    </>
                )}
            </div>
            <div>
                &nbsp;&nbsp;&nbsp;
                {isEditing === "image" ? (
                    <>
                        <Button variant="primary" onClick={handleSave}>
                            Save
                        </Button>
                        &nbsp;
                        <Button variant="secondary" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </>
                ) : (
                    <EditIcon
                        onClick={() => handleEdit("image")}
                        style={{ cursor: "pointer" }}
                    />
                )}
            </div>
        </div>
    );

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
        <div className="p-4">
            <div>
                <h1>Profile</h1>
            </div>
            <div
                className="mt-3 p-3 d-flex flex-column gap-3"
                style={{
                    border: "1px solid black",
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                }}
            >
                {renderImage()}
                {renderField("email", "Email", profile?.email, true)}{" "}
                {/* Email is editable */}
                {renderField("fname", "First Name", profile?.fname)}
                {renderField("mname", "Middle Name", profile?.mname)}
                {renderField("lname", "Last Name", profile?.lname)}
                {renderField("address", "Address", profile?.address)}
                {/* Reset Password Button */}
                <div className="mt-4">
                    {!showPasswordReset && (
                        <Button
                            variant="danger"
                            onClick={() => setShowPasswordReset(true)}
                        >
                            Reset Password
                        </Button>
                    )}
                    {renderPasswordReset()}
                </div>
            </div>
        </div>
    );
}
