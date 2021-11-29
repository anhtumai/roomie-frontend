import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "react-query";

import { Box, Typography } from "@mui/material";

import SentInvitation from "./SentInvitation";
import ReceivedInvitation from "./ReceivedInvitation";

import useAuth from "contexts/auth";
import useInvitations from "contexts/invitations";
import invitationService from "services/invitation";

function Invitations({
  invitationCollection,
}: {
  invitationCollection: InvitationCollection;
}) {
  const history = useHistory();
  const { sent, received } = invitationCollection;
  const { authState } = useAuth() as { authState: UserWithToken };
  const {
    setInvitationCollection,
    cancelInvitationsQueries,
    invalidateInvitationCollection,
  } = useInvitations();

  const cancelInvitationMutation = useMutation(
    (invitationId: number) =>
      invitationService.deleteById(authState.token, invitationId),
    {
      onMutate: async (invitationId: number) => {
        cancelInvitationsQueries();
        setInvitationCollection({
          ...invitationCollection,
          sent: invitationCollection.sent.filter(
            (invitation) => invitation.id !== invitationId,
          ),
        });

        return { previousCollection: invitationCollection };
      },

      onError: (err, variables, context) => {
        console.log(err);
        if (context?.previousCollection) {
          setInvitationCollection(context.previousCollection);
        }
        const errMessage =
          (err as any).response?.data.erro || "Fail to cancel invitation";
        toast.error(errMessage, {
          position: toast.POSITION.TOP_CENTER,
        });
      },
      onSettled: (data, error, variables, context) => {
        invalidateInvitationCollection();
      },
    },
  );

  const rejectInvitationMutation = useMutation(
    (invitationId: number) =>
      invitationService.reject(authState.token, invitationId),
    {
      onMutate: async (invitationId: number) => {
        cancelInvitationsQueries();
        setInvitationCollection({
          ...invitationCollection,
          received: invitationCollection.received.filter(
            (invitation) => invitation.id !== invitationId,
          ),
        });

        return { previousCollection: invitationCollection };
      },

      onError: (err, variables, context) => {
        console.log(err);
        if (context?.previousCollection) {
          setInvitationCollection(context.previousCollection);
        }
        const errMessage =
          (err as any).response?.data.erro || "Fail to reject invitation";
        toast.error(errMessage, {
          position: toast.POSITION.TOP_CENTER,
        });
      },
      onSettled: (data, error, variables, context) => {
        invalidateInvitationCollection();
      },
    },
  );

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
        <SentInvitation
          key={invitation.id}
          invitation={invitation}
          handleDelete={handleDelete}
        />
      ))}
      {received.map((invitation) => (
        <ReceivedInvitation
          key={invitation.id}
          invitation={invitation}
          handleAccept={handleAccept}
          handleReject={handleReject}
        />
      ))}
    </Box>
  );
}

export default Invitations;
