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
import { addDungeonTreasureSet, removeDungeonTreasureSet } from '../../../../../store/slices/content';
import { setDungeonTreasureSetsFilter } from '../../../../../store/slices/defaults';
import { useTheme } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import InputAdornment from '@mui/material/InputAdornment';
import FilterListIcon from '@mui/icons-material/FilterList';

const TreasureSetsList = (props) => {

  const { t } = useTranslation();
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [alert, setAlert] = useState(null);
  const theme = useTheme();

  const dispatch = useDispatch();

  const itemsFilter = useSelector((st) => {
    if (st.defaults.dungeonTreasureSetsFilter) {
      return st.defaults.dungeonTreasureSetsFilter;
    } else {
      return '';
    }
  });

  const rows = useSelector((st) => {
    if (st.content.dungeonTreasureSets) {
      return (st.content.dungeonTreasureSets).map((item) => {
        return {
          id: item.id,
          description: item.description,
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
          onClick={() => setItemIdToDelete(params.id)} />
      ]
    },
  ];

  const addNewItem = () => {

    const newItemId = document.getElementById('new-item-id').value;
    const newItemDescription = document.getElementById('new-item-description').value;

    if (newItemId === '') {
      setAlert(t('Treasure ID cannot be blank'));
      return;
    } else if (rows.find((row) => row.id === newItemId)) {
      setAlert(t('Treasure ID already exists'));
      return;
    }

    dispatch(addDungeonTreasureSet({
      id: newItemId,
      description: newItemDescription,
      tags: [],
      rng: []
    }));

    document.getElementById('new-item-id').value = '';
    document.getElementById('new-item-description').value = '';
  }

  const deleteItem = (itemId) => {
    dispatch(removeDungeonTreasureSet(itemId));
    setItemIdToDelete(null);
  }

  if (itemIdToDelete === null) {
    const contentsList = rows.filter((row) => row.id.toLowerCase().includes(itemsFilter.toLowerCase()));

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
          <Typography>{t("List of treasure sets")}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <TextField
            id="treasure-filter"
            value={itemsFilter}
            onChange={(event) => dispatch(setDungeonTreasureSetsFilter(event.target.value))}
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
            onRowClick={(params, event, details) => props.selectItem(params.row.id)}
            rows={contentsList}
            columns={columns}
            hideFooterPagination={true}
            paginationModel={{ page: 0, pageSize: 100 }}
          />
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <Typography>{t("Click on a treasure set to edit/delete it")}</Typography>
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
          <Typography>{t("Add a new treasure set:")}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <TextField id="new-item-id" label={t("Treasure Set ID")} variant="outlined" sx={{ width: "100%" }} />
        </Grid>
        <Grid size={12}>
          <TextField id="new-item-description" label={t("Treasure Set Description")} variant="outlined" sx={{ width: "100%" }} />
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
          <Button onClick={addNewItem} startIcon={<AddIcon />} style={{ width: '100%' }} variant="contained" color="primary">{t("Add new treasure set")}</Button>
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
          <Typography>{t("Warning! Treasure set is about to be deleted")}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <Typography>{t("Do you really want to delete treasure set")} {itemIdToDelete}?</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>&nbsp;</Grid>
       <Grid size={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button onClick={() => deleteItem(itemIdToDelete)} startIcon={<CheckIcon />} variant="contained" color="primary">{t("Yes")}</Button>
        </Grid>
       <Grid size={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button onClick={() => setItemIdToDelete(null)} startIcon={<CloseIcon />} variant="contained" color="primary">{t("No")}</Button>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
      </Grid >
    );
  }
}

export default TreasureSetsList;
