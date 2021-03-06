import { createContext, ReactNode, useContext } from "react";
import { useQuery, useQueryClient } from "react-query";

import useAuth from "contexts/auth";
import meService from "services/me";

interface InvitationsContextType {
  isLoading: boolean;
  error: unknown;
  invitationCollection: InvitationCollection | undefined;
  setInvitationCollection: (x: InvitationCollection) => void;
  invalidateInvitationCollection: () => void;
  cancelInvitationsQueries: () => void;
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

  function setInvitationCollection(
    updatedInvitationCollection: InvitationCollection,
  ) {
    queryClient.setQueryData<InvitationCollection>(
      "invitations",
      updatedInvitationCollection,
    );
  }

  function invalidateInvitationCollection() {
    queryClient.invalidateQueries("invitations");
  }

  function cancelInvitationsQueries() {
    queryClient.cancelQueries("invitations");
  }

  return (
    <InvitationsContext.Provider
      value={{
        isLoading,
        error,
        invitationCollection: data,
        setInvitationCollection,
        invalidateInvitationCollection,
        cancelInvitationsQueries,
      }}
    >
      {children}
    </InvitationsContext.Provider>
  );
}

export default function useInvitations() {
  return useContext(InvitationsContext);
}
