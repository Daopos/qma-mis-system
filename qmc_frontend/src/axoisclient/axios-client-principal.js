import axios from "axios";

const axiosClientPrincipal = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

axiosClientPrincipal.interceptors.request.use((Config) => {
    const token = localStorage.getItem("PRINCIPAL_ACCESS_TOKEN");
    Config.headers.Authorization = `Bearer ${token}`;

    return Config;
});
// 65|mHaK4QEqaCN6RXKFMeJzx5BHretOMvOhLB5D0zUdb6abab20
axiosClientPrincipal.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;

        if (response.status === 401) {
            localStorage.removeItem("PRINCIPAL_ACCESS_TOKEN");
        }

        throw error;
    }
);

export default axiosClientPrincipal;
