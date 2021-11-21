import { useState } from "react";
import { useQueryClient, useMutation } from "react-query";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

import useAuth from "../../../contexts/auth";
import apartmentService from "../../../services/apartment";

function RenameDialog({
  open,
  setOpen,
  apartment,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
  apartment: {
    id: number;
    name: string;
  };
}) {
  const queryClient = useQueryClient();
  const { authState } = useAuth() as { authState: UserWithToken };
  const [newApartmentName, setNewApartmentName] = useState(apartment.name);

  const renameApartmentMutation = useMutation(
    () =>
      apartmentService.update(authState.token, apartment.id, newApartmentName),
    {
      onMutate: async () => {
        await queryClient.cancelQueries("apartment");
        const previousApartment = queryClient.getQueryData<Apartment | "">(
          "apartment",
        );

        if (previousApartment !== undefined && previousApartment !== "") {
          const updatedApartment = {
            ...previousApartment,
            name: newApartmentName,
          };
          queryClient.setQueryData("apartment", updatedApartment);
        }

        return { previousApartment };
      },
      onError: (err, variables, context) => {
        console.log(err);
        if (context?.previousApartment) {
          queryClient.setQueryData<Apartment | "">(
            "apartment",
            context.previousApartment,
          );
        }
        toast.error("Fail to update apartment name", {
          position: toast.POSITION.TOP_CENTER,
        });
      },
      onSuccess: (data, variables, context) => {
        toast.success("Rename apartment", {
          position: toast.POSITION.TOP_CENTER,
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries("apartment");
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
