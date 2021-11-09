import { Paper, Typography, TextField, Button } from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import apartmentService from "../../services/apartment";
import { paperSx, headerSx, buttonSx, noteSx } from "./style";
import useAuth from "../../contexts/auth";

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

  async function onSubmit({ name }: { name: string }) {
    try {
      await apartmentService.create((authState as UserWithToken).token, name);
      toast.success(`Create new apartment: ${name}`, {
        position: toast.POSITION.TOP_CENTER,
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.log(err);
      toast.error("Fail to create an apartment", {
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
