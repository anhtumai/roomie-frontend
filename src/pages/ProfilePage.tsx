import ProtectedPageLayout from "./sharedLayout/ProtectedPageLayout";
import UpdateAccountForm from "../components/UpdateAccountForm";

function MainContent() {
  return <UpdateAccountForm />;
}

function ProfilePage() {
  return (
    <ProtectedPageLayout>
      <MainContent />
    </ProtectedPageLayout>
  );
}

export default ProfilePage;
