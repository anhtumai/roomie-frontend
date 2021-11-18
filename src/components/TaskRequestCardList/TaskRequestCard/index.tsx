import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { format } from "date-fns";

import {
  Avatar,
  AvatarGroup,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Button,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";

import useAuth from "../../../contexts/auth";
import useApartment from "../../../contexts/apartment";
import taskService from "../../../services/task";
import { getAbbreviation } from "../../../utils/common";

import { cardSx, avatarSx } from "./style";
import "./style.css";

function TaskRequestCard({
  taskRequest,
  requestState,
}: {
  taskRequest: TaskRequest;
  requestState: string;
}) {
  const queryClient = useQueryClient();
  const history = useHistory();

  const { authState } = useAuth() as { authState: UserWithToken };
  const { apartment } = useApartment() as { apartment: Apartment };

  const { task } = taskRequest;

  const taskCreator = apartment.members.find(
    (member) => member.id === taskRequest.task.creator_id,
  );

  const startDate = format(new Date(task.start), "dd/MM/yyyy");
  const endDate = format(new Date(task.end), "dd/MM/yyyy");

  const taskRequestId = Number(
    taskRequest.requests.find((request) => request.assignee.id === authState.id)
      ?.id,
  );

  function handleRedirectTaskPage() {
    history.push(`/tasks/${task.id}`);
  }

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

  async function handleAccept() {
    try {
      await taskService.accept(authState.token, taskRequestId);
      queryClient.invalidateQueries("apartment");
    } catch (err) {
      console.log(err);
      toast.error("Fail to accept task", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }

  async function handleReject() {
    try {
      await taskService.reject(authState.token, taskRequestId);
      queryClient.invalidateQueries("apartment");
    } catch (err) {
      console.log(err);
      toast.error("Fail to reject task", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }
  return (
    <>
      <Card sx={cardSx} className="task-request-card">
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
              <IconButton onClick={handleRedirectTaskPage}>
                <InfoIcon />
              </IconButton>
            </>
          }
        />
        <CardContent className="task-request-card__card-content">
          <Typography variant="body2" color="text.secodary">
            Difficulty: {task.difficulty} out of 10
          </Typography>
          <Typography variant="body2" color="text.secodary">
            Frequency: Every {task.frequency} week(s)
          </Typography>
          <Typography variant="body2" color="text.secodary">
            Duration: {startDate} - {endDate}
          </Typography>
        </CardContent>
        <CardActions className="task-request-card__action">
          <AvatarGroup>
            {taskRequest.requests.map((request) => {
              return (
                <Avatar key={request.id} sx={avatarSx}>
                  {getAbbreviation(request.assignee.name)}
                </Avatar>
              );
            })}
          </AvatarGroup>
          <Box className="button-group">
            <Button
              size="small"
              variant="contained"
              color="success"
              disabled={requestState === "accepted" ? true : false}
              onClick={handleAccept}
            >
              Accept
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              disabled={requestState === "rejected" ? true : false}
              onClick={handleReject}
            >
              Reject
            </Button>
          </Box>
        </CardActions>
      </Card>
    </>
  );
}

export default TaskRequestCard;
