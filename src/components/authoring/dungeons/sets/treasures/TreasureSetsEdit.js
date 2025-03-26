import React from 'react';
import { useState, useEffect } from 'react';
import { Grid, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import TreasureSetsList from './TreasureSetsList';
import TreasureSetEdit from './TreasureSetEdit';
import { useTranslation } from 'react-i18next';

const TreasureSetsEdit = (props) => {

  const { t } = useTranslation();
  const trapsListPageMode = 'dmwhisper-treasures-list';
  const [pageMode, setPageMode] = useState(trapsListPageMode);
  
  const selectTreasureSet = itemId => setPageMode(itemId);
  const setTreasureSetsListMode = () => setPageMode(trapsListPageMode);

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
          pageMode === trapsListPageMode ?
          <TreasureSetsList selectItem={selectTreasureSet} />
          :
          <TreasureSetEdit itemId={pageMode} endEditing={setTreasureSetsListMode} />
        }
      </Grid>
      <Grid size={12}>&nbsp;</Grid>
    </Grid>
  );
};

export default TreasureSetsEdit;