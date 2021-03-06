import { Toolbar, IconButton } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";

import { drawerWidth } from "components/sharedStyles/drawerConfig";
import SharedHeaderComponents from "../SharedHeaderComponents";

import { appBarSx } from "components/sharedStyles/headerStyles";

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

function DesktopProtectedHeader({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
}) {
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
        <SharedHeaderComponents />
      </Toolbar>
    </AppBar>
  );
}
export default DesktopProtectedHeader;
