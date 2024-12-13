import axios from "axios";

const axiosClientAll = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

// 65|mHaK4QEqaCN6RXKFMeJzx5BHretOMvOhLB5D0zUdb6abab20
axiosClientAll.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        throw error;
    }
);

export default axiosClientAll;
