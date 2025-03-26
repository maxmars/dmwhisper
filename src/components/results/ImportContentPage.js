import * as React from 'react';
import { Grid, Button, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useTranslation } from 'react-i18next';
import { MuiFileInput } from 'mui-file-input'
import { addThrow } from '../../store/slices/throws.js';
import { format } from 'date-fns';


const ImportContentPage = ({ showSavedResults }) => {

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [jsonSaveFile, setJsonSaveFile] = React.useState(null)

  const handleSingleContentImport = async (newValue) => {
    setJsonSaveFile(newValue);
    const jsonText = await newValue.text();
    const singleSavedContent = JSON.parse(jsonText);

    if (!singleSavedContent.contentData || !singleSavedContent.contentType) {
      showSavedResults();
      return;
    }

    dispatch(addThrow({ result: singleSavedContent.contentData, timestamp: format(new Date(), "yyyy-MM-dd' 'HH:mm:ss") }));
    showSavedResults();
  }

  return (
    <Grid container >
      <Grid size={12}>
        <Button startIcon={<ArrowBackIosNewIcon />} onClick={showSavedResults} style={{ width: '100%' }} variant="contained" color="primary">{t("Back")}</Button>
      </Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12}>
        <Typography>{t("Importazione di un singolo contenuto (schede personaggio, mappe, dungeon..)")}. {t("Tap to select a JSON file to import")}.</Typography>
      </Grid>
      <Grid size={12}>
        <MuiFileInput style={{ width: '100%' }} getInputText={(value) => value ? value.name : t('Tap to select a file to import')} inputProps={{ accept: '.json' }} value={jsonSaveFile} onChange={handleSingleContentImport} />
      </Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12}>
          <Button startIcon={<ArrowBackIosNewIcon />} onClick={showSavedResults} style={{ width: '100%' }} variant="contained" color="primary">{t("Back")}</Button>
        </Grid>
    </Grid>
  );
};


export default ImportContentPage;
