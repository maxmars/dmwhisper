import * as React from 'react';
import { Grid, Button, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setContent, clearTabPath } from '../../store/slices/content';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useTranslation } from 'react-i18next';
import { MuiFileInput } from 'mui-file-input'
import { addThrow } from '../../store/slices/throws.js';
import { format } from 'date-fns';


const ImportJsonFile = (props) => {

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [jsonSaveFile, setJsonSaveFile] = React.useState(null)
  const [jsonFile, setJsonFile] = React.useState(null)

  const handleSingleContentImport = async (newValue) => {
    setJsonSaveFile(newValue);
    const jsonText = await newValue.text();
    const singleSavedContent = JSON.parse(jsonText);

    if (!singleSavedContent.contentData || !singleSavedContent.contentType) {
      props.returnToMenu();
      return;
    }

    dispatch(addThrow({ result: singleSavedContent.contentData, timestamp: format(new Date(), "yyyy-MM-dd' 'HH:mm:ss") }));
    props.returnToMenu();
  }

  const handleSandboxImport = async (newValue) => {
    setJsonFile(newValue);
    const jsonText = await newValue.text();
    dispatch(clearTabPath());

    const newDataFile = JSON.parse(jsonText);

    if (!newDataFile.tree || !newDataFile.tables) {
      props.returnToMenu();
      return;
    }

    newDataFile.lastTableContent = {};
    
    dispatch(setContent(newDataFile));
    props.returnToMenu();
  }

  return (
    <Grid container >
      <Grid item xs={12}>
        <Button startIcon={<ArrowBackIosNewIcon />} onClick={props.returnToMenu} style={{ width: '100%' }} variant="contained" color="primary">{t("Back")}</Button>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>
        <Typography>{t("Importazione di un singolo contenuto (schede personaggio, mappe, dungeon..)")}. {t("Tap to select a JSON file to import")}.</Typography>
      </Grid>
      <Grid item xs={12}>
        <MuiFileInput style={{width: '100%'}} getInputText={(value) => value ? value.name : t('Tap to select a file to import') } inputProps={{ accept: '.json' }} value={jsonSaveFile} onChange={handleSingleContentImport} />
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>
        <Typography>{t("Importazione di una intera sandbox")}. {t("Tap to select a JSON file to import")}. {t("Warning: ALL existing content will be overwritten!")}</Typography>
      </Grid>
      <Grid item xs={12}>
        <MuiFileInput style={{width: '100%'}} getInputText={(value) => value ? value.name : t('Tap to select a file to import') } inputProps={{ accept: '.json' }} value={jsonFile} onChange={handleSandboxImport} />
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
    </Grid>
  );
};


export default ImportJsonFile;
