import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef} from '@mui/x-data-grid';
import { Button, Box, Typography, CircularProgress } from "@mui/material";
import useDataViolenceVideos from "@/app/hook/useDataViolenceVideos";
import { VIOLENCE_TYPES } from "@/constants/violenceType";
import FilterDialogViolenceComponent from "./FilterDialogViolenceComponent"; 
import { formatDate, formatFileSize, formatTime } from "@/lib/formate";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { ViolenceData, FilterViolenceVideos } from "../types/ViolenceVideosTypes";
import { getCurrentDate } from "@/constants/todayDate";
import { useRouter } from "next/navigation";


const columns: GridColDef<ViolenceData>[] = [
  {
    field: "video",
    headerName: "Video",
    width: 200,
    disableColumnMenu: true,
    renderCell: (params) => {
      const videoSrc = params.row.videoPath;
      return (
        <div className="flex items-center justify-center w-full">
          <video
            src={videoSrc}
            className="w-[140px] h-[80px] object-cover rounded-[8px] my-[16px]"
            muted
            playsInline
            preload="metadata"
            onLoadedMetadata={(e) => {
              const video = e.currentTarget;
              video.currentTime = 0.1; 
            }}
          />
        </div>
      );
    }
  },
  {
    field: "camera",
    headerName: "Camera No.",
    width: 150,
    disableColumnMenu: true,
    valueGetter: (value, row) => `CAM ${row?.camera}`
  },
  {
    field: "date",
    headerName: "Date",
    width: 150,
    disableColumnMenu: true,
    valueGetter: (value, row) => formatDate(row?.date), 
  },
  { 
    field: "time", 
    headerName: "Time", 
    width: 120,
    disableColumnMenu: true,
    valueGetter: (value, row) => formatTime(row?.time),
  },
  {
    field: "type",
    headerName: "Type",
    width: 120,
    disableColumnMenu: true,
    valueGetter: (value, row) =>
      VIOLENCE_TYPES[row?.type],
  },
  { 
    field: "fileSize", 
    headerName: "File Size", 
    width: 120, 
    disableColumnMenu: true,
    valueGetter: (value, row) => formatFileSize(row?.fileSize), },
  {
    field: "action",
    headerName: "",
    width: 120,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      const router = useRouter();
      return (
      <Button
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p:0,
          m:0,
          borderRadius: 0, 
          '&:hover': {
            backgroundColor: 'transparent',
          },
        }}
        onClick={() => router.push(`/videoDetailViolence/${params.row.videoName}`)}
      >
        <ArrowForwardIosIcon/>
      </Button>
    )},
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
    <Box 
      sx={{
        p: 3,
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
