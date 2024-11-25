import React from "react";
import "../assets/css/list.css";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

export default function AdminSubjectList() {
    return (
        <div className="list-body-container">
            <div>
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search.."
                />
                <button className="search-input-btn">
                    <SearchIcon />
                </button>
            </div>
            <div style={{ marginTop: 25 }}>
                <select id="cars">
                    <option value="">sort by</option>
                    <option value="volvo">Test</option>
                    <option value="saab">Test</option>
                    <option value="opel">Test</option>
                    <option value="audi">Test</option>
                </select>
            </div>
            <div className="list-container">
                <div className="d-flex justify-content-between list-title-container">
                    <h2>Subject List</h2>
                    <button className="button-list button-blue">
                        <AddIcon sx={{ color: "#000000" }} />
                        Add Subject
                    </button>
                </div>
                <div>
                    <table className="list-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Subjects</th>
                                <th>Grade Level</th>
                                <th>Description</th>
                                <th>Option</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Science</td>
                                <td>grade 7</td>
                                <td>Lorem opsum</td>
                                <td>
                                    <button className="button-list button-orange">
                                        Edit
                                    </button>
                                    <button className="button-list button-red">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>English</td>
                                <td>grade 8</td>
                                <td>Lorem opsum</td>
                                <td>
                                    <button className="button-list button-orange">
                                        Edit
                                    </button>
                                    <button className="button-list button-red">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
