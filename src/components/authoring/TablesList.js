import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import { useDispatch } from 'react-redux';
import { addTable } from '../../store/slices/content';

export default function TablesList() {

  const [alert, setAlert] = useState(null);

  const dispatch = useDispatch();

  const rows = useSelector((st) => st.content.tables.map((table) => {
    return {
      id: table.id,
      description: table.description,
    }
  }));

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: window.innerWidth * 0.3,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: window.innerWidth * 0.66,
    }
  ];

  const addNewTable = () => {

    const newTableId = document.getElementById('new-table-id').value;
    const newTableDescription = document.getElementById('new-table-description').value;

    if (newTableId === '') {
      setAlert('Table ID cannot be blank');
      return;
    } else if (rows.find((row) => row.id === newTableId)) {
      setAlert('Table ID already exists');
      return;
    }

    dispatch(addTable({
      id: newTableId,
      description: newTableDescription,
      tags: [],
      rng: []
    }));

    document.getElementById('new-table-id').value = '';
    document.getElementById('new-table-description').value = '';
  }

  return (
    <Grid container >
      <Grid item xs={12}>
        <Typography>List of Tables</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>Click on a table to edit/delete it</Typography>
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
      <Grid item xs={12}>
        <Typography>New Table:</Typography>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>
        <TextField id="new-table-id" label="Table ID" variant="outlined" sx={{ width: "100%" }} />
      </Grid>
      <Grid item xs={12}>
        <TextField id="new-table-description" label="Table Description" variant="outlined" sx={{ width: "100%" }} />
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
        <Button onClick={addNewTable} startIcon={<AddIcon />} style={{ width: '100%' }} variant="contained" color="primary">Add new table</Button>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
    </Grid >
  );
}