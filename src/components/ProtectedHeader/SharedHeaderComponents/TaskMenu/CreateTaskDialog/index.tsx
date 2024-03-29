import { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ErrorMessage } from "@hookform/error-message";
import { useHistory } from "react-router-dom";

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
import { MOBILE_MAX_WIDTH } from "../../../../../constants";

import "components/sharedStyles/taskFormStyle.css";
import { useWindowDimensions } from "utils/windows";

interface IFormInput {
  name: string;
  description: string;
  difficulty: string;
  frequency: string;
  start: string;
  end: string;
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
  // get window dimension, if window width is big, start date and end date inputs stay in one row.
  const windowDimensions = useWindowDimensions();

  const theme = useTheme();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
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
      description: "",
      frequency: "",
      difficulty: "",
      start: "",
      end: "",
    });
    setSelectedUsernames([]);
  }

  function handleClose() {
    resetAllFields();
    setOpen(false);
  }

  async function onSubmit(data: IFormInput) {
    try {
      const taskRequest = await taskService.create(
        authState.token,
        {
          ...data,
          difficulty: Number(data.difficulty),
          frequency: Number(data.frequency),
        },
        selectedUsernames,
      );

      const taskRequests = apartment.task_requests;
      const updatedTaskRequests = [...taskRequests, taskRequest];
      setApartment({
        ...apartment,
        task_requests: updatedTaskRequests,
      });
      history.push(`/tasks/${taskRequest.task.id}`);
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

  const startEndDateInputGroup =
    windowDimensions.width <= MOBILE_MAX_WIDTH ? (
      <>
        <label>Start Date</label>
        <input
          type="date"
          {...register("start", {
            required: true,
          })}
        />
        <label>End Date</label>
        <input
          type="date"
          {...register("end", {
            required: true,
          })}
        />
      </>
    ) : (
      <>
        <div className="task-form__date_inputs">
          <div className="task-form__date_input">
            <label>Start Date</label>
            <input
              type="date"
              {...register("start", {
                required: true,
              })}
            />
          </div>
          <div className="task-form__date_input">
            <label>End Date</label>
            <input
              type="date"
              {...register("end", {
                required: true,
              })}
            />
          </div>
        </div>
      </>
    );

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="task-form">
        <DialogTitle>New task</DialogTitle>
        <DialogContent>
          <label>Name</label>
          <input
            {...register("name", {
              required: "Task name is required",
              maxLength: {
                value: 35,
                message: "Task name has max length of 35 characters",
              },
            })}
          />
          <ErrorMessage
            className="form-error-message"
            errors={errors}
            name="name"
            as="p"
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
          {startEndDateInputGroup}
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
