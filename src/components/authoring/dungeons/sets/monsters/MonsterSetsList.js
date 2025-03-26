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
import { addDungeonMonsterSet, removeDungeonMonsterSet } from '../../../../../store/slices/content';
import { setDungeonMonsterSetsFilter } from '../../../../../store/slices/defaults';
import { useTheme } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import InputAdornment from '@mui/material/InputAdornment';
import FilterListIcon from '@mui/icons-material/FilterList';

const MonsterSetsList = (props) => {

  const { t } = useTranslation();
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [alert, setAlert] = useState(null);
  const theme = useTheme();

  const dispatch = useDispatch();

  const itemsFilter = useSelector((st) => {
    if (st.defaults.dungeonMonsterSetsFilter) {
      return st.defaults.dungeonMonsterSetsFilter;
    } else {
      return '';
    }
  });

  const rows = useSelector((st) => {
    if (st.content.dungeonMonsterSets) {
      return (st.content.dungeonMonsterSets).map((item) => {
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
      setAlert(t('Monster ID cannot be blank'));
      return;
    } else if (rows.find((row) => row.id === newItemId)) {
      setAlert(t('Monster ID already exists'));
      return;
    }

    dispatch(addDungeonMonsterSet({
      id: newItemId,
      description: newItemDescription,
      tags: [],
      rng: []
    }));

    document.getElementById('new-item-id').value = '';
    document.getElementById('new-item-description').value = '';
  }

  const deleteItem = (itemId) => {
    dispatch(removeDungeonMonsterSet(itemId));
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
          <Typography>{t("List of monster sets")}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <TextField
            id="monster-filter"
            value={itemsFilter}
            onChange={(event) => dispatch(setDungeonMonsterSetsFilter(event.target.value))}
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
          <Typography>{t("Click on a monster set to edit/delete it")}</Typography>
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
          <Typography>{t("Add a new monster set:")}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <TextField id="new-item-id" label={t("Monster Set ID")} variant="outlined" sx={{ width: "100%" }} />
        </Grid>
        <Grid size={12}>
          <TextField id="new-item-description" label={t("Monster Set Description")} variant="outlined" sx={{ width: "100%" }} />
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
          <Button onClick={addNewItem} startIcon={<AddIcon />} style={{ width: '100%' }} variant="contained" color="primary">{t("Add new monster set")}</Button>
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
          <Typography>{t("Warning! Monster set is about to be deleted")}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <Typography>{t("Do you really want to delete monster set")} {itemIdToDelete}?</Typography>
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

export default MonsterSetsList;
