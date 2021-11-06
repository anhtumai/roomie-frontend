import { styled } from "@mui/material/styles";

import { Toolbar, Typography, IconButton } from "@mui/material";

import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";

import NotificationBadge from "../NotificationBadge";
import AccountMenu from "./AccountMenu";
import ApartmentMenu from "./ApartmentMenu";
import TaskMenu from "./TaskMenu";

import { drawerWidth } from "../sharedStyles/drawerConfig";
import { appBarSx } from "../sharedStyles/headerStyles";

import useApartment from "../../contexts/apartment";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: `${drawerWidth}rem`,
    width: `calc(100% - ${drawerWidth}rem)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function ProtectedHeader({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
}) {
  const { apartment } = useApartment();
  const hasApartment = apartment !== "" && apartment !== undefined;
  function handleDrawerOpen() {
    setOpen(true);
  }
  return (
    <AppBar position="fixed" open={open} sx={appBarSx}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: "1em",
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Roomie
        </Typography>
        {hasApartment && (
          <>
            <TaskMenu />
            <ApartmentMenu />
          </>
        )}
        <NotificationBadge />
        <AccountMenu />
      </Toolbar>
    </AppBar>
  );
}

export default ProtectedHeader;
