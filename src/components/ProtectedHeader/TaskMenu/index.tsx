import React, { useState } from "react";

import { Button, Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";

import CreateTaskDialog from "./CreateTaskDialog";

import { iconSx } from "components/ProtectedHeader/style";
import "components/ProtectedHeader/style.css";

function TaskMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [openTaskDialog, setOpenTaskDialog] = useState(false);

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleOpenTaskDialog() {
    setOpenTaskDialog(true);
  }

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        disableElevation
        onClick={handleClick}
        sx={{
          color: "white",
          textTransform: "none",
          fontSize: "1rem",
        }}
      >
        <p>Task</p>
        <KeyboardArrowDownIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className="drop-down-menu"
      >
        <MenuItem onClick={handleOpenTaskDialog}>
          <AddIcon sx={iconSx} /> Create
        </MenuItem>
      </Menu>
      <CreateTaskDialog open={openTaskDialog} setOpen={setOpenTaskDialog} />
    </div>
  );
}

export default TaskMenu;
