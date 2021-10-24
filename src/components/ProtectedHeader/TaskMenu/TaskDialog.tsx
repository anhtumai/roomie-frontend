import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

function TaskDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
}) {
  const { control, handleSubmit, reset } = useForm();

  function handleClose() {
    //reset({ name: "", frequency: "", difficulty: "", start: "", end: "" });
    setOpen(false);
  }

  async function onSubmit(data: any) {
    console.log(data);
    //reset({ name: "", frequency: "", difficulty: "", start: "", end: "" });
    setOpen(false);
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>New task</DialogTitle>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Name"
                data-testid="name"
                InputLabelProps={{ shrink: true, required: true }}
                variant="filled"
                fullWidth
                required
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name="frequency"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Frequency"
                data-testid="frequency"
                type="number"
                InputLabelProps={{ shrink: true, required: true }}
                variant="filled"
                fullWidth
                required
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name="difficulty"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Difficulty"
                data-testid="difficulty"
                type="number"
                InputLabelProps={{ shrink: true, required: true }}
                variant="filled"
                fullWidth
                required
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name="start"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Start Date"
                data-testid="start-date"
                type="date"
                InputLabelProps={{ shrink: true, required: true }}
                variant="filled"
                fullWidth
                required
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name="end"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextField
                label="End Date"
                data-testid="end-date"
                type="date"
                InputLabelProps={{ shrink: true, required: true }}
                variant="filled"
                fullWidth
                required
                value={value}
                onChange={onChange}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add task</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default TaskDialog;
