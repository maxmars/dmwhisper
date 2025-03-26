import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Grid2 as Grid } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useDispatch } from 'react-redux';
import { addSetpiece, removeSetpiece } from '../../../../store/slices/content';
import { setSetpiecesFilter } from '../../../../store/slices/defaults';
import { useTheme } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import InputAdornment from '@mui/material/InputAdornment';
import FilterListIcon from '@mui/icons-material/FilterList';

export default function SetpiecesList(props) {

  const { t } = useTranslation();
  const [setpieceIdToDelete, setSetpieceIdToDelete] = useState(null);
  const [alert, setAlert] = useState(null);
  const theme = useTheme();

  const dispatch = useDispatch();

  const setpiecesFilter = useSelector((st) => {
    if (st.defaults.setpiecesFilter) {
      return st.defaults.setpiecesFilter;
    } else {
      return '';
    }
  });

  const rows = useSelector((st) => {
    if (st.content.setpieces) {
      return (st.content.setpieces).map((setpiece) => {
        return {
          id: setpiece.id,
          description: setpiece.description,
        }
      });
    } else {
      return [];
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
          onClick={() => setSetpieceIdToDelete(params.id)} />
      ]
    },
  ];

  const addNewSetpiece = () => {

    const newSetpieceId = document.getElementById('new-setpiece-id').value;
    const newSetpieceDescription = document.getElementById('new-setpiece-description').value;

    if (newSetpieceId === '') {
      setAlert(t('Set piece ID cannot be blank'));
      return;
    } else if (rows.find((row) => row.id === newSetpieceId)) {
      setAlert(t('Set piece ID already exists'));
      return;
    }

    dispatch(addSetpiece({
      id: newSetpieceId,
      description: newSetpieceDescription,
      tags: [],
      rng: []
    }));

    document.getElementById('new-setpiece-id').value = '';
    document.getElementById('new-setpiece-description').value = '';
  }

  const deleteSetpiece = (setpieceId) => {
    dispatch(removeSetpiece(setpieceId));
    setSetpieceIdToDelete(null);
  }

  if (setpieceIdToDelete === null) {
    const contentsList = rows.filter((row) => row.id.toLowerCase().includes(setpiecesFilter.toLowerCase()));

    return (
      <Grid container >
        <Grid size={12}>&nbsp;</Grid>
        <Grid
          size={12}
          style={{ display: 'flex', justifyContent: 'center' }}
          sx={{
            bgcolor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText
          }}>
          <Typography>{t("List of set pieces")}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <TextField
            id="setpiece-filter"
            value={setpiecesFilter}
            onChange={(event) => dispatch(setSetpiecesFilter(event.target.value))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterListIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12} style={{ height: (contentsList ? (contentsList.length * 52) + 56 : "100") + "px", overflow: "scroll" }}>
          <DataGrid
            sx={{ '& .MuiDataGrid-columnHeadersInner': { backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText } }}
            onRowClick={(params, event, details) => props.selectSetpiece(params.row.id)}
            rows={contentsList}
            columns={columns}
            hideFooterPagination={true}
            paginationModel={{ page: 0, pageSize: 100 }}
          />
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <Typography>{t("Click on a set piece to edit/delete it")}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid
          size={12}
          style={{ display: 'flex', justifyContent: 'center' }}
          sx={{
            bgcolor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText
          }}>
          <Typography>{t("Add a new set piece:")}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <TextField id="new-setpiece-id" label={t("Set piece ID")} variant="outlined" sx={{ width: "100%" }} />
        </Grid>
        <Grid size={12}>
          <TextField id="new-setpiece-description" label={t("Set piece Description")} variant="outlined" sx={{ width: "100%" }} />
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        {alert ?
          <>
            <Grid size={12}>
              <Alert severity='error' onClose={() => setAlert(null)}>
                {alert}
              </Alert>
            </Grid>
            <Grid size={12}>&nbsp;</Grid>
          </>
          :
          null}
        <Grid size={12}>
          <Button onClick={addNewSetpiece} startIcon={<AddIcon />} style={{ width: '100%' }} variant="contained" color="primary">{t("Add new set piece")}</Button>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
      </Grid >
    );
  } else {
    return (
      <Grid container >
        <Grid size={12}>&nbsp;</Grid>
        <Grid
          size={12}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          sx={{
            bgcolor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText
          }}>
          <Typography>{t("Warning! Set piece is about to be deleted")}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <Typography>{t("Do you really want to delete set piece")} {setpieceIdToDelete}?</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>&nbsp;</Grid>
       <Grid size={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button onClick={() => deleteSetpiece(setpieceIdToDelete)} startIcon={<CheckIcon />} variant="contained" color="primary">{t("Yes")}</Button>
        </Grid>
       <Grid size={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button onClick={() => setSetpieceIdToDelete(null)} startIcon={<CloseIcon />} variant="contained" color="primary">{t("No")}</Button>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
      </Grid >
    );
  }
}