"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import AddCameraDialogComponent from "./AddCameraDialogCompomnent"; 
import { useCameraContext } from "../context/CameraContext";
import useDataCamera from "../hook/useDataCamera";

const SystemSettingsComponent: React.FC = () => {
  const { cameraActive, toggleCamera } = useCameraContext();
  const { data, loading, error, fetchCameras, deleteCamera } = useDataCamera();
  const [open, setOpen] = useState(false);
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
      if(data){
        console.log("Raw Data from API:", data)
      }
      setClientReady(true);
  }, [data]);

  useEffect(() => {
    fetchCameras(); 
  }, [cameraActive])

  const columns: GridColDef[] = [
    {
        field: "camera",
        headerName: "Camera No.",
        width: 200,
        valueGetter: (value, row) => `CAM No. ${row?.camera}`
    },
    { field: "ip", headerName: "IP Camera", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => (
        <Box 
        sx={{
            borderRadius: "20px", 
            padding: "4px 12px",
            maxHeight: '35px',
            width: "fit-content",
            fontSize: "0.85rem", 
            textTransform: "none", 
            backgroundColor: params.value ? "success.main" : "error.main",  
            color: "#fff", 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}
        >
        {params.value ? "Connected" : "Disconnected"}
        </Box>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={(event) => {
              event.preventDefault(); 
              toggleCamera();
            }}
            color="primary"
          >
             {params.row.camera === 1
                ? (cameraActive ? <VideocamOffIcon /> : <VideocamIcon />)
                : (params.row.status ? <VideocamOffIcon /> : <VideocamIcon />)
              }
          </IconButton>
          <IconButton onClick={() => deleteCamera(params.row.camera)} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, minHeight: "92.8vh", backgroundColor: "#fafafa" }}>
      
        <Typography variant="h5" sx={{ color: 'black', fontWeight: 'medium' }}>
            System Setting
        </Typography>
        <Typography variant="h6" sx={{ color: 'black', fontWeight: 'medium' }}>
            Profile
        </Typography>

        <Box className="flex justify-end pt-1">
            <Button variant="contained" onClick={() => setOpen(true)} >
                <AddIcon /> Add Camera
            </Button>
        </Box>

        <AddCameraDialogComponent open={open} handleClose={() => setOpen(false)} refreshCameras={fetchCameras} />
        {clientReady && ( 
        <div className="min-h-full min-w-full my-4 ">
            <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row._id}
            pageSizeOptions={[5, 10, 20]}
            loading={loading}
            sx={{
                "& .MuiDataGrid-cell": { justifyContent: "center", textAlign: "center" },
                "& .MuiDataGrid-columnHeaderTitle": { textAlign: "center" },
            }}
            />
        </div>
      )} 
    </Box>
  );
};

export default SystemSettingsComponent;
