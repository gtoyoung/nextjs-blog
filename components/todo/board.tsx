import React from "react";
import { Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
}));

export const Board = ({ title, content, clickPost }) => {
  const classes = useStyles();

  return (
    <>
      <Paper elevation={3} className={classes.paper} onClick={clickPost}>
        <Typography variant="h6" color="primary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1">{content}</Typography>
      </Paper>
      <br />
    </>
  );
};
