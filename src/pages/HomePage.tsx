import ProtectedPageLayout from "./sharedLayout/ProtectedPageLayout";
import ApartmentForm from "../components/ApartmentForm";
import useApartment, { ApartmentProvider } from "../contexts/apartment";

function MainContent() {
  const { isLoading, error, apartment } = useApartment();

  return isLoading ? (
    <div>Loading...</div>
  ) : error || apartment === undefined ? (
    <div>An error has occurred</div>
  ) : apartment === "" ? (
    <ApartmentForm />
  ) : (
    <div>One Apartment</div>
  );
}

function HomePage() {
  return (
    <ApartmentProvider>
      <ProtectedPageLayout>
        <MainContent />
      </ProtectedPageLayout>
    </ApartmentProvider>
  );
}

export default HomePage;
