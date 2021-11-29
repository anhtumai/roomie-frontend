import { useState } from "react";
import { useHistory } from "react-router-dom";

import { IconButton } from "@mui/material";
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

import useAuth from "contexts/auth";
import useApartment from "contexts/apartment";

import { getAssigneeUsernames } from "utils/common";

import "./style.css";

function TaskDetail({
  taskUnion,
}: {
  taskUnion: TaskRequest | TaskAssignment;
}) {
  const history = useHistory();
  const { authState } = useAuth() as { authState: UserWithToken };
  const apartmentContext = useApartment();
  const { apartment } = apartmentContext as { apartment: Apartment };
  const { deleteTaskMutation } = apartmentContext;

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
    const decision = window.confirm(`Delete task ${task.name} ?`);
    if (decision) {
      deleteTaskMutation.mutate(task);
      history.push("/home");
    }
  }

  return (
    <div className="task-detail">
      <div className="task-detail__header">
        <CheckBoxIcon htmlColor="#6cbcec" />
        <span className="task-detail__task-span">TASK-{task.id}</span>
        {isAdminOrCreator && (
          <>
            <IconButton onClick={handleReAssign}>
              <AssignmentIndIcon htmlColor="#505f78" />
              <span>Re-assign</span>
            </IconButton>
            <IconButton onClick={handleEdit}>
              <EditIcon htmlColor="#505f78" />
              <span>Edit</span>
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon htmlColor="#505f78" />
              <span>Delete</span>
            </IconButton>
          </>
        )}
        <IconButton onClick={() => history.goBack()}>
          <KeyboardReturnIcon htmlColor="#505f78" />
          <span>Go back</span>
        </IconButton>
      </div>
      <div className="task-detail__main-content">
        <div
          style={{
            flex: "5 1 0",
          }}
        >
          <TaskProperty task={task} />
        </div>
        <div
          style={{
            flex: "3 0 0",
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
