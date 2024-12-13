import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Accordion from "react-bootstrap/Accordion";
import axiosClientRegistrar from "../../axoisclient/axios-client-registrar";

export default function ClassroomReg({ show, onHide, id, grade, className }) {
    const [classStudents, setClassStudents] = useState([]);
    const [checkedStudents, setCheckedStudents] = useState({});
    const [checkedRemoveStudents, setCheckedRemoveStudents] = useState([]);
    const [studentList, setStudentList] = useState([]);

    const [addLoading, setAddLoading] = useState(false);

    const getClassStudents = () => {
        axiosClientRegistrar.get(`/student/grade/${grade}`).then(({ data }) => {
            setClassStudents(data.students);
        });
    };

    const getStudentList = () => {
        axiosClientRegistrar.get(`/classlist/class/${id}`).then(({ data }) => {
            setStudentList(data.students);
            console.log(data.students);
        });
    };

    useEffect(() => {
        getClassStudents();
        getStudentList();
    }, []);

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
                        </tr>
                    </thead>
                    <tbody>
                        {studentList.map((data, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{data.student.lrn}</td>
                                <td>
                                    {`${data.student.surname}, ${
                                        data.student.firstname
                                    }${
                                        data.student.middlename
                                            ? `, ${data.student.middlename.charAt(
                                                  0
                                              )}.`
                                            : ""
                                    }${
                                        data.student.extension_name
                                            ? ` ${data.student.extension_name}`
                                            : ""
                                    }${
                                        data.student.strand &&
                                        data.student.strand !== "null"
                                            ? ` (${data.student.strand})`
                                            : ""
                                    }`}
                                </td>
                                <td>{data.student.grade_level}</td>
                            </tr>
                        ))}
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </Table>
                {/* <Accordion defaultActiveKey="1" className="mt-5">
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {classStudents.map((data, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{data.lrn}</td>
                                            <td>
                                                {`${data.surname}, ${
                                                    data.firstname
                                                }, ${
                                                    data.middlename
                                                        ? data.middlename.charAt(
                                                              0
                                                          )
                                                        : ""
                                                }${
                                                    data.extension_name
                                                        ? ", " +
                                                          data.extension_name
                                                        : ""
                                                }${
                                                    data.strand &&
                                                    data.strand !== "null"
                                                        ? ` (${data.strand})`
                                                        : ""
                                                }`}
                                            </td>
                                            <td>{data.grade_level}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion> */}
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
        </Modal>
    );
}
