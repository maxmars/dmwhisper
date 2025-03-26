import { Grid2 as Grid, Button, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setContent, initialState, clearTabPath } from '../../store/slices/content';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';

const PasteJson = (props) => {

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const setTables = () => {
    const jsonString = document.getElementById('new-tables').value;

    if (jsonString === '') {
      dispatch(clearTabPath());
      dispatch(setContent(initialState));
      return;
    }

    const newTables = JSON.parse(jsonString);

    if (newTables.tree && newTables.tables) {
      dispatch(clearTabPath());
      dispatch(setContent(newTables));
    }

    document.getElementById('new-tables').value = '';
  };

  return (
    <Grid container >
      <Grid size={12}>
        <Button startIcon={<ArrowBackIosNewIcon />} onClick={props.returnToMenu} style={{ width: '100%' }} variant="contained" color="primary">{t("Back")}</Button>
      </Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12}>
        <TextField fullWidth
          id="new-tables"
          label={t("Paste here a JSON string in DMWhisper format")}
          multiline
          rows={10}
          placeholder="JSON string here"
        />
      </Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12}>
        <Typography>{t("Warning: ALL existing content will be overwritten!")}</Typography>
      </Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12}>
        <Button onClick={setTables} style={{ width: '100%' }} variant="contained" color="primary">{t("Parse content")}</Button>
      </Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12}>
        <Typography>{t("Tip: importing an empty content will reset current content to the initial values.")}</Typography>
      </Grid>
    </Grid>
  );
};


export default PasteJson;
