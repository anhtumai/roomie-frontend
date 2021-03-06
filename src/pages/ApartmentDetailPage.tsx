import ProtectedPageLayout from "./ProtectedPageLayout";
import ApartmentDetail from "components/ApartmentDetail";

import useApartment from "contexts/apartment";

function MainContent() {
  const { isLoading, error, apartment } = useApartment();

  if (isLoading) return <div>Loading...</div>;
  if (error || apartment === undefined) return <div>An error has occurred</div>;
  if (apartment === "") return <div>You do not have an apartment</div>;
  return <ApartmentDetail apartment={apartment} />;
}

function ApartmentDetailPage() {
  return (
    <ProtectedPageLayout>
      <MainContent />
    </ProtectedPageLayout>
  );
}
export default ApartmentDetailPage;
