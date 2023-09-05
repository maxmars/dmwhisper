import { Grid, Button, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setContent, initialState } from '../../store/slices/content';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const PasteJson = (props) => {

  const dispatch = useDispatch();

  const setTables = () => {
    const jsonString = document.getElementById('new-tables').value;

    if (jsonString === '') {
      dispatch(setContent(initialState));
      return;
    }

    const newTables = JSON.parse(jsonString);

    if (newTables.tree && newTables.tables) {
      dispatch(setContent(newTables));
    }

    document.getElementById('new-tables').value = '';
  };

  return (
    <Grid container >
      <Grid item xs={12}>
        <Button startIcon={<ArrowBackIosNewIcon />} onClick={props.returnToMenu} style={{ width: '100%' }} variant="contained" color="primary">Back</Button>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>
        <TextField fullWidth
          id="new-tables"
          label="Paste here a JSON string in DMWhisper format"
          multiline
          rows={10}
          placeholder="JSON string here"
        />
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>
        <Button onClick={setTables} style={{ width: '100%' }} variant="contained" color="primary">Save the Tables</Button>
      </Grid>
    </Grid>
  );
};


export default PasteJson;
