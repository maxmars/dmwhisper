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
import { updateTableHeader, updateTableRng } from '../../store/slices/content';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';


export default function TableEdit(props) {

  const [rngToDelete, setRNGToDelete] = useState(null);
  const [editedTableId, setEditedTableId] = useState(props.tableId);
  const tables = useSelector((st) => st.content.tables);
  const table = tables.find((table) => table.id === props.tableId);
  const [editedTableDescription, setEditedTableDescription] = useState(table.description);
  const theme = useTheme();
  const [alert, setAlert] = useState(null);
  const [rngAlert, setRngAlert] = useState(null);
  const rows = table.rng.map((rng) => {
    return {
      id: rng.min + '-' + rng.max,
      description: rng.result,
    }
  });


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

  const columns = [
    {
      field: 'id',
      headerName: 'RNG',
      width: window.innerWidth * 0.25,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: window.innerWidth * 0.6,
    },
    {
      field: 'actions',
      type: 'actions',
      width: window.innerWidth * 0.15,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => setRNGToDelete(params.id)} />
      ]
    },
  ];

  const addRng = () => {
    if (document.getElementById('new-min').value === '') {
      setRngAlert('Min value cannot be blank');
      return;
    }

    if (document.getElementById('new-max').value === '') {
      setRngAlert('Max value cannot be blank');
      return;
    }

    if (document.getElementById('new-result').value === '') {
      setRngAlert('Result cannot be blank');
      return;
    }

    if (parseInt(document.getElementById('new-min').value) > parseInt(document.getElementById('new-max').value)) {
      setRngAlert('Min value cannot be greater than max value');
      return;
    }

    if (table.rng.find((rng) => rng.min === parseInt(document.getElementById('new-min').value) && rng.max === parseInt(document.getElementById('new-max').value))) {
      setRngAlert('RNG value already exists');
      return;
    }

    const newRng = {
      min: parseInt(document.getElementById('new-min').value),
      max: parseInt(document.getElementById('new-max').value),
      result: document.getElementById('new-result').value,
    }

    const newRngs = [...table.rng, newRng];

    dispatch(updateTableRng({
      tableId: props.tableId,
      rng: newRngs,
    }));
  }

  const deleteRng = (rngToDelete) => {
    const newRng = table.rng.filter((rng) => rng.min + '-' + rng.max !== rngToDelete);
    dispatch(updateTableRng({
      tableId: props.tableId,
      rng: newRng,
    }));

    setRNGToDelete(null);
  }

  if (rngToDelete === null) {

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
        <Grid item xs={12} bgcolor={theme.palette.info.main} color={theme.palette.info.contrastText} style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography>List of RNG values</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <Typography>Click on the bin to delete values.</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12} sx={{ height: "400px" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            hideFooterPagination={true}
            paginationModel={{ page: 1, pageSize: 1000 }}
          />
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12} bgcolor={theme.palette.info.main} color={theme.palette.info.contrastText} style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography>Add a new RNG:</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <TextField id="new-min" label="Min value" type='number' variant="outlined" sx={{ width: "100%" }} />
        </Grid>
        <Grid item xs={12}>
          <TextField id="new-max" label="Max value" type='number' variant="outlined" sx={{ width: "100%" }} />
        </Grid>
        <Grid item xs={12}>
          <TextField id="new-result" label="Result" variant="outlined" sx={{ width: "100%" }} />
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        {rngAlert ?
          <>
            <Grid item xs={12}>
              <Alert severity='error' onClose={() => setRngAlert(null)}>
                {rngAlert}
              </Alert>
            </Grid>
            <Grid item xs={12}>&nbsp;</Grid>
          </>
          :
          null}
        <Grid item xs={12}>
          <Button onClick={addRng} startIcon={<AddIcon />} style={{ width: '100%' }} variant="contained" color="primary">Add new RNG</Button>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <Button onClick={props.endEditing} startIcon={<ArrowBackIosNewIcon />} style={{ width: '100%' }} variant="contained" color="primary">Back to tables list</Button>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
      </Grid >
    );
  } else {
    // get result from rngToDelete
    const result = table.rng.find((rng) => rng.min + '-' + rng.max === rngToDelete).result;

    return <Grid container >
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12} bgcolor={theme.palette.info.main} color={theme.palette.info.contrastText} style={{ display: 'flex', justifyContent: 'center' }}>
        <Typography>Warning! Table is about to be deleted</Typography>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>
        <Typography>Do you really want to delete RNG {rngToDelete} ({result})?</Typography>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center' }}>
        <Button onClick={() => deleteRng(rngToDelete)} startIcon={<CheckIcon />} variant="contained" color="primary">Yes</Button>
      </Grid>
      <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center' }}>
        <Button onClick={() => setRNGToDelete(null)} startIcon={<CloseIcon />} variant="contained" color="primary">No</Button>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
    </Grid >
  }

}