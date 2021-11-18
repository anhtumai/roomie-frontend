import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
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

import useAuth from "../../contexts/auth";
import useApartment from "../../contexts/apartment";
import taskService from "../../services/task";
import { getAbbreviation } from "../../utils/common";

import "./style.css";

function TaskCard({
  task,
  assigneeNames,
}: {
  task: Task;
  assigneeNames: string[];
}) {
  const queryClient = useQueryClient();
  const history = useHistory();
  const { authState } = useAuth() as { authState: UserWithToken };
  const { apartment } = useApartment() as { apartment: Apartment };

  const taskCreator = apartment.members.find(
    (member) => member.id === task.creator_id,
  );

  async function handleDelete() {
    const decision = window.confirm(`Delete task ${task.name} ?`);
    if (!decision) {
      return;
    }
    try {
      await taskService.deleteOne(authState.token, task.id);
      queryClient.invalidateQueries("apartment");
      toast.success(`Delete task ${task.name}`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (err) {
      console.log(err);
      toast.error("Fail to delete task", {
        position: toast.POSITION.TOP_CENTER,
      });
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
            {assigneeNames.map((name) => {
              return (
                <Avatar
                  key={name}
                  sx={{ width: 32, height: 32, fontSize: "1rem" }}
                >
                  {getAbbreviation(name)}
                </Avatar>
              );
            })}
          </AvatarGroup>
        </CardActions>
      </Card>
    </>
  );
}

export default TaskCard;
