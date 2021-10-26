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
  Checkbox,
  ListItemText,
  FormControl,
} from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useApartment from "../../../contexts/apartment";

import "./style.css";

interface IFormInput {
  name: string;
  description: string;
  frequency: number;
  difficulty: number;
  start: string;
  end: string;
}

function getStyles(
  text: string,
  selectedTexts: readonly string[],
  theme: Theme,
) {
  console.log(text, selectedTexts);
  return {
    fontWeight:
      selectedTexts.indexOf(text) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function TaskDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
}) {
  const theme = useTheme();
  const { register, handleSubmit, reset } = useForm();
  const { apartment } = useApartment() as { apartment: Apartment };
  const { members } = apartment;

  const [selectedUsernames, setSelectedUsernames] = useState<string[]>([]);

  function resetAllFields() {
    reset({
      name: "",
      describe: "",
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

  function handleSelectChange(
    event: SelectChangeEvent<typeof selectedUsernames>,
  ) {
    console.log("This is", event.target.value, selectedUsernames);
    const {
      target: { value },
    } = event;
    setSelectedUsernames(
      // On autofill we get a the stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="task-form">
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
          <label>Start Date</label>
          <input
            type="date"
            {...register("startDate", {
              required: true,
            })}
          />
          <label>End Date</label>
          <input
            type="date"
            {...register("endDate", {
              required: true,
            })}
          />
          <FormControl sx={{ width: "100%" }}>
            <label>Assigners</label>
            <Select
              labelId="assigner-label"
              multiple
              value={selectedUsernames}
              onChange={handleSelectChange}
              input={<OutlinedInput label="Name" />}
              className="task-form-select"
            >
              {members.map(({ username }) => (
                <MenuItem
                  key={username}
                  value={username}
                  style={getStyles(username, selectedUsernames, theme)}
                >
                  {username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
