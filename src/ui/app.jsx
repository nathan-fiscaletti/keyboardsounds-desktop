import "./index.css";

import React from "react";

import { useState, useEffect } from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import green from "@mui/material/colors/green";

import { Settings } from "./pages";
import { Profiles } from "./pages";
import { Test } from "./pages";

import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import CircularProgress from '@mui/material/CircularProgress';
import GavelIcon from '@mui/icons-material/Gavel';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SettingsIcon from '@mui/icons-material/Settings';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import GitHubIcon from '@mui/icons-material/GitHub';
import { IconButton, Typography, Link } from "@mui/material";

const StatusColors = {
  enabled: green[500],
  disabled: "#f55d42",
  loading: "#e3e3e3",
}

// Create the initial theme for the application.
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: green,
  },
});

function ControlButton({initialStatusLoaded, status, isLoading, selectedProfile, volume, handleCommand}) {
  return (
    <Box>
      {!initialStatusLoaded && <CircularProgress sx={{ color: '#fff' }} size={18} />}

      {initialStatusLoaded && status.status !== "running" && (
        <Button 
          variant="contained"
          startIcon={isLoading ? <CircularProgress sx={{ color: '#000000de' }} size={18} /> : <PlayArrowIcon />}
          onClick={handleCommand(`start -p ${selectedProfile} -v ${volume}`)}
        >
          Enable
        </Button>
      )}

      {initialStatusLoaded && status.status === "running" && (
        <Button 
          variant="contained"
          color="error"
          startIcon={isLoading ? <CircularProgress sx={{ color: '#fff' }} size={18} /> : <StopIcon />}
          onClick={handleCommand("stop")}
        >
          Disable
        </Button>
      )}
    </Box>
  );
}

const execute = (cmd, handler) => {
  const channelId = Math.random().toString(36).substring(7);
  let removeExecuteListener = null;
  removeExecuteListener = window.kbs.receive(`kbs_execute_result_${channelId}`, (result) => {
    if (removeExecuteListener !== null) {
      removeExecuteListener();
    }
    handler(result);
  });
  window.kbs.execute(cmd, channelId);
};

function App() {
  // Listen for status updates from the main process.
  const [volume, setVolume] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [initialStatusLoaded, setInitialStatusLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const removeStatusListener = window.kbs.receive(
      "kbs-status",
      (newStatus) => {
        setStatus(newStatus);
      }
    );

    // Cleanup on component unmount
    return () => {
      removeStatusListener();
    };
  }, []);

  useEffect(() => {
    if (!initialStatusLoaded && status !== null) {
      setInitialStatusLoaded(true);
    }

    if (status !== null) {
      if (status.status === 'running') {
        setVolume(status.volume);
        setSelectedProfile(status.profile);
      }
    }
  }, [status]);

  useEffect(() => {
    execute("profiles", (profiles) => {
      setProfiles(profiles);
    });
  }, []);

  const handleCommand = (cmd) => {
    return () => {
      // Set loading state
      setIsLoading(true);

      execute(cmd, (result) => {
        execute("status", (status) => {
          setStatus(status);
          setIsLoading(false);
        });
      });
    };
  };

  const handleProfileChanged = (event) => {
    setSelectedProfile(event.target.value);
  };

  const [selectedTab, setSelectedTab] = useState(4);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />

      <Card
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          ml: 2,
          mr: 2,
          mt: 2,
          pl: 2,
          pr: 2,
          pt: 2, 
          pb: 2,
        }}
      >
        <Box sx={{
          display: "flex",
          flexDirection: "column",
        }}>
          <Typography variant="h6">Keyboard Sounds</Typography>
          <Typography variant="caption">By <Link href="https://github.com/nathan-fiscaletti" target="_blank">Nathan Fiscaletti</Link></Typography>
        </Box>

        <Box sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}>
          <Tooltip placement="bottom-start" title="View on GitHub" arrow>
            <IconButton sx={{
              mr: 1.5,
            }} onClick={() => execute("openInBrowser", (_) => {})}>
              <GitHubIcon />
            </IconButton>
          </Tooltip>

          <ControlButton 
            initialStatusLoaded={initialStatusLoaded}
            status={status}
            isLoading={isLoading}
            selectedProfile={selectedProfile}
            volume={volume}
            handleCommand={handleCommand} />
        </Box>
      </Card>
      
      <Card sx={{
        mr: 2,
        ml: 2,
        mb: 1,
        mt: 1,
        height: "100%",
        minHeight: "calc(100vh - 124px)",
        maxHeight: "calc(100vh - 124px)"
      }}>
        <Tabs 
          value={selectedTab}
          onChange={(_, v) => setSelectedTab(v)}
          variant="fullWidth"
        >
          <Tooltip title="Status" arrow><Tab icon={<MonitorHeartIcon />} /></Tooltip>
          <Tooltip title="Profiles" arrow><Tab icon={<LibraryMusicIcon />} /></Tooltip>
          <Tooltip title="Application Rules" arrow><Tab icon={<GavelIcon />} /></Tooltip>
          <Tooltip title="Test" arrow><Tab icon={<VolumeUpIcon />} /></Tooltip>
          <Tooltip title="Settings" arrow><Tab icon={<SettingsIcon />} /></Tooltip>
        </Tabs>

        {selectedTab === 1 && (
          <Profiles profiles={profiles} />
        )}

        {selectedTab === 3 && (
          <Test status={status} initialStatusLoaded={initialStatusLoaded} />
        )}

        {selectedTab === 4 && (
          <Settings 
            status={status}
            profiles={profiles}
            selectedProfile={selectedProfile} 
            volume={volume}
            onProfileChanged={handleProfileChanged}
            onVolumeChanged={setVolume}
            initialStatusLoaded={initialStatusLoaded} />
        )}

      </Card>
    </ThemeProvider>
  );
}

export default App;
