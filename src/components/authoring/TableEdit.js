import * as React from 'react';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import useTheme from '@mui/private-theming/useTheme';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateTableHeader } from '../../store/slices/content';


export default function TableEdit(props) {

  const [editedTableId, setEditedTableId] = useState(props.tableId);
  const tables = useSelector((st) => st.content.tables);
  const table = tables.find((table) => table.id === props.tableId);
  const [editedTableDescription, setEditedTableDescription] = useState(table.description);

  const theme = useTheme();
  const [alert, setAlert] = useState(null);

  const dispatch = useDispatch();

  const updateHeader = () => {

    if (tables.find((table) => table.id === editedTableId) && editedTableId !== props.tableId) {
      setAlert('Table ID already exists');
      return;
    }

    if (editedTableId === '') {
      setAlert('Table ID cannot be blank');
      return;
    }

    if (editedTableId === props.tableId && editedTableDescription === props.tableDescription) {
      setAlert('No changes to save');
      return;
    }

    dispatch(updateTableHeader({
      originalTableId: props.tableId,
      tableId: editedTableId,
      tableDescription: editedTableDescription,
    }));

    props.endEditing();
  }

  return (
    <Grid container >
      <Grid item xs={12} bgcolor={theme.palette.info.main} color={theme.palette.info.contrastText} style={{ display: 'flex', justifyContent: 'center' }}>
        <Typography>Edited table: {props.tableId}</Typography>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>
        <TextField id="table-id"
          label="Table ID"
          variant="outlined"
          sx={{ width: "100%" }}
          defaultValue={props.tableId}
          value={editedTableId}
          onChange={(event) => setEditedTableId(event.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField id="table-description"
          label="Table Description"
          variant="outlined"
          sx={{ width: "100%" }}
          defaultValue={props.tableDescription}
          value={editedTableDescription}
          onChange={(event) => setEditedTableDescription(event.target.value)} />
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      {alert ?
        <>
          <Grid item xs={12}>
            <Alert severity='error' onClose={() => setAlert(null)}>
              {alert}
            </Alert>
          </Grid>
          <Grid item xs={12}>&nbsp;</Grid>
        </>
        :
        null}
      <Grid item xs={12}>
        <Button onClick={updateHeader} startIcon={<SaveAltIcon />} style={{ width: '100%' }} variant="contained" color="primary">Update header info</Button>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
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