import React from 'react';
import { Grid, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import { useTranslation } from 'react-i18next';

const OutputMenu = () => {

  const { t } = useTranslation();
  const content = useSelector((st) => st.content);
  const contentToExport = JSON.parse(JSON.stringify(content)).lastTableContent = {};

  const copyContentToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(contentToExport));
  };

  const downloadJson = () => {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(contentToExport));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "dmwhisper_data.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  return (
    <Grid container sx={{ overflow: 'scroll', height: '100%' }}>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button sx={{ width: '80%' }} startIcon={<DownloadIcon />} onClick={downloadJson} variant="contained" color="primary">{t("Download content as JSON")}</Button>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button sx={{ width: '80%' }} startIcon={<ContentCopyIcon />} onClick={copyContentToClipboard} variant="contained" color="primary">{t("Copy content as JSON to clipboard")}</Button>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
    </Grid>
  );
};


export default OutputMenu;
