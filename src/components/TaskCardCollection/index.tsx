import { Grid, useMediaQuery } from "@mui/material";

import TaskCard from "components/TaskCard";

import MobileTaskCardCollection from "./MobileTaskCardCollection";

function TaskCardCollection({
  taskRequests,
  taskAssignments,
}: {
  taskRequests: TaskRequest[];
  taskAssignments: TaskAssignment[];
}) {
  const isScreenWidthSmallerThan500 = useMediaQuery("(max-width:500px)");

  if (isScreenWidthSmallerThan500) {
    return (
      <MobileTaskCardCollection
        taskRequests={taskRequests}
        taskAssignments={taskAssignments}
      />
    );
  }

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
