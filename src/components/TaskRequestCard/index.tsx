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

import useApartment from "../../contexts/apartment";

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

function TaskRequestCard({ taskRequest }: { taskRequest: TaskRequest }) {
  const { apartment } = useApartment() as { apartment: Apartment };

  const { task } = taskRequest;
  const startDate = parseDateString(task.start);
  const endDate = parseDateString(task.end);

  const taskCreator = apartment.members.find(
    (member) => member.id === taskRequest.task.creator_id,
  );
  console.log(taskCreator);

  return (
    <Card
      sx={{
        maxWidth: "280px",
      }}
      className="TaskRequestCard"
    >
      <CardHeader
        title={task.name}
        subheader={`By ${taskCreator?.username}`}
        action={
          <>
            <IconButton>
              <DeleteIcon />
            </IconButton>
            <IconButton>
              <EditIcon />
            </IconButton>
            <IconButton>
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
              <Avatar sx={{ width: 32, height: 32, fontSize: "1rem" }}>
                {getAbbreviation(request.assigner.name)}
              </Avatar>
            );
          })}
        </AvatarGroup>
        <Box className="button-group">
          <Button size="small" variant="contained" color="success">
            Confirm
          </Button>
          <Button size="small" variant="contained" color="error">
            Reject
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}

export default TaskRequestCard;
