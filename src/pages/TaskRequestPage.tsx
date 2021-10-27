import ProtectedPageLayout from "./sharedLayout/ProtectedPageLayout";
import ApartmentForm from "../components/ApartmentForm";
import useApartment, { ApartmentProvider } from "../contexts/apartment";
import { InvitationsProvider } from "../contexts/invitations";

function MainContent() {
  const { isLoading, error, apartment } = useApartment();

  return isLoading ? (
    <div>Loading...</div>
  ) : error || apartment === undefined ? (
    <div>An error has occurred</div>
  ) : apartment === "" ? (
    <ApartmentForm />
  ) : (
    <div>Here is the list of requested tasks</div>
  );
}

function TaskRequestPage() {
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

export default TaskRequestPage;
