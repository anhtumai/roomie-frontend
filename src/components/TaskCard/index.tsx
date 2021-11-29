import { useHistory } from "react-router-dom";

import {
  Avatar,
  AvatarGroup,
  Card,
  CardHeader,
  CardActions,
  IconButton,
} from "@mui/material";

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
      <Card className="task-card">
        <CardHeader
          title={task.name}
          subheader={`By ${taskCreator?.username}`}
          action={
            <>
              {(taskCreator?.id === authState.id ||
                apartment.admin.id === authState.id) && (
                <IconButton onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
              )}
              <IconButton onClick={() => history.push(`/tasks/${task.id}`)}>
                <InfoIcon />
              </IconButton>
            </>
          }
        />
        <CardActions className="task-card-action">
          <AvatarGroup sx={{ flexGrow: 1 }}>
            {assigneeNames.map((name) => (
              <Avatar
                key={name}
                sx={{ width: "2.25rem", height: "2.25rem", fontSize: "1rem" }}
              >
                {getAbbreviation(name)}
              </Avatar>
            ))}
          </AvatarGroup>
        </CardActions>
      </Card>
    </>
  );
}

export default TaskCard;
