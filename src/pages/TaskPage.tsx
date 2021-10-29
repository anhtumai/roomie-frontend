import ProtectedPageLayout from "./sharedLayout/ProtectedPageLayout";
import ApartmentForm from "../components/ApartmentForm";
import useApartment, { ApartmentProvider } from "../contexts/apartment";
import { InvitationsProvider } from "../contexts/invitations";
import useAuth from "../contexts/auth";

import TaskCardList from "../components/TaskCardList";

function MainContent() {
  const { authState } = useAuth() as { authState: UserWithToken };
  const { isLoading, error, apartment } = useApartment();

  if (isLoading) return <div>Loading...</div>;
  if (error || apartment === undefined) return <div>An error has occured</div>;
  if (apartment === "") return <div>You dont have apartment yet</div>;

  const { task_requests, task_assignments } = apartment;

  return (
    <TaskCardList
      taskRequests={task_requests}
      taskAssignments={task_assignments}
    />
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
