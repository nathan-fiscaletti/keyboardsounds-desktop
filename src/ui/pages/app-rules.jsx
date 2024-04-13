import React from "react";

import { useState } from "react";

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
  CircularProgress,
  TextField,
  InputAdornment,
} from "@mui/material";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import { execute } from '../execute';

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
  const [isDeleting, setIsDeleting] = useState(false);
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

          {isDeleting && (
            <CircularProgress size={18} sx={{mr: 2, ml: 1}} />
          )}

          {!isDeleting && (
            <Tooltip title="Remove rule" placement="top" arrow>
              <IconButton
                color="primary"
                sx={{ mr: 1 }}
                onClick={() => {
                  setIsDeleting(true);
                  execute(`remove-rule --app "${rule.app_path}"`, (_) => {
                    setIsDeleting(false);
                  });
                }}
              >
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      }
    >
      <Tooltip title={rule.app_path} followCursor>
        <ListItemText
          sx={{
            cursor: "default",
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

const AppRules = ({ appRules, appRulesLoaded }) => {
  const [searchValue, setSearchValue] = useState("");

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
      <Box sx={{ pr: 2 }}>
      <TextField
        label="Search"
        size="small"
        fullWidth
        sx={{
          mt: 1,
          mb: 1,
        }}
        value={searchValue}
        onChange={
          e => setSearchValue(e.target.value)
        }
        InputProps={{
          endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>,
        }}
      />
      </Box>
      {appRulesLoaded && appRules.length > 0 && (
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
          {appRules.map((rule) => {
            if (
              searchValue === "" ||
              rule.app_path
                .match(/[^\\/]+$/)[0]
                .toLowerCase()
                .includes(searchValue.toLowerCase())
            ) {
              return (
                <AppRule rule={rule} />
              );
            }

            return null;
          })}
        </List>
      )}
      {(!appRulesLoaded || appRules.length < 1) && (
        <Box sx={{ mt: 28, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <Typography variant="button" color="GrayText">
              No rules have been added yet.
            </Typography>
            <Typography variant="body2" color="GrayText" sx={{ mt: 1 }}>
              Click the "Add Rule" button to get started.
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export { AppRules };
