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
import { addDungeonTrapSet, removeDungeonTrapSet } from '../../../../../store/slices/content';
import { setDungeonTrapSetsFilter } from '../../../../../store/slices/defaults';
import { useTheme } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import InputAdornment from '@mui/material/InputAdornment';
import FilterListIcon from '@mui/icons-material/FilterList';


const TrapSetsList = (props) => {

  const { t } = useTranslation();
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [alert, setAlert] = useState(null);
  const theme = useTheme();

  const dispatch = useDispatch();

  const itemsFilter = useSelector((st) => {
    if (st.defaults.dungeonTrapSetsFilter) {
      return st.defaults.dungeonTrapSetsFilter;
    } else {
      return '';
    }
  });

  const rows = useSelector((st) => {
    if (st.content.dungeonTrapSets) {
      return (st.content.dungeonTrapSets).map((item) => {
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
      setAlert(t('Trap ID cannot be blank'));
      return;
    } else if (rows.find((row) => row.id === newItemId)) {
      setAlert(t('Trap ID already exists'));
      return;
    }

    dispatch(addDungeonTrapSet({
      id: newItemId,
      description: newItemDescription,
      tags: [],
      rng: []
    }));

    document.getElementById('new-item-id').value = '';
    document.getElementById('new-item-description').value = '';
  }

  const deleteItem = (itemId) => {
    dispatch(removeDungeonTrapSet(itemId));
    setItemIdToDelete(null);
  }

  if (itemIdToDelete === null) {
    const contentsList = rows.filter((row) => row.id.toLowerCase().includes(itemsFilter.toLowerCase()));

    return (
      <Grid container >
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid
          item
          xs={12}
          style={{ display: 'flex', justifyContent: 'center' }}
          sx={{
            bgcolor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText
          }}>
          <Typography>{t("List of trap sets")}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <TextField
            id="trap-filter"
            value={itemsFilter}
            onChange={(event) => dispatch(setDungeonTrapSetsFilter(event.target.value))}
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
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12} style={{ height: (contentsList ? (contentsList.length * 52) + 56 : "100") + "px", overflow: "scroll" }}>
          <DataGrid
            sx={{ '& .MuiDataGrid-columnHeadersInner': { backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText } }}
            onRowClick={(params, event, details) => props.selectItem(params.row.id)}
            rows={contentsList}
            columns={columns}
            hideFooterPagination={true}
            paginationModel={{ page: 0, pageSize: 100 }}
          />
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <Typography>{t("Click on a trap set to edit/delete it")}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid
          item
          xs={12}
          style={{ display: 'flex', justifyContent: 'center' }}
          sx={{
            bgcolor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText
          }}>
          <Typography>{t("Add a new trap set:")}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <TextField id="new-item-id" label={t("Trap Set ID")} variant="outlined" sx={{ width: "100%" }} />
        </Grid>
        <Grid item xs={12}>
          <TextField id="new-item-description" label={t("Trap Set Description")} variant="outlined" sx={{ width: "100%" }} />
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
          <Button onClick={addNewItem} startIcon={<AddIcon />} style={{ width: '100%' }} variant="contained" color="primary">{t("Add new trap set")}</Button>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
      </Grid >
    );
  } else {
    return (
      <Grid container >
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid
          item
          xs={12}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          sx={{
            bgcolor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText
          }}>
          <Typography>{t("Warning! Trap set is about to be deleted")}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <Typography>{t("Do you really want to delete trap set")} {itemIdToDelete}?</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button onClick={() => deleteItem(itemIdToDelete)} startIcon={<CheckIcon />} variant="contained" color="primary">{t("Yes")}</Button>
        </Grid>
        <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button onClick={() => setItemIdToDelete(null)} startIcon={<CloseIcon />} variant="contained" color="primary">{t("No")}</Button>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
      </Grid >
    );
  }
}

export default TrapSetsList;
