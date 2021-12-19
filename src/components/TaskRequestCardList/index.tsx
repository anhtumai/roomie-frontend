import TaskRequestCard from "./TaskRequestCard";

import "./style.css";

function TaskRequestCardList({
  taskRequests,
}: {
  taskRequests: TaskRequest[];
}) {
  if (taskRequests.length === 0) {
    return <div>You have no task requests.</div>;
  }

  return (
    <div className="task-request-card-list">
      {taskRequests.map((taskRequest) => (
        <TaskRequestCard
          key={taskRequest.task.id}
          taskRequest={taskRequest}
        ></TaskRequestCard>
      ))}
    </div>
  );
}

export default TaskRequestCardList;
