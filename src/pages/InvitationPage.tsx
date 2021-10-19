import { useQuery } from "react-query";
import useAuth from "../contexts/auth";
import meService from "../services/me";
import { ApartmentProvider } from "../contexts/apartment";
import ProtectedPageLayout from "./sharedLayout/ProtectedPageLayout";

function MainContent() {
  const { authState } = useAuth() as { authState: UserWithToken };
  const { isLoading, error, data } = useQuery("invitations", () =>
    meService.getInvitations(authState.token),
  );
  if (isLoading) return <div>Loading...</div>;

  if (error || data === undefined) return <div>An error has occurred</div>;

  console.log(data);
  const message = `Invitations here: ${data.sent}, ${data.received}`;
  return <div>{message}</div>;
}

function InvitationPage() {
  return (
    <ApartmentProvider>
      <ProtectedPageLayout>
        <MainContent />
      </ProtectedPageLayout>
    </ApartmentProvider>
  );
}
export default InvitationPage;
