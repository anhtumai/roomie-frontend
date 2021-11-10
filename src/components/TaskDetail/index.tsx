import { useState } from "react";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import TaskProperty from "./TaskProperty";
import EditTaskDialog from "./EditTaskDialog";
import ReAssignDialog from "./ReAssignDialog";

import useAuth from "../../contexts/auth";
import useApartment from "../../contexts/apartment";

import { getAssigneeUsernames } from "../../utils/common";

import "./style.css";

function TaskDetail({ task }: { task: Task }) {
  const { authState } = useAuth() as { authState: UserWithToken };
  const { apartment } = useApartment() as { apartment: Apartment };

  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [openReAssignDialog, setOpenReAssignDialog] = useState(false);

  const isAdminOrCreator =
    authState.id === apartment.admin.id || authState.id === task.creator_id;

  function handleReAssign() {
    setOpenReAssignDialog(true);
  }

  function handleEdit() {
    setOpenTaskDialog(true);
  }

  function handleDelete() {
    console.log("Handle delete");
  }

  return (
    <div className="task-detail">
      <div className="task-detail__header">
        <CheckBoxIcon htmlColor="#6cbcec" />
        <span className="task-detail__task-span">TASK-{task.id}</span>
        {isAdminOrCreator && (
          <>
            <div
              className="task-detail__header-button"
              onClick={handleReAssign}
            >
              <AssignmentIndIcon htmlColor="#505f78" />
              <span>Re-assign</span>
            </div>
            <div className="task-detail__header-button" onClick={handleEdit}>
              <EditIcon htmlColor="#505f78" />
              <span>Edit</span>
            </div>
            <div className="task-detail__header-button" onClick={handleDelete}>
              <DeleteIcon htmlColor="#505f78" />
              <span>Delete</span>
            </div>
          </>
        )}
      </div>
      <div className="task-detail__main-content">
        <div
          style={{
            flex: "2 1 0",
          }}
        >
          <TaskProperty task={task} />
        </div>
        <div
          style={{
            flex: "1 0 0",
          }}
        >
          Hihi
        </div>
      </div>
      <EditTaskDialog
        open={openTaskDialog}
        setOpen={setOpenTaskDialog}
        task={task}
      />
      <ReAssignDialog
        open={openReAssignDialog}
        setOpen={setOpenReAssignDialog}
        assigneeUsernames={getAssigneeUsernames(task.id, apartment)}
      />
    </div>
  );
}

export default TaskDetail;
