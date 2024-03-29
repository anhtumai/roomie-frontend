import { useState } from "react";
import { toast } from "react-toastify";

import _ from "lodash";

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
import { SelectChangeEvent } from "@mui/material/Select";
import { Theme, useTheme } from "@mui/material/styles";

import useAuth from "contexts/auth";
import useApartment from "contexts/apartment";
import taskService from "services/task";

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

function ReAssignDialog({
  open,
  setOpen,
  taskId,
  assigneeUsernames,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
  taskId: number;
  assigneeUsernames: string[];
}) {
  const theme = useTheme();
  const { authState } = useAuth() as { authState: UserWithToken };
  const { apartment, setApartment } = useApartment() as {
    apartment: Apartment;
    setApartment: (x: Apartment | "") => void;
  };
  const { members } = apartment;
  const [selectedUsernames, setSelectedUsernames] =
    useState<string[]>(assigneeUsernames);

  function handleClose() {
    setSelectedUsernames(assigneeUsernames);
    setOpen(false);
  }

  async function handleSubmit() {
    if (
      setSelectedUsernames.length === 0 ||
      _.isEqual(_.sortBy(selectedUsernames), _.sortBy(assigneeUsernames))
    ) {
      setOpen(false);
      toast.error(
        "Selected assignee usernames must be different and have length bigger than 0.",
        {
          position: toast.POSITION.TOP_CENTER,
        },
      );
      return;
    }
    try {
      const taskRequest = await taskService.updateAssignees(
        authState.token,
        taskId,
        selectedUsernames,
      );
      const updatedTaskAssignments = apartment.task_assignments.filter(
        (element) => element.task.id !== taskRequest.task.id,
      );
      const unSortedUpdatedTaskRequests = [
        ...apartment.task_requests.filter(
          (element) => element.task.id !== taskRequest.task.id,
        ),
        taskRequest,
      ];
      const updatedTaskRequests = _.sortBy(
        unSortedUpdatedTaskRequests,
        (taskRequest) => taskRequest.task.id,
      );
      setApartment({
        ...apartment,
        task_requests: updatedTaskRequests,
        task_assignments: updatedTaskAssignments,
      });
    } catch (err) {
      console.log(err);
      toast.error("Fail to re-assign the task", {
        position: toast.POSITION.TOP_CENTER,
      });
      setSelectedUsernames(assigneeUsernames);
    } finally {
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
      <DialogTitle>Re-assign</DialogTitle>
      <DialogContent>
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
        <Button onClick={handleSubmit}>Update</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReAssignDialog;
