import { TextField, Button, Typography, Avatar, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router";
import { toast } from "react-toastify";

import accountService from "../../services/account";

import {
  boxSx,
  avatarSx,
  h2Sx,
  submitButtonSx,
} from "../sharedStyles/authFormStyles";

import "../sharedStyles/authFormStyles.css";

function RegisterForm() {
  const history = useHistory();

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .min(5, "Username must be at least 5 characters"),
    name: Yup.string()
      .required("Name is required")
      .min(10, "Name must be at least 10 characters"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm(formOptions);

  async function onSubmit({ username, name, password }: Account) {
    try {
      await accountService.create({
        username,
        name,
        password,
      });
      toast.success(`Create new account: ${name}`, {
        position: toast.POSITION.TOP_CENTER,
      });
      history.push("/login");
    } catch (err) {
      console.log(err);
      toast.error("Fail to create new account", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }

  return (
    <Box sx={boxSx}>
      <Avatar
        className="avatar"
        sx={{
          ...avatarSx,
          backgroundColor: "#1bbd7e",
        }}
      >
        <AddIcon />
      </Avatar>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <Typography variant="h2" component="h2" sx={h2Sx}>
          Sign up
        </Typography>
        <Controller
          name="username"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Username"
              data-testid="username"
              variant="filled"
              required
              value={value}
              onChange={onChange}
            />
          )}
        />
        {errors.username && (
          <span className="errorSpan">{errors.username.message}</span>
        )}
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Name"
              data-testid="name"
              variant="filled"
              required
              value={value}
              onChange={onChange}
            />
          )}
        />
        {errors.name && (
          <span className="errorSpan">{errors.name.message}</span>
        )}

        <Controller
          name="password"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Password"
              data-testid="password"
              variant="filled"
              type="password"
              required
              value={value}
              onChange={onChange}
            />
          )}
        />
        {errors.password && (
          <span className="errorSpan">{errors.password.message}</span>
        )}
        <Controller
          name="confirmPassword"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextField
              label="ConfirmPassword"
              data-testid="confirmPassword"
              variant="filled"
              type="password"
              required
              value={value}
              onChange={onChange}
            />
          )}
        />
        {errors.confirmPassword && (
          <span className="errorSpan">{errors.confirmPassword.message}</span>
        )}

        <Button
          data-testid="login-btn"
          type="submit"
          variant="contained"
          color="primary"
          sx={submitButtonSx}
        >
          Sign up
        </Button>
      </form>
    </Box>
  );
}

export default RegisterForm;
