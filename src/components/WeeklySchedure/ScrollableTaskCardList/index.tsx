import { Paper } from "@mui/material";

import { getAssignerUsernames } from "../utils";

import TaskCard from "../../TaskCard";

function ScrollableTaskCardList({
  tasks,
  taskAssignments,
}: {
  tasks: Task[];
  taskAssignments: TaskAssignment[];
}) {
  return (
    <Paper
      sx={{
        overflowX: "scroll",
      }}
    >
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          assigners={getAssignerUsernames(task.id, taskAssignments)}
        />
      ))}
    </Paper>
  );
}

export default ScrollableTaskCardList;
