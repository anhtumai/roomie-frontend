import { Box } from "@mui/material";
import { useQueryClient } from "react-query";
import { useHistory } from "react-router";
import useAuth from "../../contexts/auth";
import useInvitations from "../../contexts/invitations";
import useNotification from "../../contexts/notification";

import invitationService from "../../services/invitation";

function Invitations({
  invitationCollection,
}: {
  invitationCollection: InvitationCollection;
}) {
  const queryClient = useQueryClient();
  const history = useHistory();
  const { sent, received } = invitationCollection;
  const { authState } = useAuth() as { authState: UserWithToken };
  const { setNotification } = useNotification();
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
      setNotification(`Now you are member of ${newApartmentName}`, "success");
    } catch (err) {
      console.log(err);
      setNotification("Fail to accept invitation", "error");
    }
  }

  function handleReject(invitationId: number) {
    rejectInvitationMutation.mutate(invitationId);
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
          {invitation.invitee.username} ({invitation.invitee.name}) invites you
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
