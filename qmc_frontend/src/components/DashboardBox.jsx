import React from "react";
import "./DashboardBox.css";

export default function DashboardBox(props) {
    return (
        <div className="d-flex dashboard-container">
            <div style={{ backgroundColor: props.BoxColor }}></div>
            <div>
                <div>
                    <h1>{props.count || "0"}</h1>
                    {/* <h1>0</h1> */}
                </div>
                <h4>{props.title}</h4>
            </div>
        </div>
    );
}
