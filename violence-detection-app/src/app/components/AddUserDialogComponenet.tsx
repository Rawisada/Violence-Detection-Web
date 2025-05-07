"use client";

import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, Checkbox, FormControlLabel,
  Alert
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import useSignup from "../hook/useSignUp";

interface AddUserDialogProps {
  open: boolean;
  handleClose: () => void;
  refreshUsers: () => void;
}

const AddUserDialogComponent: React.FC<AddUserDialogProps> = ({ open, handleClose, refreshUsers }) => {
  const { control, handleSubmit, reset, formState: { isValid } } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      organization: ""
    }
  });  

  const { loading, error, success, signup } = useSignup();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      setErrorMessage(null); // เคลียร์ error เดิม
      await signup({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        organization: data.organization
      });
  
      refreshUsers();
      handleClose();
      reset();
    } catch (error) {
      const err = error as Error;
      setErrorMessage(err.message || "Something went wrong");
    }
    
  };
  
    
  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleAddClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmAdd = () => {
    handleSubmit(onSubmit)();
    setConfirmOpen(false);
  };

  const handleCancelConfirm = () => {
    setConfirmOpen(false);
    
  };

  const handleCloseAndReset = () => {
    reset();
    setErrorMessage(null);
    handleClose();
  };
  

  return (
    <>
    <Dialog open={open} onClose={handleCloseAndReset} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h6" component="span">Add User</Typography>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
          <Controller
            name="email"
            control={control}
            rules={{
              pattern: {
                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Invalid email format"
              }
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Email Address"
                fullWidth
                required
                error={!!error && error.type !== 'required'}
                helperText={error && error.type !== 'required'? error.message : ""} 
              />
            )}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "First name is required" }}
              render={({ field }) => (
                <TextField {...field} label="First Name" fullWidth required />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              rules={{ required: "Last name is required" }}
              render={({ field }) => (
                <TextField {...field} label="Last Name" fullWidth required />
              )}
            />
          </Box>
          <Controller
            name="organization"
            control={control}
            rules={{ required: "organization is required" }}
            render={({ field }) => (
              <TextField {...field} label="Organization" fullWidth required />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters"
              }
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField {...field} label="Password" type="password" fullWidth required error={!!error && error.type !== 'required'}
              helperText={error && error.type !== 'required'? error.message : ""} />
            )}
          />
          {errorMessage && (
            <Box sx={{ mb: 2 }}>
              <Alert variant="filled" severity="error">
                {errorMessage}
              </Alert>
            </Box>
          )}

          
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleCloseAndReset} color="error">Cancel</Button>
        <Button type="submit" onClick={handleAddClick} variant="contained" color="primary" disabled={!isValid}>
          Add
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog open={confirmOpen} onClose={handleCancelConfirm}  fullWidth maxWidth="xs">
        <DialogTitle>
          <Typography variant="h6" component="span">Confirm Add User</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 1 }}>
            Do you want to add this user?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirm} color="inherit">Cancel</Button>
          <Button onClick={handleConfirmAdd} variant="contained" color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>
      </>
  );
};

export default AddUserDialogComponent;
