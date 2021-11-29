import { useState } from "react";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

import useAuth from "contexts/auth";
import apartmentService from "services/apartment";
import useApartment from "contexts/apartment";

function RenameDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
}) {
  const { authState } = useAuth() as { authState: UserWithToken };
  const apartmentContext = useApartment();
  const { apartment } = apartmentContext as {
    apartment: Apartment;
  };
  const { setApartment, invalidateApartment, cancelApartmentQueries } =
    apartmentContext;
  const [newApartmentName, setNewApartmentName] = useState(apartment.name);

  const renameApartmentMutation = useMutation(
    () =>
      apartmentService.update(authState.token, apartment.id, newApartmentName),
    {
      onMutate: async () => {
        cancelApartmentQueries();
        const updatedApartment = {
          ...apartment,
          name: newApartmentName,
        };
        setApartment(updatedApartment);

        return { previousApartment: apartment };
      },
      onError: (err, variables, context) => {
        console.log(err);
        if (context?.previousApartment) {
          setApartment(context.previousApartment);
        }
        const errMessage =
          (err as any).response?.data.error || "Fail to update apartment name";
        toast.error(errMessage, {
          position: toast.POSITION.TOP_CENTER,
        });
      },
      onSuccess: (data, variables, context) => {
        toast.success("Rename apartment", {
          position: toast.POSITION.TOP_CENTER,
        });
      },
      onSettled: (data, error, variables, context) => {
        invalidateApartment();
      },
    },
  );

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setNewApartmentName(event.target.value);
  }

  function handleClose() {
    setNewApartmentName(apartment.name);
    setOpen(false);
  }

  function handleRename(event: React.SyntheticEvent) {
    event.preventDefault();
    renameApartmentMutation.mutate();
    setOpen(false);
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleRename}>
        <DialogTitle>Apartment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="New name"
            data-testid="apartmentName"
            variant="filled"
            required
            value={newApartmentName}
            onChange={onChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Update</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default RenameDialog;
