import React from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import SubjectCSS from "../assets/css/subjectdetails.module.css";

export default function StudentSubjectDetails() {
    const { subjectId } = useParams(); // Get the subjectId from the URL

    const { pathname } = useLocation();
    const isActive = (path) => pathname === path;

    return (
        <>
            <div className={SubjectCSS.linkContainer}>
                <Link
                    className={`${SubjectCSS.link} ${
                        isActive(`/student/subjects/${subjectId}/all`)
                            ? SubjectCSS.active
                            : ""
                    }`}
                    to={`/student/subjects/${subjectId}/all`}
                >
                    Program
                </Link>
                <Link
                    className={`${SubjectCSS.link} ${
                        isActive(`/student/subjects/${subjectId}/classwork`)
                            ? SubjectCSS.active
                            : ""
                    }`}
                    to={`/student/subjects/${subjectId}/classwork`}
                >
                    Classwork
                </Link>
                <Link
                    className={`${SubjectCSS.link} ${
                        isActive(`/student/subjects/${subjectId}/test`)
                            ? SubjectCSS.active
                            : ""
                    }`}
                    to={`/student/subjects/${subjectId}/test`}
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
