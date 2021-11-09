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
  Popover,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";

import { useQueryClient } from "react-query";
import { toast } from "react-toastify";

import useAuth from "../../../contexts/auth";
import useApartment from "../../../contexts/apartment";

import taskService from "../../../services/task";

import commonUtils from "../../../utils/common";

import { useState } from "react";

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

  const { parseDateString, getAbbreviation } = commonUtils;

  const { authState } = useAuth() as { authState: UserWithToken };
  const { apartment } = useApartment() as { apartment: Apartment };

  const { task, requests } = taskRequest;

  const taskCreator = apartment.members.find(
    (member) => member.id === taskRequest.task.creator_id,
  );

  const startDate = parseDateString(task.start);
  const endDate = parseDateString(task.end);

  const taskRequestId = Number(
    taskRequest.requests.find((request) => request.assigner.id === authState.id)
      ?.id,
  );

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  function handleOpenPopover(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClosePopover() {
    setAnchorEl(null);
  }

  const openPopover = Boolean(anchorEl);

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
              <IconButton onClick={handleOpenPopover}>
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
                  {getAbbreviation(request.assigner.name)}
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
      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Typography sx={{ p: 1, fontSize: "0.9rem" }}>
          Description: {task.description}
        </Typography>
        <Typography sx={{ p: 1, fontSize: "0.9rem" }}>
          Assigned to:{" "}
          {requests.map((request) => request.assigner.username).join(", ")}
        </Typography>
      </Popover>
    </>
  );
}

export default TaskRequestCard;