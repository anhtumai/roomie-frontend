import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import { Box, Typography } from "@mui/material";

import useAuth from "../../contexts/auth";
import useInvitations from "../../contexts/invitations";
import invitationService from "../../services/invitation";

function Invitations({
  invitationCollection,
}: {
  invitationCollection: InvitationCollection;
}) {
  const history = useHistory();
  const { sent, received } = invitationCollection;
  const { authState } = useAuth() as { authState: UserWithToken };
  const { cancelInvitationMutation, rejectInvitationMutation } =
    useInvitations();

  function handleDelete(invitationId: number) {
    cancelInvitationMutation.mutate(invitationId);
  }

  async function handleAccept(invitationId: number) {
    try {
      await invitationService.accept(authState.token, invitationId);
      history.push("/home");
      const newApartmentName = invitationCollection.received.find(
        (invitation) => invitation.id === invitationId,
      )?.apartment.name;
      toast.success(`Now you are member of ${newApartmentName}`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (err) {
      console.log(err);
      toast.error("Fail to accept invitation", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }

  function handleReject(invitationId: number) {
    rejectInvitationMutation.mutate(invitationId);
  }

  if (
    invitationCollection.sent.length === 0 &&
    invitationCollection.received.length === 0
  ) {
    return (
      <Box>
        <Typography>There are no invitations</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {sent.map((invitation) => (
        <div key={invitation.id}>
          You have sent an invitation to {invitation.invitee.username} (
          {invitation.invitee.name})
          <button onClick={() => handleDelete(invitation.id)}>Cancel</button>
        </div>
      ))}
      {received.map((invitation) => (
        <div key={invitation.id}>
          {invitation.invitor.username} ({invitation.invitor.name}) invites you
          to {invitation.apartment.name}
          <button onClick={() => handleAccept(invitation.id)}>
            Accept
          </button>{" "}
          <button onClick={() => handleReject(invitation.id)}>Reject</button>
        </div>
      ))}
    </Box>
  );
}

export default Invitations;
