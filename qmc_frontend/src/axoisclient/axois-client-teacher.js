import axios from "axios";

const axiosClientTeacher = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

axiosClientTeacher.interceptors.request.use((Config) => {
    const token = localStorage.getItem("TEACHER_ACCESS_TOKEN");
    Config.headers.Authorization = `Bearer ${token}`;

    return Config;
});
// 65|mHaK4QEqaCN6RXKFMeJzx5BHretOMvOhLB5D0zUdb6abab20
axiosClientTeacher.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;

        if (response.status === 401) {
            localStorage.removeItem("TEACHER_ACCESS_TOKEN");
        }

        throw error;
    }
);

export default axiosClientTeacher;
