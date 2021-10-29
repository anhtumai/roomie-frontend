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
import EditIcon from "@mui/icons-material/Edit";

import { useQueryClient } from "react-query";
import { toast } from "react-toastify";

import useAuth from "../../contexts/auth";
import useApartment from "../../contexts/apartment";

import taskService from "../../services/task";

import "./style.css";
import { useState } from "react";
import ReadonlyTaskDetailModal from "./ReadonlyTaskDetailModal";

function getAbbreviation(name: string) {
  return name
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("")
    .slice(0, 2);
}

function parseDateString(dateString: string) {
  const dateObject = new Date(dateString);
  const month = dateObject.getMonth();
  const day = dateObject.getDay();
  const year = dateObject.getFullYear();
  return `${day}/${month}/${year}`;
}

function TaskRequestCard({
  taskRequest,
  requestState,
}: {
  taskRequest: TaskRequest;
  requestState: string;
}) {
  const queryClient = useQueryClient();
  const { authState } = useAuth() as { authState: UserWithToken };
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const { apartment } = useApartment() as { apartment: Apartment };

  const { task } = taskRequest;

  const taskCreator = apartment.members.find(
    (member) => member.id === taskRequest.task.creator_id,
  );

  const startDate = parseDateString(task.start);
  const endDate = parseDateString(task.end);

  const taskRequestId = Number(
    taskRequest.requests.find((request) => request.assigner.id === authState.id)
      ?.id,
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
      <Card
        sx={{
          width: "270px",
          border: "2px ridge",
          backgroundColor: "#edf3f1",
        }}
        className="TaskRequestCard"
      >
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
              <IconButton onClick={() => setOpenDetailsModal(true)}>
                <InfoIcon />
              </IconButton>
            </>
          }
        />
        <CardContent
          sx={{
            minHeight: "80px",
          }}
        >
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
        <CardActions className="TaskRequestCardAction">
          <AvatarGroup>
            {taskRequest.requests.map((request) => {
              return (
                <Avatar
                  key={request.id}
                  sx={{ width: 32, height: 32, fontSize: "1rem" }}
                >
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
      <ReadonlyTaskDetailModal
        open={openDetailsModal}
        setOpen={setOpenDetailsModal}
        task={taskRequest.task}
        assigners={taskRequest.requests.map((request) => request.assigner)}
      />
    </>
  );
}

export default TaskRequestCard;
