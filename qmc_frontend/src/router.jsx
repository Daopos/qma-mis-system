import { createBrowserRouter } from "react-router-dom";
import AdminLogin from "./adminpages/AdminLogin";
import AdminHome from "./adminpages/AdminHome";
import AdminLayout from "../layouts/AdminLayout";
import AdminProfile from "./adminpages/AdminProfile";
import AdminClassList from "./adminpages/AdminClassList";
import AdminSubjectList from "./adminpages/AdminSubjectList";
import AdminClassListFee from "./adminpages/AdminClassListFee";
import AdminAcademicYear from "./adminpages/AdminAcademicYear";
import AdminStudentList from "./adminpages/AdminStudentList";
import AdminEmployeeList from "./adminpages/AdminEmployeeList";
import AdminAnnouncement from "./adminpages/AdminAnnouncement";
import AdminAudit from "./adminpages/AdminAudit";
import RegistrarLogin from "./registrarpages/RegistrarLogin";
import RegistrarLayout from "../layouts/RegistrarLayout";
import RegistrarDashboard from "./registrarpages/RegistrarDashboard";
import RegistrarProfile from "./registrarpages/RegistrarProfile";
import RegistrarPreEnroll from "./registrarpages/RegistrarPreEnroll";
import RegistrarReadyEnroll from "./registrarpages/RegistrarReadyEnroll";
import RegistrarEnrolled from "./registrarpages/RegistrarEnrolled";
import RegistrarNewStudent from "./registrarpages/RegistrarNewStudent";
import FinanceDashboard from "./financepages/FinanceDashboard";

