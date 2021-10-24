import * as React from "react";
import { useState } from "react";

import { Button, Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";

import useApartment from "../../../contexts/apartment";
import { iconSx } from "./style";

function TaskMenu() {
  const [openInvitationDialog, setOpenInvitationDialog] = useState(false);

  const apartmentContext = useApartment();
  const apartment = apartmentContext.apartment as Apartment;
  const { leaveApartmentMutation } = apartmentContext;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleLeave() {
    const decision = window.confirm(`Leave apartment ${apartment.name} ?`);
    if (decision) {
      leaveApartmentMutation.mutate();
    }
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
        <MenuItem onClick={() => setOpenInvitationDialog(true)} disableRipple>
          <AddIcon sx={iconSx} /> Create
        </MenuItem>
      </Menu>
    </div>
  );
}

export default TaskMenu;
