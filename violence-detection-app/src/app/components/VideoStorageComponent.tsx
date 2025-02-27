import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import useViolenceData from "@/app/hook/useDataVideoStorage";
import { VIOLENCE_TYPES } from "@/constants/violenceType";
import FilterDialog from "./FilterDialogComponent"; 
interface FilterType {
  cameraNo: string;
  date: string;
  type: number[];
}

const VideoStorageComponent: React.FC = () => {
  const { data, loading, error } = useViolenceData();
  const [filteredData, setFilteredData] = useState(data);
  const [openFilter, setOpenFilter] = useState(false);
  const [filter, setFilter] = useState<FilterType>({
    cameraNo: "",
    date: "",
    type: [],
  });

  const handleFilter = (filterData: { cameraNo: string; date: string; type: string[] }) => {
    const typeToNumber = filterData.type.map((t) => parseInt(t)); 
  
    const filtered = data.filter(item => {
      const matchCamera = filterData.cameraNo ? item.videoName.includes(filterData.cameraNo) : true;
      const matchDate = filterData.date ? item.date === filterData.date : true;
      const matchType = typeToNumber.length > 0 ? typeToNumber.includes(item.type) : true;
  
      return matchCamera && matchDate && matchType;
    });
  
    setFilteredData(filtered);
    setOpenFilter(false);
  };
  
  const clearFilter = () => {
    setFilter({ cameraNo: "", date: "", type: [] });
    setFilteredData(data);
    console.log("Filter Cleared");
  };

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  return (
    <Box className="py-3">
      <Box className="flex justify-end pr-4 pt-1">
        <Button variant="outlined" onClick={() => setOpenFilter(true)}>
          Filter by
        </Button>
      </Box>

      <FilterDialog
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        onFilter={handleFilter}
        onClear={clearFilter}
      />

      <Box mt={2}>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-300 text-black">
              <th className="border p-2">Video</th>
              <th className="border p-2">Camera No.</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Time</th>
              <th className="border p-2">Violence Type</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center p-4 text-red-500">
                  Failed to fetch data.
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index} className="border-b text-black">
                  <td className="p-2 flex justify-center">
                    <div className="w-20 h-20 bg-gray-300 flex items-center justify-center "></div>
                  </td>
                  <td className="p-2 text-center">{item.videoName}</td>
                  <td className="p-2 text-center">{item.date}</td>
                  <td className="p-2 text-center">{item.time}</td>
                  <td className="p-2 font-bold text-center">{VIOLENCE_TYPES[item.type]}</td>
                  <td className="p-2 text-center">
                    <Button variant="outlined" size="small" onClick={() => window.open(item.videoLink, "_blank")}>
                      View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};

export default VideoStorageComponent;
