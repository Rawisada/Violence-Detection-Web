import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  OutlinedInput,
  Chip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import useDataCamera from "../hook/useDataCamera";
import { VIOLENCE_TYPES } from "@/constants/violenceType";
import { getCurrentDate } from "@/constants/todayDate";
import { FilterViolenceVideos } from "../types/ViolenceVideosTypes";
import { CameraData } from "../types/CameraTypes";

interface FilterDialogProps {
    open: boolean;
    onClose: () => void;
    onFilter: (filter: FilterViolenceVideos) => void;}
  
const FilterDialogViolenceComponent: React.FC<FilterDialogProps> = ({ open, onClose, onFilter}) => {
    const { data, loading, error } = useDataCamera();
    const todayDate = getCurrentDate();
    const [menuOpen, setMenuOpen] = useState(false); 
    const [filter, setFilter] = useState({
      camera:[] as number[],
      date:  getCurrentDate(),
      type: Object.keys(VIOLENCE_TYPES), 
    });

    useEffect(() => {
      if (data && data.length > 0) {
        setFilter((prev) => ({
          ...prev,
          camera: data.map((cam) => cam.camera),
        }));
      }
    }, [data]);
  
    const handleCameraChange = (event: any) => {
      setFilter((prev) => ({
        ...prev,
        camera: event.target.value,
      }));
    };
  
    const handleTypeChange = (event: any) => {
      setFilter((prev) => ({
        ...prev,
        type: event.target.value,
      }));
    };
  
    const handleDateChange = (newValue: any) => {
      setFilter((prev) => ({
        ...prev,
        date: newValue ? newValue.format("YYYY-MM-DD") : "",
      }));
    };
  
    const handleDeleteCamera = (cameraToDelete: number) => {
      setFilter((prev) => ({
        ...prev,
        camera: prev.camera.filter((cam) => cam !== cameraToDelete)
      }));
    };
  
    const handleDeleteType = (typeToDelete: string) => {
      setFilter((prev) => ({
        ...prev,
        type: prev.type.filter((t) => t !== typeToDelete),
      }));
    };
    
    return (
      <Dialog 
        open={open} 
        onClose={onClose} 
        fullWidth 
        sx={{
          '& .MuiDialog-paper': {
            width: '550px'
          }
        }} >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" component="span" sx={{minWidth: '80px', display: 'flex', alignItems: 'center'}}>Filter</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon/>
          </IconButton>
        </DialogTitle>
  
        <DialogContent dividers className="p-5">
          <div className="flex mb-4">
            <Typography variant="subtitle1" component="span" sx={{minWidth: '100px', display: 'flex', alignItems: 'center'}}>Camera No:</Typography>
            <FormControl fullWidth>
               <Select
                multiple
                value={filter.camera}
                onOpen={() => setMenuOpen(true)}   
                onClose={() => setMenuOpen(false)} 
                onChange={handleCameraChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={`CAM ${value}`}  
                        onMouseDown={(event) => event.stopPropagation()} 
                        onDelete={() => handleDeleteCamera(value)} 
                      />
                    ))}
                  </Box>
                )}
              >
                {data.map((item: CameraData) => (
                  <MenuItem key={item._id} value={item.camera}>
                    CAM {item.camera}
                  </MenuItem>
                  
                ))}
                
            </Select>
            </FormControl>
          </div>
          <div className="flex mb-4">
            <Typography variant="subtitle1" component="span" sx={{minWidth: '100px', display: 'flex', alignItems: 'center'}}>Date:</Typography>
             <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={filter.date ? dayjs(filter.date) : null}
                onChange={handleDateChange}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </div>
          <div className="flex mb-4">
            <Typography variant="subtitle1" component="span" sx={{minWidth: '100px', display: 'flex', alignItems: 'center'}}>Type:</Typography>
            <FormControl fullWidth>
              <Select
                multiple
                value={filter.type}
                onChange={handleTypeChange}
                input={<OutlinedInput />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {selected.map((value:any) => (
                      <Chip 
                        key={value} 
                        label={VIOLENCE_TYPES[value]}  
                        onMouseDown={(event) => event.stopPropagation()} 
                        onDelete={() => handleDeleteType(value)}  
                      />
                    ))}
                  </Box>
                )}
              >
                {Object.entries(VIOLENCE_TYPES).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        
          </div>
        </DialogContent>
  
        <DialogActions>
          <Button 
            onClick={() => {
              onFilter({
                camera: data.map(cam => cam.camera), 
                date: todayDate,                     
                type: Object.keys(VIOLENCE_TYPES),  
              })
              setFilter({
                camera: data.map(cam => cam.camera), 
                date: todayDate,                     
                type: Object.keys(VIOLENCE_TYPES),  
              })
            }} 
            color="warning">
            CLEAR
          </Button>
          <Button 
            onClick={() => onFilter({
              camera: filter.camera,
              date: filter.date, 
              type: filter.type  
            })} 
            variant="contained" 
            color="primary"
          >
            SEARCH
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default FilterDialogViolenceComponent;
  