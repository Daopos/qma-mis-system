import React, { useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Dropdown from "react-bootstrap/Dropdown";
import AnnouncementCSS from "./Announcement.module.css";

const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
};

const ReadMore = ({ children }) => {
    const text = children || "";
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };

    const isLongText = text.length > 400;

    return (
        <p
            className={AnnouncementCSS.readFont}
            style={{ marginTop: 20, opacity: 0.75 }}
        >
            {isLongText && isReadMore ? text.slice(0, 400) : text}
            {isLongText && (
                <span
                    onClick={toggleReadMore}
                    className="read-or-hide"
                    style={{ color: "green", cursor: "pointer" }}
                >
                    {isReadMore ? "...read more" : " show less"}
                </span>
            )}
        </p>
    );
};

export default function Announcement({
    title,
    desc,
    date,
    owner,
    currentUserRole,
    onEdit,
    onDelete,
    recipient,
}) {
    const canEditOrDelete = owner === currentUserRole;

    return (
        <div
            style={{
                borderRadius: 20,
                backgroundColor: "rgb(247, 247, 249)",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            }}
        >
            <div
                className="d-flex justify-content-between align-items-center"
                style={{ padding: "20px 20px 0px 20px" }}
            >
                <h2>{title}</h2>
                {canEditOrDelete && (
                    <div>
                        <Dropdown>
                            <Dropdown.Toggle
                                className={AnnouncementCSS.dropdownToggle}
                                id="dropdown-basic"
                                aria-expanded="false"
                            >
                                <MoreHorizIcon
                                    className={AnnouncementCSS.dotIcon}
                                />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={onEdit}>
                                    Edit
                                </Dropdown.Item>
                                <Dropdown.Item onClick={onDelete}>
                                    Delete
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                )}
            </div>
            <div style={{ padding: 20 }}>
                <ReadMore>{desc}</ReadMore>
            </div>
            <div
                className="d-flex justify-content-between align-items-center"
                style={{ padding: 20 }}
            >
                <h5
                    className={AnnouncementCSS.annFont}
                    style={{ opacity: 0.28 }}
                >
                    {formatDate(date)}
                </h5>
                <h5 style={{ opacity: 0.28 }}>{owner}</h5>
            </div>
            {/* Conditionally render recipient information */}
            {canEditOrDelete && recipient && (
                <div style={{ padding: 20 }}>
                    <h6>To: {recipient}</h6>
                </div>
            )}
        </div>
    );
}
