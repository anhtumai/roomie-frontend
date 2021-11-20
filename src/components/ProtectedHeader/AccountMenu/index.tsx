import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { IconButton, Avatar, Menu, MenuItem } from "@mui/material";

import useAuth from "../../../contexts/auth";
import { getAbbreviation } from "../../../utils/common";

function AccountMenu() {
  const history = useHistory();
  const { logout, authState } = useAuth();
  const { name } = authState as UserWithToken;
  const abbreviation = getAbbreviation(name);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleRedirectProfile() {
    history.push("/profile");
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleLogOut() {
    logout();
  }

  return (
    <div>
      <IconButton onClick={handleClick} color="inherit">
        <Avatar sx={{ width: 32, height: 32 }}>{abbreviation}</Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleRedirectProfile}>Settings</MenuItem>
        <MenuItem onClick={handleLogOut}>Logout</MenuItem>
      </Menu>
    </div>
  );
}

export default AccountMenu;
