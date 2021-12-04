import ProtectedPageLayout from "./sharedLayout/ProtectedPageLayout";
import useApartment from "../contexts/apartment";
import useAuth from "../contexts/auth";

import TaskRequestCardList from "../components/TaskRequestCardList";

function MainContent() {
  const { authState } = useAuth() as { authState: UserWithToken };
  const { isLoading, error, apartment } = useApartment();

  if (isLoading) return <div>Loading...</div>;
  if (error || apartment === undefined) return <div>An error has occured</div>;
  if (apartment === "") return <div>You dont have apartment yet</div>;

  const taskRequests = apartment.task_requests;

  const pendingTaskRequests: TaskRequest[] = [];
  const acceptedTaskRequests: TaskRequest[] = [];
  const rejectedTaskRequests: TaskRequest[] = [];

  for (const taskRequest of taskRequests) {
    const requestState = taskRequest.requests.find(
      (request) => request.assignee.id === authState.id,
    )?.state;
    if (requestState === "pending") pendingTaskRequests.push(taskRequest);
    if (requestState === "accepted") acceptedTaskRequests.push(taskRequest);
    if (requestState === "rejected") rejectedTaskRequests.push(taskRequest);
  }
  return (
    <>
      <TaskRequestCardList
        taskRequests={pendingTaskRequests}
        requestState={"pending"}
      />
      <TaskRequestCardList
        taskRequests={acceptedTaskRequests}
        requestState={"accepted"}
      />
      <TaskRequestCardList
        taskRequests={rejectedTaskRequests}
        requestState={"rejected"}
      />
    </>
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
