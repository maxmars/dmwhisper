import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { uuidv4 } from '../../../utils/index.js';
import { Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';


export default function TablesChooser(props) {

  const { t } = useTranslation();
  const [tableId, setTableId] = useState(null);
  const [unique, setUnique] = useState(false);
  const wholeContent = useSelector((st) => st.content);
  const tables = wholeContent.tables;
  const theme = useTheme();
  const mainColor = theme.palette.primary.main
  const contrastTextColor = theme.palette.primary.contrastText

  const toggleUnique = () => {
    setUnique(!unique);
  }

  const tableNames = useMemo(
    () => tables.map((item) => {
      return {
        label: item.id,
      }
    }),
    [tables],
  );

  const addTableId = (tableId, uniquevalues) => {

    let newTableIds = [];

    if (props.tablesIds) {
      newTableIds = [...props.tablesIds];
    }

    newTableIds.push({
      id: uuidv4(),
      label: tableId + (unique ? "!" : "")
    });

    props.onTablesChange(newTableIds.map((item) => item.label).join(" ").trim());
  };

  const raiseMenu = (id) => {
    const index = props.tablesIds.findIndex((item) => item.id === id);
    if (index > 0) {
      const newTableIds = [...props.tablesIds];
      const temp = newTableIds[index - 1];
      newTableIds[index - 1] = newTableIds[index];
      newTableIds[index] = temp;
      props.onTablesChange(newTableIds.map((item) => item.label).join(" ").trim());
    }
  };

  const lowerMenu = (id) => {
    const index = props.tablesIds.findIndex((item) => item.id === id);
    if (index < props.tablesIds.length - 1) {
      const newTableIds = [...props.tablesIds];
      const temp = newTableIds[index + 1];
      newTableIds[index + 1] = newTableIds[index];
      newTableIds[index] = temp;
      props.onTablesChange(newTableIds.map((item) => item.label).join(" ").trim());
    }
  };

  const setMenuToDelete = (id) => {
    const newTableIds = props.tablesIds.filter((item) => item.id !== id);
    props.onTablesChange(newTableIds.map((item) => item.label).join(" ").trim());
  };

  const columns = [
    {
      field: 'label',
      headerName: t('Tables to roll on'),
      flex: 1
    },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          icon={<ArrowUpwardIcon />}
          label={t("Move up")}
          onClick={() => {
            raiseMenu(params.id);
          }
          } />,
        <GridActionsCellItem
          icon={<ArrowDownwardIcon />}
          label={t("Move down")}
          onClick={() => {
            lowerMenu(params.id);
          }
          } />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label={t("Delete")}
          onClick={() => {
            setMenuToDelete(params.id);
          }
          } />
      ]
    },
  ];

  return (
    <Grid container sx={{ width: '100%' }}>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={5} sx={{ display: 'flex', alignItems: 'center' }}>
        <Autocomplete
          disablePortal
          id="tableIDs"
          options={tableNames}
          sx={{ width: '100%' }}
          onChange={(event, newValue) => {
            setTableId(newValue.label);
          }}
          renderInput={(params) => <TextField {...params} label={t("Table Id..")} />}
        />
      </Grid>
      <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderLeft: '1em' }}>
        <Typography variant="body1">{t("Unique values?")}</Typography>
        <Checkbox checked={unique} onChange={toggleUnique} inputProps={{ 'aria-label': 'controlled' }} />
      </Grid>
      <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderLeft: '1em' }}>
        <IconButton disabled={!tableId} onClick={() => addTableId(tableId, unique)}><AddIcon /></IconButton>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12} style={{ height: (props.tablesIds ? (props.tablesIds.length * 52) + 156 : "100") + "px", overflow: "scroll" }}>
        <DataGrid
          sx={{ '& .MuiDataGrid-columnHeadersInner': { backgroundColor: mainColor, color: contrastTextColor } }}
          hideFooter
          rows={props.tablesIds ? props.tablesIds : []}
          columns={columns}
          width="100%"
        />
      </Grid>
    </Grid>
  );
}

