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
import { useTranslation } from 'react-i18next';


export default function TableEdit(props) {

  const { t } = useTranslation();
  const [rngToDelete, setRNGToDelete] = useState(null);
  const [editedTableId, setEditedTableId] = useState(props.tableId);
  const tables = useSelector((st) => st.content.tables);
  const table = tables.find((table) => table.id === props.tableId);
  const [editedTableDescription, setEditedTableDescription] = useState(table.description);
  const theme = useTheme();
  const [alert, setAlert] = useState(null);
  const [rngAlert, setRngAlert] = useState(null);

  const [newMin, setNewMin] = useState(null);
  const [newMax, setNewMax] = useState(null);
  const [newResult, setNewResult] = useState(null);
  const [newPrefix, setNewPrefix] = useState(null);
  const [newTable, setNewTable] = useState(null);
  const [newPostfix, setNewPostfix] = useState(null);

  const rows = table.rng.map((rng) => {
    let description = rng.result;
    if (!rng.result) {
      const prefix = rng.prefix ? rng.prefix : '';
      const postfix = rng.postfix ? rng.postfix : '';
      description = prefix + ' ' + rng.table + ' ' + postfix;
    }

    return {
      id: rng.min + '-' + rng.max,
      description: description,
    }
  });


  const dispatch = useDispatch();

  const updateHeader = () => {

    if (tables.find((table) => table.id === editedTableId) && editedTableId !== props.tableId) {
      setAlert(t('Table ID already exists'));
      return;
    }

    if (editedTableId === '') {
      setAlert(t('Table ID cannot be blank'));
      return;
    }

    if (editedTableId === props.tableId && editedTableDescription === props.tableDescription) {
      setAlert(t('No changes to save'));
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
      headerName: t('RNG'),
      width: window.innerWidth * 0.25,
    },
    {
      field: 'description',
      headerName: t('Description'),
      width: window.innerWidth * 0.6,
    },
    {
      field: 'actions',
      type: 'actions',
      width: window.innerWidth * 0.15,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label={t("Delete")}
          onClick={() => setRNGToDelete(params.id)} />
      ]
    },
  ];

  const addRng = () => {
    if (document.getElementById('new-min').value === '') {
      setRngAlert(t('Min value cannot be blank'));
      return;
    }

    if (document.getElementById('new-max').value === '') {
      setRngAlert(t('Max value cannot be blank'));
      return;
    }

    if (document.getElementById('new-result').value === '' &&
      document.getElementById('new-table').value === '') {
      setRngAlert(t('Either Fixed result or Table must have a value'));
      return;
    }

    if (parseInt(document.getElementById('new-min').value) > parseInt(document.getElementById('new-max').value)) {
      setRngAlert(t('Min value cannot be greater than max value'));
      return;
    }

    if (table.rng.find((rng) => rng.min === parseInt(document.getElementById('new-min').value) && rng.max === parseInt(document.getElementById('new-max').value))) {
      setRngAlert(t('RNG value already exists'));
      return;
    }

    const newRng = {
      min: parseInt(document.getElementById('new-min').value),
      max: parseInt(document.getElementById('new-max').value),
      prefix: document.getElementById('new-prefix').value,
      table: document.getElementById('new-table').value,
      postfix: document.getElementById('new-postfix').value,
      result: document.getElementById('new-result').value,
    }

    const newRngs = [...table.rng, newRng];

    dispatch(updateTableRng({
      tableId: props.tableId,
      rng: newRngs,
    }));

    document.getElementById('new-min').value = '';
    document.getElementById('new-max').value = '';
    document.getElementById('new-result').value = '';
    document.getElementById('new-prefix').value = '';
    document.getElementById('new-table').value = '';
    document.getElementById('new-postfix').value = '';
  }

  const deleteRng = (rngToDelete) => {
    const newRng = table.rng.filter((rng) => rng.min + '-' + rng.max !== rngToDelete);
    dispatch(updateTableRng({
      tableId: props.tableId,
      rng: newRng,
    }));

    setRNGToDelete(null);
  }

  const editRNGValues = (rngId) => {
    //document.getElementById('new-min').value = rngId.split('-')[0];
    //document.getElementById('new-max').value = rngId.split('-')[1];
    setNewMin(rngId.split('-')[0]);
    setNewMax(rngId.split('-')[1]);

    const result = table.rng.find((rng) => rng.min + '-' + rng.max === rngId).result;
    if (result) {
      //document.getElementById('new-result').value = result;
      setNewResult(result);
    }

    const prefix = table.rng.find((rng) => rng.min + '-' + rng.max === rngId).prefix;
    if (prefix) {
      //document.getElementById('new-prefix').value = prefix;
      setNewPrefix(prefix);
    }

    const postfix = table.rng.find((rng) => rng.min + '-' + rng.max === rngId).postfix;
    if (postfix) {
      //document.getElementById('new-postfix').value = postfix;
      setNewPostfix(postfix);
    }

    const tableName = table.rng.find((rng) => rng.min + '-' + rng.max === rngId).table;
    if (tableName) {
      //document.getElementById('new-table').value = tableName;
      setNewTable(tableName);
    }
  }

  if (rngToDelete === null) {

    return (
      <Grid container >
        <Grid item xs={12} bgcolor={theme.palette.warning.main} color={theme.palette.warning.contrastText} style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography>{t("Edited table:")} {props.tableId}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <TextField id="table-id"
            label={t("Table ID")}
            variant="outlined"
            sx={{ width: "100%" }}
            defaultValue={props.tableId}
            value={editedTableId}
            onChange={(event) => setEditedTableId(event.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField id="table-description"
            label={t("Table Description")}
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
          <Button onClick={updateHeader} startIcon={<SaveAltIcon />} style={{ width: '100%' }} variant="contained" color="primary">{t("Update header info")}</Button>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12} bgcolor={theme.palette.warning.main} color={theme.palette.warning.contrastText} style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography>{t("List of RNG values")}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <Typography>{t("Click on the bin to delete values.")}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12} style={{ height: (rows ? (rows.length * 52) + 56 : "100") + "px", overflow: "scroll" }}>
          <DataGrid
            sx={{ '& .MuiDataGrid-columnHeadersInner': { backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText } }}
            onRowClick={(params) => editRNGValues(params.row.id)}
            rows={rows}
            columns={columns}
            hideFooterPagination={true}
            paginationModel={{ page: 1, pageSize: 1000 }}
          />
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12} bgcolor={theme.palette.warning.main} color={theme.palette.warning.contrastText} style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography>{t("Add a new RNG:")}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <TextField 
            onChange={(event) => setNewMin(event.target.value)} 
            value={newMin} 
            id="new-min" 
            label={newMin? "" : t("Min value")} 
            type='number' 
            variant="outlined" 
            sx={{ width: "100%" }} />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            onChange={(event) => setNewMax(event.target.value)}
            value={newMax} 
            id="new-max" 
            label={newMax? "" : t("Max value")}
            type='number' 
            variant="outlined" 
            sx={{ width: "100%" }} />
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <Typography>{t("Either specify a fixed result:")}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <TextField 
            value={newResult} 
            id="new-result" 
            label={newResult? "" : t("Fixed result")}
            variant="outlined" 
            sx={{ width: "100%" }} />
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <Typography>{t("Or specfiy one or more (space separated) tables to roll on, plus optional prefix and postfix:")}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <TextField 
            value={newPrefix} 
            id="new-prefix" 
            label={newPrefix? "" : t("Prefix")}
            variant="outlined" 
            sx={{ width: "100%" }} />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            value={newTable} 
            id="new-table" 
            label={newTable? "" : t("Table (ID)")}
            variant="outlined" 
            sx={{ width: "100%" }} />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            value={newPostfix} 
            id="new-postfix" 
            label={newPostfix? "" : t("Postfix")}
            variant="outlined" 
            sx={{ width: "100%" }} />
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
          <Button onClick={addRng} startIcon={<AddIcon />} style={{ width: '100%' }} variant="contained" color="primary">{t("Add new RNG")}</Button>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <Button onClick={props.endEditing} startIcon={<ArrowBackIosNewIcon />} style={{ width: '100%' }} variant="contained" color="primary">{t("Back to tables list")}</Button>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
      </Grid >
    );
  } else {
    // get result from rngToDelete
    const result = table.rng.find((rng) => rng.min + '-' + rng.max === rngToDelete).result;

    return <Grid container >
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12} bgcolor={theme.palette.warning.main} color={theme.palette.warning.contrastText} style={{ display: 'flex', justifyContent: 'center' }}>
        <Typography>{t("Warning! RNG is about to be deleted")}</Typography>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>
        <Typography>{t("Do you really want to delete RNG")} {rngToDelete} ({result})?</Typography>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button onClick={() => deleteRng(rngToDelete)} startIcon={<CheckIcon />} variant="contained" color="primary">{t("Yes")}</Button>
      </Grid>
      <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button onClick={() => setRNGToDelete(null)} startIcon={<CloseIcon />} variant="contained" color="primary">{t("No")}</Button>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
    </Grid >
  }

}