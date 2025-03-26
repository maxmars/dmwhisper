import React from 'react';
import { Grid2 as Grid, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import { useTranslation } from 'react-i18next';
import { downloadJson } from '../../utils';

const OutputMenu = () => {

  const { t } = useTranslation();
  const content = useSelector((st) => st.content);
  const contentToExport = JSON.parse(JSON.stringify(content));
  contentToExport.lastTableContent = {};

  const copyContentToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(contentToExport));
  };

  return (
    <Grid container sx={{ overflow: 'scroll', height: '100%' }}>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button sx={{ width: '80%' }} startIcon={<DownloadIcon />} onClick={() => downloadJson(contentToExport)} variant="contained" color="primary">{t("Download content as JSON")}</Button>
      </Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button sx={{ width: '80%' }} startIcon={<ContentCopyIcon />} onClick={copyContentToClipboard} variant="contained" color="primary">{t("Copy content as JSON to clipboard")}</Button>
      </Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12}>&nbsp;</Grid>
    </Grid>
  );
};


export default OutputMenu;
