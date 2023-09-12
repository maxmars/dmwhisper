import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import { useDispatch } from 'react-redux';
import { addTable, removeTable } from '../../store/slices/content';
import useTheme from '@mui/private-theming/useTheme';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

export default function TablesList(props) {

  const { t } = useTranslation();
  const [tableIdToDelete, setTableIdToDelete] = useState(null);
  const [alert, setAlert] = useState(null);
  const theme = useTheme();

  const dispatch = useDispatch();

  const rows = useSelector((st) => st.content.tables).map((table) => {
    return {
      id: table.id,
      description: table.description,
    }
  });

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: window.innerWidth * 0.7,
    },
    {
      field: 'actions',
      type: 'actions',
      width: window.innerWidth * 0.28,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label={t("Delete")}
          onClick={() => setTableIdToDelete(params.id)} />
      ]
    },
  ];

  const addNewTable = () => {

    const newTableId = document.getElementById('new-table-id').value;
    const newTableDescription = document.getElementById('new-table-description').value;

    if (newTableId === '') {
      setAlert(t('Table ID cannot be blank'));
      return;
    } else if (rows.find((row) => row.id === newTableId)) {
      setAlert(t('Table ID already exists'));
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

  const deleteTable = (tableId) => {
    dispatch(removeTable(tableId));
    setTableIdToDelete(null);
  }

  if (tableIdToDelete === null) {
    return (
      <Grid container >
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12} bgcolor={theme.palette.warning.main} color={theme.palette.warning.contrastText} style={{display: 'flex', justifyContent: 'center'}}>
          <Typography>{t("List of Tables")}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <Typography>{t("Click on a table to edit/delete it")}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12} style={{ height: (rows ? (rows.length * 52) + 56 : "100") + "px", overflow: "scroll" }}>
          <DataGrid
            onRowClick={(params, event, details) => props.selectTable(params.row.id)}
            rows={rows}
            columns={columns}
            hideFooterPagination={true}
            paginationModel={{ page: 1, pageSize: 1000 }}
          />
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12} bgcolor={theme.palette.warning.main} color={theme.palette.warning.contrastText} style={{display: 'flex', justifyContent: 'center'}}>
          <Typography>{t("Add a new table:")}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <TextField id="new-table-id" label={t("Table ID")} variant="outlined" sx={{ width: "100%" }} />
        </Grid>
        <Grid item xs={12}>
          <TextField id="new-table-description" label={t("Table Description")} variant="outlined" sx={{ width: "100%" }} />
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
          <Button onClick={addNewTable} startIcon={<AddIcon />} style={{ width: '100%' }} variant="contained" color="primary">{t("Add new table")}</Button>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
      </Grid >
    );
  } else {
    return <Grid container >
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12} bgcolor={theme.palette.warning.main} color={theme.palette.warning.contrastText} style={{display: 'flex', justifyContent: 'center'}}>
        <Typography>{t("Warning! Table is about to be deleted")}</Typography>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>
        <Typography>{t("Do you really want to delete table")} {tableIdToDelete}?</Typography>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={6} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Button onClick={() => deleteTable(tableIdToDelete)} startIcon={<CheckIcon />} variant="contained" color="primary">{t("Yes")}</Button>
      </Grid>
      <Grid item xs={6} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Button onClick={() => setTableIdToDelete(null)} startIcon={<CloseIcon />} variant="contained" color="primary">{t("No")}</Button>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
    </Grid >
  }
}