import { styled, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import HomeIcon from "@mui/icons-material/Home";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import TaskIcon from "@mui/icons-material/Task";
import AssignmentIcon from "@mui/icons-material/Assignment";

import DrawerHeader from "../Common/DrawerHeader";
import RouteItem from "../Common/RouteItem";
import { drawerWidth } from "../sharedStyles/drawerConfig";

import useApartment from "../../contexts/apartment";

const openedMixin = (theme: Theme): CSSObject => ({
  width: `${drawerWidth}rem`,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)})`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)})`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: `${drawerWidth}rem`,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

function NavigationBar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
}) {
  const { apartment } = useApartment() as { apartment: Apartment | "" };

  function handleDrawerClose() {
    setOpen(false);
  }
  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        <RouteItem text="Home" path="/home">
          <HomeIcon />
        </RouteItem>
        <RouteItem text="Invitations" path="/invitations">
          <PersonAddAlt1Icon />
        </RouteItem>
      </List>
      {apartment !== "" && (
        <>
          <Divider />
          <List>
            <RouteItem text="Tasks" path="/tasks">
              <TaskIcon />
            </RouteItem>
            <RouteItem text="Requests" path="/task_requests">
              <AssignmentIcon />
            </RouteItem>
          </List>
        </>
      )}
    </Drawer>
  );
}

export default NavigationBar;
