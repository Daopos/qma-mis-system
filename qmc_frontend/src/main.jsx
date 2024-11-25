import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./App.css";
import router from "./router.jsx";
import { ContextProvider } from "./context/ContextProvider.jsx";
import { QueryClient, QueryClientProvider } from "react-query"; // Import QueryClient and QueryClientProvider

const queryClient = new QueryClient(); // Create a QueryClient instance

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ContextProvider>
            <QueryClientProvider client={queryClient}>
                {/* Wrap RouterProvider with QueryClientProvider */}
                <RouterProvider router={router} />
            </QueryClientProvider>
        </ContextProvider>
    </React.StrictMode>
);
