import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";

import { Button, TextField, Stack } from "@mui/material";

import authService from "services/auth";
import accountService from "services/account";
import useAuth from "contexts/auth";

import "./style.css";

function UpdateAccountForm() {
  const queryClient = useQueryClient();
  const { authState, setAuthState } = useAuth() as {
    authState: UserWithToken;
    setAuthState: (authInfo: UserWithToken) => void;
  };

  const validationSchema = Yup.object().shape(
    {
      username: Yup.string()
        .required("Username is required")
        .min(5, "Username must be at least 5 characters"),
      name: Yup.string()
        .required("Name is required")
        .min(10, "Name must be at least 10 characters"),
      newPassword: Yup.string()
        .notRequired()
        .when("newPassword", {
          is: (value: string | undefined) => value?.length,
          then: (rule) => rule.min(10),
        }),
      confirmPassword: Yup.string().oneOf(
        [Yup.ref("newPassword")],
        "Passwords must match",
      ),
      currentPassword: Yup.string()
        .required("Need password for authentication")
        .min(10, "Current password should be at least 10 characters"),
    },
    [["newPassword", "newPassword"]],
  );

  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm(formOptions);

  function resetAllFields() {
    reset({
      username: authState.username,
      name: authState.name,
      newPassword: "",
      confirmPassword: "",
      currentPassword: "",
    });
  }

  function handleReset() {
    resetAllFields();
  }

  async function onSubmit(data: {
    name: string;
    username: string;
    newPassword: string;
    confirmPassword: string;
    currentPassword: string;
  }) {
    try {
      const credential: AccountCredential = {
        username: authState.username,
        password: data.currentPassword,
      };

      await authService.login(credential);
    } catch (err) {
      console.log(err);
      const errMessage =
        (err as any).response?.status === 401
          ? "Wrong password"
          : "Fail to validate credential";

      toast.error(errMessage, {
        position: toast.POSITION.TOP_CENTER,
      });
      resetAllFields();
      return;
    }

    try {
      const { username, name, newPassword } = data;
      const updateAccoutProperty: UpdateAccountProperty = { username, name };
      if (typeof newPassword === "string" && newPassword.length >= 10) {
        updateAccoutProperty.password = newPassword;
      }
      const updatedAccountResponseData = await accountService.update(
        authState.token,
        authState.id,
        updateAccoutProperty,
      );

      const updatedAuthState = { ...authState, ...updatedAccountResponseData };
      setAuthState(updatedAuthState);
      toast.success("Update account profile", {
        position: toast.POSITION.TOP_CENTER,
      });
      reset({
        username: username,
        name: name,
        newPassword: "",
        confirmPassword: "",
        currentPassword: "",
      });
      queryClient.clear();
    } catch (err) {
      console.log(err);
      const errMessage = "Fail to update account";
      toast.error(errMessage, {
        position: toast.POSITION.TOP_CENTER,
      });
      resetAllFields();
    }
  }

  return (
    <div className="update-account-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h4>Profile</h4>

        <Controller
          name="username"
          control={control}
          defaultValue={authState.username}
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Username"
              variant="standard"
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
          defaultValue={authState.name}
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Name"
              variant="standard"
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
          name="newPassword"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextField
              label="New password (optional)"
              variant="standard"
              type="password"
              value={value}
              onChange={onChange}
            />
          )}
        />
        {errors.newPassword && (
          <span className="errorSpan">{errors.newPassword.message}</span>
        )}
        <Controller
          name="confirmPassword"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Confirm Password"
              variant="standard"
              type="password"
              value={value}
              onChange={onChange}
            />
          )}
        />
        {errors.confirmPassword && (
          <span className="errorSpan">{errors.confirmPassword.message}</span>
        )}

        <Controller
          name="currentPassword"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Current Password"
              variant="standard"
              type="password"
              value={value}
              onChange={onChange}
            />
          )}
        />
        {errors.currentPassword && (
          <span className="errorSpan">{errors.currentPassword.message}</span>
        )}
        <Stack
          direction="row"
          spacing={1.25}
          sx={{
            marginTop: "2.5rem",
            marginBottom: "0.75rem",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="outlined" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="outlined" type="submit">
            Update
          </Button>
        </Stack>
      </form>
    </div>
  );
}

export default UpdateAccountForm;
