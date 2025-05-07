"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Card, Typography, Tabs, Tab, CircularProgress } from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { VIOLENCE_TYPES } from "@/constants/violenceType";
import useDataViolenceVideos from "../hook/useDataViolenceVideos";
import useDataViolenceVideosAll from "../hook/useDataViolenceVideosAll";
import { getWeeklyDataByType } from "@/utils/getWeeklyChartData";
import { getMonthlyChartData } from "@/utils/getMonthlyChartData";
import { ViolenceData } from "../types/ViolenceVideosTypes";
import { getAnnualChartData } from "@/utils/getAnnualChartData";
import { format, parseISO } from "date-fns";

export function getLatestUpdatedAt(data: ViolenceData[]): string {
    if (!data || data.length === 0) return "-";
  
    const latest = data.reduce((a, b) => {
      const aDate = new Date(`${a.date}T${a.time.replace(/-/g, ":")}`);
      const bDate = new Date(`${b.date}T${b.time.replace(/-/g, ":")}`);
      return aDate > bDate ? a : b;
    });
  
    const datetime = parseISO(`${latest.date}T${latest.time.replace(/-/g, ":")}`);
    return format(datetime, "dd/MM/yyyy, HH:mm:ss");
  }

const DashboardComponent: React.FC = () => {
    const [tab, setTab] = useState(0);
    const [filteredData, setFilteredData] = useState<ViolenceData[]>([])
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };
    const { data: violenceData, loading } = useDataViolenceVideos();
    const { data: violenceAlls, loading: loadingAll } = useDataViolenceVideosAll();

    const colorMapping : Record<number, string> = {
        1: "#1976d2",
        2: "#4fc3f7",
        3: "#b3e5fc",
        4: "#90a4ae",
    };

    const totalIncidents = violenceData.length;
    const incidentsByType = [1, 2, 3, 4].map((typeId) => {
        const count = violenceData.filter((item) => item.type === typeId).length;
        return {
        id: typeId,
        value: count,
        label: VIOLENCE_TYPES[typeId],
        color: colorMapping[typeId],
        };
    });

    // const {days, weeklyData } = getWeeklyDataByType(filteredData);
    // const monthlyData = getMonthlyChartData(filteredData);
    // const annualChartData = getAnnualChartData(filteredData);
    // const totalYearly = annualChartData.reduce((sum, type) => {
    //     return sum + type.data.reduce((acc, val) => acc + val, 0);
    //   }, 0);

    const { days, weeklyData } = useMemo(() => {
        if (!filteredData || filteredData.length === 0) {
            return { days: [], weeklyData: [] };
        }
        return getWeeklyDataByType(filteredData);
    }, [filteredData]);
    
    const monthlyData = useMemo(() => {
        if (!filteredData || filteredData.length === 0) {
            return [];
        }
        return getMonthlyChartData(filteredData);
    }, [filteredData]);
    
    const annualChartData = useMemo(() => {
        if (!filteredData || filteredData.length === 0) {
            return [];
        }
        return getAnnualChartData(filteredData);
    }, [filteredData]);
    
    const totalYearly = useMemo(() => {
        if (!annualChartData || annualChartData.length === 0) {
            return 0;
        }
        return annualChartData.reduce((sum, type) => {
            return sum + type.data.reduce((acc, val) => acc + val, 0);
        }, 0);
    }, [annualChartData]);

    const lastDate = useMemo(() => {
        if (!filteredData || filteredData.length === 0) {
            return [];
        }
        return getLatestUpdatedAt(filteredData);
    }, [filteredData]);

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    useEffect(() => {
        if(violenceAlls){
          setFilteredData(violenceAlls);

          console.log("Raw Data from API:", filteredData)
        }
    }, [violenceAlls]);
    

  return (
    <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ color: 'black', fontWeight: 'medium' }}>Daily Statistics</Typography>
        <Typography variant="body2" sx={{ color: 'gray', mb:1}}>
            <AccessTimeIcon sx={{fontSize: 20}}/> 
            {lastDate}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
            <Card   sx={{
                flex: 2,
                p: 2,
                
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
            }}>
                <Typography variant="h4" sx={{fontWeight: 'bold' }}>{totalIncidents}</Typography>
                <Typography variant="body2">Total Violent Incidents</Typography>
            </Card>
            {incidentsByType.map((item) => (
            <Card key={item.id} sx={{
                flex: 1,
                p: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
            }}>
                <Typography variant="h4" sx={{fontWeight: 'bold' }}>{item.value}</Typography>
                <Typography variant="body2">Total Violent of</Typography>
                <Typography variant="body2" sx={{color: item.color}}>{item.label}</Typography>
            </Card>
            ))}
        </Box>
        <Typography variant="h5" sx={{ color: 'black', fontWeight: 'medium' }}>Other Statistics</Typography>
        <Tabs value={tab} onChange={handleTabChange} centered  variant="fullWidth" sx={{backgroundColor: "white", mb:2, borderRadius: "4px" }}>
            <Tab label="Weekly" />
            <Tab label="Monthly" />
            <Tab label="Annually" />
        </Tabs>

        {tab === 0 &&  (
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 3 }}>
                    <LineChart
                    height={380}
                    series={weeklyData}
                    xAxis={[{ scaleType: 'point', data: days }]}
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Card sx={{ mb: 1, display: 'flex', borderRadius: "4px" }}>
                        <Box sx={{ width: "5%", backgroundColor: "black" }}></Box>
                        <Box sx={{ p: 2, width: "95%" }}>
                        <Typography variant="body2">Total Weekly Violent Incidents</Typography>
                        <Typography variant="h4" sx={{ textAlign: "right", fontWeight: 'bold' }}>
                            {weeklyData.reduce((acc, cur) => acc + cur.data.reduce((a, b) => a + b, 0), 0)}
                        </Typography>
                        </Box>
                    </Card>

                    {weeklyData.map((item, index) => (
                        <Card key={index} sx={{ mb: 1, display: 'flex', borderRadius: "4px" }}>
                        <Box sx={{ width: "5%", backgroundColor: item.color }}></Box>
                        <Box sx={{ p: 2, width: "95%" }}>
                            <Typography variant="body2">Type: {item.label}</Typography>
                            <Typography variant="h4" sx={{ textAlign: "right", fontWeight: 'bold' }}>
                            {item.data.reduce((a, b) => a + b, 0)}
                            </Typography>
                        </Box>
                        </Card>
                    ))}
                </Box>
            </Box>
        )}

        {tab === 1 && (
            <Box sx={{ display: 'flex', gap: 2, width: "100%" }}>
            <Box sx={{ flex: 3, minWidth: 0 }}>
            <PieChart
                series={[{
                    data: monthlyData,
                    arcLabel: (item) => `${Math.round(item.value / monthlyData.reduce((sum, item) => sum + item.value, 0) * 100)}%`,  
                    arcLabelMinAngle: 10, 
                    
                }]}
                width={600}
                height={350}
            />
            </Box>
            <Box sx={{ flex: 1 }}>
                <Card sx={{ mb: 1, display: 'flex', borderRadius: "4px" }}>
                    <Box sx={{ width: "5%", backgroundColor: "black" }}></Box>
                    <Box sx={{ p: 2, width: "95%" }}>
                    <Typography variant="body2">Total Monthly Violent Incidents</Typography>
                    <Typography variant="h4" sx={{ textAlign: "right", fontWeight: 'bold' }}>
                        {monthlyData.reduce((sum, item) => sum + item.value, 0)}
                    </Typography>
                    </Box>
                </Card>

                {monthlyData.map((item) => (
                    <Card key={item.id} sx={{ mb: 1, display: 'flex', borderRadius: "4px" }}>
                    <Box sx={{ width: "5%", backgroundColor: item.color }}></Box>
                    <Box sx={{ p: 2, width: "95%" }}>
                        <Typography variant="body2">Type: {item.label}</Typography>
                        <Typography variant="h4" sx={{ textAlign: "right", fontWeight: 'bold' }}>
                        {item.value}
                        </Typography>
                    </Box>
                    </Card>
                ))}
            </Box>

            </Box>
        )}

        {tab === 2 && (
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 3 }}>
                    <LineChart
                        height={380}
                        series={annualChartData}
                        xAxis={[{ scaleType: 'point', data: months }]}
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Card sx={{ mb: 1, display: 'flex', borderRadius: "4px" }}>
                        <Box sx={{ width: "5%", backgroundColor: "black" }}></Box>
                        <Box sx={{ p: 2, width: "95%" }}>
                        <Typography variant="body2">Total Violent Incidents</Typography>
                        <Typography variant="h4" sx={{ textAlign: "right", fontWeight: 'bold' }}>
                            {totalYearly}
                        </Typography>
                        </Box>
                    </Card>
                    {annualChartData.map((item, idx) => {
                        const yearlyCount = item.data.reduce((a, b) => a + b, 0);
                        return (
                        <Card key={idx} sx={{ mb: 1, display: 'flex', borderRadius: "4px" }}>
                            <Box sx={{ width: "5%", backgroundColor: item.color }}></Box>
                            <Box sx={{ p: 2, width: "95%" }}>
                            <Typography variant="body2">Type: {item.label}</Typography>
                            <Typography variant="h4" sx={{ textAlign: "right", fontWeight: 'bold' }}>
                                {yearlyCount}
                            </Typography>
                            </Box>
                        </Card>
                        );
                    })}
                </Box>
            </Box>
        )}
    </Box>
  )
};

export default DashboardComponent;