import FinanceLayout from "../layouts/FinanceLayout";
import FinancePendingStudents from "./financepages/FinancePendingStudents";
import FinanceConfirmedStudents from "./financepages/FinanceConfirmedStudents";
import FinanceStudents from "./financepages/FinanceStudents";
import AdminEmpoyeeArchive from "./adminpages/AdminEmpoyeeArchive";
import RegistrarEditStudent from "./components/registrar/RegistrarEditStudent";
import FinanceLogin from "./financepages/FinanceLogin";
import PrincipalLogin from "./principalpages/PrincipalLogin";
import PrincipalLayout from "../layouts/PrincipalLayout";
import PrincipalDashboard from "./principalpages/PrincipalDashboard";
import PrincipalProfile from "./principalpages/PrincipalProfile";
import PrincipalSubjectList from "./principalpages/PrincipalSubjectList";
import PrincipalTeacherList from "./principalpages/PrincipalTeacherList";
import PrinciaplClassroomList from "./principalpages/PrinciaplClassroomList";
import TeacherLogin from "./teacherpages/TeacherLogin";
import TeacherLayout from "../layouts/TeacherLayout";
import TeacherDashboard from "./teacherpages/TeacherDashboard";
import TeacherProfile from "./teacherpages/TeacherProfile";
import TeacherSubject from "./teacherpages/TeacherSubjects";
import StudentLogin from "./studentpages/StudentLogin";
import StudentLayout from "../layouts/StudentLayout";
import StudentDashboard from "./studentpages/StudentDashboard";
import StudentGrades from "./studentpages/StudentGrades";
import StudentProfile from "./studentpages/StudentProfile";
import StudentSubject from "./studentpages/StudentSubject";
import TeacherSubjectsDetails from "./teacherpages/TeacherSubjectsDetails";
import TeacherClasswork from "./teacherpages/TeacherClasswork";
import TeacherStream from "./teacherpages/TeacherStream";
import TeacherStudent from "./teacherpages/TeacherStudent";
import TeacherAdvisory from "./teacherpages/TeacherAdvisory";
import RegistrarOldStudent from "./registrarpages/RegistrarOldStudent";
import StudentSubjectDetails from "./studentpages/StudentSubjectDetails";
import StudentStream from "./studentpages/StudentStream";
import TeacherQuiz from "./teacherpages/TeacherQuiz";
import TeacherTestCreation from "./teacherpages/TeacherTestCreation";
import TeacherTestCreationEdit from "./teacherpages/TeacherTestCreationEdit";
import StudentClasswork from "./studentpages/StudentClasswork";
import StudentTest from "./studentpages/StudentTest";
import StudentDoTest from "./studentpages/StudentDoTest";
import FinanceProfile from "./financepages/FinanceProfile";
import TeacherTestSubmission from "./teacherpages/TeacherTestSubmission";
import ViewStudentSubmission from "./teacherpages/ViewStudentSubmission";
import TeacherClassworkSubmission from "./teacherpages/TeacherClassworkSubmission";
import PdfClassStudent from "./components/principal/PdfClassStudent";
import PdfClassSubjects from "./components/principal/PdfClassSubjects";
import StudentSoa from "./studentpages/StudentSoa";
import PrincipalAnnouncement from "./principalpages/PrincipalAnnouncement";
import TeacherAnnouncements from "./teacherpages/TeacherAnnouncements";
import StudentAnnouncement from "./studentpages/StudentAnnouncement";
import FinanceAnnouncement from "./financepages/FinanceAnnouncement";
import RegistrarAnnouncement from "./registrarpages/RegistrarAnnouncement";
import RegistrarAcademicArchive from "./registrarpages/RegistrarAcademicArchive";
import RegistrarArchiveStudents from "./registrarpages/RegistrarArchiveStudents";
import ParentLogin from "./parentpages/ParentLogin";
import ParentLayout from "../layouts/ParentLayout";
import ParentDashboard from "./parentpages/ParentDashboard";
import ParentProfile from "./parentpages/ParentProfile";
import ParentSchedules from "./parentpages/ParentSchedules";
import ParentSoa from "./parentpages/ParentSoa";
import ParentGrade from "./parentpages/ParentGrade";
import TeacherSubjectArchive from "./teacherpages/TeacherSubjectArchive";
import TeacherSubjectDetailsArchived from "./teacherpages/TeacherSubjectDetailsArchive";
import TeacherStreamArchived from "./teacherpages/TeacherStreamArchived";
import TeacherStudentArchive from "./teacherpages/TeacherStudentArchive";
import TeacherClassworkArchive from "./teacherpages/TeacherClassworkArchive";
import TeacherQuizArchive from "./teacherpages/TeacherQuizArchive";
import PrintNoGoodMoral from "./components/registrar/PrintNoGoodMoral";
import PrintNoPsa from "./components/registrar/PrintNoPsa";
import PrintNoReport from "./components/registrar/PrintNoReport";
import PrintNoTranscript from "./components/registrar/PrintNoTranscript";
import StudentReviewer from "./studentpages/StudentReviewer";
import PrintWithBalance from "./components/finance/PrintWithBalance";
import EmployeeResetForm from "./components/EmployeeResetForm";
import StudentResetForm from "./components/StudentResetForm";
import GuardianResetForm from "./components/guardianResetForm";
import RegistrarClassroom from "./registrarpages/RegistrarClassroom";

