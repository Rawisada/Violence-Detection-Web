"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import useDataUser from "../hook/useDataUser";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useRouter } from "next/navigation";
import AddUserDialogComponenet from "./AddUserDialogComponenet";

const AdministrationComponent: React.FC = () => {
  const router = useRouter();
  const { data, loading, error, fetchAllUsers, deleteUser, updateUser } = useDataUser();
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
        field: "fullName",
        headerName: "Full Name",
        width: 200,
        valueGetter: (value, row) => `${row?.profile.firstName} ${row?.profile.lastName}`
    },
    { field: "email", headerName: "IP Email Address", width: 200 },
    {
      field: "organization",
      headerName: "Organization",
      width: 200,
      valueGetter: (value, row) => `${row?.profile.organization}`
    },
    {
      field: "role",
      headerName: "Permission",
      width: 200,
      valueGetter: (value, row) => `${row?.profile.role}`
    },
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 , alignItems: "center", justifyContent: "center", height: "100%", width: "100%",}}>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={(event) => {
              event.preventDefault();
              setSelectedUserId(params.row._id);
              setConfirmOpenUpdate(true);
              // const currentRole = params.row.profile.role;
              // const newRole = currentRole === "admin" ? "user" : "admin";
              // updateUser(params.row._id, {
              //   profile: {
              //     ...params.row.profile,
              //     role: newRole,
              //   },
              // });
            }}
            sx={{ fontSize: "0.75rem", padding: "2px 8px", minWidth: "unset" }}
          >
            <EditIcon sx={{marginRight: 0.5, width: 20}}/>  MODIFY
          </Button>
    
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDeleteClick(params.row._id)}
            sx={{ fontSize: "0.75rem", padding: "2px 8px", minWidth: "unset" }}
          >
             <DeleteIcon sx={{marginRight: 0.5, width: 20}}/>  REMOVE
          </Button>
        </Box>
      ),
    }
  ];

  const [confirmOpenDelete, setConfirmOpenDelete] = useState(false);
  const [confirmOpenUpdate, setConfirmOpenUpdate] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  
  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setConfirmOpenDelete(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUserId) {
      deleteUser(selectedUserId);
      setConfirmOpenDelete(false);
    }
  };

  const handleCancelConfirmDelete = () => {
    setConfirmOpenDelete(false);
  };

  const handleConfirmUpdate = () => {
    if (selectedUserId) {
      const user = data.find((u) => String(u._id) === selectedUserId);
      if (user) {
        const currentRole = user.profile.role;
        const newRole = currentRole === "admin" ? "user" : "admin";
        updateUser(selectedUserId, {
          profile: {
            ...user.profile,
            role: newRole,
          },
        });
      }
      setConfirmOpenUpdate(false);
    }
  };

  const handleCancelConfirmUpdate = () => {
    setConfirmOpenUpdate(false);
  };


  

  return (
    <>
    <Box sx={{ p: 3, minHeight: "92.8vh", backgroundColor: "#fafafa" }}>
        <Button onClick={() => router.back()} sx={{ p:0, m:0 }}>
          <Typography variant="h5" sx={{ color: 'black', fontWeight: 'medium' }}>
          <ChevronLeftIcon sx={{ fontSize: 40}} /> Administration Menu
          </Typography>
        </Button>

        <Typography variant="h6" sx={{ color: 'black', fontWeight: 'medium' }}>
            User Management
        </Typography>

        <Box className="flex justify-end pt-1">
            <Button variant="contained" onClick={() => setOpen(true)} >
                <AddIcon /> ADD USER
            </Button>
        </Box>
        <AddUserDialogComponenet open={open} handleClose={() => setOpen(false)} refreshUsers={fetchAllUsers} />
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
    {/* Dialog Confirm Delete */}
    <Dialog open={confirmOpenDelete} onClose={handleCancelConfirmDelete} fullWidth maxWidth="xs">
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent>
        <Typography sx={{ mt: 1 }}>
          Do you want to remove this user?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelConfirmDelete} color="inherit">Cancel</Button>
        <Button onClick={handleConfirmDelete} variant="contained" color="error">Delete</Button>
      </DialogActions>
    </Dialog>

    {/* Dialog Confirm Update Role */}
    <Dialog open={confirmOpenUpdate} onClose={handleCancelConfirmUpdate} fullWidth maxWidth="xs">
      <DialogTitle>Update Role</DialogTitle>
      <DialogContent>
        <Typography sx={{ mt: 1 }}>
          Do you want to update role?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelConfirmUpdate} color="inherit">Cancel</Button>
        <Button onClick={handleConfirmUpdate} variant="contained" sx={{ backgroundColor: '#03A9F4' }}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  </>
  );
};

export default AdministrationComponent;
