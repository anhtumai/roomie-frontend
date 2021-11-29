import { useState } from "react";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  OutlinedInput,
  FormControl,
} from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import { SelectChangeEvent } from "@mui/material/Select";

import useAuth from "contexts/auth";
import useApartment from "contexts/apartment";
import taskService from "services/task";

import "components/sharedStyles/taskFormStyle.css";

interface IFormInput {
  name: string;
  description: string;
  difficulty: string;
  frequency: string;
  startDate: string;
  endDate: string;
}

function getStyles(
  text: string,
  selectedTexts: readonly string[],
  theme: Theme,
) {
  return {
    fontWeight:
      selectedTexts.indexOf(text) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function CreateTaskDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
}) {
  const theme = useTheme();
  const { register, handleSubmit, reset } = useForm();
  const { authState } = useAuth() as { authState: UserWithToken };
  const { apartment, setApartment } = useApartment() as {
    apartment: Apartment;
    setApartment: (x: Apartment | "") => void;
  };
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
    setSelectedUsernames([]);
  }

  function handleClose() {
    resetAllFields();
    setOpen(false);
  }

  async function onSubmit(data: IFormInput) {
    try {
      console.log(data);
      const taskRequest = await taskService.create(
        authState.token,
        {
          ...data,
          difficulty: Number(data.difficulty),
          frequency: Number(data.frequency),
          start: data.startDate,
          end: data.endDate,
        },
        selectedUsernames,
      );
      toast.success(`Create new task ${data.name}`, {
        position: toast.POSITION.TOP_CENTER,
      });

      const taskRequests = apartment.task_requests;
      const updatedTaskRequests = [...taskRequests, taskRequest];
      setApartment({
        ...apartment,
        task_requests: updatedTaskRequests,
      });
    } catch (err) {
      console.log(err);
      toast.error("Fail to create new task", {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      resetAllFields();
      setOpen(false);
    }
  }

  function handleSelectChange(
    event: SelectChangeEvent<typeof selectedUsernames>,
  ) {
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
          <label>Difficulty (N out of 10)</label>
          <input
            type="number"
            min="1"
            max="10"
            {...register("difficulty", {
              required: true,
            })}
          />
          <label>Frequency (every N weeks)</label>
          <input
            type="number"
            min="1"
            max="10"
            {...register("frequency", {
              required: true,
            })}
          />
          <div className="task-form__date_inputs">
            <div className="task-form__date_input">
              <label>Start Date</label>
              <input
                type="date"
                {...register("startDate", {
                  required: true,
                })}
              />
            </div>
            <div className="task-form__date_input">
              <label>End Date</label>
              <input
                type="date"
                {...register("endDate", {
                  required: true,
                })}
              />
            </div>
          </div>
          <FormControl sx={{ width: "100%" }}>
            <label>Assignees</label>
            <Select
              labelId="assignee-label"
              multiple
              value={selectedUsernames}
              onChange={handleSelectChange}
              input={<OutlinedInput label="Name" />}
              className="task-form__select"
              required
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

export default CreateTaskDialog;
