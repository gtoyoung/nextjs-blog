import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { PoketInfo } from "services/poke.types";

export const PokeSearchBox = ({
  pokemons,
  changePokemon,
  nameList,
}: {
  pokemons: PoketInfo[];
  changePokemon: any;
  nameList: any[];
}) => {
  // 한글이름으로 변환
  const convertKorName = (name: string) => {
    var result = nameList.find((element) => {
      if (element.en.toUpperCase() === name.toUpperCase()) return true;
    });

    return result?.ko || name;
  };
  return (
    <Autocomplete
      id="userSelect"
      sx={{ width: 300 }}
      autoHighlight
      autoComplete
      options={pokemons}
      getOptionLabel={(option) => convertKorName(option.name)}
      onChange={(_event, value) => changePokemon(value)}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img
            loading="lazy"
            width="20"
            src={option.img.front}
            srcSet={`${option.img.front} 2x`}
            alt=""
          />
          {convertKorName(option.name)}
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
};
