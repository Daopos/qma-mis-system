import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import axiosClientRegistrar from "../axoisclient/axios-client-registrar";
import { Button, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import ErrorIcon from "@mui/icons-material/Error";
import { Container, Row, Col } from "react-bootstrap";

import {
    regions,
    provinces,
    cities,
    barangays,
} from "select-philippines-address";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

export default function RegistrarNewStudent() {
    const [toastId, setToastId] = useState(null);

    const lrnRef = useRef();
    const trackRef = useRef();
    const strandRef = useRef();
    const surnameRef = useRef();
    const fnameRef = useRef();
    const mnameRef = useRef();
    const suffixRef = useRef();
    const streetRef = useRef();
    const barangayRef = useRef();
    const municipalityRef = useRef();
    const provinceRef = useRef();
    const birthdateRef = useRef();
    const birthNationalityRef = useRef();
    const birthMunicipalityRef = useRef();
    const birthProvinceRef = useRef();
    const genderRef = useRef();
    const religionRef = useRef();
    const contactRef = useRef();
    const emailRef = useRef();
    const socialRef = useRef();
    const fathernameRef = useRef();
    const fatheroccupationRef = useRef();
    const fathercontactRef = useRef();
    const fathersocialRef = useRef();
    const mothernameRef = useRef();
    const motheroccupationRef = useRef();
    const mothersocialRef = useRef();
    const mothercontactRef = useRef();
    const guardiannameRef = useRef();
    const guardianoccupationRef = useRef();
    const guardiancontactRef = useRef();
    const guardiansocialRef = useRef();
    const previousschoolnameRef = useRef();
    const previousschooladdressRef = useRef();
    const birthcertificateRef = useRef();
    const reportcardRef = useRef();
    const transcriptRef = useRef();
    const goodmoralRef = useRef();
    const gradelevelRef = useRef();
    const fatheremailRef = useRef();
    const motheremailRef = useRef();
    const guardianemailRef = useRef();

    const [regionData, setRegion] = useState([]);
    const [provinceData, setProvince] = useState([]);
    const [cityData, setCity] = useState([]);
    const [barangayData, setBarangay] = useState([]);

    const [regionAddr, setRegionAddr] = useState("01"); // Default to region "01"
    const [provinceAddr, setProvinceAddr] = useState("0155");
    const [cityAddr, setCityAddr] = useState("");
    const [barangayAddr, setBarangayAddr] = useState("");

    const [_loading, setLoading] = useState(false);

    const getFileUrl = () => {
        axiosClientRegistrar.get("/download/form").then(({ data }) => {
            setFile(data.file_url); //
        });
    };

    const onChangeRegion = (e) => {
        console.log(
            "region_selected_options",
            e.target.selectedOptions[0].text
        );
        console.log("region_value", e.target.value);
        setRegionAddr(e.target.selectedOptions[0].text);
        provinces(e.target.value).then((response) => {
            setProvince(response);
            setCity([]);
            setBarangay([]);
        });
    };

    const region = () => {
        regions().then((response) => {
            setRegion(response);
        });
    };

    const onChangeProvince = (e) => {
        console.log(
            "province_selected_options",
            e.target.selectedOptions[0].text
        );
        console.log("province_value", e.target.value);
        setProvinceAddr(e.target.selectedOptions[0].text);
        cities(e.target.value).then((response) => {
            setCity(response);
        });
    };

    const onChangeCity = (e) => {
        console.log("city_selected_options", e.target.selectedOptions[0].text);
        console.log("city_value", e.target.value);
        setCityAddr(e.target.selectedOptions[0].text);
        barangays(e.target.value).then((response) => {
            setBarangay(response);
        });
    };

    const onChangeBarangay = (e) => {
        console.log(
            "barangay_selected_options",
            e.target.selectedOptions[0].text
        );
        console.log("barangay_value", e.target.value);
        setBarangayAddr(e.target.selectedOptions[0].text);
    };

    useEffect(() => {
        region();
        getFileUrl();
    }, []);

    const onSubmit = () => {
        setLoading(true);

        const formData = new FormData();

        // Append other form fields
        formData.append("lrn", lrnRef.current.value);
        formData.append("track", trackRef.current.value);
        formData.append("strand", strandRef.current.value);
        formData.append("surname", surnameRef.current.value);
        formData.append("firstname", fnameRef.current.value);
        formData.append("middlename", mnameRef.current.value);
        formData.append("extension_name", suffixRef.current.value);
        formData.append("street", streetRef.current.value);
        formData.append("barangay", barangayAddr);
        formData.append("municipality", cityAddr);
        formData.append("province", provinceAddr);
        formData.append("birthdate", birthdateRef.current.value);
        formData.append("nationality", birthNationalityRef.current.value);
        formData.append(
            "birth_municipality",
            birthMunicipalityRef.current.value
        );
        formData.append("birth_province", birthProvinceRef.current.value);
        formData.append("gender", genderRef.current.value);
        formData.append("religion", religionRef.current.value);
        formData.append("contact", contactRef.current.value);
        formData.append("email", emailRef.current.value);
        formData.append("social_media", socialRef.current.value);
        formData.append("father_name", fathernameRef.current.value);
        formData.append("father_occupation", fatheroccupationRef.current.value);
        formData.append("father_contact", fathercontactRef.current.value);
        formData.append("father_social", fathersocialRef.current.value);
        formData.append("mother_name", mothernameRef.current.value);
        formData.append("mother_occupation", motheroccupationRef.current.value);
        formData.append("mother_contact", mothercontactRef.current.value);
        formData.append("mother_social", mothersocialRef.current.value);
        formData.append("guardian_name", guardiannameRef.current.value);
        formData.append("guardian_email", guardianemailRef.current.value);
        formData.append("father_email", fatheremailRef.current.value);
        formData.append("mother_email", motheremailRef.current.value);

        formData.append(
            "guardian_occupation",
            guardianoccupationRef.current.value
        );
        formData.append("guardian_contact", guardiancontactRef.current.value);
        formData.append("guardian_social", guardiansocialRef.current.value);
        formData.append(
            "previous_school_name",
            previousschoolnameRef.current.value
        );
        formData.append(
            "previous_school_address",
            previousschooladdressRef.current.value
        );

        // Append checkbox values based on if they're checked
        formData.append(
            "birth_certificate",
            birthcertificateRef.current.checked ? 1 : 0
        );
        formData.append("report_card", reportcardRef.current.checked ? 1 : 0);
        formData.append(
            "transcript_record",
            transcriptRef.current.checked ? 1 : 0
        );
        formData.append("good_moral", goodmoralRef.current.checked ? 1 : 0);

        formData.append("enrolment_status", "pre-enrolled");
        formData.append("grade_level", gradelevelRef.current.value);

        // ... (append data to formData)

        // Log each key-value pair
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        axiosClientRegistrar
            .post("/students", formData)
            .then((response) => {
                toast.success("Successfully added");

                // Clear input fields
                lrnRef.current.value = "";
                trackRef.current.value = "";
                strandRef.current.value = "";
                surnameRef.current.value = "";
                fnameRef.current.value = "";
                mnameRef.current.value = "";
                suffixRef.current.value = "";
                streetRef.current.value = "";
                setBarangayAddr("");
                setCityAddr("");
                birthdateRef.current.value = "";
                birthNationalityRef.current.value = "";
                birthMunicipalityRef.current.value = "";
                birthProvinceRef.current.value = "";
                genderRef.current.value = "";
                religionRef.current.value = "";
                contactRef.current.value = "";
                emailRef.current.value = "";
                socialRef.current.value = "";
                fathernameRef.current.value = "";
                fatheroccupationRef.current.value = "";
                fathercontactRef.current.value = "";
                fathersocialRef.current.value = "";
                mothernameRef.current.value = "";
                motheroccupationRef.current.value = "";
                mothercontactRef.current.value = "";
                mothersocialRef.current.value = "";
                guardiannameRef.current.value = "";
                guardianoccupationRef.current.value = "";
                guardiancontactRef.current.value = "";
                guardiansocialRef.current.value = "";
                previousschoolnameRef.current.value = "";
                previousschooladdressRef.current.value = "";

                // Uncheck all checkboxes
                birthcertificateRef.current.checked = false;
                reportcardRef.current.checked = false;
                transcriptRef.current.checked = false;
                goodmoralRef.current.checked = false;
            })
            .catch((err) => {
                const response = err.response;
                if (response) {
                    // Handle validation errors (status 422)
                    if (response.status === 422) {
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
                    }
                    // Handle custom error (like 400 status)
                    else if (response.status === 400) {
                        const errorMessage =
                            response.data.error || "An error occurred";
                        if (toast.isActive(toastId)) {
                            toast.update(toastId, {
                                render: errorMessage,
                                type: toast.TYPE.ERROR,
                            });
                        } else {
                            const id = toast.error(errorMessage);
                            setToastId(id);
                        }
                    }
                }
            })
            .finally(() => setLoading(false));
    };

    const [filePath, setFilePath] = useState(null);
    const [file, setFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const getFIle = () => {
        axiosClientRegistrar.get("/enrollment-form").then((response) => {
            console.log(response.data.file_url);
            setFilePath(response.data.file_url);
        });
    };

    useEffect(() => {
        // Fetch the enrollment form
        getFIle();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axiosClientRegistrar.post(
                "/enrollment-form",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setFilePath(response.data.form.file_url);
            setIsEditing(false); // Exit editing mode
            getFIle();
            alert(response.data.message);
        } catch (error) {
            if (error.response) {
                alert(error.response.data.error || "File upload failed.");
            } else {
                alert("An unexpected error occurred.");
            }
        }
    };

    const handleCancel = () => {
        setFile(null); // Clear the selected file
        setIsEditing(false); // Exit editing mode
    };

    return (
        <>
            <div style={{ padding: "40px 30px" }}>
                {filePath ? (
                    <a
                        href={filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download Enrollment Form
                    </a>
                ) : (
                    <p>No enrollment form available.</p>
                )}

                {!isEditing ? (
                    <IconButton
                        color="primary"
                        onClick={() => setIsEditing(true)}
                    >
                        <EditIcon />
                    </IconButton>
                ) : (
                    <div>
                        <Form.Control
                            width={100}
                            type="file"
                            className="mb-2"
                            onChange={handleFileChange}
                        />
                        <Button
                            variant="success"
                            className="me-2"
                            onClick={handleUpload}
                        >
                            Save
                        </Button>
                        <Button variant="secondary" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </div>
                )}

                <div className="d-flex flex-wrap justify-content-between pb-3">
                    <h1>APPLICATION FOR ENROLLMENT</h1>

                    <div className="d-flex align-items-center gap-3">
                        <Form.Group className="mb-0">
                            <Form.Select ref={gradelevelRef}>
                                <option value="">Select Grade</option>
                                <option value="7">Grade 7</option>
                                <option value="8">Grade 8</option>
                                <option value="9">Grade 9</option>
                                <option value="10">Grade 10</option>
                                <option value="11">Grade 11</option>
                                <option value="12">Grade 12</option>
                            </Form.Select>
                        </Form.Group>
                        <Button
                            className="button-list button-blue border-0 p-3"
                            onClick={onSubmit}
                            disabled={_loading}
                        >
                            {_loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />{" "}
                                    Loading...
                                </>
                            ) : (
                                "Submit Form"
                            )}
                        </Button>
                    </div>
                </div>
                <div className="alert alert-warning" role="alert">
                    <small>
                        Fields marked with an asterisk (*) are required.
                    </small>
                </div>
                <Form>
                    <Tabs
                        defaultActiveKey="home"
                        id="fill-tab-example"
                        className="mb-3"
                        fill
                    >
                        <Tab eventKey="home" title="Personal Information">
                            <h3>Enrolling for Grade:</h3>
                            <div className="d-flex flex-wrap gap-5 border p-3 border-2  rounded">
                                <Form.Group className="mb-0">
                                    <Form.Label>
                                        LRN
                                        {/* <ErrorIcon color="red" /> */}
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        ref={lrnRef}
                                        placeholder="Ex. 123456789101"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-0">
                                    <Form.Label>Track</Form.Label>
                                    <Form.Select ref={trackRef}>
                                        <option value="">None</option>
                                        <option value="Academic">
                                            Academic
                                        </option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-0">
                                    <Form.Label>Strand</Form.Label>
                                    <Form.Select ref={strandRef}>
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
                                        ref={surnameRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex. Juan"
                                        ref={fnameRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Middle Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex. Ponce"
                                        ref={mnameRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Extension Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex. Jr."
                                        ref={suffixRef}
                                    />
                                </Form.Group>
                            </div>
                            <h3 className="mt-4">HOME ADDRESS:</h3>
                            <div className="d-flex flex-wrap gap-5 border p-3 border-2 rounded">
                                <Form.Group className="mb-3">
                                    <Form.Label>Region</Form.Label>
                                    <Form.Select
                                        onChange={onChangeRegion}
                                        onSelect={region}
                                    >
                                        <option>Select Region</option>
                                        {regionData &&
                                            regionData.length > 0 &&
                                            regionData.map((item) => (
                                                <option
                                                    key={item.region_code}
                                                    value={item.region_code}
                                                >
                                                    {item.region_name}
                                                </option>
                                            ))}
                                    </Form.Select>
                                    {/* <Form.Control
                                type="text"
                                placeholder="Ex. Pangasinan"
                                ref={provinceRef}
                            /> */}
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Province</Form.Label>
                                    <Form.Select
                                        ref={provinceRef}
                                        onChange={onChangeProvince}
                                    >
                                        <option>Select Province</option>
                                        {provinceData &&
                                            provinceData.length > 0 &&
                                            provinceData.map((item) => (
                                                <option
                                                    key={item.province_code}
                                                    value={item.province_code}
                                                >
                                                    {item.province_name}
                                                </option>
                                            ))}
                                    </Form.Select>
                                    {/* <Form.Control
                                type="text"
                                placeholder="Ex. Pangasinan"
                                ref={provinceRef}
                            /> */}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Municipality</Form.Label>
                                    <Form.Select
                                        ref={municipalityRef}
                                        onChange={onChangeCity}
                                    >
                                        <option>
                                            Select City / Municipality
                                        </option>
                                        {cityData &&
                                            cityData.length > 0 &&
                                            cityData.map((item) => (
                                                <option
                                                    key={item.city_code}
                                                    value={item.city_code}
                                                >
                                                    {item.city_name}
                                                </option>
                                            ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>barangay</Form.Label>
                                    <Form.Select
                                        ref={barangayRef}
                                        onChange={onChangeBarangay}
                                    >
                                        <option>Select Barangay</option>
                                        {barangayData &&
                                            barangayData.length > 0 &&
                                            barangayData.map((item) => (
                                                <option
                                                    key={item.brgy_code}
                                                    value={item.brgy_code}
                                                >
                                                    {item.brgy_name}
                                                </option>
                                            ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>No./Street</Form.Label>
                                    <Form.Control
                                        type="text"
                                        ref={streetRef}
                                        placeholder="Ex. No. 15/Burgos Street"
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
                                        ref={birthdateRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nationality</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex. Filipino"
                                        ref={birthNationalityRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Municipality</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex. Umingan"
                                        ref={birthMunicipalityRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Province</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex. Pangasinan"
                                        ref={birthProvinceRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>GENDER</Form.Label>
                                    <Form.Select ref={genderRef}>
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>RELIGION</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex. Catholic"
                                        ref={religionRef}
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
                                        placeholder="Ex. 09212347896"
                                        ref={contactRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex. juandelacruz@gmail.com"
                                        ref={emailRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Social Media Account
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex. Juan Dela Cruz"
                                        ref={socialRef}
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
                                        placeholder="Ex. Pedro Dela Cruz"
                                        ref={fathernameRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>OCCUPATION</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex. Farming"
                                        ref={fatheroccupationRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Contact Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex. 09214569876"
                                        ref={fathercontactRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Social Media Account
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex. Pedro Dela Cruz"
                                        ref={fathersocialRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Ex. Pedro Dela Cruz"
                                        ref={fatheremailRef}
                                    />
                                </Form.Group>
                            </div>
                            <h3 className="mt-4">PARENTS MOTHER'S NAME:</h3>
                            <div className="d-flex flex-wrap gap-5 border p-3 border-2 rounded">
                                <Form.Group className="mb-3">
                                    <Form.Label>MOTHER'S NAME</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex.  Susan Dela Cruz"
                                        ref={mothernameRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>OCCUPATION</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex. Housewife"
                                        ref={motheroccupationRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Contact Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex. 09213458765"
                                        ref={mothercontactRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Social Media Account
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex. Susan Dela Cruz"
                                        ref={mothersocialRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Ex. Pedro Dela Cruz"
                                        ref={motheremailRef}
                                    />
                                </Form.Group>
                            </div>
                            <h3 className="mt-4">GUARDIAN'S NAME:</h3>
                            <div className="d-flex flex-wrap gap-5 border p-3 border-2 rounded">
                                <Form.Group className="mb-3">
                                    <Form.Label>GUARDIAN'S NAME</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex.  Susan Dela Cruz"
                                        ref={guardiannameRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>OCCUPATION</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex. Housewife"
                                        ref={guardianoccupationRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Contact Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex. 09213458765"
                                        ref={guardiancontactRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Social Media Account
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex. Susan Dela Cruz"
                                        ref={guardiansocialRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Ex. Pedro Dela Cruz"
                                        ref={guardianemailRef}
                                    />
                                </Form.Group>
                            </div>
                        </Tab>
                        <Tab eventKey="longer-tab" title="Documents">
                            <h3 className="mt-4">
                                School Previously Attended:
                            </h3>
                            <div className="d-flex flex-wrap gap-5 border p-3 border-2 rounded">
                                <Form.Group className="mb-3">
                                    <Form.Label>School Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex. Flores NHS"
                                        ref={previousschoolnameRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>School Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex. Flores, Umingan, Pang."
                                        ref={previousschooladdressRef}
                                    />
                                </Form.Group>
                            </div>
                            <h3 className="mt-4">
                                Requirements for enrolment:
                            </h3>
                            <div className="d-flex flex-wrap gap-4 border p-3 border-2 rounded">
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Birth Certificate (PSA)"
                                        ref={birthcertificateRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Report Card"
                                        ref={reportcardRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Transcript of Record"
                                        ref={transcriptRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Certificate of Good Moral"
                                        ref={goodmoralRef}
                                    />
                                </Form.Group>
                            </div>
                        </Tab>
                    </Tabs>
                </Form>
            </div>
            <ToastContainer limit={1} />
        </>
    );
}
