import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

// ✅ เพิ่ม Props Interface
interface AddCameraDialogProps {
  open: boolean;
  handleClose: () => void;
  refreshCameras: () => void;
}

// ✅ ใช้ Props Interface กับ Component
const AddCameraDialogComponent: React.FC<AddCameraDialogProps> = ({ open, handleClose, refreshCameras }) => {
  const { control, handleSubmit, reset } = useForm({
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

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h6" component="span">Add Camera</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
          <Controller
            name="camera"
            control={control}
            rules={{ required: "Camera number is required" }}
            render={({ field }) => <TextField {...field} label="Camera No." fullWidth required />}
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
            rules={{ required: "IP Address is required" }}
            render={({ field }) => <TextField {...field} label="IP Address" fullWidth required />}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCameraDialogComponent;
