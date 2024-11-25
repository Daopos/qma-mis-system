import React, { useEffect, useMemo } from "react";
import DashboardBox from "../components/DashboardBox";
import Timetable from "../components/TimeTable";
import { useQuery } from "react-query";
import axiosClientTeacher from "../axoisclient/axois-client-teacher";
import randomColor from "randomcolor"; // Import the randomcolor package
import Spinner from "react-bootstrap/Spinner";
import Announcement from "../components/Announcement";

export default function TeacherDashboard() {
    const {
        data: subjectsCounts,
        isLoading: isCountLoading,
        error: isCountError,
    } = useQuery("teacherSubjectsCounts", async () => {
        const response = await axiosClientTeacher.get(
            "/teacher/count/subjects"
        );
        return response.data.subject_count;
    });

    const {
        data: subjects = [],
        isLoading,
        error,
    } = useQuery("teacherSubjects", async () => {
        const response = await axiosClientTeacher.get("/teacher/subjects");
        console.log(response.data.subjects);
        return response.data.subjects;
    });

    const {
        data: announcements = [],
        isLoading: isAnnouncementsLoading,
        error: isAnnouncemenstError,
    } = useQuery("teacherAnnouncement", async () => {
        const response = await axiosClientTeacher.get("/teacher/announcements");
        return response.data;
    });

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
                startTime: schedule.start,
                endTime: schedule.end,
                daysOfWeek: [dayMap[schedule.day]], // Adjust according to your data structure if needed
                color: randomColor({
                    luminosity: "dark",
                }),
                extendedProps: {
                    classroomTitle: subject.classroom_title,
                    gradeLevel: subject.grade_level,
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
        <div style={{ padding: "40px 30px" }}>
            <div
                className="d-flex gap-5 flex-wrap justify-content-lg-start justify-content-sm-center justify-content-center"
                style={{ padding: 20 }}
            >
                <DashboardBox
                    BoxColor="#E1604E"
                    title="Subjects"
                    count={subjectsCounts}
                />
            </div>
            <div>
                <Timetable events={events} />
            </div>
            <h2>Announcements</h2>
            {/* Render filtered announcements */}
            <div className="d-flex flex-column gap-4 mt-5">
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
