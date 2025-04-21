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
  Typography,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import useDataCamera from "../hook/useDataCamera";
import { getCurrentDate } from "@/constants/todayDate";
import { FilterWeeklyViodeos } from "../types/WeeklyVideosTypes";
import { CameraData } from "../types/CameraTypes";

interface FilterDialogProps {
    open: boolean;
    onClose: () => void;
    onFilter: (filter: FilterWeeklyViodeos) => void;}
  
const FilterDialogWeeklyVideoComponent: React.FC<FilterDialogProps> = ({ open, onClose, onFilter}) => {
    const { data, loading, error } = useDataCamera();
    const todayDate = getCurrentDate();
    const [menuOpen, setMenuOpen] = useState(false); 
    const [filter, setFilter] = useState({
      camera:[] as number[],
      date:  getCurrentDate(),
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
    
    return (
      <Dialog 
        open={open} 
        onClose={onClose} 
        fullWidth 
        sx={{
          '& .MuiDialog-paper': {
            width: '550px'
          }
        }} 
      >
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
                maxDate={dayjs()}
                minDate={dayjs().subtract(6, 'day')}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </div>
        </DialogContent>
  
        <DialogActions>
          <Button 
            onClick={() => {
              onFilter({
                camera: data.map(cam => cam.camera), 
                date: todayDate,                     
              })
              setFilter({
                camera: data.map(cam => cam.camera), 
                date: todayDate                    
              })
            }} 
            color="warning">
            CLEAR
          </Button>
          <Button 
            onClick={() => onFilter({
              camera: filter.camera,
              date: filter.date
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
  
  export default FilterDialogWeeklyVideoComponent;
  