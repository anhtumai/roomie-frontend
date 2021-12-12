import { useState } from "react";

import { ToggleButtonGroup, ToggleButton } from "@mui/material";

import TaskCard from "components/TaskCard";

function MobileTaskCardCollection({
  taskRequests,
  taskAssignments,
}: {
  taskRequests: TaskRequest[];
  taskAssignments: TaskAssignment[];
}) {
  const requestingState = "requesting";
  const assignedState = "assigned";

  const [alignment, setAlignment] = useState(assignedState);

  function handleToggleButton(
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) {
    setAlignment(newAlignment);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "225px",
        }}
      >
        <ToggleButtonGroup
          color={alignment === requestingState ? "warning" : "success"}
          value={alignment}
          exclusive
          onChange={handleToggleButton}
          sx={{
            marginBottom: "20px",
          }}
        >
          <ToggleButton
            value={requestingState}
            disabled={alignment === requestingState}
          >
            Requesting
          </ToggleButton>
          <ToggleButton
            value={assignedState}
            disabled={alignment === assignedState}
          >
            Assigned
          </ToggleButton>
        </ToggleButtonGroup>
        {alignment === requestingState &&
          taskRequests.map(({ task, requests }) => (
            <TaskCard
              key={task.id}
              task={task}
              assigneeNames={requests.map((request) => request.assignee.name)}
            />
          ))}

        {alignment === assignedState &&
          taskAssignments.map(({ task, assignments }) => (
            <TaskCard
              key={task.id}
              task={task}
              assigneeNames={assignments.map(
                (assignment) => assignment.assignee.name,
              )}
            />
          ))}
      </div>
    </div>
  );
}

export default MobileTaskCardCollection;
