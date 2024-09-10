import React from 'react';
import { useState } from 'react';
import { Grid, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import MonsterSetsList from './MonsterSetsList';
import MonsterSetEdit from './MonsterSetEdit';
import { useTranslation } from 'react-i18next';

const MonsterSetsEdit = (props) => {

  const { t } = useTranslation();
  const trapsListPageMode = 'dmwhisper-monsters-list';
  const [pageMode, setPageMode] = useState(trapsListPageMode);
  
  const selectMonsterSet = itemId => setPageMode(itemId);
  const setMonsterSetsListMode = () => setPageMode(trapsListPageMode);

  return (
    <Grid container sx={{height: "100%"}} >
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>
        <Button startIcon={<ArrowBackIosNewIcon />} onClick={props.returnToMenu} style={{ width: '100%' }} variant="contained" color="primary">{t("Main menu")}</Button>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>
        {
          pageMode === trapsListPageMode ?
          <MonsterSetsList selectItem={selectMonsterSet} />
          :
          <MonsterSetEdit itemId={pageMode} endEditing={setMonsterSetsListMode} />
        }
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
    </Grid>
  );
};

export default MonsterSetsEdit;