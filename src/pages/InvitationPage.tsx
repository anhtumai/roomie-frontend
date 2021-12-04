import useInvitations from "../contexts/invitations";

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
    <ProtectedPageLayout>
      <MainContent />
    </ProtectedPageLayout>
  );
}
export default InvitationPage;
