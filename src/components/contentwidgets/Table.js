import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { diceThrow } from '../../store/slices/content';
import { addThrow } from '../../store/slices/throws';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';

const Table = (props) => {

  const content = useSelector((st) => st.content);
  const prefix = props.content.data.prefix ? props.content.data.prefix + " " : "";
  const postfix = props.content.data.postfix ? " " + props.content.data.postfix : "";
  const [currentThrow, setCurrentThrow] = useState(prefix + diceThrow(content, props.content.data.table) + postfix);
  const dispatch = useDispatch();

  const saveRoll = () => {
      dispatch(addThrow({ result: currentThrow, timestamp: format(new Date(), "yyyy-MM-dd' 'HH:mm:ss") }));
  };


  const diceRoll = () => {
    const prefix = props.content.data.prefix ? props.content.data.prefix + " " : "";
    const postfix = props.content.data.postfix ? " " + props.content.data.postfix : "";  
    setCurrentThrow(prefix + diceThrow(content, props.content.data.table) + postfix);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2} direction="column"
        justifyContent="space-evenly"
        alignItems="center">
        <div>{props.content.data.textContent}</div>
        <div>{currentThrow}</div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <Button onClick={diceRoll} startIcon={<PlayArrowIcon />} variant='contained'>Roll again</Button>
          <Button onClick={saveRoll} startIcon={<SaveAltIcon />} variant='contained'>Save</Button>
        </div>
      </Stack>
    </Box>
  );

};


export default Table;
