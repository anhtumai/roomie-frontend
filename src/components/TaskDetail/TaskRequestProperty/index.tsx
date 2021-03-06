import MemberDisplay from "components/TaskDetail/MemberDisplay";
import useApartment from "contexts/apartment";

import "./style.css";

const stateDisplay = {
  accepted: (
    <span className="task-request-property__accepted-span">ACCEPTED</span>
  ),
  rejected: (
    <span className="task-request-property__rejected-span">REJECTED</span>
  ),
  pending: <span className="task-request-property__pending-span">PENDING</span>,
};

function TaskRequestProperty({ taskRequest }: { taskRequest: TaskRequest }) {
  const { apartment } = useApartment() as { apartment: Apartment };
  const { members } = apartment;
  const creator = members.find(
    (member) => member.id === taskRequest.task.creator_id,
  );

  return (
    <div className="task-request-property">
      <h2 className="task-request-property__first-header">Status</h2>
      <div className="task-request-property__status">
        <p>Requesting</p>
      </div>
      <h2>Assignees</h2>
      {taskRequest.requests.map((_request) => (
        <div
          key={_request.id}
          className="task-request-property__assignee-display"
        >
          <div className="task-request-property__member-display">
            <MemberDisplay member={_request.assignee} />{" "}
          </div>
          {stateDisplay[_request.state]}
        </div>
      ))}
      <h2>Creator</h2>
      {creator && <MemberDisplay member={creator} />}
    </div>
  );
}

export default TaskRequestProperty;
