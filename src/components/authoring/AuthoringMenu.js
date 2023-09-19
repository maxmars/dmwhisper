import React from 'react';
import { useState } from 'react';
import { Grid, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PasteJson from './PasteJson';
import TablesEdit from './TablesEdit';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import TableChartIcon from '@mui/icons-material/TableChart';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import MenuEdit from './MenuEdit';
import { useTranslation } from 'react-i18next';

const AuthoringMenu = () => {

  const { t } = useTranslation();
  const content = useSelector((st) => st.content);

  const [pageMode, setPageMode] = useState('menu');

  const returnToMenu = () => {
    setPageMode('menu');
  };

  const copyContentToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(content));
  };

  const downloadJson = () => {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(content));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "dmwhisper_data.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  switch (pageMode) {
    case 'menu':
      return (
        <Grid container sx={{ overflow: 'scroll' }}>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button startIcon={<AccountTreeIcon />} onClick={() => setPageMode('menuedit')} variant="contained" color="primary">{t("Edit content tree")}</Button>
          </Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button startIcon={<TableChartIcon />} onClick={() => setPageMode('tablesedit')} variant="contained" color="primary">{t("Edit content tables")}</Button>
          </Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button startIcon={<ContentCopyIcon />} onClick={copyContentToClipboard} variant="contained" color="primary">{t("Copy content as JSON to clipboard")}</Button>
          </Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button startIcon={<ContentPasteIcon />} onClick={() => setPageMode('parse')} variant="contained" color="primary">{t("Paste JSON and parse as content")}</Button>
          </Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button startIcon={<DownloadIcon />} onClick={downloadJson} variant="contained" color="primary">{t("Download content as JSON")}</Button>
          </Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button startIcon={<FileUploadIcon />} variant="contained" color="primary">{t("Upload JSON file")}</Button>
          </Grid>
        </Grid>
      );

    case 'parse':
      return <PasteJson returnToMenu={returnToMenu} />;

    case 'tablesedit':
      return <TablesEdit returnToMenu={returnToMenu} />;

    case 'menuedit':
    default:
      return <MenuEdit returnToMenu={returnToMenu} />;
  }
};


export default AuthoringMenu;
