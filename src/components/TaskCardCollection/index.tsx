import { Box, Grid, Typography } from "@mui/material";

import TaskCard from "../TaskCard";

function TaskCardCollection({
  taskRequests,
  taskAssignments,
}: {
  taskRequests: TaskRequest[];
  taskAssignments: TaskAssignment[];
}) {
  return (
    <Grid
      container
      spacing={0}
      sx={{
        width: "35rem",
      }}
    >
      <Grid item xs={6} sx={{}}>
        <div>Requesting</div>
        {taskRequests.map(({ task, requests }) => (
          <TaskCard
            key={task.id}
            task={task}
            assigneeNames={requests.map((request) => request.assignee.name)}
          />
        ))}
      </Grid>
      <Grid item xs={6} sx={{}}>
        <div>Assigned</div>
        {taskAssignments.map(({ task, assignments }) => (
          <TaskCard
            key={task.id}
            task={task}
            assigneeNames={assignments.map(
              (assignment) => assignment.assignee.name,
            )}
          />
        ))}
      </Grid>
    </Grid>
  );
}

export default TaskCardCollection;
