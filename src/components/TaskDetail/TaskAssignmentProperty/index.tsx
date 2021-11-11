import "./style.css";

import MemberDisplay from "../MemberDisplay";
import useApartment from "../../../contexts/apartment";

function TaskAssignmentProperty({
  taskAssignment,
}: {
  taskAssignment: TaskAssignment;
}) {
  const { apartment } = useApartment() as { apartment: Apartment };
  const { members } = apartment;
  const creator = members.find(
    (member) => member.id === taskAssignment.task.creator_id,
  );

  return (
    <div className="task-assignment-property">
      <h2>Status</h2>
      <div className="task-assignment-property__status">
        <p>Assigned</p>
      </div>
      <h2>Orders</h2>

      <h2>Creator</h2>
      {creator && <MemberDisplay member={creator} />}
    </div>
  );
}

export default TaskAssignmentProperty;
