import { useSelector } from 'react-redux';
import { Button, Grid, List, ListItem, ListItemText } from '@mui/material';
import { useDispatch } from 'react-redux';
import { clearThrows } from '../../store/slices/throws';

const ResultsList = () => {

  const throws = useSelector((st) => st.throws);
  const dispatch = useDispatch();

  const onClick = (rowId) => {
    dispatch(clearThrows(rowId));
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {throws.sequence.map((throwResult, index) => {
            return (
              <ListItem key={"ris" + index}>
                <ListItemText primary={throwResult.result} secondary={throwResult.timestamp} />
              </ListItem>
            );
          })}
        </List>
      </Grid>
      <Grid item xs={12}>
        {
          throws.sequence.length > 0 ?
            <Button style={{ width: '100%' }} variant="contained" color="primary" onClick={onClick}>Clean</Button>
            : null
        }
      </Grid>
    </Grid>
  );
};


export default ResultsList;
