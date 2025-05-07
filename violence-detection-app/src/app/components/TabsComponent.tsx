'use client';

import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { handleSignOut } from '@/lib/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Image from 'next/image';

interface TabProps {
  session: any;
}

export default function TabsComponent({ session }: TabProps) {
  const pathname = usePathname();
  console.log('Current Pathname:', pathname);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);


  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);

      if (pathname !== '/videoStorageWeekly' && pathname !== '/videoStorageViolence') {
        setValue(getValueFromPathname(pathname));
      }
  };

  const getValueFromPathname = (path: string) => {
    if (path === '/liveFeed') return 'one';
    if (path ==='/videoStorageWeekly'  || path === '/videoStorageViolence' || path === '/videoDetailWeekly') return 'two';
    if (path === '/summary') return 'three';
    if (path === '/systemSetting'|| path === '/administration') return 'four';
    return 'one';
  };

  const [value, setValue] = React.useState<string>(getValueFromPathname(pathname));

  React.useEffect(() => {
    setValue(getValueFromPathname(pathname));
    if (pathname === '/videoStorage/weekly') {
      setSelectedMenu('weekly');
    } else if (pathname === '/videoStorageViolence') {
      setSelectedMenu('violence');
    } else {
      setSelectedMenu(null);
    }
  }, [pathname]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{
        display: "flex",
        borderBottom: 1,
        borderColor: "divider",
        alignItems: "center",
        paddingLeft: 2,
        paddingRight: 5,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        zIndex: 10,
        position: "sticky" 
        }}
      >
        <div className="p-1 flex items-center justify-center max-w-10 max-h-10 mr-5">
          <Image
            src="/logo2.png"
            alt="Camera Icon"
            width={100}
            height={100}
          />
        </div>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{
            flexGrow: 1, 
          }}>
          <Tab value="one" component={Link} href="/liveFeed" label="Live Feed"  />
          <Tab
            value="two"
            label={
              <Box display="flex" alignItems="center" gap={0.5}>
                  Video Storage <ExpandMoreIcon />
              </Box>
            }
            onClick={handleClick} 
            aria-controls={open ? 'video-storage-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}

          />
          <Tab value="three" label="Summary" component={Link} href="/summary"/>
          <Tab value="four" label="System Setting" component={Link} href="/systemSetting" />
        </Tabs>

        <Menu
          id="video-storage-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
                width: '170px',  
            }
        }}
        >
          <MenuItem onClick={handleClose} component={Link} href="/videoStorageWeekly" selected={selectedMenu === 'weekly'}>
              Weekly Videos
          </MenuItem>
          <MenuItem onClick={handleClose} component={Link} href="/videoStorageViolence" selected={selectedMenu === 'violence'}>
              Violence Videos
          </MenuItem>
        </Menu>

        <div className=' border-r-1 border-gray-500'>
          <p className='mr-3 text-black border-r-1 border-gray-500'>{session.user?.name}</p>
        </div>
     
        <Tab 
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
    </Box>
    );
}
