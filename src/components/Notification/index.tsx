import { useEffect } from "react";

import Alert from "@mui/material/Alert";
import useNotification from "../../contexts/notification";

function Notification() {
  const { notificationState, clear } = useNotification();
  useEffect(() => {
    if (notificationState === null) return;
    const timeId = setTimeout(() => {
      clear();
    }, 3000);

    return () => {
      clearTimeout(timeId);
    };
  });

  if (notificationState === null) return null;
  const { type, message } = notificationState;
  return <Alert severity={type}>{message}</Alert>;
}
export default Notification;
