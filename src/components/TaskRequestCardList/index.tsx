import { Box, Typography } from "@mui/material";

import TaskRequestCard from "./TaskRequestCard";
import "./style.css";

function TaskRequestCardList({
  taskRequests,
  requestState,
}: {
  taskRequests: TaskRequest[];
  requestState: "pending" | "accepted" | "rejected";
}) {
  if (taskRequests.length === 0) {
    return <Typography>There are no {requestState} tasks.</Typography>;
  }

  return (
    <Box>
      <Typography>
        {requestState.charAt(0).toUpperCase() + requestState.slice(1)} tasks:{" "}
      </Typography>
      <Box className="task-request-card-list">
        {taskRequests.map((taskRequest) => (
          <TaskRequestCard
            key={taskRequest.task.id}
            taskRequest={taskRequest}
            requestState={requestState}
          ></TaskRequestCard>
        ))}
      </Box>
    </Box>
  );
}

export default TaskRequestCardList;
