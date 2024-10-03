import React from 'react';
import { useState, useEffect } from 'react';
import { Grid, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SetpiecesList from './DungeonSetpiecesList';
import SetpieceEdit from './DungeonSetpieceEdit';
import { useTranslation } from 'react-i18next';

const DungeonSetpiecesEdit = (props) => {

  const { t } = useTranslation();
  const trapsListPageMode = 'dmwhisper-setpieces-list';
  const [pageMode, setPageMode] = useState(trapsListPageMode);
  
  const selectSetpiece = itemId => setPageMode(itemId);
  const setSetpiecesListMode = () => setPageMode(trapsListPageMode);

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
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>
        <Button startIcon={<ArrowBackIosNewIcon />} onClick={props.returnToMenu} style={{ width: '100%' }} variant="contained" color="primary">{t("Main menu")}</Button>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>
        {
          pageMode === trapsListPageMode ?
          <SetpiecesList selectItem={selectSetpiece} />
          :
          <SetpieceEdit itemId={pageMode} endEditing={setSetpiecesListMode} />
        }
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
    </Grid>
  );
};

export default DungeonSetpiecesEdit;