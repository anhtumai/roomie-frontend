import ProtectedPageLayout from "./ProtectedPageLayout";
import UpdateAccountForm from "components/UpdateAccountForm";

function ProfilePage() {
  return (
    <ProtectedPageLayout>
      <UpdateAccountForm />
    </ProtectedPageLayout>
  );
}

export default ProfilePage;
