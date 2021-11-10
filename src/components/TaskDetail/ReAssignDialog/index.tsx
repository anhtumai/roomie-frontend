import { useState } from "react";
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

import { useQueryClient } from "react-query";
import { toast } from "react-toastify";

import useAuth from "../../../contexts/auth";
import useApartment from "../../../contexts/apartment";

import taskService from "../../../services/task";

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
  const { apartment } = useApartment() as { apartment: Apartment };
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
      selectedUsernames === assigneeUsernames
    ) {
      setOpen(false);
      return;
    }
    try {
      await taskService.updateAssignees(
        authState.token,
        taskId,
        selectedUsernames,
      );
      toast.success(
        `Re-assign TASK-${taskId} to ${selectedUsernames.join(", ")}`,
        { position: toast.POSITION.TOP_CENTER },
      );
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
