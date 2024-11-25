import axios from "axios";

const axiosClientAdmin = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

axiosClientAdmin.interceptors.request.use((Config) => {
    const token = localStorage.getItem("ADMIN_ACCESS_TOKEN");
    Config.headers.Authorization = `Bearer ${token}`;

    return Config;
});
// 65|mHaK4QEqaCN6RXKFMeJzx5BHretOMvOhLB5D0zUdb6abab20
axiosClientAdmin.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;

        if (response.status === 401) {
            localStorage.removeItem("ADMIN_ACCESS_TOKEN");
        }

        throw error;
    }
);

export default axiosClientAdmin;
