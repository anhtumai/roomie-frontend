import { Paper, Typography, TextField, Button } from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import apartmentService from "../../services/apartment";
import { paperSx, headerSx, buttonSx, noteSx } from "./style";
import useAuth from "../../contexts/auth";
import useNotification from "../../contexts/notification";

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

  const { authState } = useAuth();
  const { setNotification } = useNotification();

  async function onSubmit({ name }: { name: string }) {
    try {
      await apartmentService.create((authState as UserWithToken).token, name);
      setNotification(`Create new apartment: ${name}`, "success");

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.log(err);
      setNotification("Fail to create an apartment", "error");
    }
  }

  return (
    <Paper sx={paperSx}>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
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
      <Typography variant="body1" component="p" sx={noteSx}>
        <b>Note:</b> You can create a new apartment or wait for invitation from
        other people
      </Typography>
    </Paper>
  );
}

export default ApartmentForm;
