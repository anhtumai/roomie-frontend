import * as React from "react";
import { useState } from "react";

import { Button, Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";

import { iconSx } from "./style";
import TaskDialog from "./TaskDialog";

function TaskMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [openTaskDialog, setOpenTaskDialog] = useState(false);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
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
        onClick={handleClick}
        sx={{
          color: "white",
          paddingRight: "1.25rem",
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
      >
        <MenuItem onClick={handleOpenTaskDialog}>
          <AddIcon sx={iconSx} /> Create
        </MenuItem>
      </Menu>
      <TaskDialog open={openTaskDialog} setOpen={setOpenTaskDialog} />
    </div>
  );
}

export default TaskMenu;
