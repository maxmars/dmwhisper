import React from 'react';
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const handleBackButton = (event) => {
      window.history.pushState({ noBackExitsApp: true }, '');
      event.preventDefault();
      props.returnToMenu();
    };

    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <Grid container sx={{height: "100%"}} >
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12}>
        <Button startIcon={<ArrowBackIosNewIcon />} onClick={props.returnToMenu} style={{ width: '100%' }} variant="contained" color="primary">{t("Main menu")}</Button>
      </Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12}>
        {
          pageMode === tablesListPageMode ?
          <TablesList selectTable={selectTable} />
          :
          <TableEdit tableId={pageMode} endEditing={setTablesListMode} />
        }
      </Grid>
      <Grid size={12}>&nbsp;</Grid>
    </Grid>
  );
};


export default TablesEdit;