const router = createBrowserRouter([
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            {
                path: "/admin/home",
                element: <AdminHome />,
            },
            {
                path: "/admin/profile",
                element: <AdminProfile />,
            },
            {
                path: "/admin/classlist",
                element: <AdminClassList />,
            },
            {
                path: "/admin/gradelistfee",
                element: <AdminClassListFee />,
            },
            {
                path: "/admin/subjectlist",
                element: <AdminSubjectList />,
            },
            {
                path: "/admin/academicyear",
                element: <AdminAcademicYear />,
            },
            {
                path: "/admin/studentlist",
                element: <AdminStudentList />,
            },
            {
                path: "/admin/employee",
                element: <AdminEmployeeList />,
            },
            {
                path: "/admin/announcement",
                element: <AdminAnnouncement />,
            },
            {
                path: "/admin/audit",
                element: <AdminAudit />,
            },
            {
                path: "/admin/employeearchive",
                element: <AdminEmpoyeeArchive />,
            },
        ],
    },
    {
        path: "/admin/login",
        element: <AdminLogin />,
    },
    {
        path: "/registrar/login",
        element: <RegistrarLogin />,
    },
    {
        path: "/registrar",
        element: <RegistrarLayout />,
        children: [
            {
                path: "/registrar/dashboard",
                element: <RegistrarDashboard />,
            },
            {
                path: "/registrar/addnew",
                element: <RegistrarNewStudent />,
            },
            {
                path: "/registrar/addold",
                element: <RegistrarOldStudent />,
            },
            {
                path: "/registrar/profile",
                element: <RegistrarProfile />,
            },
            {
                path: "/registrar/pre-enrolled",
                element: <RegistrarPreEnroll />,
            },
            {
                path: "/registrar/ready-for-enrollment",
                element: <RegistrarReadyEnroll />,
            },
            {
                path: "/registrar/enrolled",
                element: <RegistrarEnrolled />,
            },
            {
                path: "/registrar/announcements",
                element: <RegistrarAnnouncement />,
            },
            {
                path: "/registrar/archives",
                element: <RegistrarAcademicArchive />,
            },
            {
                path: "/registrar/students/archives/:archiveId",
                element: <RegistrarArchiveStudents />,
            },
            {
                path: "/registrar/classrooms",
                element: <RegistrarClassroom />,
            },
        ],
    },
    {
        path: "/finance/login",
        element: <FinanceLogin />,
    },
    {
        path: "/finance",
        element: <FinanceLayout />,
        children: [
            {
                path: "/finance/dashboard",
                element: <FinanceDashboard />,
            },
            {
                path: "/finance/pendingstudents",
                element: <FinancePendingStudents />,
            },
            {
                path: "/finance/confirmedstudents",
                element: <FinanceConfirmedStudents />,
            },
            {
                path: "/finance/students",
                element: <FinanceStudents />,
            },
            {
                path: "/finance/profile",
                element: <FinanceProfile />,
            },
            {
                path: "/finance/announcements",
                element: <FinanceAnnouncement />,
            },
        ],
    },
    {
        path: "/principal/login",
        element: <PrincipalLogin />,
    },
    {
        path: "/principal",
        element: <PrincipalLayout />,
        children: [
            {
                path: "/principal/dashboard",
                element: <PrincipalDashboard />,
            },
            {
                path: "/principal/profile",
                element: <PrincipalProfile />,
            },
            {
                path: "/principal/subject-list",
                element: <PrincipalSubjectList />,
            },
            {
                path: "/principal/teacher-list",
                element: <PrincipalTeacherList />,
            },
            {
                path: "/principal/class-list",
                element: <PrinciaplClassroomList />,
            },
            {
                path: "/principal/announcements",
                element: <PrincipalAnnouncement />,
            },
        ],
    },
    {
        path: "/teacher/login",
        element: <TeacherLogin />,
    },
    {
        path: "/teacher",
        element: <TeacherLayout />,
        children: [
            {
                path: "/teacher/dashboard",
                element: <TeacherDashboard />,
            },
            {
                path: "/teacher/profile",
                element: <TeacherProfile />,
            },
            {
                path: "/teacher/subjects",
                element: <TeacherSubject />,
            },
            {
                path: "/teacher/advisory-list",
                element: <TeacherAdvisory />,
            },
            {
                path: "/teacher/announcements",
                element: <TeacherAnnouncements />,
            },

            {
                path: "/teacher/subjects/:subjectId",
                element: <TeacherSubjectsDetails />,
                children: [
                    {
                        path: "/teacher/subjects/:subjectId/all",
                        element: <TeacherStream />,
                    },
                    {
                        path: "/teacher/subjects/:subjectId/classwork",
                        element: <TeacherClasswork />,
                    },
                    {
                        path: "/teacher/subjects/:subjectId/students",
                        element: <TeacherStudent />,
                    },
                    {
                        path: "/teacher/subjects/:subjectId/quiz",
                        element: <TeacherQuiz />,
                    },
                ],
            },
            {
                path: "/teacher/test-creation/:subjectId",
                element: <TeacherTestCreation />,
            },
            {
                path: "/teacher/test-creation/edit/:testId",
                element: <TeacherTestCreationEdit />,
            },
            {
                path: "/teacher/test-submissions/:testId",
                element: <TeacherTestSubmission />,
            },
            {
                path: "/teacher/test-submission/:testId/student/:studentId",
                element: <ViewStudentSubmission />,
            },
            {
                path: "/teacher/classwork-submissions/:classworkId",
                element: <TeacherClassworkSubmission />,
            },
            //archived
            {
                path: "/teacher/subjects/archived",
                element: <TeacherSubjectArchive />,
            },
            {
                path: "/teacher/archived/subjects/:subjectId",
                element: <TeacherSubjectDetailsArchived />,
                children: [
                    {
                        path: "/teacher/archived/subjects/:subjectId/all",
                        element: <TeacherStreamArchived />,
                    },
                    {
                        path: "/teacher/archived/subjects/:subjectId/classwork",
                        element: <TeacherClassworkArchive />,
                    },
                    {
                        path: "/teacher/archived/subjects/:subjectId/students",
                        element: <TeacherStudentArchive />,
                    },
                    {
                        path: "/teacher/archived/subjects/:subjectId/quiz",
                        element: <TeacherQuizArchive />,
                    },
                ],
            },
        ],
    },
    {
        path: "/student/login",
        element: <StudentLogin />,
    },
    {
        path: "/student",
        element: <StudentLayout />,
        children: [
            {
                path: "/student/dashboard",
                element: <StudentDashboard />,
            },
            {
                path: "/student/profile",
                element: <StudentProfile />,
            },
            {
                path: "/student/subjects",
                element: <StudentSubject />,
            },
            {
                path: "/student/grade",
                element: <StudentGrades />,
            },
            {
                path: "/student/soa",
                element: <StudentSoa />,
            },
            {
                path: "/student/announcements",
                element: <StudentAnnouncement />,
            },
            {
                path: "/student/subjects/:subjectId",
                element: <StudentSubjectDetails />,
                children: [
                    {
                        path: "/student/subjects/:subjectId/all",
                        element: <StudentStream />,
                    },
                    {
                        path: "/student/subjects/:subjectId/classwork",
                        element: <StudentClasswork />,
                    },
                    {
                        path: "/student/subjects/:subjectId/test",
                        element: <StudentTest />,
                    },
                ],
            },
        ],
    },
    {
        path: "/parent/login",
        element: <ParentLogin />,
    },
    {
        path: "/parent",
        element: <ParentLayout />,
        children: [
            {
                path: "/parent/dashboard",
                element: <ParentDashboard />,
            },
            {
                path: "/parent/profile",
                element: <ParentProfile />,
            },
            {
                path: "/parent/schedules",
                element: <ParentSchedules />,
            },
            {
                path: "/parent/soa",
                element: <ParentSoa />,
            },
            {
                path: "/parent/grades",
                element: <ParentGrade />,
            },
        ],
    },
    {
        path: "/student/subject/test/:testId",
        element: <StudentDoTest />,
    },
    {
        path: "/",
        element: <StudentLayout />,
    },
    {
        path: "/printpdfclassstudents",
        element: <PdfClassStudent />,
    },
    {
        path: "/printpdfclasssubjects",
        element: <PdfClassSubjects />,
    },
    //report gen registrar
    {
        path: "/printpdfgoodmoral",
        element: <PrintNoGoodMoral />,
    },
    {
        path: "/printpdfpsa",
        element: <PrintNoPsa />,
    },
    {
        path: "/printpdfreportcard",
        element: <PrintNoReport />,
    },
    {
        path: "/printpdftranscript",
        element: <PrintNoTranscript />,
    },
    {
        path: "/printstudentwithbalance",
        element: <PrintWithBalance />,
    },

    {
        path: "/testing",
        element: <StudentReviewer />,
    },
    {
        path: "/resetform/employee",
        element: <EmployeeResetForm />,
    },
    {
        path: "/resetform/student",
        element: <StudentResetForm />,
    },
    {
        path: "/resetform/parent",
        element: <GuardianResetForm />,
    },
]);

export default router;
