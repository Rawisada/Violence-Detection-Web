import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { handleSignOut } from '@/lib/auth';
import LiveFeedComponent from './LiveFeedComponent';
import VideoStorageComponent from './VideoStorageComponent';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface TabProps {
  session: any;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      
    >
      {value === index && <Box sx={{ padding: 0, margin: 0, height: "100%" }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function TabsComponent({ session }: TabProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{
        display: "flex",
        borderBottom: 1,
        borderColor: "divider",
        alignItems: "center",}}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{
            flexGrow: 1, 
          }}>
          <Tab label="Live Feed" {...a11yProps(0)} />
          <Tab label="Video Storage" {...a11yProps(1)} />
          <Tab label="Summary" {...a11yProps(2)} />
          <Tab label="System Setting" {...a11yProps(3)} />
        </Tabs>
        <p className='mr-3 text-black'>{session.user?.name}</p>
        <Tab
            {...a11yProps(4)}
            component="button"
            onClick={handleSignOut}
            label='Sign Out'
            sx={{
              color: 
              "red",
              "&:hover": {
                backgroundColor: "rgba(255, 0, 0, 0.1)",
                flexShrink: 0, 
              },
            }}
          />
      </Box>
      <CustomTabPanel value={value} index={0} >
        <LiveFeedComponent/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <VideoStorageComponent/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Tree
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>

      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>

      </CustomTabPanel>
    </Box>
    );
}
