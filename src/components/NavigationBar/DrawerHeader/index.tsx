// @ts-ignore
import { styled } from "@mui/material/styles";

const DrawerHeader = styled("div")((data: any) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: data.theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...data.theme.mixins.toolbar,
}));

export default DrawerHeader;
