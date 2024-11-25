import React, { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axiosClientPrincipal from "../axoisclient/axios-client-principal";
import Spinner from "react-bootstrap/Spinner";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import PrincipalClassView from "../components/principal/PrincipalClassView";
import PrincipalSubjectView from "../components/principal/PrincipalSubjectView";
import { useNavigate } from "react-router-dom";

import PrintIcon from "@mui/icons-material/Print";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GroupsIcon from "@mui/icons-material/Groups";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { toast, ToastContainer } from "react-toastify";
import "./PrincipalCss.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ConfirmationLoad from "../components/Confirmationload";

export default function PrinciaplClassroomList() {
    const [showNewClass, setNewClass] = useState(false);
    const [showEditClass, setEditClass] = useState(false);
    const [editId, setEditId] = useState();
    const [teachers, setTeachers] = useState([]);

    const [classrooms, setClassrooms] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredClass, setFilteredClass] = useState([]);
    const [activeTab, setActiveTab] = useState("grade7");

    const [showView, setShowView] = useState(false);

    const [gradeLevel, setGradeLevel] = useState();
    const [classId, setClassId] = useState("");

    const [showSubject, setShowSubject] = useState(false);

    const [className, setClassName] = useState("");

    const [confirm, setConfirm] = useState(false);

    const [countStudents, setCountStudents] = useState("");

    const [formLoading, setFormLoading] = useState(false);

    const handleCloseConfirm = () => {
        setConfirm(false);
        setClassId("");
    };

    const navigate = useNavigate();

    const handleCloseView = () => {
        setShowView(false);
        setClassId(null);
    };

    const handleCloseNewClass = () => {
        setNewClass(false);
    };

    const handleCloseEditClass = () => {
        setEditClass(false);
    };

    const handleCloseSubject = () => {
        setShowSubject(false);
    };

    const titleRef = useRef();
    const gradeRef = useRef();
    const adviserRef = useRef();

    const getTeachers = () => {
        axiosClientPrincipal
            .get("/all/teacher")
            .then(({ data }) => {
                setTeachers(data.teachers);
                setClassId("");
            })
            .catch((error) => {
                console.error("Error fetching teachers:", error);
            });
    };

    const getClassrooms = () => {
        axiosClientPrincipal
            .get("/classrooms")
            .then(({ data }) => {
                setClassrooms(data.classrooms);
                setFilteredClass(data.classrooms);
            })
            .catch((error) => {
                console.error("Error fetching classroons:", error);
            });
    };

    const getStudentsNoClass = () => {
        axiosClientPrincipal
            .get("/student/no/classroom")
            .then(({ data }) => {
                setCountStudents(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getTeachers();
        getClassrooms();
        getStudentsNoClass();
    }, []);

    const addClassroom = () => {
        const payload = {
            title: titleRef.current.value,
            grade_level: gradeRef.current.value,
            adviser_id: adviserRef.current.value,
        };

        setFormLoading(true);

        axiosClientPrincipal
            .post("/classrooms", payload)
            .then(() => {
                handleCloseNewClass();
                toast.success("Classroom added successfully!"); // Success notification
                getClassrooms();
            })
            .catch((err) => {
                toast.error(
                    "Please complete the title and grade level fields."
                ); // Error notification
            })
            .finally(() => setFormLoading(false));
    };

    const deleteClass = () => {
        setFormLoading(true);

        axiosClientPrincipal
            .delete(`/classrooms/${classId}`)
            .then(() => {
                handleCloseConfirm();
                toast.success("Classroom deleted successfully!"); // Success notification
                getClassrooms();
            })
            .catch((error) => {
                console.error("Error deleting classroom:", error);
                toast.error(
                    "Failed to delete classroom. It may have associated subjects or students."
                ); // Error notification
            })
            .finally(() => setFormLoading(false));
    };

    const editClassroom = () => {
        const formData = new FormData();

        formData.append("_method", "PUT");
        if (titleRef.current.value) {
            formData.append("title", titleRef.current.value);
        }
        // if (gradeRef.current.value) {
        //     formData.append("grade_level", gradeRef.current.value);
        // }
        if (adviserRef.current.value) {
            formData.append("adviser_id", adviserRef.current.value);
        }
        setFormLoading(true);

        axiosClientPrincipal
            .post(`/classrooms/${editId}`, formData)
            .then(() => {
                getClassrooms();
                handleCloseEditClass();
                toast.success("Classroom updated successfully!"); // Success notification
            })
            .catch((err) => {
                toast.success("Error"); // Success notification
                console.log("fail");
            })
            .finally(() => setFormLoading(false));
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = classrooms.filter((classroom) => {
            return classroom.title.toLowerCase().includes(query);
            // classroom.adviser.toLowerCase().includes(query)
        });
        setFilteredClass(filtered);
        if (filtered.length > 0) {
            const gradeLevel = filtered[0].grade_level.toString();
            setActiveTab(`grade${gradeLevel}`);
        }
    };

    const renderTable = (classroomsToRender) => (
        <table className="list-table">
            <thead>
                <tr>
                    <th className="small-column">No</th>
                    <th>Class Name</th>
                    <th>Class Level</th>
                    <th>Adviser</th>
                    <th>Total</th>
                    <th>Option</th>
                </tr>
            </thead>
            <tbody>
                {classroomsToRender.map((data, index) => (
                    <tr key={index}>
                        <td data-label="No">{index + 1}</td>
                        <td data-label="Class Name">{data.title}</td>
                        <td data-label="Class Level">
                            Grade {data.grade_level}
                        </td>
                        <td data-label="Adviser">
                            {data.fname
                                ? `${data.lname}, ${data.fname} ${
                                      data.mname
                                          ? data.mname.charAt(0) + "."
                                          : ""
                                  }`
                                : "N/A"}
                        </td>
                        <td data-label="Total">{data.student_count}</td>
                        <td data-label="Option">
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip className="custom-tooltip">
                                        Edit Classroom
                                    </Tooltip>
                                }
                            >
                                <button
                                    className="button-list button-orange"
                                    onClick={() => {
                                        setEditId(data.id);
                                        setEditClass(true);
                                    }}
                                >
                                    <EditIcon />
                                </button>
                            </OverlayTrigger>

                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip className="custom-tooltip">
                                        Delete Classroom
                                    </Tooltip>
                                }
                            >
                                <button
                                    className="button-list button-red"
                                    onClick={() => {
                                        setClassId(data.id);
                                        setConfirm(true);
                                    }}
                                >
                                    <DeleteIcon />
                                </button>
                            </OverlayTrigger>

                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip className="custom-tooltip">
                                        View Students
                                    </Tooltip>
                                }
                            >
                                <button
                                    className="button-list button-blue"
                                    onClick={() => {
                                        setShowView(true);
                                        setClassId(data.id);
                                        setGradeLevel(data.grade_level);
                                        setClassName(data.title);
                                    }}
                                >
                                    <GroupsIcon />
                                </button>
                            </OverlayTrigger>

                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip className="custom-tooltip">
                                        View Subjects
                                    </Tooltip>
                                }
                            >
                                <button
                                    className="button-list button-blue"
                                    onClick={() => {
                                        setShowSubject(true);
                                        setClassId(data.id);
                                        setGradeLevel(data.grade_level);
                                    }}
                                >
                                    <MenuBookIcon />
                                </button>
                            </OverlayTrigger>

                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip className="custom-tooltip">
                                        Print Students List
                                    </Tooltip>
                                }
                            >
                                <button
                                    className="button-list button-green"
                                    onClick={() => {
                                        navigate("/printpdfclassstudents", {
                                            state: {
                                                classId: data.id,
                                                className: data.title,
                                                grade: data.grade_level,
                                                adviser: data.fname
                                                    ? `${data.lname}, ${
                                                          data.fname
                                                      } ${
                                                          data.mname
                                                              ? data.mname.charAt(
                                                                    0
                                                                ) + "."
                                                              : ""
                                                      }`
                                                    : "none",
                                            },
                                        });
                                        setTimeout(() => {
                                            navigate(-1);
                                        }, 3000);
                                    }}
                                >
                                    <PrintIcon />
                                    <GroupsIcon />
                                </button>
                            </OverlayTrigger>

                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip className="custom-tooltip">
                                        Print Subjects List
                                    </Tooltip>
                                }
                            >
                                <button
                                    className="button-list button-green"
                                    onClick={() => {
                                        navigate("/printpdfclasssubjects", {
                                            state: {
                                                classId: data.id,
                                                className: data.title,
                                                grade: data.grade_level,
                                            },
                                        });
                                        setTimeout(() => {
                                            navigate(-1);
                                        }, 3000);
                                    }}
                                >
                                    <PrintIcon />
                                    <MenuBookIcon />
                                </button>
                            </OverlayTrigger>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const Grade7 = filteredClass.filter(
        (classroom) => classroom.grade_level === "7"
    );
    const Grade8 = filteredClass.filter(
        (classroom) => classroom.grade_level === "8"
    );
    const Grade9 = filteredClass.filter(
        (classroom) => classroom.grade_level === "9"
    );
    const Grade10 = filteredClass.filter(
        (classroom) => classroom.grade_level === "10"
    );
    const Grade11 = filteredClass.filter(
        (classroom) => classroom.grade_level === "11"
    );
    const Grade12 = filteredClass.filter(
        (classroom) => classroom.grade_level === "12"
    );

    const [showPDF, setShowPDF] = useState(false);

    const [printGradeLevel, setPrintGradeLevel] = useState("");
    const [printClassname, setPrintClassname] = useState("");

    return (
        <>
            <div className="list-body-container">
                <div className="grade-cards-container">
                    {[
                        { grade: 7, count: countStudents["7"] },
                        { grade: 8, count: countStudents["8"] },
                        { grade: 9, count: countStudents["9"] },
                        { grade: 10, count: countStudents["10"] },
                        { grade: 11, count: countStudents["11"] },
                        { grade: 12, count: countStudents["12"] },
                    ].map(({ grade, count }) => (
                        <div className="grade-card" key={grade}>
                            <h3>Grade {grade}</h3>
                            <p>{count} students without classroom</p>
                        </div>
                    ))}
                </div>
                <div>
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search.."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <button className="search-input-btn">
                        <SearchIcon />
                    </button>
                </div>
                <div className="list-container">
                    <div className="d-flex justify-content-between list-title-container">
                        <h2>Classroom List</h2>
                        <button
                            className="button-list button-blue"
                            onClick={() => setNewClass(true)}
                        >
                            <AddIcon sx={{ color: "white" }} />
                            New Classroom
                        </button>
                    </div>
                    <div>
                        <Tabs
                            activeKey={activeTab}
                            onSelect={(k) => setActiveTab(k)}
                            id="uncontrolled-tab-example"
                            className="mb-3 tab-title"
                        >
                            <Tab eventKey="grade7" title="Grade 7">
                                {renderTable(Grade7)}
                            </Tab>
                            <Tab eventKey="grade8" title="Grade 8">
                                {renderTable(Grade8)}
                            </Tab>
                            <Tab eventKey="grade9" title="Grade 9">
                                {renderTable(Grade9)}
                            </Tab>
                            <Tab eventKey="grade10" title="Grade 10">
                                {renderTable(Grade10)}
                            </Tab>
                            <Tab eventKey="grade11" title="Grade 11">
                                {renderTable(Grade11)}
                            </Tab>
                            <Tab eventKey="grade12" title="Grade 12">
                                {renderTable(Grade12)}
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
            <Modal show={showNewClass} onHide={handleCloseNewClass}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Classroom</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                ref={titleRef}
                                placeholder="Ex. Falcon"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Grade Level</Form.Label>
                            <Form.Select ref={gradeRef}>
                                <option value="">Grade Level</option>
                                <option value="7">Grade 7</option>
                                <option value="8">Grade 8</option>
                                <option value="9">Grade 9</option>
                                <option value="10">Grade 10</option>
                                <option value="11">Grade 11</option>
                                <option value="12">Grade 12</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>Adviser</Form.Label>
                            <Form.Select ref={adviserRef}>
                                <option value="">Select Adviser</option>
                                {teachers.map((data, index) => {
                                    return (
                                        <option key={index} value={data.id}>
                                            {data.fname} {data.lname}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={addClassroom}
                        disabled={formLoading}
                    >
                        {formLoading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />{" "}
                                Save Changes
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showEditClass} onHide={handleCloseEditClass}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Classroom</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                ref={titleRef}
                                placeholder="Ex. Falcon"
                            />
                        </Form.Group>
                        {/* <Form.Group className="mb-3">
                            <Form.Label>Grade Level</Form.Label>
                            <Form.Select ref={gradeRef}>
                                <option value="">Grade Level</option>
                                <option value="7">Grade 7</option>
                                <option value="8">Grade 8</option>
                                <option value="9">Grade 9</option>
                                <option value="10">Grade 10</option>
                                <option value="11">Grade 11</option>
                                <option value="12">Grade 12</option>
                            </Form.Select>
                        </Form.Group> */}
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>Adviser</Form.Label>
                            <Form.Select ref={adviserRef}>
                                <option value="">Select Adviser</option>
                                {teachers.map((data, index) => {
                                    return (
                                        <option key={index} value={data.id}>
                                            {data.fname} {data.lname}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={editClassroom}
                        disabled={formLoading}
                    >
                        {formLoading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />{" "}
                                Save Changes
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {classId && (
                <PrincipalClassView
                    show={showView}
                    onHide={handleCloseView}
                    grade={gradeLevel}
                    id={classId}
                    className={className}
                />
            )}

            {showSubject && (
                <PrincipalSubjectView
                    show={showSubject}
                    onHide={handleCloseSubject}
                    classId={classId}
                />
            )}

            <ConfirmationLoad
                show={confirm}
                onHide={handleCloseConfirm}
                confirm={deleteClass}
                title={
                    "Are you sure you want to delete this classroom? Deleting this classroom will also remove all associated subjects, schedules, and students linked to it. This action is irreversible."
                }
                loading={formLoading}
            />

            <ToastContainer />
        </>
    );
}
