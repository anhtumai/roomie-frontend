import { useState } from "react";

import { TextField, Button, Typography, Avatar, Box } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Controller, useForm } from "react-hook-form";
import { Redirect } from "react-router";

import {
  boxSx,
  avatarSx,
  h2Sx,
  submitButtonSx,
} from "../sharedStyles/authFormStyles";

import "../sharedStyles/authFormStyles.scss";

import useAuth from "../../contexts/auth";
import useNotification from "../../contexts/notification";

import authService from "../../services/auth";

function LoginForm() {
  const [redirectOnSuccess, setRedirectOnSuccess] = useState(false);
  const { setAuthState } = useAuth();
  const { setNotification } = useNotification();
  const { control, handleSubmit, reset } = useForm();
  async function onSubmit(data: Credential) {
    try {
      const userWithToken = await authService.login(data);
      setAuthState(userWithToken);

      setTimeout(() => {
        setRedirectOnSuccess(true);
        setNotification("Login successful", "success");
      }, 0);
    } catch (err) {
      console.log(err);
      const errMessage =
        (err as any).response?.status === 401
          ? "Invalid credential"
          : "Fail to login";
      setNotification(errMessage, "error");
      reset({ username: "", password: "" });
    }
  }

  return (
    <>
      {redirectOnSuccess && <Redirect to="/home" />}
      <Box sx={boxSx}>
        <Avatar className="avatar" sx={avatarSx}>
          <LockOutlinedIcon />
        </Avatar>
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <Typography variant="h2" component="h2" sx={h2Sx}>
            Sign in
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

          <Button
            data-testid="login-btn"
            type="submit"
            variant="contained"
            color="primary"
            sx={submitButtonSx}
          >
            Login
          </Button>
        </form>
      </Box>
    </>
  );
}

export default LoginForm;
