import React, { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axiosClientRegistrar from "../axoisclient/axios-client-registrar";
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

import { toast, ToastContainer } from "react-toastify";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ConfirmationLoad from "../components/ConfirmationLoad";
import PdfClassStudent from "../components/principal/PdfClassStudent";
import PdfClassSubjects from "../components/principal/PdfClassSubjects";
import ClassroomReg from "../components/registrar/classrooms";

export default function RegistrarClassroom() {
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

    const [selectedClassroom, setSelectedClassroom] = useState("");

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

    const [printId, setPrintid] = useState("");
    const [printclass, setPrintClass] = useState("");
    const [printGrade, setPrintGrade] = useState("");

    const [printIdRoom, setPrintidRoom] = useState("");
    const [printclassRoom, setPrintClassRoom] = useState("");
    const [printGradeRoom, setPrintGradeRoom] = useState("");
    const [printAdviser, setPrintAdviser] = useState("");

    const getTeachers = () => {
        axiosClientRegistrar
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
        axiosClientRegistrar
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
        axiosClientRegistrar
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

                            {/* <OverlayTrigger
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
                            </OverlayTrigger> */}

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
                                        setPrintidRoom(data.id);
                                        setPrintClassRoom(data.title);
                                        setPrintGradeRoom(data.grade_level);
                                        setPrintAdviser(
                                            data.fname
                                                ? `${data.lname}, ${
                                                      data.fname
                                                  } ${
                                                      data.mname
                                                          ? data.mname.charAt(
                                                                0
                                                            ) + "."
                                                          : ""
                                                  }`
                                                : "none"
                                        );
                                        handleStudentsPrintClick();
                                    }}
                                >
                                    <PrintIcon />
                                    <GroupsIcon />
                                </button>
                            </OverlayTrigger>
                            {/*
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
                                        setPrintid(data.id);
                                        setPrintClass(data.title);
                                        setPrintGrade(data.grade_level);
                                        handleSubjectsPrintClick();
                                    }}
                                >
                                    <PrintIcon />
                                    <MenuBookIcon />
                                </button>
                            </OverlayTrigger> */}
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

    const printSubjectsRef = useRef();
    const printStudentsRef = useRef();

    const [showPrintStudents, setShowPrintStudents] = useState(false);
    const [showPrintSubjects, setShowPrintSubjects] = useState(false);

    const handleStudentsPrintClick = () => {
        setShowPrintStudents(false); // Unmount the component first
        setTimeout(() => {
            setShowPrintStudents(true); // Remount after ensuring state resets
            if (printStudentsRef.current) {
                printStudentsRef.current.resetAndPrint(); // Reset and fetch new data
            }
        }, 50);
    };

    const handleSubjectsPrintClick = () => {
        setShowPrintSubjects(false); // Unmount the component first
        setTimeout(() => {
            setShowPrintSubjects(true); // Remount after ensuring state resets
            if (printSubjectsRef.current) {
                printSubjectsRef.current.resetAndPrint(); // Reset and fetch new data
            }
        }, 50); // Delay to ensure proper unmount and remount
    };

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

            {classId && (
                <ClassroomReg
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

            {showPrintStudents && (
                <div style={{ display: "none" }}>
                    <PdfClassStudent
                        ref={printStudentsRef}
                        classId={printIdRoom}
                        className={printclassRoom}
                        grade={printGradeRoom}
                        adviser={printAdviser}
                    />
                </div>
            )}

            {showPrintSubjects && (
                <div style={{ display: "none" }}>
                    <PdfClassSubjects
                        ref={printSubjectsRef}
                        classId={printId}
                        className={printclass}
                        grade={printGrade}
                    />
                </div>
            )}
            <ToastContainer />
        </>
    );
}
