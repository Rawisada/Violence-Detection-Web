import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

interface AddCameraDialogProps {
  open: boolean;
  handleClose: () => void;
  refreshCameras: () => void;
  cameras: any[];
}


const AddCameraDialogComponent: React.FC<AddCameraDialogProps> = ({ open, handleClose, refreshCameras, cameras }) => {
  const { control, handleSubmit, reset, setValue, formState: { isValid } } = useForm({
    mode: "onChange",
    defaultValues: {
      camera: "",
      name: "",
      ip: "",
      status: false, 
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await axios.post("/api/camera", { ...data, status: false });
      refreshCameras(); 
      handleClose(); 
      reset(); 
    } catch (error) {
      console.error("Failed to add camera:", error);
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
    handleClose();
  };

  useEffect(() => {
    if (open && cameras.length > 0) {
      const maxCamera = Math.max(...cameras.map((cam) => Number(cam.camera) || 0));
      const nextCamera = maxCamera + 1;
      setValue("camera", nextCamera.toString());
    } 
  }, [open, cameras, setValue]);
  

  return (
    <>
      <Dialog open={open} onClose={handleCloseAndReset} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h6" component="span">Add Camera</Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
            <Controller
              name="camera"
              control={control}
              rules={{
                required: "Camera number is required",
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Camera No."
                  fullWidth
                  required
                  type="number" 
                  disabled
                />
              )}
            />
            <Controller
              name="name"
              control={control}
              rules={{ required: "Camera name is required" }}
              render={({ field }) => <TextField {...field} label="Camera Name" fullWidth required />}
            />
            <Controller
              name="ip"
              control={control}
              rules={{
                required: "IP Address is required",
                pattern: {
                  value: /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/,
                  message: "Invalid IP Camera format"
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="IP Camera"
                  fullWidth
                  required
                  error={!!error && error.type !== 'required'}
                  helperText={error && error.type !== 'required' ? error.message : ""}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAndReset} color="error">Cancel</Button>
          <Button onClick={handleAddClick} variant="contained" color="primary" disabled={!isValid}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={handleCancelConfirm}  fullWidth maxWidth="xs">
        <DialogTitle>
          <Typography variant="h6" component="span">Confirm Add Camera</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 1 }}>
            Do you want to add this camera?
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

export default AddCameraDialogComponent;
