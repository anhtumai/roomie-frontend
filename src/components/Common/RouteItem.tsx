import { ReactNode } from "react";

import { ListItem, ListItemIcon, ListItemText } from "@mui/material";

import { Link } from "react-router-dom";

function RouteItem({
  text,
  path,
  children,
}: {
  text: string;
  path: string;
  children: ReactNode;
}) {
  return (
    <ListItem button key={text} component={Link} to={path}>
      <ListItemIcon>{children}</ListItemIcon>
      <ListItemText primary={text}></ListItemText>
    </ListItem>
  );
}

export default RouteItem;
