import "./style.css";

import MemberDisplay from "../MemberDisplay";
import useApartment from "../../../contexts/apartment";

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
      <h2>Status</h2>
      <div className="task-request-property__status">
        <p>Requesting</p>
      </div>
      <h2>Assignees</h2>
      {taskRequest.requests.map((_request) => (
        <div style={{}}>
          <MemberDisplay member={_request.assignee} />:{" "}
          {stateDisplay[_request.state]}
        </div>
      ))}
      <h2>Creator</h2>
      {creator && <MemberDisplay member={creator} />}
    </div>
  );
}

export default TaskRequestProperty;
