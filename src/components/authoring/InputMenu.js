import React from 'react';
import { useState } from 'react';
import { Grid, Button } from '@mui/material';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import PasteJson from './PasteJson';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ImportJsonFile from './ImportJsonFile';
import { useTranslation } from 'react-i18next';

const InputMenu = () => {

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
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button sx={{width: '80%'}} startIcon={<FileUploadIcon />} onClick={() => setPageMode("importJson")} variant="contained" color="primary">{t("Upload JSON file")}</Button>
          </Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button sx={{width: '80%'}} startIcon={<ContentPasteIcon />} onClick={() => setPageMode('parse')} variant="contained" color="primary">{t("Paste JSON and parse as content")}</Button>
          </Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12}>&nbsp;</Grid>
        </Grid>
      );

    case 'parse':
      return <PasteJson returnToMenu={returnToMenu} />;

    default:
    case 'importJson':
      return <ImportJsonFile returnToMenu={returnToMenu} />;
  }
};


export default InputMenu;
