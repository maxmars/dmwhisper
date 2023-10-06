import React from 'react';
import { useState } from 'react';
import { Grid, Button } from '@mui/material';
import TablesEdit from './TablesEdit';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import TableChartIcon from '@mui/icons-material/TableChart';
import MenuEdit from './MenuEdit';
import { useTranslation } from 'react-i18next';

const AuthoringMenu = () => {

  const { t } = useTranslation();
  const [pageMode, setPageMode] = useState('menu');

  const returnToMenu = () => {
    setPageMode('menu');
  };

  switch (pageMode) {
    case 'menu':
      return (
        <Grid container sx={{ overflow: 'scroll', height: '100%' }}>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button sx={{width: '80%'}} startIcon={<AccountTreeIcon />} onClick={() => setPageMode('menuedit')} variant="contained" color="primary">{t("Edit content tree")}</Button>
          </Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button sx={{width: '80%'}} startIcon={<TableChartIcon />} onClick={() => setPageMode('tablesedit')} variant="contained" color="primary">{t("Edit content tables")}</Button>
          </Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12}>&nbsp;</Grid>
        </Grid>
      );

    case 'tablesedit':
      return <TablesEdit returnToMenu={returnToMenu} />;

    case 'menuedit':
    default:
      return <MenuEdit returnToMenu={returnToMenu} />;
  }
};


export default AuthoringMenu;
