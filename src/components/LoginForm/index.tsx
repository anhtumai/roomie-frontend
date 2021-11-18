import { useState } from "react";

import { Controller, useForm } from "react-hook-form";
import { Redirect } from "react-router";
import { toast } from "react-toastify";

import { TextField, Button, Typography, Avatar, Box } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import {
  boxSx,
  avatarSx,
  h2Sx,
  submitButtonSx,
} from "../sharedStyles/authFormStyles";
import "../sharedStyles/authFormStyles.css";

import useAuth from "../../contexts/auth";

import authService from "../../services/auth";

function LoginForm() {
  const [redirectOnSuccess, setRedirectOnSuccess] = useState(false);
  const { setAuthState } = useAuth();
  const { control, handleSubmit, reset } = useForm();
  async function onSubmit(data: Credential) {
    try {
      const userWithToken = await authService.login(data);
      setAuthState(userWithToken);

      setTimeout(() => {
        setRedirectOnSuccess(true);
        toast.success("Login successfully", {
          position: toast.POSITION.TOP_CENTER,
        });
      }, 0);
    } catch (err) {
      console.log(err);
      const errMessage =
        (err as any).response?.status === 401
          ? "Invalid credential"
          : "Fail to login";
      toast.error(errMessage, {
        position: toast.POSITION.TOP_CENTER,
      });
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
