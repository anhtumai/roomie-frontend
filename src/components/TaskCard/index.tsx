import { useHistory } from "react-router-dom";

import { Avatar, AvatarGroup, IconButton } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";

import useAuth from "contexts/auth";
import useApartment from "contexts/apartment";
import { getAbbreviation } from "utils/common";

import "./style.css";

function TaskCard({
  task,
  assigneeNames,
}: {
  task: Task;
  assigneeNames: string[];
}) {
  const history = useHistory();
  const { authState } = useAuth() as { authState: UserWithToken };
  const apartmentContext = useApartment();
  const { apartment } = apartmentContext as {
    apartment: Apartment;
  };
  const { deleteTaskMutation } = apartmentContext;

  const taskCreator = apartment.members.find(
    (member) => member.id === task.creator_id,
  );

  function handleDelete() {
    const decision = window.confirm(`Delete task ${task.name} ?`);
    if (decision) {
      deleteTaskMutation.mutate(task);
    }
  }

  return (
    <>
      <div className="task-card">
        <div className="task-card__header ">
          <div className="task-card__titles">
            <div className="task-card__title">{task.name}</div>
            <div className="task-card__sub-title">{`By ${taskCreator?.username}`}</div>
          </div>
          <div className="task-card__action">
            {(taskCreator?.id === authState.id ||
              apartment.admin.id === authState.id) && (
              <IconButton onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            )}
            <IconButton onClick={() => history.push(`/tasks/${task.id}`)}>
              <InfoIcon />
            </IconButton>
          </div>
        </div>
        <div className="task-card__avatar-group">
          <AvatarGroup>
            {assigneeNames.map((name) => (
              <Avatar
                key={name}
                sx={{ width: "2rem", height: "2rem", fontSize: "1rem" }}
              >
                {getAbbreviation(name)}
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
      </div>
    </>
  );
}

export default TaskCard;
