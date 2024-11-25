import React, { useEffect, useState } from "react";
import DashboardBox from "../components/DashboardBox";
import axiosClientAdmin from "../axoisclient/axios-client-admin";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    LabelList,
    Label,
} from "recharts";
import randomColor from "randomcolor";

export default function AdminHome() {
    const [employeeCount, setEmployeeCount] = useState(null);
    const [studentCount, setStudentCount] = useState(null);
    const [announcementCount, setAnnouncementCount] = useState(0);
    const [enrolledCount, setEnrolledCount] = useState(0);
    const [academicYears, setAcademicYears] = useState([]);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
    const [data, setData] = useState([]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [enrollmentCountsByYear, setEnrollmentCountsByYear] = useState([]);
    const [predictedEnrollment, setPredictedEnrollment] = useState(0); // New state for predicted enrollment

    const getCount = () => {
        axiosClientAdmin.get("/count-employee").then((data) => {
            setEmployeeCount(data.data.count);
        });

        axiosClientAdmin.get("/count-students").then((data) => {
            setStudentCount(data.data.count);
        });

        axiosClientAdmin.get("/count/admin/announcements").then(({ data }) => {
            setAnnouncementCount(data);
        });
    };

    const getAcademicYears = () => {
        axiosClientAdmin.get("/academic-years").then(({ data }) => {
            setAcademicYears(data);
            if (data.length > 0) {
                setSelectedAcademicYear(data[0].id);
                getStudentCounts(data[0].id);
            }
        });
    };

    const getStudentCounts = (academicYearId) => {
        axiosClientAdmin
            .get(`/count/students/by-grade/${academicYearId}`)
            .then(({ data }) => {
                const total = data.reduce((acc, item) => acc + item.total, 0);
                setTotalStudents(total);

                const formattedData = data.map((item) => ({
                    label: `Grade ${item.grade_level}`,
                    value: item.total,
                    percentage: total ? (item.total / total) * 100 : 0, // Ensure total != 0
                }));
                console.log("Formatted Data for PieChart:", formattedData);
                setData(formattedData);
            });
    };

    const calculatePredictedEnrollment = (enrollmentData) => {
        // Example logic for simple average growth prediction
        if (enrollmentData.length < 2) return 0; // Not enough data to predict

        const total = enrollmentData.reduce((acc, curr) => acc + curr.total, 0);
        const average = total / enrollmentData.length;

        // Example: Assume a growth rate of 10% (you can adjust this logic as needed)
        const growthRate = 0.1; // 10%
        const prediction = Math.round(average * (1 + growthRate));

        return prediction;
    };

    const getEnrollmentCountsByYear = () => {
        axiosClientAdmin.get("/enrollment-counts-by-year").then(({ data }) => {
            setEnrollmentCountsByYear(data);

            // Calculate predicted enrollment based on historical data
            const prediction = calculatePredictedEnrollment(data);
            setPredictedEnrollment(prediction);
        });
    };

    const handleAcademicYearChange = (event) => {
        const yearId = event.target.value;
        setSelectedAcademicYear(yearId);
        getStudentCounts(yearId);
    };

    useEffect(() => {
        getCount();
        getAcademicYears();
        getEnrollmentCountsByYear();
    }, []);

    return (
        <div className="container mt-4">
            <div className="d-flex gap-5 flex-wrap justify-content-lg-start justify-content-sm-center justify-content-center">
                <DashboardBox
                    BoxColor="#E1604E"
                    title="Total Employee"
                    count={employeeCount}
                />
                <DashboardBox
                    BoxColor="#6987EA"
                    title="Total Students"
                    count={studentCount}
                />
                <DashboardBox
                    BoxColor="#E1DB4E"
                    title="Total Announcement"
                    count={announcementCount}
                />
            </div>
            <div className="row mt-5">
                <div className="col-lg-6 mb-4">
                    <div
                        className="p-3 border rounded"
                        style={{ backgroundColor: "rgb(247, 247, 249)" }}
                    >
                        <select
                            value={selectedAcademicYear}
                            onChange={handleAcademicYearChange}
                            className="form-select mb-3"
                        >
                            {academicYears.map((year) => (
                                <option key={year.id} value={year.id}>
                                    {year.academic_year}
                                </option>
                            ))}
                        </select>
                        <h2>Count of Students by Grade</h2>
                        <div className="mt-2">
                            <h3>Total Students: {totalStudents}</h3>
                        </div>
                        <PieChart width={500} height={400}>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="label"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label={({ label, percentage }) =>
                                    `${label}: ${percentage.toFixed(2)}%`
                                }
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={randomColor({
                                            luminosity: "dark",
                                        })}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>
                </div>

                <div className="col-lg-6 mb-4">
                    <div
                        className="p-3 border rounded d-flex flex-column"
                        style={{
                            backgroundColor: "rgb(247, 247, 249)",
                            height: "100%",
                        }}
                    >
                        <h2>Enrollment by Academic Year</h2>
                        <div className="mt-2">
                            <h4>
                                Predicted Enrollment for Next Academic Year:{" "}
                                {predictedEnrollment}
                            </h4>
                        </div>
                        <div className="flex-grow-1 d-flex justify-content-center align-items-end">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={enrollmentCountsByYear}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="academic_year">
                                        <Label
                                            value="Academic Year"
                                            offset={0}
                                            position="insideBottom"
                                        />
                                    </XAxis>
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="total" fill="#8884d8">
                                        <LabelList
                                            dataKey="total"
                                            position="top"
                                        />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
