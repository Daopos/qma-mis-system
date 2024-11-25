import React, { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import axiosClientPrincipal from "../axoisclient/axios-client-principal";

export default function PrincipalSubjectList() {
    const [showNewSubject, setShowNewSubject] = useState(false);
    const [subjects, setSubjects] = useState([]);

    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("grade7");

    const titleRef = useRef();
    const gradeRef = useRef();

    const handleCloseNewSubject = () => {
        setShowNewSubject(false);
    };

    useEffect(() => {
        getSubjects();
    }, []);

    const getSubjects = () => {
        axiosClientPrincipal.get("/subjects").then(({ data }) => {
            setSubjects(data.subjects);
            setFilteredSubjects(data.subjects);
        });
    };

    const addSubject = () => {
        const payload = {
            title: titleRef.current.value,
            grade_level: gradeRef.current.value,
        };

        axiosClientPrincipal
            .post("/subjects", payload)
            .then(() => {
                console.log("succes");
                getSubjects();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = subjects.filter((subjects) => {
            return subjects.title.toLowerCase().includes(query);
            // classroom.adviser.toLowerCase().includes(query)
        });
        setFilteredSubjects(filtered);
        if (filtered.length > 0) {
            const gradeLevel = filtered[0].grade_level.toString();
            setActiveTab(`grade${gradeLevel}`);
        }
    };

    const renderTable = (subjectsToRender) => (
        <table className="list-table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Subject Name</th>
                    <th>Class Level</th>
                    <th>Option</th>
                </tr>
            </thead>
            <tbody>
                {subjectsToRender.map((data, index) => (
                    <tr key={index}>
                        <td data-label="No">{index + 1}</td>
                        <td data-label="Subject Name">{data.title}</td>
                        <td data-label="Class Level">{data.grade_level}</td>
                        <td data-label="Option">
                            <button
                                className="button-list button-blue"
                                onClick={() => {}}
                            >
                                Edit
                            </button>
                            <button
                                className="button-list button-blue"
                                onClick={() => {}}
                            >
                                View Breakdown
                            </button>
                            <button className="button-list button-blue">
                                Print
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const Grade7 = filteredSubjects.filter(
        (subject) => subject.grade_level === "7"
    );
    const Grade8 = filteredSubjects.filter(
        (subject) => subject.grade_level === "8"
    );
    const Grade9 = filteredSubjects.filter(
        (subject) => subject.grade_level === "9"
    );
    const Grade10 = filteredSubjects.filter(
        (subject) => subject.grade_level === "10"
    );
    const Grade11 = filteredSubjects.filter(
        (subject) => subject.grade_level === "11"
    );
    const Grade12 = filteredSubjects.filter(
        (subject) => subject.grade_level === "12"
    );

    return (
        <>
            <div className="list-body-container">
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
                        <h2>Subject List</h2>
                        <button
                            className="button-list button-blue"
                            onClick={() => setShowNewSubject(true)}
                        >
                            <AddIcon sx={{ color: "#000000" }} />
                            New Subject
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

            <Modal show={showNewSubject} onHide={handleCloseNewSubject}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Subject</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                ref={titleRef}
                                type="text"
                                autoFocus
                                placeholder="Ex. Science"
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
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={addSubject}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
