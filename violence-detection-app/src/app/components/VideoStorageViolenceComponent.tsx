import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef} from '@mui/x-data-grid';
import { Button, Box, Typography, CircularProgress } from "@mui/material";
import useDataViolenceVideos from "@/app/hook/useDataViolenceVideos";
import { VIOLENCE_TYPES } from "@/constants/violenceType";
import FilterDialogViolenceComponent from "./FilterDialogViolenceComponent"; 
import { formatDate, formatFileSize } from "@/lib/formate";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { ViolenceData, FilterViolenceVideos } from "../types/ViolenceVideosTypes";
import { getCurrentDate } from "@/constants/todayDate";

const columns: GridColDef<ViolenceData>[] = [
  {
    field: "video",
    headerName: "Video",
    width: 200,
    renderCell: () => (
      <div className="flex items-center justify-center">
         <Box className="w-[140px] h-[80px] bg-gray-300 rounded-[8px] my-[16px]"></Box>
      </div>
    ),
  },
  {
    field: "camera",
    headerName: "Camera No.",
    width: 150,
    valueGetter: (value, row) => `Camera No. ${row?.camera}`
  },
  {
    field: "date",
    headerName: "Date",
    width: 150,
    valueGetter: (value, row) => formatDate(row?.date), 
  },
  { 
    field: "time", 
    headerName: "Time", 
    width: 150
  },
  {
    field: "type",
    headerName: "Violence Type",
    width: 140,
    valueGetter: (value, row) => (VIOLENCE_TYPES[row?.type]),
  },
  { 
    field: "fileSize", 
    headerName: "fileSize", 
    width: 130, 
    valueGetter: (value, row) => formatFileSize(row?.fileSize), },
  {
    field: "action",
    headerName: "Action",
    width: 120,
    renderCell: (params) => (
      <Button
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 0, 

        }}
        onClick={() => window.open(params.row.videoPath, "_blank")}
      >
        <ArrowForwardIosIcon/>
      </Button>
    ),
  },
];


const VideoStorageViolenceComponent: React.FC = () => {
  const { data, loading ,error, refetch} = useDataViolenceVideos();
  const [filteredData, setFilteredData] = useState<ViolenceData[]>([])
  const [openFilter, setOpenFilter] = useState(false);
  const [clientReady, setClientReady] = useState(false);
  const todayDate = getCurrentDate();
  const [filter, setFilter] = useState<FilterViolenceVideos>({
    camera: [],
    date: todayDate,
    type: [],
  });
  
  const handleFilter = (filterData: FilterViolenceVideos) => {
    setFilter(filterData);
    refetch(filterData)
    setOpenFilter(false);
  };

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 5,
    page: 0,
  });
  
  
  useEffect(() => {
    if(data){
      setFilteredData(data);
      console.log("Raw Data from API:", data)
    }
    setClientReady(true); 
  }, [data]);


  return (
    <Box className="py-3"  
      sx={{
        minHeight:"92.8vh",
        backgroundColor: "#fafafa",
       
      }}
      >
      <Typography variant="h5" sx={{ color: 'black', fontWeight: 'medium' }}>
        Violence Videos
      </Typography>
      <Box className="flex justify-end pt-1">
        <Button variant="contained" onClick={() => setOpenFilter(true)}>
          <FilterAltIcon/> Filter by
        </Button>
      </Box>

      <FilterDialogViolenceComponent
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        onFilter={handleFilter}
      />

      {clientReady && ( 
        <div className="min-h-full min-w-full my-4 ">
          
          <DataGrid
            rows={filteredData}
            columns={columns.map((column) => ({
              ...column,
              headerAlign: "center", 
              align: "center", 
            }))}
            getRowId={(row) => row._id || Math.random()}
            rowHeight={112}
            pageSizeOptions={[5, 10, 20]}  
            paginationMode="client"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sx={{
              "& .MuiDataGrid-cell": { justifyContent: "center", textAlign: "center"},
              "& .MuiDataGrid-columnHeaderTitle": { textAlign: "center" }, 
              minHeight: "74vh",
            }}
            loading={loading}
            slots={{
              noRowsOverlay: () => (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="h6" sx={{ color: 'gray' }}>
                        No videos
                    </Typography>
                </Box>
              )
            }}
          />
        </div>
      )}

    </Box>
  );
};

export default VideoStorageViolenceComponent;
