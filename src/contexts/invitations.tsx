import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "react-query";

import { toast } from "react-toastify";

import useAuth from "../contexts/auth";
import invitationService from "../services/invitation";
import meService from "../services/me";

type UseInvitationCollectionMutationResult = UseMutationResult<
  never | undefined,
  unknown,
  number,
  {
    previousCollection: InvitationCollection | undefined;
  }
>;

interface InvitationsContextType {
  isLoading: boolean;
  error: unknown;
  invitationCollection: InvitationCollection | undefined;
  cancelInvitationMutation: UseInvitationCollectionMutationResult;
  rejectInvitationMutation: UseInvitationCollectionMutationResult;
}

const InvitationsContext = createContext<InvitationsContextType>(
  {} as InvitationsContextType,
);

export function InvitationsProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const queryClient = useQueryClient();
  const { authState } = useAuth() as { authState: UserWithToken };
  const { isLoading, error, data } = useQuery("invitations", () =>
    meService.getInvitations(authState.token),
  );
  const cancelInvitationMutation = useMutation(
    (invitationId: number) =>
      invitationService.deleteById(authState.token, invitationId),
    {
      onMutate: async (invitationId: number) => {
        await queryClient.cancelQueries("invitations");
        const previousCollection =
          queryClient.getQueryData<InvitationCollection>("invitations");

        if (previousCollection) {
          queryClient.setQueryData<InvitationCollection>("invitations", {
            sent: previousCollection.sent.filter(
              (invitation) => invitation.id !== invitationId,
            ),
            received: previousCollection.sent.filter(
              (invitation) => invitation.id !== invitationId,
            ),
          });
        }

        return { previousCollection };
      },

      onError: (err, variables, context) => {
        console.log(err);
        if (context?.previousCollection) {
          queryClient.setQueryData<InvitationCollection>(
            "invitations",
            context.previousCollection,
          );
        }
        toast.error("Fail to cancel invitation", {
          position: toast.POSITION.TOP_CENTER,
        });
      },

      onSettled: () => {
        queryClient.invalidateQueries("invitations");
      },
    },
  );

  const rejectInvitationMutation = useMutation(
    (invitationId: number) =>
      invitationService.reject(authState.token, invitationId),
    {
      onMutate: async (invitationId: number) => {
        await queryClient.cancelQueries("invitations");
        const previousCollection =
          queryClient.getQueryData<InvitationCollection>("invitations");

        if (previousCollection) {
          queryClient.setQueryData<InvitationCollection>("invitations", {
            sent: previousCollection.sent.filter(
              (invitation) => invitation.id !== invitationId,
            ),
            received: previousCollection.sent.filter(
              (invitation) => invitation.id !== invitationId,
            ),
          });
        }

        return { previousCollection };
      },

      onError: (err, variables, context) => {
        console.log(err);
        if (context?.previousCollection) {
          queryClient.setQueryData<InvitationCollection>(
            "invitations",
            context.previousCollection,
          );
        }
        toast.error("Fail to reject invitation", {
          position: toast.POSITION.TOP_CENTER,
        });
      },

      onSettled: () => {
        queryClient.invalidateQueries("invitations");
      },
    },
  );

  return (
    <InvitationsContext.Provider
      value={{
        isLoading,
        error,
        invitationCollection: data,
        cancelInvitationMutation,
        rejectInvitationMutation,
      }}
    >
      {children}
    </InvitationsContext.Provider>
  );
}

export default function useInvitations() {
  return useContext(InvitationsContext);
}
