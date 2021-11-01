import { Box, Grid, Typography } from "@mui/material";

import TaskCard from "../TaskCard";

function TaskCardList({
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
        width: "540px",
      }}
    >
      <Grid item xs={6} sx={{}}>
        <div>Requesting</div>
        {taskRequests.map(({ task, requests }) => (
          <TaskCard
            key={task.id}
            task={task}
            assigners={requests.map((request) => request.assigner.username)}
          />
        ))}
      </Grid>
      <Grid item xs={6} sx={{}}>
        <div>Assigned</div>
        {taskAssignments.map(({ task, assignments }) => (
          <TaskCard
            key={task.id}
            task={task}
            assigners={assignments.map(
              (assignment) => assignment.assigner.username,
            )}
          />
        ))}
      </Grid>
    </Grid>
  );
}

export default TaskCardList;
