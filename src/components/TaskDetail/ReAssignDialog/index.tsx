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

import useApartment from "../../../contexts/apartment";

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
  assigneeUsernames,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
  assigneeUsernames: string[];
}) {
  const theme = useTheme();
  const { apartment } = useApartment() as { apartment: Apartment };
  const { members } = apartment;
  const [selectedUsernames, setSelectedUsernames] =
    useState<string[]>(assigneeUsernames);

  function handleClose() {
    setSelectedUsernames(assigneeUsernames);
    setOpen(false);
  }

  async function handleSubmit() {
    if (selectedUsernames === assigneeUsernames) {
      setOpen(false);
      return;
    }
    try {
      //
    } catch (err) {
      console.log(err);
      setSelectedUsernames(assigneeUsernames);
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
      <DialogTitle>Assignees</DialogTitle>
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
        <Button onClick={handleSubmit}>Edit assignees</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReAssignDialog;
