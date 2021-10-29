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

function TaskCard({ task, assigners }: { task: Task; assigners: string[] }) {
  const queryClient = useQueryClient();
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
      <Card
        sx={{
          border: "2px ridge",
          backgroundColor: "#edf3f1",
        }}
        className="TaskCard"
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
              <IconButton onClick={() => console.log("Open new page")}>
                <InfoIcon />
              </IconButton>
            </>
          }
        />
        <CardActions className="TaskCardAction">
          <AvatarGroup>
            {assigners.map((assigner) => {
              return (
                <Avatar
                  key={assigner}
                  sx={{ width: 32, height: 32, fontSize: "1rem" }}
                >
                  {getAbbreviation(assigner)}
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
