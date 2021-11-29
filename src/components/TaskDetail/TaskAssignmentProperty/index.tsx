import { useState } from "react";
import _ from "lodash";

import { IconButton } from "@mui/material";
import ReorderIcon from "@mui/icons-material/Reorder";

import MemberDisplay from "components/TaskDetail/MemberDisplay";
import ReorderDialog from "./ReorderDialog";

import useAuth from "contexts/auth";
import useApartment from "contexts/apartment";

import "./style.css";

function TaskAssignmentProperty({
  taskAssignment,
}: {
  taskAssignment: TaskAssignment;
}) {
  const { authState } = useAuth() as { authState: UserWithToken };
  const { apartment } = useApartment() as { apartment: Apartment };
  const { members } = apartment;

  const [openReorderDialog, setOpenReorderDialog] = useState(false);

  const { task, assignments } = taskAssignment;
  const isAdminOrTaskCreator =
    apartment.admin.id === authState.id || task.creator_id === authState.id;

  const sortedAssignmentsByOrder = _.sortBy(
    assignments,
    (assignment) => assignment.order,
  );
  const creator = members.find((member) => member.id === task.creator_id);

  return (
    <>
      <div className="task-assignment-property">
        <h2 className="task-assignment-property__first-header">Status</h2>
        <div className="task-assignment-property__status ">
          <p>Assigned</p>
        </div>
        <div className="task-assignment-property__order">
          <h2
            style={{
              flexGrow: 1,
            }}
          >
            Order
          </h2>
          {isAdminOrTaskCreator && (
            <IconButton onClick={() => setOpenReorderDialog(true)}>
              <ReorderIcon htmlColor="#505f78" />
              <span>Reorder</span>
            </IconButton>
          )}
        </div>
        {sortedAssignmentsByOrder.map((assignment) => (
          <div
            key={assignment.id}
            className="task-assignment-property__assignee-display"
          >
            <MemberDisplay member={assignment.assignee} />
          </div>
        ))}

        <h2>Creator</h2>
        {creator && <MemberDisplay member={creator} />}
      </div>
      <ReorderDialog
        open={openReorderDialog}
        setOpen={setOpenReorderDialog}
        taskAssignment={taskAssignment}
      />
    </>
  );
}

export default TaskAssignmentProperty;
