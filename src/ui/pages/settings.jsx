import React from "react";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { Alert, Button, TextField, Link } from "@mui/material";

const Settings = ({status, profiles, selectedProfile, volume, onProfileChanged, onVolumeChanged, initialStatusLoaded}) => {
  return (
    <Box sx={{
      ml: 2,
      mr: 2,
      mt: 2,
    }}>
      {status && initialStatusLoaded && status.status === 'running' && (
        <Alert
          severity="warning"
          variant="outlined"
          iconMapping={{
            success: <WarningIcon />,
          }}

          sx={{ mb: 1 }}
        >
          <Typography variant="body2">
            Settings can't be adjusted while the daemon is running.
          </Typography>
        </Alert>
      )}

      <Typography sx={{
        mb: 1.5,
      }} variant="h6">Profile</Typography>
      <FormControl size="small" fullWidth>
        <Select
          labelId="profile-select-label"
          value={selectedProfile}
          onChange={onProfileChanged}
          disabled={initialStatusLoaded && status.status === 'running'}
        >
          {profiles.map((profile) => (
            <MenuItem key={profile.name} value={profile.name}>
              {profile.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography sx={{
        mt: 2,
      }} variant="h6">Volume</Typography>
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        mb: 2,
      }}>
        <Slider
          size="small"
          defaultValue={70}
          aria-label="Small"
          valueLabelDisplay="off"
          value={volume}
          onChange={(event, value) => onVolumeChanged(value)}
          disabled={initialStatusLoaded && status.status === 'running'}
          sx={{
            ml: 1,
            mr: 1,
          }}
        />
        <Tooltip title="Mute" placement="top">
          <IconButton
            sx={{
              pl: 1,
              pr: 1,
            }}
          >
            <VolumeOffIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography sx={{
        mt: 2,
      }} variant="h6">Execute Command</Typography>
      <Box>
        <Alert 
          severity="success"
          variant="outlined"
          iconMapping={{
            success: <InfoIcon />,
          }}
          sx={{ mb: 1, mt: 2 }}
        >
          Execute a command using the <Link href="https://github.com/nathan-fiscaletti/keyboardsounds" target="_blank">Keyboard Sounds CLI</Link>.
        </Alert>
        <Box sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          mt: 2,
        }}>
          <FormControl size="small" sx={{ flexGrow: 1, }}>
            <TextField 
              label="Command"
              size="small"
              inputProps={{
                style: {
                  fontFamily: "monospace",
                }
              }}
              InputLabelProps={{
                style: {
                  fontFamily: "monospace",
                }
              }}
              fullWidth
            />
          </FormControl>
          <Button
            variant="contained"
            sx={{ ml: 2, }}
            startIcon={<PlayArrowIcon />}
          >
            Run
          </Button>
        </Box>
        <Box sx={{
          border: "1px solid #525252",
          borderRadius: "4px",
          p: 2,
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          height: "100px",
          overflowY: "auto",
          minHeight: status && initialStatusLoaded && status.status === 'running' ? "calc(100vh - 644px)" : "calc(100vh - 570px)",
        }}>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "monospace",
            }}
          >
            Run a command to see the output here.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export { Settings };