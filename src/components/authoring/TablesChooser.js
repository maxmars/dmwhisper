import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import useTheme from '@mui/private-theming/useTheme';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { uuidv4 } from '../../utils/index.js';
import { Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';


export default function TablesChooser(props) {

  const { t } = useTranslation();
  const [tableId, setTableId] = useState(null);
  const [unique, setUnique] = useState(false);
  const [tableIds, setTableIds] = useState(props.tablesIds ? props.tablesIds : []);
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

  useEffect(() => {

    const emitTablesChange = () => {
      if (props.onTablesChange) {
        const newTablesIdsArray = tableIds.map((item) => item.label);
        props.onTablesChange(newTablesIdsArray.join(' ').trim());
      }
    };
    emitTablesChange();
  }, [tableIds, props]);

  const addTableId = (tableId, uniquevalues) => {

    const newTableIds = [...tableIds, {
      id: uuidv4(),
      label: tableId + (unique ? "!" : "")
    }];

    setTableIds(newTableIds);
  };

  const raiseMenu = (id) => {
    const index = tableIds.findIndex((item) => item.id === id);
    if (index > 0) {
      const newTableIds = [...tableIds];
      const temp = newTableIds[index - 1];
      newTableIds[index - 1] = newTableIds[index];
      newTableIds[index] = temp;
      setTableIds(newTableIds);
    }
  };

  const lowerMenu = (id) => {
    const index = tableIds.findIndex((item) => item.id === id);
    if (index < tableIds.length - 1) {
      const newTableIds = [...tableIds];
      const temp = newTableIds[index + 1];
      newTableIds[index + 1] = newTableIds[index];
      newTableIds[index] = temp;
      setTableIds(newTableIds);
    }
  };

  const setMenuToDelete = (id) => {
    const newTableIds = tableIds.filter((item) => item.id !== id);
    setTableIds(newTableIds);
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
      <Grid item xs={12} style={{ height: (tableIds ? (tableIds.length * 52) + 156 : "100") + "px", overflow: "scroll" }}>
        <DataGrid
          sx={{ '& .MuiDataGrid-columnHeadersInner': { backgroundColor: mainColor, color: contrastTextColor } }}
          hideFooter
          rows={tableIds}
          columns={columns}
          width="100%"
        />
      </Grid>
    </Grid>
  );
}

