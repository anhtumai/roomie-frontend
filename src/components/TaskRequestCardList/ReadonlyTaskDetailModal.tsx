import { Modal, Box, Typography } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "300px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function parseDateString(dateString: string) {
  const dateObject = new Date(dateString);
  const month = dateObject.getMonth();
  const day = dateObject.getDay();
  const year = dateObject.getFullYear();
  return `${day}/${month}/${year}`;
}

function TaskDetailModal({
  open,
  setOpen,
  task,
  assigners,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
  task: Task;
  assigners: Member[];
}) {
  const startDate = parseDateString(task.start);
  const endDate = parseDateString(task.end);

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box sx={style}>
        <Typography variant="h6">{task.name}</Typography>
        <Typography variant="body1">Description: {task.description}</Typography>
        <Typography variant="body1">
          Difficulty: {task.difficulty} out of 10.{" "}
        </Typography>
        <Typography variant="body1">
          Frequency: Every {task.frequency} weeks.
        </Typography>
        <Typography variant="body1">
          Assigned to:{" "}
          {assigners.map((assigner) => assigner.username).join(", ")}
        </Typography>
        <Typography variant="body1">
          Duration: {startDate} - {endDate}
        </Typography>
      </Box>
    </Modal>
  );
}

export default TaskDetailModal;
