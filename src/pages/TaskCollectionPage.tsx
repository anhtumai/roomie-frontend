import ProtectedPageLayout from "./ProtectedPageLayout";
import useApartment from "contexts/apartment";

import TaskCardCollection from "components/TaskCardCollection";

function MainContent() {
  const { isLoading, error, apartment } = useApartment();

  if (isLoading) return <div>Loading...</div>;
  if (error || apartment === undefined) return <div>An error has occured</div>;
  if (apartment === "") return <div>You dont have apartment yet</div>;

  const { task_requests, task_assignments } = apartment;

  return (
    <TaskCardCollection
      taskRequests={task_requests}
      taskAssignments={task_assignments}
    />
  );
}

function TaskRequestPage() {
  return (
    <ProtectedPageLayout>
      <MainContent />
    </ProtectedPageLayout>
  );
}

export default TaskRequestPage;
