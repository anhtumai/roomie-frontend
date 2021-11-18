import { ReactNode } from "react";
import { Link } from "react-router-dom";

import { ListItem, ListItemIcon, ListItemText } from "@mui/material";

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
