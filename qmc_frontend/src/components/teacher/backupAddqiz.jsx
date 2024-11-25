import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import ButtonB from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function TeacherAddQuiz({ show, onHide }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <Modal show={show} onHide={onHide} fullscreen={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-center">
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            id="basic-button"
                            aria-controls={open ? "basic-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={handleClick}
                        >
                            Add Question
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                "aria-labelledby": "basic-button",
                            }}
                        >
                            <MenuItem onClick={handleClose}>
                                Multiple Choice
                            </MenuItem>
                            <MenuItem onClick={handleClose}>Essay</MenuItem>
                            <MenuItem onClick={handleClose}>
                                Identification
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                Check boxes
                            </MenuItem>
                        </Menu>
                    </div>

                    <div></div>
                </Modal.Body>
            </Modal>
        </>
    );
}
