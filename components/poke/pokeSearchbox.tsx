import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export const PokeSearchBox = ({
  changePokemon,
  nameList,
}: {
  changePokemon: any;
  nameList: any[];
}) => {
  return (
    <Autocomplete
      id="pokemonSelect"
      sx={{ width: 300, border: "0px" }}
      autoHighlight
      autoComplete
      options={nameList}
      getOptionLabel={(option) => option.ko}
      onChange={(_event, value) => changePokemon(value?.en)}
      //   renderOption={async (props, option) => {
      //     return await pokeApi.getPoketInfo(option.en).then((res) => {
      //       return (
      //         <Box
      //           component="li"
      //           sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
      //           {...props}
      //         >
      //           <img
      //             loading="lazy"
      //             width="20"
      //             src={res.img.front}
      //             srcSet={`${res.img.front} 2x`}
      //             alt=""
      //           />
      //           {option.ko}
      //         </Box>
      //       );
      //     });
      //   }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a pokemon"
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
};
