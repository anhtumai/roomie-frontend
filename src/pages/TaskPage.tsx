import ProtectedPageLayout from "./sharedLayout/ProtectedPageLayout";

import useApartment, { ApartmentProvider } from "../contexts/apartment";
import { InvitationsProvider } from "../contexts/invitations";
import { useParams } from "react-router-dom";
import TaskDetail from "../components/TaskDetail";

function MainContent() {
  const taskIdStr = (useParams() as any).id;
  const taskId = Number(taskIdStr);
  const { isLoading, error, apartment } = useApartment();

  if (isLoading) return <div>Loading...</div>;
  if (error || apartment === undefined) return <div>An error has occurred</div>;
  if (apartment === "") return <div>You dont have apartment yet</div>;

  const { task_requests, task_assignments } = apartment;

  const taskRequest = task_requests.find(
    (taskRequest) => taskRequest.task.id === taskId,
  );

  if (taskRequest) {
    return <TaskDetail taskUnion={taskRequest} />;
  }

  const taskAssignment = task_assignments.find(
    (taskAssignment) => taskAssignment.task.id === taskId,
  );

  if (taskAssignment) {
    return <TaskDetail taskUnion={taskAssignment} />;
  }
  return <div>404 not found ...</div>;
}

function SingleTaskPage() {
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

export default SingleTaskPage;
