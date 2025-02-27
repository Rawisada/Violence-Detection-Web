import React, { useState } from "react";
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
  InputLabel,
  Checkbox,
  FormControlLabel,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

interface FilterDialogProps {
    open: boolean;
    onClose: () => void;
    onFilter: (filter: { cameraNo: string; date: string; type: string[] }) => void;
    onClear: () => void;
}
  
const FilterDialogComponent: React.FC<FilterDialogProps> = ({ open, onClose, onFilter, onClear }) => {
    const [filter, setFilter] = useState({
      cameraNo: "",
      date: "",
      type: [] as string[], 
    });
  
    const handleTypeChange = (type: string) => {
      setFilter((prev) => ({
        ...prev,
        type: prev.type.includes(type)
          ? prev.type.filter((t) => t !== type)
          : [...prev.type, type],
      }));
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Filter</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon/>
          </IconButton>
        </DialogTitle>
  
        <DialogContent dividers className="p-5">
          <div className="flex mb-4">
            <text className="flex text-[13px] min-w-20 items-center ">Camera No:</text>
            <FormControl fullWidth>
              <InputLabel id="camera-label" >Camera No.</InputLabel>
              <Select
                labelId="camera-label"
                value={filter.cameraNo}
                onChange={(e) => setFilter({ ...filter, cameraNo: e.target.value })}
                fullWidth
                label="Camera No."
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="CAM 01">CAM 01</MenuItem>
                <MenuItem value="CAM 02">CAM 02</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="flex mb-4">
            <text className="flex text-[13px] min-w-20 items-center">Date:</text>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={filter.date ? dayjs(filter.date) : null}
                onChange={(newValue) => setFilter({ ...filter, date: newValue ? newValue.format("YYYY-MM-DD") : "" })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </div>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Violence Type:
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            {["Child-Adult", "Child-Child", "Adult-Adult"].map((type) => (
              <FormControlLabel
                key={type}
                control={
                  <Checkbox
                    checked={filter.type.includes(type)}
                    onChange={() => handleTypeChange(type)}
                  />
                }
                label={type}
              />
            ))}
          </Box>
        </DialogContent>
  
        <DialogActions>
          <Button onClick={onClear} color="warning">
            CLEAR
          </Button>
          <Button onClick={() => onFilter(filter)} variant="contained" color="primary">
            SEARCH
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default FilterDialogComponent;
  