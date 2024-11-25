import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Accordion from "react-bootstrap/Accordion";
import axiosClientPrincipal from "../../axoisclient/axios-client-principal";

export default function PrincipalClassView({
    show,
    onHide,
    id,
    grade,
    className,
}) {
    const [classStudents, setClassStudents] = useState([]);
    const [checkedStudents, setCheckedStudents] = useState({});
    const [checkedRemoveStudents, setCheckedRemoveStudents] = useState([]);
    const [studentList, setStudentList] = useState([]);

    const [addLoading, setAddLoading] = useState(false);

    const getClassStudents = () => {
        axiosClientPrincipal.get(`/student/grade/${grade}`).then(({ data }) => {
            setClassStudents(data.students);
        });
    };

    const getStudentList = () => {
        axiosClientPrincipal.get(`/classlist/class/${id}`).then(({ data }) => {
            setStudentList(data.students);
            console.log(data.students);
        });
    };

    useEffect(() => {
        getClassStudents();
        getStudentList();
    }, []);

    const handleCheckboxChange = (id) => {
        setCheckedStudents((prevCheckedStudents) => ({
            ...prevCheckedStudents,
            [id]: !prevCheckedStudents[id],
        }));
    };

    const handleCheckboxChangeRemove = (id) => {
        setCheckedRemoveStudents((prevCheckedStudents) => {
            if (prevCheckedStudents.includes(id)) {
                // If the id is already in the array, remove it
                return prevCheckedStudents.filter(
                    (studentId) => studentId !== id
                );
            } else {
                // Otherwise, add the id to the array
                return [...prevCheckedStudents, id];
            }
        });
    };

    const addStudent = () => {
        const selectedStudentIds = Object.keys(checkedStudents).filter(
            (id) => checkedStudents[id]
        );
        const studentsToAdd = selectedStudentIds.map((studentId) => ({
            student_id: studentId,
            class_id: id,
        }));

        setAddLoading(true);

        axiosClientPrincipal
            .post(`/classlists`, studentsToAdd)
            .then(() => {
                getClassStudents(); // Refresh the student list
                getStudentList();
                setCheckedStudents([null]);
            })
            .finally(() => setAddLoading(false));
    };

    const deleteStudent = () => {
        // Log the array of checked classlist_ids

        const confirmDelete = window.confirm(
            "Are you sure you want to remove the selected students?"
        );

        if (!confirmDelete) return;
        console.log(checkedRemoveStudents);

        axiosClientPrincipal
            .delete(`/classlists/${checkedRemoveStudents}`)
            .then(() => {
                console.log("succes");
                getClassStudents();
                getStudentList();
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <Modal
            show={show}
            aria-labelledby="contained-modal-title-vcenter"
            onHide={onHide}
            dialogClassName="modal-60w"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    CLASSROOM
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Students in {className}</h4>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>LRN</th>
                            <th>Name</th>
                            <th>Grade Level</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentList.map((data, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{data.student.lrn}</td>
                                <td>{`${data.student.surname}${
                                    data.student.extension_name
                                        ? ` ${data.student.extension_name}`
                                        : ""
                                }, ${data.student.firstname}${
                                    data.student.middlename
                                        ? `, ${data.student.middlename.charAt(
                                              0
                                          )}.`
                                        : ""
                                }`}</td>
                                <td>{data.student.grade_level}</td>
                                <td>
                                    <Form.Check
                                        type="checkbox"
                                        id={`checkbox-${data.classlist_id}`}
                                        checked={checkedRemoveStudents.includes(
                                            data.classlist_id
                                        )}
                                        onChange={() =>
                                            handleCheckboxChangeRemove(
                                                data.classlist_id
                                            )
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                                <Button
                                    className="btn btn-danger"
                                    onClick={deleteStudent}
                                >
                                    Remove
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <Accordion defaultActiveKey="1" className="mt-5">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Add Students</Accordion.Header>
                        <Accordion.Body>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>LRN</th>
                                        <th>Name</th>
                                        <th>Grade Level</th>
                                        <th>action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classStudents.map((data, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{data.lrn}</td>
                                            <td>{`${data.surname}, ${
                                                data.firstname
                                            }, ${
                                                data.middlename
                                                    ? data.middlename.charAt(0)
                                                    : ""
                                            }${
                                                data.extension_name
                                                    ? ", " + data.extension_name
                                                    : ""
                                            }`}</td>
                                            <td>{data.grade_level}</td>
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    id={`checkbox-${data.id}`}
                                                    checked={
                                                        !!checkedStudents[
                                                            data.id
                                                        ]
                                                    }
                                                    onChange={() =>
                                                        handleCheckboxChange(
                                                            data.id
                                                        )
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))}

                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <Button
                                                onClick={addStudent}
                                                disabled={addLoading}
                                            >
                                                {addLoading ? (
                                                    <>
                                                        <Spinner
                                                            as="span"
                                                            animation="border"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                        />{" "}
                                                        Add
                                                    </>
                                                ) : (
                                                    "Add"
                                                )}
                                            </Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
        </Modal>
    );
}
