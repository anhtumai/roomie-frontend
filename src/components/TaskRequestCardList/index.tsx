import { Box, Typography } from "@mui/material";

import TaskRequestCard from "./TaskRequestCard";

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "50px",
        }}
      >
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
