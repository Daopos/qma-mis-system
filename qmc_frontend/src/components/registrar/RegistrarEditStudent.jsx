import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import { toast, ToastContainer } from "react-toastify"; // Import toast for notifications
import axiosClientRegistrar from "../../axoisclient/axios-client-registrar";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

export default function RegistrarEditStudent({
    show,
    onHide,
    initialValues,
    getStudents,
}) {
    const [formValues, setFormValues] = useState(initialValues);
    const [toastId, setToastId] = useState(null);

    useEffect(() => {
        setFormValues(initialValues);
    }, [initialValues]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleFileChange = (name, checked) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: checked ? 1 : 0, // Set 1 if checked, else 0
        }));
    };

    const handleSubmit = () => {
        // Create a new FormData object
        const formData = new FormData();
        formData.append("_method", "PUT");

        // Manually append each form value to FormData
        formData.append("lrn", formValues.lrn);
        if (
            formValues.track !== "null" &&
            formValues.track !== null &&
            formValues.track !== undefined
        ) {
            formData.append("track", formValues.track);
        }

        if (
            formValues.strand !== "null" &&
            formValues.strand !== null &&
            formValues.strand !== undefined
        ) {
            formData.append("strand", formValues.strand);
        }
        formData.append("surname", formValues.surname);
        formData.append("firstname", formValues.firstname);
        formData.append("middlename", formValues.middlename || "");
        formData.append("extension_name", formValues.extension_name || "");
        formData.append("street", formValues.street);
        formData.append("barangay", formValues.barangay);
        formData.append("municipality", formValues.municipality);
        formData.append("province", formValues.province);
        formData.append("birthdate", formValues.birthdate);
        formData.append("nationality", formValues.nationality);
        formData.append("birth_municipality", formValues.birth_municipality);
        formData.append("birth_province", formValues.birth_province);
        formData.append("gender", formValues.gender);
        formData.append("religion", formValues.religion);
        formData.append("contact", formValues.contact);
        formData.append("email", formValues.email);
        formData.append("social_media", formValues.social_media);
        formData.append("father_name", formValues.father_name);
        formData.append("father_occupation", formValues.father_occupation);
        formData.append("father_contact", formValues.father_contact);
        formData.append("father_social", formValues.father_social);
        formData.append("mother_name", formValues.mother_name);
        formData.append("mother_occupation", formValues.mother_occupation);
        formData.append("mother_contact", formValues.mother_contact);
        formData.append("mother_social", formValues.mother_social);
        formData.append("guardian_name", formValues.guardian_name);
        formData.append("guardian_occupation", formValues.guardian_occupation);
        formData.append("guardian_contact", formValues.guardian_contact);
        formData.append("guardian_social", formValues.guardian_social);
        formData.append("guardian_email", formValues.guardian_email);
        formData.append("father_email", formValues.father_email);
        formData.append("mother_email", formValues.mother_email);

        formData.append(
            "previous_school_name",
            formValues.previous_school_name
        );
        formData.append(
            "previous_school_address",
            formValues.previous_school_address
        );
        formData.append("grade_level", formValues.grade_level);

        // Append files only if they exist and are of type File
        formData.append(
            "birth_certificate",
            formValues.birth_certificate ? "1" : "0"
        );
        formData.append("report_card", formValues.report_card ? "1" : "0");
        formData.append(
            "transcript_record",
            formValues.transcript_record ? "1" : "0"
        );
        formData.append("good_moral", formValues.good_moral ? "1" : "0");

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        axiosClientRegistrar
            .post(`/students/${formValues.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(() => {
                onHide(); // Close the modal after submission

                getStudents();

                if (toast.isActive(toastId)) {
                    toast.update(toastId, {
                        render: "Edited successfully",
                        type: toast.TYPE.SUCCESS,
                    });
                } else {
                    const id = toast.success("Edited successfully");
                    setToastId(id);
                }
            })
            .catch((err) => {
                console.error("Error response:", err.response);
                const response = err.response;

                if (response && response.status === 422) {
                    const dataError = response.data.errors;

                    const errorMessage = Object.values(dataError)
                        .flatMap((errors) => errors)
                        .join("\n");

                    if (toast.isActive(toastId)) {
                        toast.update(toastId, {
                            render: errorMessage,
                            type: toast.TYPE.ERROR,
                        });
                    } else {
                        const id = toast.error(errorMessage);
                        setToastId(id);
                    }
                } else {
                    console.error("Unexpected error:", err);
                }
            });
    };

    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        EDIT APPLICATION
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: "#f7f7f9" }}>
                    <div className="d-flex flex-wrap justify-content-end pb-3">
                        <div className="d-flex align-items-center gap-3">
                            {/* <Form.Group className="mb-0">
                                <Form.Select
                                    name="grade_level"
                                    value={formValues.grade_level}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Grade</option>
                                    <option value="7">Grade 7</option>
                                    <option value="8">Grade 8</option>
                                    <option value="9">Grade 9</option>
                                    <option value="10">Grade 10</option>
                                    <option value="11">Grade 11</option>
                                    <option value="12">Grade 12</option>
                                </Form.Select>
                            </Form.Group> */}
                            <Button
                                className="button-list button-blue border-0 p-3"
                                onClick={handleSubmit}
                            >
                                Submit Form
                            </Button>
                        </div>
                    </div>
                    <Form>
                        <Tabs
                            defaultActiveKey="home"
                            id="justify-tab-example"
                            className="mb-3"
                            justify
                        >
                            <Tab eventKey="home" title="Student Information">
                                <h3>Enrolling for Grade:</h3>
                                <div className="d-flex flex-wrap gap-5 border p-3 border-2 rounded">
                                    <Form.Group className="mb-0">
                                        <Form.Label>LRN</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ex. 11111"
                                            name="lrn"
                                            value={formValues.lrn}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-0">
                                        <Form.Label>Track</Form.Label>
                                        <Form.Select
                                            name="track"
                                            value={formValues.track}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">None</option>
                                            <option value="Academic">
                                                Academic
                                            </option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-0">
                                        <Form.Label>Strand</Form.Label>
                                        <Form.Select
                                            name="strand"
                                            value={formValues.strand}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">None</option>
                                            <option value="Stem">STEM</option>
                                            <option value="Abm">ABM</option>
                                            <option value="Humss">HUMSS</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <h3 className="mt-4">NAME OF STUDENT:</h3>
                                <div className="d-flex flex-wrap gap-5 border p-3 border-2 rounded">
                                    <Form.Group className="mb-3">
                                        <Form.Label>SURNAME</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ex. Dela Cruz"
                                            name="surname"
                                            value={formValues.surname}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ex. Juan"
                                            name="firstname"
                                            value={formValues.firstname}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Middle Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ex. Ponce"
                                            name="middlename"
                                            value={formValues.middlename || ""}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Extension Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ex. Jr."
                                            name="extension_name"
                                            value={
                                                formValues.extension_name || ""
                                            }
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </div>
                                <h3 className="mt-4">HOME ADDRESS:</h3>
                                <div className="d-flex flex-wrap gap-5 border p-3 border-2 rounded">
                                    <Form.Group className="mb-3">
                                        <Form.Label>No./Street</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ex. No. 15/Burgos Street"
                                            name="street"
                                            value={formValues.street}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Barangay</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ex. Flores"
                                            name="barangay"
                                            value={formValues.barangay}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Municipality</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ex. Umingan"
                                            name="municipality"
                                            value={formValues.municipality}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Province</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ex. Pangasinan"
                                            name="province"
                                            value={formValues.province}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </div>
                                <h3 className="mt-4">BIRTH:</h3>
                                <div className="d-flex flex-wrap gap-5 border p-3 border-2 rounded">
                                    <Form.Group className="mb-3">
                                        <Form.Label>BIRTHDATE</Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder="mm/dd/yyyy"
                                            name="birthdate"
                                            value={formValues.birthdate}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nationality</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ex. Filipino"
                                            name="nationality"
                                            value={formValues.nationality}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Municipality</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ex. Umingan"
                                            name="birth_municipality"
                                            value={
                                                formValues.birth_municipality
                                            }
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Province</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ex. Pangasinan"
                                            name="birth_province"
                                            value={formValues.birth_province}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>GENDER</Form.Label>
                                        <Form.Select
                                            name="gender"
                                            value={formValues.gender}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">
                                                Select Gender
                                            </option>
                                            <option value="male">Male</option>
                                            <option value="female">
                                                Female
                                            </option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>RELIGION</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ex. Catholic"
                                            name="religion"
                                            value={formValues.religion}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </div>
                                <h3 className="mt-4">
                                    Contact Number/s of the Student:
                                </h3>
                                <div className="d-flex flex-wrap gap-5 border p-3 border-2 rounded">
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            Contact Number of the Student
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="contact"
                                            value={formValues.contact}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="email"
                                            value={formValues.email}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            Social Media Account
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="social_media"
                                            value={formValues.social_media}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </div>
                            </Tab>
                            <Tab eventKey="profile" title="Family Background">
                                <h3 className="mt-4">PARENTS FATHER'S NAME:</h3>
                                <div className="d-flex flex-wrap gap-5 border p-3 border-2 rounded">
                                    <Form.Group className="mb-3">
                                        <Form.Label>FATHER'S NAME</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="father_name"
                                            value={formValues.father_name}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>OCCUPATION</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="father_occupation"
                                            value={formValues.father_occupation}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Contact Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="father_contact"
                                            value={formValues.father_contact}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            Social Media Account
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="father_social"
                                            value={formValues.father_social}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="father_email"
                                            value={formValues.father_email}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </div>
                                <h3 className="mt-4">PARENTS MOTHER'S NAME:</h3>
                                <div className="d-flex flex-wrap gap-5 border p-3 border-2 rounded">
                                    <Form.Group className="mb-3">
                                        <Form.Label>MOTHER'S NAME</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="mother_name"
                                            value={formValues.mother_name}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>OCCUPATION</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="mother_occupation"
                                            value={formValues.mother_occupation}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Contact Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="mother_contact"
                                            value={formValues.mother_contact}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            Social Media Account
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="mother_social"
                                            value={formValues.mother_social}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="mother_email"
                                            value={formValues.mother_email}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </div>
                                <h3 className="mt-4">GUARDIAN'S NAME:</h3>
                                <div className="d-flex flex-wrap gap-5 border p-3 border-2 rounded">
                                    <Form.Group className="mb-3">
                                        <Form.Label>GUARDIAN'S NAME</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="guardian_name"
                                            value={formValues.guardian_name}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>OCCUPATION</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="guardian_occupation"
                                            value={
                                                formValues.guardian_occupation
                                            }
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Contact Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="guardian_contact"
                                            value={formValues.guardian_contact}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            Social Media Account
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="guardian_social"
                                            value={formValues.guardian_social}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="guardian_email"
                                            value={formValues.guardian_email}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </div>
                            </Tab>
                            <Tab eventKey="longer-tab" title="Requirements">
                                <h3 className="mt-4">
                                    School Previously Attended:
                                </h3>
                                <div className="d-flex flex-wrap gap-5 border p-3 border-2 rounded">
                                    <Form.Group className="mb-3">
                                        <Form.Label>School Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="previous_school_name"
                                            value={
                                                formValues.previous_school_name
                                            }
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>School Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="previous_school_address"
                                            value={
                                                formValues.previous_school_address
                                            }
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </div>
                                <h3 className="mt-4">
                                    Requirements for Enrollment:
                                </h3>
                                <div className="d-flex flex-wrap gap-4 border p-3 border-2 rounded">
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            label="Birth Certificate (PSA)"
                                            name="birth_certificate"
                                            checked={
                                                formValues.birth_certificate ===
                                                1
                                            } // Check if value is "1"
                                            onChange={(e) =>
                                                handleFileChange(
                                                    e.target.name,
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            label="Report Card"
                                            name="report_card"
                                            checked={
                                                formValues.report_card === 1
                                            } // Check if value is "1"
                                            onChange={(e) =>
                                                handleFileChange(
                                                    e.target.name,
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            label="Transcript of Record"
                                            name="transcript_record"
                                            checked={
                                                formValues.transcript_record ===
                                                1
                                            } // Check if value is "1"
                                            onChange={(e) =>
                                                handleFileChange(
                                                    e.target.name,
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            label="Certificate of Good Moral"
                                            name="good_moral"
                                            checked={
                                                formValues.good_moral === 1
                                            } // Check if value is "1"
                                            onChange={(e) =>
                                                handleFileChange(
                                                    e.target.name,
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    </Form.Group>
                                </div>
                            </Tab>
                        </Tabs>
                    </Form>
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </>
    );
}
