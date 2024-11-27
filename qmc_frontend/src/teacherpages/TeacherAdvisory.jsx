import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import axiosClientTeacher from "../axoisclient/axois-client-teacher";
import { Pagination } from "react-bootstrap";

export default function TeacherAdvisory() {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        getStudents();
    }, []);

    const getStudents = () => {
        axiosClientTeacher
            .get("/classlist/students")
            .then(({ data }) => {
                setStudents(data);
                setFilteredStudents(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = students.filter((student) => {
            const middleName = student.middlename
                ? student.middlename.toLowerCase()
                : "";
            const fullName =
                `${student.surname} ${student.firstname} ${middleName}`
                    .trim()
                    .toLowerCase();
            const lrn = student.lrn.toString().toLowerCase();

            return (
                student.surname.toLowerCase().includes(query) ||
                student.firstname.toLowerCase().includes(query) ||
                middleName.includes(query) ||
                fullName.includes(query) ||
                lrn.includes(query)
            );
        });

        setFilteredStudents(filtered);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredStudents.length / pageSize);
    const currentData = filteredStudents.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const goToPage = (page) => setCurrentPage(page);

    return (
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
                    <h2>Advisory List</h2>
                </div>
                <div>
                    <table className="list-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>LRN</th>
                                <th>Gender</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((data, index) => (
                                <tr key={index}>
                                    <td data-label="No">
                                        {(currentPage - 1) * pageSize +
                                            index +
                                            1}
                                    </td>
                                    <td data-label="Name">{`${data.surname}, ${
                                        data.firstname
                                    }${
                                        data.middlename
                                            ? `, ${data.middlename.charAt(0)}.`
                                            : ""
                                    }${
                                        data.extension_name
                                            ? ` ${data.extension_name}`
                                            : ""
                                    }`}</td>
                                    <td data-label="LRN">{data.lrn}</td>
                                    <td data-label="Gender">{data.gender}</td>
                                    <td data-label="Grade">
                                        {data.grade_level}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* React Bootstrap Pagination */}
            </div>
            <Pagination className="justify-content-center mt-3">
                <Pagination.Prev
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                />
                {[...Array(totalPages).keys()].map((page) => (
                    <Pagination.Item
                        key={page + 1}
                        active={page + 1 === currentPage}
                        onClick={() => goToPage(page + 1)}
                    >
                        {page + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />
            </Pagination>
        </div>
    );
}
