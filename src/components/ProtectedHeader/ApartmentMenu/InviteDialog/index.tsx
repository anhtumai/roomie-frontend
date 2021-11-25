import { useState } from "react";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

import useAuth from "../../../../contexts/auth";
import useInvitations from "../../../../contexts/invitations";
import invitationService from "../../../../services/invitation";

function InviteDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
}) {
  const { authState } = useAuth() as { authState: UserWithToken };
  const {
    invitationCollection,
    setInvitationCollection,
    invalidateInvitationCollection,
  } = useInvitations();
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
      const newInvitation = await invitationService.create(
        authState.token,
        inviteeUsername,
      );

      if (invitationCollection) {
        const { sent } = invitationCollection;
        const updatedSent = [...sent, newInvitation];
        setInvitationCollection({
          ...invitationCollection,
          sent: updatedSent,
        });
      } else {
        invalidateInvitationCollection();
      }
      toast.success(`Send invitation to ${inviteeUsername}`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (err) {
      console.log(err);
      const errMessage =
        (err as any).response?.data.error || "Fail to send invitation";
      toast.error(errMessage, {
        position: toast.POSITION.TOP_CENTER,
      });
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
