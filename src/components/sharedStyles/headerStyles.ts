import { SxProps } from "@mui/system";

// if this value changes, change the value navigation-bar__drawer-header in this file also:components/NavigationBar/style.css
export const headerHeight = "4.5rem";

export const appBarSx = {
  backgroundColor: "#282c2c",
  height: headerHeight,
};

export const headerTextButtonSx: SxProps = {
  color: "white",
  textTransform: "none",
  fontSize: "1rem",
};
