import * as React from "react";
import { useState } from "react";

import { Button, Menu, MenuItem, Divider } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

import InviteDialog from "./InviteDialog";

import useApartment from "../../../contexts/apartment";
import useAuth from "../../../contexts/auth";

import { iconSx } from "../style";
import { headerTextButtonSx } from "../../sharedStyles/headerStyles";

function ApartmentMenu() {
  const [openInvitationDialog, setOpenInvitationDialog] = useState(false);

  const apartmentContext = useApartment();
  const apartment = apartmentContext.apartment as Apartment;
  const { leaveApartmentMutation } = apartmentContext;
  const { authState } = useAuth() as { authState: UserWithToken };

  const isAdmin = authState.username === apartment.admin.username;

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
        sx={headerTextButtonSx}
      >
        <p>Apartment</p>
        <KeyboardArrowDownIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => setOpenInvitationDialog(true)} disableRipple>
          <PersonAddAlt1Icon sx={iconSx} /> Invite
        </MenuItem>
        {isAdmin && (
          <MenuItem onClick={handleClose} disableRipple>
            <EditIcon sx={iconSx} /> Edit
          </MenuItem>
        )}
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleLeave} disableRipple>
          <ExitToAppIcon sx={iconSx} /> Leave
        </MenuItem>
        {isAdmin && (
          <MenuItem onClick={handleClose} disableRipple>
            <DeleteIcon sx={iconSx} /> Delete
          </MenuItem>
        )}
      </Menu>
      <InviteDialog
        open={openInvitationDialog}
        setOpen={setOpenInvitationDialog}
      ></InviteDialog>
    </div>
  );
}

export default ApartmentMenu;
