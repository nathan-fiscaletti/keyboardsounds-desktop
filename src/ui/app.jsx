import "./index.css";

import React from "react";

import { useState, useEffect } from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import green from "@mui/material/colors/green";

import { Settings } from "./pages";
import { Profiles } from "./pages";
import { Status } from "./pages";
import { AppRules } from "./pages";

import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import CircularProgress from "@mui/material/CircularProgress";
import GavelIcon from "@mui/icons-material/Gavel";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import SettingsIcon from "@mui/icons-material/Settings";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import GitHubIcon from "@mui/icons-material/GitHub";
import { IconButton, Typography, Link } from "@mui/material";

import { execute } from './execute';

const StatusColors = {
  enabled: green[500],
  disabled: "#f55d42",
  loading: "#e3e3e3",
};

// Create the initial theme for the application.
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: green,
  },
});

function ControlButton({
  statusLoaded,
  status,
  isLoading,
  selectedProfile,
  volume,
  handleCommand,
}) {
  return (
    <Box>
      {!statusLoaded && (
        <CircularProgress sx={{ color: "#fff" }} size={18} />
      )}

      {statusLoaded && status.status !== "running" && (
        <Button
          variant="contained"
          startIcon={
            isLoading ? (
              <CircularProgress sx={{ color: "#000000de" }} size={18} />
            ) : (
              <PlayArrowIcon />
            )
          }
          onClick={handleCommand(`start -p ${selectedProfile} -v ${volume}`)}
        >
          Enable
        </Button>
      )}

      {statusLoaded && status.status === "running" && (
        <Button
          variant="contained"
          color="error"
          startIcon={
            isLoading ? (
              <CircularProgress sx={{ color: "#fff" }} size={18} />
            ) : (
              <StopIcon />
            )
          }
          onClick={handleCommand("stop")}
        >
          Disable
        </Button>
      )}
    </Box>
  );
}

function App() {
  // Listen for status updates from the main process.
  const [volume, setVolume] = useState(0);
  const [displayVolume, setDisplayVolume] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState('');
  
  const [status, setStatus] = useState(null);
  const [statusLoaded, setStatusLoaded] = useState(false);

  const [appRules, setAppRules] = useState([]);
  const [appRulesLoaded, setAppRulesLoaded] = useState(false);

  const [profiles, setProfiles] = useState([]);
  const [profilesLoaded, setProfilesLoaded] = useState(false);

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
    if (!statusLoaded && status !== null) {
      setStatusLoaded(true);
      if (status.volume !== null) {
        setDisplayVolume(status.volume);
        setVolume(status.volume);
      }
    }

    if (status !== null) {
      if (status.status === 'running') {
        // setDisplayVolume(status.volume);
        // setSelectedProfile(status.profile);
      }
    }
  }, [status]);

  useEffect(() => {
    const removeAppRulesListener = window.kbs.receive(
      "kbs-app-rules",
      (newAppRules) => {
        setAppRules(newAppRules);
      }
    );

    return () => {
      removeAppRulesListener();
    }
  }, []);

  useEffect(() => {
    if(!appRulesLoaded && appRules.length > 0) {
      setAppRulesLoaded(true);
    }

    if (appRules.length > 0) {
      console.log(appRules);
    }
  }, [appRules]);

  useEffect(() => {
    const removeProfilesListener = window.kbs.receive(
      "kbs-profiles",
      (newProfiles) => {
        setProfiles(newProfiles);
      }
    );

    return () => {
      removeProfilesListener();
    }
  }, []);

  useEffect(() => {
    if (!profilesLoaded && profiles.length > 0) {
      setProfilesLoaded(true);
      if (selectedProfile === '') {
        setSelectedProfile(profiles[0].name);
      }
    }

    if (profiles.length > 0) {
      console.log(profiles);
    }
  }, [profiles]);

  useEffect(() => {
    const run = async () => {
      if (statusLoaded && status.status === "running") {
        console.log(`setVolume ${volume}`);
        await execute(`setVolume ${volume}`);
      }
    };
    run();
  }, [volume]);

  const handleCommand = (cmd) => {
    return () => {
      // Set loading state
      setIsLoading(true);

      execute(cmd).then((_) => {
        execute("status").then((status) => {
          setStatus(status);
          setIsLoading(false);
        });
      });
    };
  };

  const handleProfileChanged = (event) => {
    setSelectedProfile(event.target.value);
    if (statusLoaded && status.status === "running") {
      execute(`setProfile ${event.target.value}`).then((_) => {});
    }
  };

  const [selectedTab, setSelectedTab] = useState(2);

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
            }} onClick={() => execute("openInBrowser")}>
              <GitHubIcon />
            </IconButton>
          </Tooltip>

          <ControlButton 
            statusLoaded={statusLoaded}
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
          <Tooltip title="Settings" arrow><Tab icon={<SettingsIcon />} /></Tooltip>
        </Tabs>

        {selectedTab === 0 && (
          <Status status={status} statusLoaded={statusLoaded} />
        )}

        {selectedTab === 1 && (
          <Profiles statusLoaded={statusLoaded} status={status} profilesLoaded={profilesLoaded} profiles={profiles} />
        )}

        {selectedTab === 2 && (
          <AppRules appRules={appRules} appRulesLoaded={appRulesLoaded} />
        )}

        {selectedTab === 3 && (
          <Settings 
            statusLoaded={statusLoaded}
            status={status}
            profilesLoaded={profilesLoaded}
            profiles={profiles}
            selectedProfile={selectedProfile} 
            displayVolume={displayVolume}
            onProfileChanged={handleProfileChanged}
            onVolumeChanged={setVolume}
            onDisplayVolumeChanged={setDisplayVolume}
          />
        )}

      </Card>
    </ThemeProvider>
  );
}

export default App;
