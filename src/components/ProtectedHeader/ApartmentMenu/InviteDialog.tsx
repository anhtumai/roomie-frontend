import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useQueryClient } from "react-query";
import { createBrowserHistory } from "history";

import useAuth from "../../../contexts/auth";
import useNotification from "../../../contexts/notification";
import invitationService from "../../../services/invitation";

function InviteDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
}) {
  const history = createBrowserHistory();
  const queryClient = useQueryClient();
  const { authState } = useAuth() as { authState: UserWithToken };
  const { setNotification } = useNotification();
  const [inviteeUsername, setInviteeUsername] = useState("");

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setInviteeUsername(event.target.value);
  }

  function handleClose() {
    setInviteeUsername("");
    setOpen(false);
  }

  async function handleInvite(event: React.SyntheticEvent) {
    event.preventDefault();
    setInviteeUsername("");
    setOpen(false);

    try {
      await invitationService.create(authState.token, inviteeUsername);
      if (history.location.pathname === "/invitations") {
        queryClient.invalidateQueries("invitations");
      }
      setNotification(`Send invitation to ${inviteeUsername}`, "success");
    } catch (err) {
      console.log(err);
      console.log((err as any).response);
      setNotification("Fail to send invitation", "error");
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleInvite}>
        <DialogTitle>Invite</DialogTitle>
        <DialogContent>
          <DialogContentText>Insert invitee's username</DialogContentText>
          <TextField
            autoFocus
            label="Initee Username"
            data-testid="username"
            variant="filled"
            required
            value={inviteeUsername}
            onChange={onChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Invite</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default InviteDialog;
