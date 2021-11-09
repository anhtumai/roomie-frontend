import commonUtils from "../../../utils/common";
import "./style.css";

function TaskProperty({ task }: { task: Task }) {
  const { parseDateString } = commonUtils;
  console.log(task.description);
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
          from {parseDateString(task.start)} to {parseDateString(task.end)}
        </span>
      </h2>
    </div>
  );
}

export default TaskProperty;
