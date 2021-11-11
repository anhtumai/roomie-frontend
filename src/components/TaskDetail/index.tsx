import { useState } from "react";

import { useHistory } from "react-router-dom";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

import TaskProperty from "./TaskProperty";
import EditTaskDialog from "./EditTaskDialog";
import ReAssignDialog from "./ReAssignDialog";
import TaskRequestProperty from "./TaskRequestProperty";
import TaskAssignmentProperty from "./TaskAssignmentProperty";

import useAuth from "../../contexts/auth";
import useApartment from "../../contexts/apartment";

import { getAssigneeUsernames } from "../../utils/common";

import "./style.css";

function TaskDetail({
  taskUnion,
}: {
  taskUnion: TaskRequest | TaskAssignment;
}) {
  const history = useHistory();
  const { authState } = useAuth() as { authState: UserWithToken };
  const { apartment } = useApartment() as { apartment: Apartment };

  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [openReAssignDialog, setOpenReAssignDialog] = useState(false);

  const { task } = taskUnion;

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
            <div
              className="task-detail__header-button"
              onClick={() => history.goBack()}
            >
              <KeyboardReturnIcon
                sx={{ marginTop: "0.2rem" }}
                htmlColor="#505f78"
              />
              <span>Go back</span>
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
          {"requests" in taskUnion && (
            <TaskRequestProperty taskRequest={taskUnion as TaskRequest} />
          )}
          {"assignments" in taskUnion && (
            <TaskAssignmentProperty
              taskAssignment={taskUnion as TaskAssignment}
            />
          )}
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
        taskId={task.id}
        assigneeUsernames={getAssigneeUsernames(task.id, apartment)}
      />
    </div>
  );
}

export default TaskDetail;
