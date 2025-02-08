import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

const LiveFeedComponent: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "92vh",
        backgroundColor: "#f9f9f9",
        padding: "0 !important",
        m: 0
      }}
    >
      <Box sx={{ flex: 6, borderRight: "1px solid #ccc", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", padding: "0 !important"}}>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#e0e0e0",
          }}
        >
          <Typography variant="subtitle1">CAM 01</Typography>
        </Box>
        <Box sx={{ textAlign: "center", p: 1, backgroundColor: "#fff", position: "absolute", m:2, display: "flex", right:0}}>
          <Typography variant="body2">DD/MM/YYYY HH:MM:SS</Typography>
        </Box>
        <Box sx={{ textAlign: "center", p: 1, backgroundColor: "#fff", position: "absolute", m:2, display: "flex", left:0}}>
          <Typography variant="body2">CAM 01</Typography>
        </Box>
        <Box sx={{ textAlign: "center", p: 2, backgroundColor: "#fff" }}>
          <Typography variant="body2">CAM 01</Typography>
        </Box>
      </Box>

      {/* Right Section: Detected Violence */}
      <Box sx={{ flex: 3, display: "flex", flexDirection: "column", p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Violence Detected
        </Typography>
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} sx={{ mb: 1 }}>
              <CardContent sx={{ display: "flex", alignItems: "center",  padding: "10px !important"}}>
                <Box
                  sx={{
                    width: 90,
                    height: 90,
                    backgroundColor: "#e0e0e0",
                    mr: 2,
                    borderRadius: "4px"
                  }}
                ></Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">
                    Violence: <strong>{index % 2 === 0 ? "Child Adult" : "Adult Adult"}</strong>
                  </Typography>
                  <Typography variant="body2">Date: DD/MM/YYYY</Typography>
                  <Typography variant="body2">Time: hh:mm:ss</Typography>
                </Box>
                {/* <Button variant="text"></Button> */}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default LiveFeedComponent;
