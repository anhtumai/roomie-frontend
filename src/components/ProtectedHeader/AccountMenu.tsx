import { IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";

import useAuth from "../../contexts/auth";

function AccountMenu() {
  const { logout, authState } = useAuth();
  const { name } = authState as UserWithToken;
  const abbreviation = name
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("")
    .slice(0, 2);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
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
          vertical: "top",
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
        <MenuItem onClick={handleClose}>Settings</MenuItem>
        <MenuItem onClick={handleLogOut}>Logout</MenuItem>
      </Menu>
    </div>
  );
}

export default AccountMenu;
