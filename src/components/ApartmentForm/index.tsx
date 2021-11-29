import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { Paper, Typography, TextField, Button } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";

import apartmentService from "services/apartment";
import useAuth from "contexts/auth";
import useApartment from "contexts/apartment";

import { paperSx, headerSx, buttonSx, noteSx } from "./style";

function ApartmentForm() {
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Apartment name is required")
      .min(5, "Apartment name must be at least 5 characters"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm(formOptions);

  const { authState } = useAuth() as { authState: UserWithToken };
  const { setApartment } = useApartment();

  async function onSubmit({ name }: { name: string }) {
    try {
      const responseCreateApartment = await apartmentService.create(
        authState.token,
        name,
      );
      const apartment: Apartment = {
        id: responseCreateApartment.id,
        name: responseCreateApartment.name,
        admin: authState,
        members: [authState],
        task_requests: [],
        task_assignments: [],
      };
      setApartment(apartment);
      toast.success(`Create new apartment: ${name}`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (err) {
      console.log(err);
      const errMessage =
        (err as any).response?.data.error || "Fail to create an apartment";
      toast.error(errMessage, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }

  return (
    <Paper sx={paperSx}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h6" component="h6" sx={headerSx}>
          Create new apartment
        </Typography>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Apartment Name"
              data-testid="apartment-name"
              variant="filled"
              required
              value={value}
              onChange={onChange}
            ></TextField>
          )}
        ></Controller>
        {errors.name && (
          <span className="errorSpan">{errors.name.message}</span>
        )}
        <Typography variant="body1" component="p" sx={noteSx}>
          <b>Note:</b> You can create a new apartment or wait for invitation
          from other people
        </Typography>

        <Button
          data-testid="login-btn"
          type="submit"
          variant="contained"
          color="primary"
          sx={buttonSx}
        >
          Submit
        </Button>
      </form>
    </Paper>
  );
}

export default ApartmentForm;
