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
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import BugReportIcon from '@mui/icons-material/BugReport';
import StorageIcon from '@mui/icons-material/Storage';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Alert, Button, TextField, Link } from "@mui/material";

const AboutItem = ({ icon, title, value, first }) => {
  return (
      <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            mt: first ? 0 : 1,
          }}
        >
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            {icon}
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                ml: 1,
              }}
            >
              {title}
            </Typography>
          </Box>
          <Typography variant="button" color="GrayText">
            {value}
          </Typography>
        </Box>
  );
};

const Settings = ({statusLoaded, status}) => {
  return (
    <Box
      sx={{
        ml: 2,
        mr: 2,
        mt: 2,
      }}
    >
      <Typography variant="h6">Sound Test</Typography>
      <Box sx={{
        mt: 2,
        borderRadius: 1,
        p: 2,
        bgcolor: "background.default",
        // minHeight: "calc(100vh - 800px)",
      }}>
        <Alert
            severity="success"
            variant="outlined"
            icon={<BugReportIcon />}
            sx={{
              mb: 2,
            }}
        >
            Test the selected profile by typing below.
        </Alert>
        <TextField
            multiline
            placeholder="Type here..."
            fullWidth
            rows={5.6}
        />
      </Box>

      <Typography variant="h6" sx={{ mt: 2 }}>About</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRadius: 1,
          mt: 2,
          p: 2,
          bgcolor: "background.default",
        }}
      >
        <AboutItem icon={<CheckCircleOutlineIcon fontSize="small" color="disabled" />} title="App Version" value="1.0.0" first />
        <AboutItem icon={<StorageIcon fontSize="small" color="disabled" />} title="Backend Version" value="5.7.0" />
        <AboutItem icon={<PersonOutlineIcon fontSize="small" color="disabled" />} title="Created By" value="Nathan Fiscaletti" />

        <Link href="https://github.com/nathan-fiscaletti/keyboardsounds/issues" target="_blank">
          <Button
            fullWidth
            variant="outlined"
            startIcon={<BugReportIcon />}
            sx={{
              mt: 2,
            }}
          >
            Report a Bug
          </Button>
        </Link>

        <Link href="https://github.com/nathan-fiscaletti/keyboardsounds/issues" target="_blank">
          <Button
            fullWidth
            variant="outlined"
            startIcon={<CloudDownloadIcon />}
            sx={{
              mt: 2,
            }}
          >
            Check for Update
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export { Settings };
