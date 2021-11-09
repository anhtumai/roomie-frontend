import { format } from "date-fns";
import "./style.css";

function TaskProperty({ task }: { task: Task }) {
  return (
    <div className="task-property">
      <h1>{task.name}</h1>
      <div className="task-property__description-block">
        <h2>Description</h2>
        <div>{task.description}</div>
      </div>
      <h2>
        Frequency: <span>every {task.frequency} week(s)</span>
      </h2>
      <h2>
        Difficulty: <span>{task.difficulty} out of 10</span>
      </h2>
      <h2>
        Duration:{" "}
        <span>
          from {format(new Date(task.start), "dd/MM/yyyy")} to{" "}
          {format(new Date(task.end), "dd/MM/yyyy")}
        </span>
      </h2>
    </div>
  );
}

export default TaskProperty;
