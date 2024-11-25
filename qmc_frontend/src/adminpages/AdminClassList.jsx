import React, { useRef, useState } from "react";
import "../assets/css/list.css";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axiosClientAdmin from "../axoisclient/axios-client-admin";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useStateContext } from "../context/ContextProvider";

export default function AdminClassList() {
    return (
        <div className="list-body-container">
            <div>
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search.."
                />
                <Button className="search-input-btn">
                    <SearchIcon />
                </Button>
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
                    <h2>Classroom List</h2>
                    <button className="button-list button-blue">
                        <AddIcon sx={{ color: "#000000" }} />
                        Add Class
                    </button>
                </div>

                <div>
                    <table className="list-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Class Level</th>
                                <th>Adviser</th>
                                <th>Total</th>
                                <th>Option</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>grade 7 - Falcon</td>
                                <td>Barroga, Lea</td>
                                <td>1/30</td>
                                <td>
                                    <button className="button-list button-orange">
                                        Edit
                                    </button>
                                    <button className="button-list button-red">
                                        Delete
                                    </button>
                                    <button className="button-list button-blue">
                                        Info
                                    </button>
                                    <button className="button-list button-blue">
                                        Students
                                    </button>
                                    <button className="button-list button-green">
                                        Print
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Grade 8 - Rose </td>
                                <td>Navarro, ylisa</td>
                                <td>1/43</td>
                                <td>
                                    <button className="button-list button-orange">
                                        Edit
                                    </button>
                                    <button className="button-list button-red">
                                        Delete
                                    </button>
                                    <button className="button-list button-blue">
                                        Info
                                    </button>
                                    <button className="button-list button-blue">
                                        Students
                                    </button>
                                    <button className="button-list button-green">
                                        Print
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
