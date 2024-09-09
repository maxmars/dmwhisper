import React from 'react';
import { useState } from 'react';
import { Grid, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import TreasureSetsList from './TreasureSetsList';
import TreasureSetEdit from './TreasureSetEdit';
import { useTranslation } from 'react-i18next';

const TreasureSetsEdit = (props) => {

  const { t } = useTranslation();
  const trapsListPageMode = 'dmwhisper-treasures-list';
  const [pageMode, setPageMode] = useState(trapsListPageMode);
  
  const selectTrapSet = itemId => setPageMode(itemId);
  const setTrapSetsListMode = () => setPageMode(trapsListPageMode);

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
          <TreasureSetsList selectItem={selectTrapSet} />
          :
          <TreasureSetEdit itemId={pageMode} endEditing={setTrapSetsListMode} />
        }
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
    </Grid>
  );
};

export default TreasureSetsEdit;