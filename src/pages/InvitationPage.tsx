import { ApartmentProvider } from "../contexts/apartment";
import useInvitations, { InvitationsProvider } from "../contexts/invitations";

import ProtectedPageLayout from "./sharedLayout/ProtectedPageLayout";
import Invitations from "../components/Invitations";

function MainContent() {
  const { isLoading, error, invitationCollection } = useInvitations();
  if (isLoading) return <div>Loading...</div>;

  if (error || invitationCollection === undefined)
    return <div>An error has occurred</div>;

  return <Invitations invitationCollection={invitationCollection} />;
}

function InvitationPage() {
  return (
    <ApartmentProvider>
      <InvitationsProvider>
        <ProtectedPageLayout>
          <MainContent />
        </ProtectedPageLayout>
      </InvitationsProvider>
    </ApartmentProvider>
  );
}
export default InvitationPage;
