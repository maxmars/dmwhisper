import React from 'react';
import { useState } from 'react';
import { Grid, Button, Typography } from '@mui/material';
import TablesEdit from './tables/TablesEdit';
import SetpiecesEdit from './maps/setpieces/SetpiecesEdit';
import TrapSetsEdit from './dungeons/sets/traps/TrapSetsEdit';
import MonsterSetsEdit from './dungeons/sets/monsters/MonsterSetsEdit';
import PuzzleSetsEdit from './dungeons/sets/puzzles/PuzzleSetsEdit';
import TreasureSetsEdit from './dungeons/sets/treasures/TreasureSetsEdit';
import DungeonSetpiecesEdit from './dungeons/sets/setpieces/DungeonSetpiecesEdit';
import ListIcon from '@mui/icons-material/List';
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
          <Grid size={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button sx={{ width: '90%' }} startIcon={<ListIcon />} onClick={() => setPageMode('menuedit')} variant="contained" color="primary">{t("Edit content tree")}</Button>
          </Grid>
          <Grid size={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button sx={{ width: '90%' }} startIcon={<TableChartIcon />} onClick={() => setPageMode('tablesedit')} variant="contained" color="primary">{t("Edit content tables")}</Button>
          </Grid>
          <Grid size={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button sx={{ width: '90%' }} startIcon={<MapIcon />} onClick={() => setPageMode('setpiecesedit')} variant="contained" color="primary">{t("Edit maps contents")}</Button>
          </Grid>
          <Grid size={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography sx={{ width: '90%' }} align='center'>{t("Dungeons")}</Typography>
          </Grid>
          <Grid size={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button sx={{ width: '90%' }} startIcon={<AccountTreeIcon />} onClick={() => setPageMode('dungeonsetpiecesedit')} variant="contained" color="primary">{t("Edit dungeon rooms")}</Button>
          </Grid>
          <Grid size={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button sx={{ width: '90%' }} startIcon={<AccountTreeIcon />} onClick={() => setPageMode('dungeontrapsedit')} variant="contained" color="primary">{t("Edit traps")}</Button>
          </Grid>
          <Grid size={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button sx={{ width: '90%' }} startIcon={<AccountTreeIcon />} onClick={() => setPageMode('dungeonmonstersedit')} variant="contained" color="primary">{t("Edit monsters")}</Button>
          </Grid>
          <Grid size={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button sx={{ width: '90%' }} startIcon={<AccountTreeIcon />} onClick={() => setPageMode('dungeontreasuresedit')} variant="contained" color="primary">{t("Edit treasures")}</Button>
          </Grid>
          <Grid size={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button sx={{ width: '90%' }} startIcon={<AccountTreeIcon />} onClick={() => setPageMode('dungeonpuzzlesedit')} variant="contained" color="primary">{t("Edit puzzles")}</Button>
          </Grid>
        </Grid>
      );

    case 'dungeontrapsedit':
      return <TrapSetsEdit returnToMenu={returnToMenu} />;

    case 'dungeonmonstersedit':
      return <MonsterSetsEdit returnToMenu={returnToMenu} />;

    case 'dungeonpuzzlesedit':
      return <PuzzleSetsEdit returnToMenu={returnToMenu} />;

    case 'dungeontreasuresedit':
      return <TreasureSetsEdit returnToMenu={returnToMenu} />;

    case 'dungeonsetpiecesedit':
      return <DungeonSetpiecesEdit returnToMenu={returnToMenu} />;

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
