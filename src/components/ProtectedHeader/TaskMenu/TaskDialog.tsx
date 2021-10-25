import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import "./style.css";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface IFormInput {
  name: string;
  description: string;
  frequency: number;
  difficulty: number;
  start: string;
  end: string;
}

function TaskDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
}) {
  const { register, handleSubmit, reset } = useForm();

  function resetAllFields() {
    reset({
      name: "",
      frequency: "",
      difficulty: "",
      startDate: "",
      endDate: "",
    });
  }

  function handleClose() {
    resetAllFields();
    setOpen(false);
  }

  async function onSubmit(data: IFormInput) {
    console.log(data);
    resetAllFields();
    setOpen(false);
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <DialogTitle>New task</DialogTitle>
        <DialogContent>
          <label>Name</label>
          <input
            {...register("name", {
              required: true,
              maxLength: 50,
            })}
          />
          <label>Description</label>
          <textarea
            rows={10}
            cols={30}
            {...register("description", {
              required: true,
              maxLength: 500,
            })}
          ></textarea>
          <label>Difficulty</label>
          <input
            type="number"
            min="1"
            max="10"
            {...register("difficulty", {
              required: true,
            })}
          />
          <label>Frequency</label>
          <input
            type="number"
            min="1"
            max="10"
            {...register("frequency", {
              required: true,
            })}
          />
          <label>start</label>
          <input
            type="date"
            {...register("startDate", {
              required: true,
            })}
          />
          <label>end</label>
          <input
            type="date"
            {...register("endDate", {
              required: true,
            })}
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
