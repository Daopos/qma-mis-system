import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    user: null,
    adminToken: null,
    registrarToken: null,
    financeToken: null,
    principalToken: null,
    teacherToken: null,
    studentToken: null,
    parentToken: null,
    notification: null,
    setUser: () => {},
    setAdminToken: () => {},
    setRegistrarToken: () => {},
    setPrincipalToken: () => {},
    setFinanceToken: () => {},
    setTeacherToken: () => {},
    setStudentToken: () => {},
    setParentToken: () => {},
    setNotification: () => {},
});

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [adminToken, _setAdminToken] = useState(
        localStorage.getItem("ADMIN_ACCESS_TOKEN")
    );
    const [registrarToken, _setRegistrarToken] = useState(
        localStorage.getItem("REGISTRAR_ACCESS_TOKEN")
    );
    const [financeToken, _setFinanceToken] = useState(
        localStorage.getItem("FINANCE_ACCESS_TOKEN")
    );
    const [principalToken, _setPrincipalToken] = useState(
        localStorage.getItem("PRINCIPAL_ACCESS_TOKEN")
    );
    const [teacherToken, _setTeacherToken] = useState(
        localStorage.getItem("TEACHER_ACCESS_TOKEN")
    );
    const [studentToken, _setStudentToken] = useState(
        localStorage.getItem("STUDENT_ACCESS_TOKEN")
    );
    const [parentToken, _setParentToken] = useState(
        localStorage.getItem("PARENT_ACCESS_TOKEN")
    );
    const [notification, _setNotification] = useState("");

    const setNotification = (message) => {
        _setNotification(message);
        setTimeout(() => {
            _setNotification("");
        }, 5000);
    };

    const setAdminToken = (token) => {
        // console.log("Setting token:", token);
        _setAdminToken(token);

        if (token) {
            localStorage.setItem("ADMIN_ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("ADMIN_ACCESS_TOKEN");
        }
    };

    const setRegistrarToken = (token) => {
        // console.log("Setting token:", token);
        _setRegistrarToken(token);

        if (token) {
            localStorage.setItem("REGISTRAR_ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("REGISTRAR_ACCESS_TOKEN");
        }
    };

    const setFinanceToken = (token) => {
        // console.log("Setting token:", token);
        _setFinanceToken(token);

        if (token) {
            localStorage.setItem("FINANCE_ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("FINANCE_ACCESS_TOKEN");
        }
    };

    const setPrincipalToken = (token) => {
        // console.log("Setting token:", token);
        _setPrincipalToken(token);

        if (token) {
            localStorage.setItem("PRINCIPAL_ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("PRINCIPAL_ACCESS_TOKEN");
        }
    };

    const setTeacherToken = (token) => {
        console.log("Setting token:", token);
        _setTeacherToken(token);

        if (token) {
            localStorage.setItem("TEACHER_ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("TEACHER_ACCESS_TOKEN");
        }
    };

    const setStudentToken = (token) => {
        console.log("Setting token:", token);
        _setStudentToken(token);

        if (token) {
            localStorage.setItem("STUDENT_ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("STUDENT_ACCESS_TOKEN");
        }
    };

    const setParentToken = (token) => {
        console.log("Setting token:", token);
        _setParentToken(token);

        if (token) {
            localStorage.setItem("PARENT_ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("PARENT_ACCESS_TOKEN");
        }
    };

    return (
        <StateContext.Provider
            value={{
                user,
                adminToken,
                registrarToken,
                financeToken,
                principalToken,
                teacherToken,
                studentToken,
                parentToken,
                setUser,
                setAdminToken,
                setRegistrarToken,
                setFinanceToken,
                setPrincipalToken,
                setTeacherToken,
                setStudentToken,
                setParentToken,
                notification,
                setNotification,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
