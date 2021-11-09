import { useState } from "react";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

import TaskProperty from "./TaskProperty";
import EditTaskDialog from "./EditTaskDialog";
import useAuth from "../../contexts/auth";
import useApartment from "../../contexts/apartment";

import "./style.css";

function TaskDetail({ task }: { task: Task }) {
  const { authState } = useAuth() as { authState: UserWithToken };
  const { apartment } = useApartment() as { apartment: Apartment };

  const [openTaskDialog, setOpenTaskDialog] = useState(false);

  const isAdminOrCreator =
    authState.id === apartment.admin.id || authState.id === task.creator_id;

  function handleEdit() {
    setOpenTaskDialog(true);
  }

  function handleDelete() {
    console.log("Handle delete");
  }

  function handleReturnToTaskCollection() {
    console.log("Handle return");
  }

  return (
    <div className="task-detail">
      <div className="task-detail__header">
        <CheckBoxIcon htmlColor="#6cbcec" />
        <span className="task-detail__task-span">TASK-{task.id}</span>
        {isAdminOrCreator && (
          <>
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
        <div className="task-detail__header-button" onClick={handleDelete}>
          <KeyboardReturnIcon
            htmlColor="#505f78"
            sx={{
              marginTop: "0.15rem",
            }}
          />
          <span>Return</span>
        </div>
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
    </div>
  );
}

export default TaskDetail;
