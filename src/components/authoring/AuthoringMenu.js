import React from 'react';
import { useState } from 'react';
import { Grid, Button } from '@mui/material';
import TablesEdit from './tables/TablesEdit';
import SetpiecesEdit from './maps/SetpiecesEdit';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import TableChartIcon from '@mui/icons-material/TableChart';
import MapIcon from '@mui/icons-material/Map';
import MenuEdit from './menutree/MenuEdit';
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
        <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'scroll', height: '80vh' }}>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button sx={{ width: '90%' }} startIcon={<AccountTreeIcon />} onClick={() => setPageMode('menuedit')} variant="contained" color="primary">{t("Edit content tree")}</Button>
          </Grid>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button sx={{ width: '90%' }} startIcon={<TableChartIcon />} onClick={() => setPageMode('tablesedit')} variant="contained" color="primary">{t("Edit content tables")}</Button>
          </Grid>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button sx={{ width: '90%' }} startIcon={<MapIcon />} onClick={() => setPageMode('setpiecesedit')} variant="contained" color="primary">{t("Edit maps contents")}</Button>
          </Grid>
        </Grid>
      );

    case 'setpiecesedit':
      return <SetpiecesEdit returnToMenu={returnToMenu} />;

    case 'tablesedit':
      return <TablesEdit returnToMenu={returnToMenu} />;

    case 'menuedit':
    default:
      return <MenuEdit returnToMenu={returnToMenu} />;
  }
};


export default AuthoringMenu;
