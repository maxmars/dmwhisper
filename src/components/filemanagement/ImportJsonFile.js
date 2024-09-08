import * as React from 'react';
import { Grid, Button, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setContent, clearTabPath } from '../../store/slices/content';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useTranslation } from 'react-i18next';
import { MuiFileInput } from 'mui-file-input'

const ImportJsonFile = (props) => {

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [jsonFile, setJsonFile] = React.useState(null)

  const handleChange = async (newValue) => {
    setJsonFile(newValue);
    const jsonText = await newValue.text();
    dispatch(clearTabPath());

    const newDataFile = JSON.parse(jsonText);
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
        <Typography>{t("Tap to select a JSON file to import")}</Typography>
      </Grid>
      <Grid item xs={12}>
        <MuiFileInput style={{width: '100%'}} getInputText={(value) => value ? value.name : t('Tap to select a file to import') } inputProps={{ accept: '.json' }} value={jsonFile} onChange={handleChange} />
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>
        <Typography>{t("Warning: ALL existing content will be overwritten!")}</Typography>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
    </Grid>
  );
};


export default ImportJsonFile;
