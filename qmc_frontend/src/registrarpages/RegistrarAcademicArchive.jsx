import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Button from "react-bootstrap/Button";
import axiosClientRegistrar from "../axoisclient/axios-client-registrar";
import { useNavigate } from "react-router-dom";

export default function RegistrarAcademicArchive() {
    const navigate = useNavigate();

    const [academicYears, setAcademicYears] = useState([]);

    const getAcademicYears = () => {
        axiosClientRegistrar
            .get("/academic-year/deactivated")
            .then(({ data }) => {
                console.log(data);
                setAcademicYears(data);
            })
            .catch((err) => {
                console.log("fail");
                console.log(err);
            });
    };

    useEffect(() => {
        getAcademicYears();
    }, []);

    const seeStudent = (id) => {
        navigate(`/registrar/students/archives/${id}`);
    };

    return (
        <>
            <div className="list-body-container">
                <div>
                    {/* <input
                        className="search-input"
                        type="text"
                        placeholder="Search.."
                    />
                    <button className="search-input-btn">
                        <SearchIcon />
                    </button> */}
                </div>
                <div className="list-container">
                    <div className="d-flex justify-content-between list-title-container">
                        <h2>Archive of Academic Year Lists</h2>
                    </div>
                    <div>
                        <table className="list-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Academic Year</th>
                                    <th>Status</th>
                                    <th>Option</th>
                                </tr>
                            </thead>
                            <tbody>
                                {academicYears.map((data, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{data.academic_year}</td>
                                        <td>Archived</td>
                                        <td>
                                            <button
                                                className="button-list button-blue"
                                                onClick={() =>
                                                    seeStudent(data.id)
                                                }
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
