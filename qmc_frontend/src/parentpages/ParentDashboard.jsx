import React, { useMemo } from "react";
import DashboardBox from "../components/DashboardBox";
import { useQuery } from "react-query";
import axiosClientParent from "../axoisclient/axios-client-parent";
import randomColor from "randomcolor";
import TimetableStudent from "../components/TimeTableStudent";
import Spinner from "react-bootstrap/Spinner";
import Announcement from "../components/Announcement";

export default function ParentDashboard() {
    const {
        data: subjectsCounts,
        isLoading: isCountLoading,
        error: isCountError,
    } = useQuery("parentSubjectsCount", async () => {
        const response = await axiosClientParent.get("/parent/subjects/count");
        console.log(response);
        return response.data.subject_count;
    });

    const {
        data: balance,
        isLoading: isBalanceLoadiing,
        error: isBalanceError,
    } = useQuery("parentBalance", async () => {
        const response = await axiosClientParent.get("/parent/own/balance");
        return response.data.total_fee;
    });

    const {
        data: grades,
        isLoading: isGradeLoading,
        error: isGradeError,
    } = useQuery("parentGradesCount", async () => {
        const response = await axiosClientParent.get("/parent/count/grades");
        console.log(response);
        return response.data.total_grades_count;
    });

    const {
        data: subjects = [],
        isLoading,
        error,
    } = useQuery("parentSubjects", async () => {
        const response = await axiosClientParent.get("/parent/subjects");
        return response.data.subjects;
    });

    const {
        data: announcements = [],
        isLoading: isAnnouncementLoading,
        error: isAnnouncementError,
    } = useQuery("parentAnnouncement", async () => {
        const response = await axiosClientParent.get("/parent/announcements");
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
                style={{
                    padding: 20,
                }}
            >
                <DashboardBox
                    BoxColor="#E1604E"
                    title="Subjects"
                    count={subjectsCounts}
                />
                <DashboardBox
                    BoxColor="#1C77"
                    title="Balance"
                    count={balance.toLocaleString()}
                />
                <DashboardBox
                    BoxColor="#9E4784"
                    title="Grades"
                    count={grades}
                />

                {/* <DashboardBox BoxColor="#761212" title="Total Finance" /> */}
            </div>
            <div>
                <TimetableStudent events={events} />
            </div>

            <div className="mt-3">
                <h2>Announcements</h2>
                <div className="d-flex flex-column gap-4 mt-3">
                    {announcements.length > 0 ? (
                        announcements.map((data) => (
                            <Announcement
                                key={data.id}
                                title={data.title}
                                desc={data.desc}
                                date={data.created_at}
                                owner={data.owner}
                            />
                        ))
                    ) : (
                        <p>No announcements available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
