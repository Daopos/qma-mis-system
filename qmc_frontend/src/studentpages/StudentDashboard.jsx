import React, { useMemo } from "react";
import randomColor from "randomcolor";
import TimetableStudent from "../components/TimeTableStudent";
import DashboardBox from "../components/DashboardBox";
import { useQuery } from "react-query";
import axiosClientStudent from "../axoisclient/axios-client-student";
import Spinner from "react-bootstrap/Spinner";
import Announcement from "../components/Announcement";

export default function StudentDashboard() {
    const {
        data: subjectsCounts,
        isLoading: isCountLoading,
        error: isCountError,
    } = useQuery("studentSubjectsCount", async () => {
        const response = await axiosClientStudent.get(
            "/student/subjects/count"
        );
        console.log(response);
        return response.data.subject_count;
    });

    const {
        data: balance,
        isLoading: isBalanceLoadiing,
        error: isBalanceError,
    } = useQuery("studentBalance", async () => {
        const response = await axiosClientStudent.get("/student/own/balance");
        return response.data.total_fee;
    });

    const {
        data: grades,
        isLoading: isGradeLoading,
        error: isGradeError,
    } = useQuery("studentGradesCount", async () => {
        const response = await axiosClientStudent.get("/student/count/grades");
        console.log(response);
        return response.data.total_grades_count;
    });

    const {
        data: subjects = [],
        isLoading,
        error,
    } = useQuery("studentSubjects", async () => {
        const response = await axiosClientStudent.get("/student/subjects");
        return response.data.subjects;
    });

    const {
        data: announcements = [],
        error: isAnnouncementError,
        isLoading: isAnnouncementLoading,
    } = useQuery("announcements", () =>
        axiosClientStudent.get("/student/announcements").then((res) => res.data)
    );

    // Map day names to numbers
    const dayMap = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
    };

    // Memoize the events to keep the colors consistent across re-renders
    const events = useMemo(() => {
        return subjects.flatMap((subject) =>
            subject.schedules.map((schedule) => ({
                title: subject.title,
                startTime: schedule.start, // Use schedule start time
                endTime: schedule.end, // Use schedule end time
                daysOfWeek: [dayMap[schedule.day]], // Map day name to number
                color: randomColor({
                    luminosity: "dark",
                }),
                extendedProps: {
                    classroomTitle: subject.classroom_title,
                    teacher: `${subject.teacher_fname} ${subject.teacher_lname}`,
                },
            }))
        );
    }, [subjects]);

    if (isLoading)
        return (
            <div className="d-flex justify-content-center pt-4">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    if (error) return <div>Error loading data</div>;

    return (
        <div style={{ padding: "10px 30px" }}>
            <div
                className="d-flex gap-3 gap-lg-5 flex-wrap justify-content-lg-start justify-content-sm-center justify-content-center"
                style={{ padding: 20 }}
            >
                <DashboardBox
                    BoxColor="#E1604E"
                    title="Subjects"
                    count={subjectsCounts}
                />
                <DashboardBox
                    BoxColor="#76ABAE"
                    title="Balance"
                    count={balance.toLocaleString()}
                />
                <DashboardBox
                    BoxColor="#50727B"
                    title="Grades"
                    count={grades}
                />
            </div>
            <div>
                <TimetableStudent events={events} />
            </div>

            <div style={{ gap: 40 }}>
                <h2>Announcements</h2>
            </div>

            {/* Render filtered announcements */}
            <div className="d-flex flex-column gap-4 mt-3">
                {announcements.map((data) => (
                    <Announcement
                        key={data.id}
                        title={data.title}
                        desc={data.desc}
                        date={data.created_at}
                        owner={data.owner}
                    />
                ))}
            </div>
        </div>
    );
}
