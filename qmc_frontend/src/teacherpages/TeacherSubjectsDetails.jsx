import React from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import SubjectCSS from "../assets/css/subjectdetails.module.css";

export default function TeacherSubjectsDetails() {
    const { subjectId } = useParams(); // Get the subjectId from the URL

    const { pathname } = useLocation();
    const isActive = (path) => pathname === path;

    return (
        <>
            <div className={SubjectCSS.linkContainer}>
                <Link
                    className={`${SubjectCSS.link} ${
                        isActive(`/teacher/subjects/${subjectId}/all`)
                            ? SubjectCSS.active
                            : ""
                    }`}
                    to={`/teacher/subjects/${subjectId}/all`}
                >
                    Program
                </Link>
                <Link
                    className={`${SubjectCSS.link} ${
                        isActive(`/teacher/subjects/${subjectId}/classwork`)
                            ? SubjectCSS.active
                            : ""
                    }`}
                    to={`/teacher/subjects/${subjectId}/classwork`}
                >
                    Classwork
                </Link>
                <Link
                    className={`${SubjectCSS.link} ${
                        isActive(`/teacher/subjects/${subjectId}/students`)
                            ? SubjectCSS.active
                            : ""
                    }`}
                    to={`/teacher/subjects/${subjectId}/students`}
                >
                    Students
                </Link>
                <Link
                    className={`${SubjectCSS.link} ${
                        isActive(`/teacher/subjects/${subjectId}/quiz`)
                            ? SubjectCSS.active
                            : ""
                    }`}
                    to={`/teacher/subjects/${subjectId}/quiz`}
                >
                    Assessment
                </Link>
            </div>
            <div>
                <Outlet />
            </div>
        </>
    );
}
