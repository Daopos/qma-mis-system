import axios from "axios";

const axiosClientParent = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

axiosClientParent.interceptors.request.use((Config) => {
    const token = localStorage.getItem("PARENT_ACCESS_TOKEN");
    Config.headers.Authorization = `Bearer ${token}`;

    return Config;
});
axiosClientParent.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;

        if (response.status === 401) {
            localStorage.removeItem("PARENT_ACCESS_TOKEN");
        }

        throw error;
    }
);

export default axiosClientParent;
