import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export default function TableEdit(props) {

  return (
    <Grid container >
      <Grid item xs={12}>
        <Typography>Edited table:</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>{props.tableId}</Typography>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>
        <Button onClick={props.endEditing} startIcon={<ArrowBackIosNewIcon />} style={{ width: '100%' }} variant="contained" color="primary">Back to tables list</Button>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
   </Grid >
  );
}