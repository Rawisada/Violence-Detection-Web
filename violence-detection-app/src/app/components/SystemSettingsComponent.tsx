"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import AddCameraDialogComponent from "./AddCameraDialogCompomnent"; 
import { useCameraContext } from "../context/CameraContext";
import useDataCamera from "../hook/useDataCamera";
import useDataUser from "../hook/useDataUser";
import type { UserData } from "../types/UsersType";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface TabProps {
  session: any;
}

const SystemSettingsComponent: React.FC<TabProps> = ({ session }) => {
  const { cameraActive, toggleCamera } = useCameraContext();
  const { data, loading, error, fetchCameras, updateCameraStatus, deleteCamera } = useDataCamera();
  const { fetchUser } = useDataUser();
  const [open, setOpen] = useState(false);
  const [clientReady, setClientReady] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
      if(data){
        console.log("Raw Data from API:", data)
      }
      setClientReady(true);
  }, [data]);

  useEffect(() => {
    fetchCameras(); 
  }, [cameraActive])

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (session?.user?.email) {
        const userProfile = await fetchUser(session.user.email);
        setUser(userProfile);
        console.log("Current User:", userProfile);
      }
    };
    fetchCurrentUser();
  }, [session]);

  const columns: GridColDef[] = [
    {
        field: "camera",
        headerName: "Camera No.",
        width: 200,
        disableColumnMenu: true,
        valueGetter: (value, row) => `CAM No. ${row?.camera}`
    },
    { field: "ip", headerName: "IP Camera", width: 300, disableColumnMenu: true, },
    {
      field: "status",
      headerName: "Status",
      width: 300,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box 
        sx={{
          display: "flex", gap: 1 , alignItems: "center", justifyContent: "center", height: "100%", width: "100%",
        }}
        >
          <Box sx={{
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
          }}>
            {params.value ? "Connected" : "Disconnected"}
          </Box>
        </Box>
      ),
    },
    {
      field: "action",
      headerName: "",
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{  display: "flex", gap: 1 , alignItems: "center", justifyContent: "center", height: "100%", width: "100%", }}>
          <IconButton
            onClick={(event) => {
              event.preventDefault(); 
              handleConnectClick(params.row.camera, params.row.status);
            }}
            color="primary"
          >
             {params.row.camera === 1
                ? (cameraActive ? <VideocamOffIcon /> : <VideocamIcon />)
                : (params.row.status ? <VideocamOffIcon /> : <VideocamIcon />)
              }
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(params.row.camera)} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const [confirmOpenDelete, setConfirmOpenDelete] = useState(false);
  const [confirmOpenConnect, setConfirmOpenConnect] = useState(false);
  const [confirmOpenDisconnect, setConfirmOpenDisconnect] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<number>(0);

  const handleDeleteClick = (camera: number) => {
    setSelectedCamera(camera);
    setConfirmOpenDelete(true);
  };
  
  const handleConfirmDelete = () => {
    if (selectedCamera !== null) {
      deleteCamera(selectedCamera);
      setConfirmOpenDelete(false);
    }
  };
  
  const handleCancelConfirmDelete = () => {
    setConfirmOpenDelete(false);
  };

  const handleConnectClick = (camera: number, isConnected: boolean) => {
    setSelectedCamera(camera);
    if (isConnected) {
      setConfirmOpenDisconnect(true); 
    } else {
      setConfirmOpenConnect(true); 
    }
  };
  
  const handleConfirmConnect = () => {
    updateCameraStatus(selectedCamera ,true)
    if(selectedCamera === 1){
      toggleCamera(); 
    }
    setConfirmOpenConnect(false);
  };
  
  const handleConfirmDisconnect = () => {
    updateCameraStatus(selectedCamera, false)
    if(selectedCamera === 1){
      toggleCamera(); 
    }
    setConfirmOpenDisconnect(false);
  };
  
  const handleCancelConfirmConnect = () => {
    setConfirmOpenConnect(false);
  };
  
  const handleCancelConfirmDisconnect = () => {
    setConfirmOpenDisconnect(false);
  };
  

  return (
    <>
    <Box sx={{ p: 3, minHeight: "92.8vh", backgroundColor: "#fafafa" }}>
      
        <Typography variant="h5" sx={{ color: 'black', fontWeight: 'medium' }}>
            System Setting
        </Typography>
        <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold', marginTop: 2}}>
            Profile
        </Typography>
        <Typography variant="body1" sx={{ color: 'black', fontWeight: 'medium' }}>
            Name: {user?.profile.firstName} {user?.profile.lastName} 
        </Typography>
        <Typography variant="body1" sx={{ color: 'black', fontWeight: 'medium' }}>
            Email: {user?.email}
        </Typography>
        <Typography variant="body1" sx={{ color: 'black', fontWeight: 'medium' }}>
            Organization: <Box component="span" sx={{ textTransform: 'uppercase' }}>{user?.profile.organization}</Box>
        </Typography>
        <Typography variant="body1" sx={{ color: 'black', fontWeight: 'medium' }}>
            Role: <Box component="span" sx={{ textTransform: 'uppercase' }}>{user?.profile.role}</Box>
        </Typography>

        {user?.profile.role == 'admin' && (
          <Typography 
            component="a" 
            href="/administration"
            sx={{
                color: '#03A9F4',
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
            }}
            >
            ADMINISTRATION MENU  <ArrowForwardIosIcon fontSize="inherit" />
          </Typography>
        )}

        <Box className="flex justify-end pt-1">
            <Button variant="contained" onClick={() => setOpen(true)} >
                <AddIcon /> Add Camera
            </Button>
        </Box>

        <AddCameraDialogComponent open={open} handleClose={() => setOpen(false)} refreshCameras={fetchCameras}  cameras={data}/>
        {clientReady && ( 
        <div className="min-h-full min-w-full my-4 ">
            <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row._id}
            pageSizeOptions={[5, 10, 20]}
            loading={loading}
            sx={{
                "& .MuiDataGrid-cell": { justifyContent: "left", textAlign: "left" },
                "& .MuiDataGrid-columnHeaderTitle": { textAlign: "left" },
            }}
            />
        </div>
      )} 
    </Box>
    <Dialog open={confirmOpenDelete} onClose={handleCancelConfirmDelete} fullWidth maxWidth="xs">
      <DialogTitle>Delete Camera</DialogTitle>
      <DialogContent>
        <Typography sx={{ mt: 1 }}>
          Do you want to remove this camera?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelConfirmDelete} color="inherit">Cancel</Button>
        <Button onClick={handleConfirmDelete} variant="contained" color="error">Delete</Button>
      </DialogActions>
    </Dialog>
    <Dialog open={confirmOpenConnect} onClose={handleCancelConfirmConnect} fullWidth maxWidth="xs">
      <DialogTitle>Reconnect Camera</DialogTitle>
      <DialogContent>
        <Typography sx={{ mt: 1 }}>
          Do you want to reconnect the camera?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelConfirmConnect} color="inherit">Cancel</Button>
        <Button onClick={handleConfirmConnect} variant="contained" sx={{ backgroundColor: '#03A9F4' }}>
          Reconnect
        </Button>
      </DialogActions>
    </Dialog>
    <Dialog open={confirmOpenDisconnect} onClose={handleCancelConfirmDisconnect} fullWidth maxWidth="xs">
      <DialogTitle>Disconnect Camera</DialogTitle>
      <DialogContent>
        <Typography sx={{ mt: 1 }}>
          Do you want to disconnect the camera?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelConfirmDisconnect} color="inherit">Cancel</Button>
        <Button onClick={handleConfirmDisconnect} variant="contained" sx={{ backgroundColor: '#F44336' }}>
          Disconnect
        </Button>
      </DialogActions>
    </Dialog>



  </>
  );
};

export default SystemSettingsComponent;
