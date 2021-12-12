import { Link, useHistory } from "react-router-dom";
import { useState } from "react";

import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import HomeIcon from "@mui/icons-material/Home";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import TaskIcon from "@mui/icons-material/Task";
import AssignmentIcon from "@mui/icons-material/Assignment";

import useApartment from "contexts/apartment";

import { footerHeight } from "components/sharedStyles/footerStyles";

function MobileProtectedFooter() {
  const pathname = window.location.pathname;
  const history = useHistory();

  const [value, setValue] = useState(pathname);

  const { apartment } = useApartment() as { apartment: Apartment | "" };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: footerHeight,
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          history.push(newValue);
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          value="/home"
        />
        <BottomNavigationAction
          label="Invitations"
          icon={<PersonAddAlt1Icon />}
          value="/invitations"
        />
        {apartment !== "" && (
          <BottomNavigationAction
            label="Tasks"
            icon={<TaskIcon />}
            value="/tasks"
          />
        )}
        {apartment !== "" && (
          <BottomNavigationAction
            label="Requests"
            icon={<AssignmentIcon />}
            value="/task_requests"
          />
        )}
      </BottomNavigation>
    </Paper>
  );
}

export default MobileProtectedFooter;
