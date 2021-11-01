import ProtectedPageLayout from "./sharedLayout/ProtectedPageLayout";
import ApartmentForm from "../components/ApartmentForm";
import WeeklySchedure from "../components/WeeklySchedure";

import useApartment, { ApartmentProvider } from "../contexts/apartment";
import { InvitationsProvider } from "../contexts/invitations";

function MainContent() {
  const { isLoading, error, apartment } = useApartment();

  if (isLoading) return <div>Loading...</div>;
  if (error || apartment === undefined) return <div>An error has occurred</div>;
  if (apartment === "") return <ApartmentForm />;
  return <WeeklySchedure />;
}

function HomePage() {
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

export default HomePage;
