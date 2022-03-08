import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { GoogleUser } from "services/google.types";

export default function UserSelectBox({
  users,
  changeUser,
}: {
  users: GoogleUser[];
  changeUser: any;
}) {
  return (
    <Autocomplete
      id="userSelect"
      sx={{ width: 300 }}
      autoHighlight
      autoComplete
      options={users}
      getOptionLabel={(option) => option.displayName}
      onChange={(_event, value) => changeUser(value)}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img
            loading="lazy"
            width="20"
            src={option.photoURL}
            srcSet={`${option.photoURL} 2x`}
            alt=""
          />
          {option.displayName}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a user"
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}
