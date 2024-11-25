import React from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import SubjectCSS from "../assets/css/subjectdetails.module.css";

export default function TeacherSubjectDetailsArchived() {
    const { subjectId } = useParams(); // Get the subjectId from the URL

    const { pathname } = useLocation();
    const isActive = (path) => pathname === path;

    return (
        <>
            <div className={SubjectCSS.linkContainer}>
                <Link
                    className={`${SubjectCSS.link} ${
                        isActive(`/teacher/archived/subjects/${subjectId}/all`)
                            ? SubjectCSS.active
                            : ""
                    }`}
                    to={`/teacher/archived/subjects/${subjectId}/all`}
                >
                    Program
                </Link>
                <Link
                    className={`${SubjectCSS.link} ${
                        isActive(
                            `/teacher/archived/subjects/${subjectId}/classwork`
                        )
                            ? SubjectCSS.active
                            : ""
                    }`}
                    to={`/teacher/archived/subjects/${subjectId}/classwork`}
                >
                    Classwork
                </Link>
                <Link
                    className={`${SubjectCSS.link} ${
                        isActive(
                            `/teacher/archived/subjects/${subjectId}/students`
                        )
                            ? SubjectCSS.active
                            : ""
                    }`}
                    to={`/teacher/archived/subjects/${subjectId}/students`}
                >
                    Students
                </Link>
                <Link
                    className={`${SubjectCSS.link} ${
                        isActive(`/teacher/archived/subjects/${subjectId}/quiz`)
                            ? SubjectCSS.active
                            : ""
                    }`}
                    to={`/teacher/archived/subjects/${subjectId}/quiz`}
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
