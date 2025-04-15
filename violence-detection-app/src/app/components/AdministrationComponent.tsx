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

const AdministrationComponent: React.FC = () => {
  const { data, loading, error, fetchCameras, deleteCamera } = useDataCamera();
  const [open, setOpen] = useState(false);
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
      if(data){
        console.log("Raw Data from API:", data)
      }
      setClientReady(true);
  }, [data]);

  const columns: GridColDef[] = [
    {
        field: "camera",
        headerName: "Full Name",
        width: 200,
        valueGetter: (value, row) => `CAM No. ${row?.camera}`
    },
    { field: "email", headerName: "IP Email Address", width: 200 },
    { field: "date", headerName: "Joined Date", width: 200 },
    { field: "role", headerName: "Permission", width: 200 },
    { field: "action", headerName: "Action", width: 200 },
   
  ];

  return (
    <Box sx={{ p: 3, minHeight: "92.8vh", backgroundColor: "#fafafa" }}>
      
        <Typography variant="h5" sx={{ color: 'black', fontWeight: 'medium' }}>
            Administration Menu
        </Typography>
        <Typography variant="h6" sx={{ color: 'black', fontWeight: 'medium' }}>
            User Management
        </Typography>

        <Box className="flex justify-end pt-1">
            <Button variant="contained" onClick={() => setOpen(true)} >
                <AddIcon /> ADD USER
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

export default AdministrationComponent;
