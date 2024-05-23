import React from 'react';
import { useState } from 'react';
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

  return (
    <Grid container sx={{height: "100%"}} >
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>
        <Button startIcon={<ArrowBackIosNewIcon />} onClick={props.returnToMenu} style={{ width: '100%' }} variant="contained" color="primary">{t("Main menu")}</Button>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>
        {
          pageMode === setpiecesListPageMode ?
          <SetpiecesList selectSetpiece={selectSetpiece} />
          :
          <SetpieceEdit setpieceId={pageMode} endEditing={setSetpiecesListMode} />
        }
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
    </Grid>
  );
};


export default SetpiecesEdit;
