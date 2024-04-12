import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert'

const Test = ({status, initialStatusLoaded}) => {
  return (
    <Box sx={{
      m: 2
    }}>
      <Typography variant="h6">Test</Typography>
      <Alert
        severity="info"
        variant="outlined"
        sx={{
          mb: 2,
          mt: 1,
        }}
      >
        Test the selected profile by typing in this box while Keyboard Sounds is running.
      </Alert>
      <TextField
        label="Typing Test"
        multiline
        fullWidth
        disabled={!initialStatusLoaded || status.status !== 'running'}
        rows={4}
      />
    </Box>
  );
};

export { Test };