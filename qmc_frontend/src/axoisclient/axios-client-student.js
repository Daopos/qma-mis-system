import axios from "axios";

const axiosClientStudent = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

axiosClientStudent.interceptors.request.use((Config) => {
    const token = localStorage.getItem("STUDENT_ACCESS_TOKEN");
    Config.headers.Authorization = `Bearer ${token}`;

    return Config;
});
// 65|mHaK4QEqaCN6RXKFMeJzx5BHretOMvOhLB5D0zUdb6abab20
axiosClientStudent.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;

        if (response.status === 401) {
            localStorage.removeItem("STUDENT_ACCESS_TOKEN");
        }

        throw error;
    }
);

export default axiosClientStudent;
