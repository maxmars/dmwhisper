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
import { addDungeonSetpiece, removeDungeonSetpiece } from '../../../../../store/slices/content';
import { setDungeonSetpiecesFilter } from '../../../../../store/slices/defaults';
import useTheme from '@mui/private-theming/useTheme';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import InputAdornment from '@mui/material/InputAdornment';
import FilterListIcon from '@mui/icons-material/FilterList';

const DungeonSetpiecesList = (props) => {

  const { t } = useTranslation();
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [alert, setAlert] = useState(null);
  const theme = useTheme();

  const dispatch = useDispatch();

  const itemsFilter = useSelector((st) => {
    if (st.defaults.dungeonSetpiecesFilter) {
      return st.defaults.dungeonSetpiecesFilter;
    } else {
      return '';
    }
  });

  const rows = useSelector((st) => {
    if (st.content.dungeonSetpieces) {
      return (st.content.dungeonSetpieces).map((item) => {
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
      setAlert(t('Setpiece ID cannot be blank'));
      return;
    } else if (rows.find((row) => row.id === newItemId)) {
      setAlert(t('Setpiece ID already exists'));
      return;
    }

    dispatch(addDungeonSetpiece({
      id: newItemId,
      description: newItemDescription,
      tags: [],
      rng: []
    }));

    document.getElementById('new-item-id').value = '';
    document.getElementById('new-item-description').value = '';
  }

  const deleteItem = (itemId) => {
    dispatch(removeDungeonSetpiece(itemId));
    setItemIdToDelete(null);
  }

  if (itemIdToDelete === null) {
    const contentsList = rows.filter((row) => row.id.toLowerCase().includes(itemsFilter.toLowerCase()));

    return (
      <Grid container >
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12} bgcolor={theme.palette.warning.main} color={theme.palette.warning.contrastText} style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography>{t("List of setpiece sets")}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <TextField
            id="setpiece-filter"
            value={itemsFilter}
            onChange={(event) => dispatch(setDungeonSetpiecesFilter(event.target.value))}
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
            paginationModel={{ page: 1, pageSize: 1000 }}
          />
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <Typography>{t("Click on a setpiece set to edit/delete it")}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12} bgcolor={theme.palette.warning.main} color={theme.palette.warning.contrastText} style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography>{t("Add a new setpiece set:")}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <TextField id="new-item-id" label={t("Setpiece Set ID")} variant="outlined" sx={{ width: "100%" }} />
        </Grid>
        <Grid item xs={12}>
          <TextField id="new-item-description" label={t("Setpiece Set Description")} variant="outlined" sx={{ width: "100%" }} />
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
          <Button onClick={addNewItem} startIcon={<AddIcon />} style={{ width: '100%' }} variant="contained" color="primary">{t("Add new setpiece set")}</Button>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
      </Grid >
    );
  } else {
    return <Grid container >
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12} bgcolor={theme.palette.warning.main} color={theme.palette.warning.contrastText} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>{t("Warning! Setpiece set is about to be deleted")}</Typography>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>
        <Typography>{t("Do you really want to delete setpiece set")} {itemIdToDelete}?</Typography>
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
  }
}

export default DungeonSetpiecesList;