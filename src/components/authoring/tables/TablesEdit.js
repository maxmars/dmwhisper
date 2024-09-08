import React from 'react';
import { useState } from 'react';
import { Grid, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import TablesList from './TablesList';
import TableEdit from './TableEdit';
import { useTranslation } from 'react-i18next';

const TablesEdit = (props) => {

  const { t } = useTranslation();
  const tablesListPageMode = 'dmwhisper-tables-list';
  const [pageMode, setPageMode] = useState(tablesListPageMode);
  
  const selectTable = tableId => setPageMode(tableId);
  const setTablesListMode = () => setPageMode(tablesListPageMode);

  return (
    <Grid container sx={{height: "100%"}} >
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>
        <Button startIcon={<ArrowBackIosNewIcon />} onClick={props.returnToMenu} style={{ width: '100%' }} variant="contained" color="primary">{t("Main menu")}</Button>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>
        {
          pageMode === tablesListPageMode ?
          <TablesList selectTable={selectTable} />
          :
          <TableEdit tableId={pageMode} endEditing={setTablesListMode} />
        }
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
    </Grid>
  );
};


export default TablesEdit;
