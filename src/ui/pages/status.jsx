import React from "react";

import { Box, Typography, Alert, TextField } from "@mui/material";

const Status = ({ status, statusLoaded }) => {
  return (
    <Box
      sx={{
        ml: 2,
        mr: 2,
        mt: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 2,
          p: 2,
          bgcolor: "background.default",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
          }}
        >
          Status
        </Typography>
        <Typography
          variant="button"
          color={
            !statusLoaded
              ? "HighlightText"
              : status.status === "running"
              ? "green"
              : "red"
          }
        >
          {statusLoaded ? status.user_status : "Loading..."}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          mt: 2,
          p: 2,
          bgcolor: "background.default",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
            }}
          >
            Volume
          </Typography>
          <Typography variant="button" color="GrayText">
            {statusLoaded && status.volume !== null ? `${status.volume}%` : "N/A"}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
            }}
          >
            Selected Profile
          </Typography>
          <Typography variant="button" color="GrayText">
            {statusLoaded && status.profile ? status.profile : "N/A"}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
            }}
          >
            Daemon Status
          </Typography>
          <Typography variant="button" color="GrayText">
            {statusLoaded && status.status ? status.status : "N/A"}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
            }}
          >
            Daemon PID
          </Typography>
          <Typography variant="button" color="GrayText">
            {statusLoaded && status.pid ? status.pid : "N/A"}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
            }}
          >
            Daemon Lock
          </Typography>
          <Typography variant="button" color="GrayText">
            {statusLoaded
              ? status.lock.active
                ? "Active"
                : "Inactive"
              : "N/A"}
          </Typography>
        </Box>
      </Box>

      <Box sx={{
        mt: 2,
        borderRadius: 2,
        p: 2,
        bgcolor: "background.default",
        minHeight: "calc(100vh - 478px)",
      }}>
        <Typography variant="h6">Sound Test</Typography>
        <Alert
            severity="info"
            variant="outlined"
            sx={{
            mb: 2,
            mt: 1,
            }}
        >
            Test the selected profile by typing in this box. Keyboard Sounds must be running to test.
        </Alert>
        <TextField
            multiline
            placeholder="Type here..."
            fullWidth
            disabled={!statusLoaded || status.status !== 'running'}
            rows={5.6}
        />
      </Box>
    </Box>
  );
};

export { Status };
