import Typography from "@mui/material/Typography";

import NotificationBadge from "./NotificationBadge";
import AccountMenu from "./AccountMenu";
import ApartmentMenu from "./ApartmentMenu";
import TaskMenu from "./TaskMenu";

import useApartment from "contexts/apartment";

function SharedHeaderComponents() {
  const { apartment } = useApartment();
  const hasApartment = apartment !== "" && apartment !== undefined;
  return (
    <>
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
    </>
  );
}

export default SharedHeaderComponents;
