import CheckBoxIcon from "@mui/icons-material/CheckBox";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import TaskProperty from "./TaskProperty";

import "./style.css";

function TaskDetail({ task }: { task: Task }) {
  function handleEdit() {
    console.log("Handle edit");
  }

  function handleDelete() {
    console.log("Handle delete");
  }

  return (
    <div className="task-detail">
      <div className="task-detail__header">
        <CheckBoxIcon htmlColor="#6cbcec" />
        <span className="task-detail__task-span">TASK-{task.id}</span>
        <div className="task-detail__header-button" onClick={handleEdit}>
          <EditIcon htmlColor="#505f78" />
          <span>Edit</span>
        </div>
        <div className="task-detail__header-button" onClick={handleDelete}>
          <DeleteIcon htmlColor="#505f78" />
          <span>Delete</span>
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
    </div>
  );
}

export default TaskDetail;
