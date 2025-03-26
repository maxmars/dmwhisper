import React from 'react';
import { useState, useEffect } from 'react';
import { Grid, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SetpiecesList from './SetpiecesList';
import SetpieceEdit from './SetpieceEdit';
import { useTranslation } from 'react-i18next';

const SetpiecesEdit = (props) => {

  const { t } = useTranslation();
  const setpiecesListPageMode = 'dmwhisper-setpieces-list';
  const [pageMode, setPageMode] = useState(setpiecesListPageMode);
  
  const selectSetpiece = setpieceId => setPageMode(setpieceId);
  const setSetpiecesListMode = () => setPageMode(setpiecesListPageMode);

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
          pageMode === setpiecesListPageMode ?
          <SetpiecesList selectSetpiece={selectSetpiece} />
          :
          <SetpieceEdit setpieceId={pageMode} endEditing={setSetpiecesListMode} />
        }
      </Grid>
      <Grid size={12}>&nbsp;</Grid>
    </Grid>
  );
};


export default SetpiecesEdit;
