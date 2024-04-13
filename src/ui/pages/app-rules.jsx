import React from "react";

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";

const RuleActionLabel = ({ action }) => {
  return (
    <Typography variant="button" fontSize={11}>
      {action === "disable"
        ? "Disabled"
        : action === "exclusive"
        ? "Exclusive"
        : "Enabled"}
    </Typography>
  );
};

const AppRule = ({ rule }) => {
  return (
    <ListItem
      key={rule.app_path}
      sx={{
        borderRadius: 2,
        mb: 1,
        bgcolor: "background.default",
        pl: 2,
      }}
      disableGutters
      secondaryAction={
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Chip
            variant="outlined"
            sx={{
              mr: 1,
              borderRadius: 1,
              width: 80,
              cursor: "default",
              "& .MuiChip-label": {
                textTransform: "capitalize",
              },
            }}
            size="small"
            label={<RuleActionLabel action={rule.action} />}
            color={
              rule.action === "disable"
                ? "error"
                : rule.action === "exclusive"
                ? "warning"
                : "success"
            }
          />

          <Tooltip title="Remove rule" placement="top" arrow>
            <IconButton color="primary" sx={{ mr: 1 }} onClick={
                () => window.kbs.execute(`remove-rule --app "${rule.app_path}"`)
            }>
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      }
    >
        <Tooltip title={rule.app_path} followCursor>
        <ListItemText
            sx={{
                cursor: "default"
            }}
            primary={rule.app_path.match(/[^\\/]+$/)[0]}
            primaryTypographyProps={{
            variant: "body2",
            }}
            secondary={rule.app_path}
            secondaryTypographyProps={{
            noWrap: true,
            variant: "caption",
            style: {
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "calc(100vw - 232px)",
            },
            }}
        />
      </Tooltip>
    </ListItem>
  );
};

const AppRules = ({ appRules }) => {
  // Sort the app rules so that "exclusive" rules come first
  appRules.sort((a, b) => {
    if (a.action === "exclusive" && b.action !== "exclusive") {
      return -1;
    } else if (a.action !== "exclusive" && b.action === "exclusive") {
      return 1;
    } else {
      return 0;
    }
  });

  return (
    <Box
      sx={{
        ml: 2,
        mt: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          mr: 3,
          mb: 2,
        }}
      >
        <Typography variant="h6">Application Rules</Typography>
        <Button variant="outlined" size="small" startIcon={<AddIcon />}>
          Add Rule
        </Button>
      </Box>
      <Typography variant="body2" color="GrayText" sx={{ mb: 1, mt: 1 }}>
        These rules allow you to control the behavior of the sound daemon based
        on the currently running applications.
      </Typography>
      <List
        sx={{
          overflow: "auto",
          maxHeight: "calc(100vh - 275px)",
          pr: 2,
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(255, 255, 255, 0.07)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          },
        }}
      >
        {appRules.map((rule) => (
            <AppRule rule={rule} /> 
        ))}
      </List>
    </Box>
  );
};

export { AppRules };
