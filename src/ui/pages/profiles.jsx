import React, { useState } from "react";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import InputAdornment from '@mui/material/InputAdornment';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import IosShareIcon from '@mui/icons-material/IosShare';

function ProfileListItem({ profile: { name, author, description } }) {  
  return (
    <ListItem
      disableGutters
      secondaryAction={
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Tooltip title="Export & Share" placement="top" arrow>
            <IconButton color="primary" sx={{ mr: 1 }}>
              <IosShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Profile" placement="top" arrow>
            <IconButton color="primary" sx={{ mr: 1 }}>
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      }
    >
      <ListItemText
        primary={name}
        secondary={description}
        secondaryTypographyProps={{
          style: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 'calc(100vw - 165px)',
          }
        }}
      />
    </ListItem>
  );
}

const Profiles = ({profiles}) => {
  const [profileSearchValue, setProfileSearchValue] = useState('');

  return (
    <Box sx={{
      ml: 2,
      pt: 2,
    }}>
      <Typography variant="h6">Profiles</Typography>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        mr: 2,
        mt: 1,
      }}>
        <TextField
          label="Search"
          size="small"
          value={profileSearchValue}
          onChange={
            e => setProfileSearchValue(e.target.value)
          }
          InputProps={{
            endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>,
          }} />
        <Button
          variant="outlined"
          sx={{
            mt: 1,
            mb: 1,
          }}
          startIcon={<AddIcon />}
        >Import</Button>
      </Box>
      <List sx={{
        overflow: 'auto',
        maxHeight: 'calc(100vh - 278px)',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.07)',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
      }}>
        {profiles.filter(p => profileSearchValue === "" || p.name.toLowerCase().includes(profileSearchValue.toLowerCase())).map((profile) => (
          <ProfileListItem key={profile.name} profile={profile} />
        ))}
      </List>
    </Box>
  );
};

export { Profiles };