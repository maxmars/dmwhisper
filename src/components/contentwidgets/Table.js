import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { diceThrow, clearContent } from '../../store/slices/content';
import { addThrow } from '../../store/slices/throws';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import ErrorIcon from '@mui/icons-material/Error';

const Table = (props) => {

  const content = useSelector((st) => st.content);
  const [currentThrow, setCurrentThrow] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const saveRoll = () => {
    dispatch(addThrow({ result: currentThrow, timestamp: format(new Date(), "yyyy-MM-dd' 'HH:mm:ss") }));
  };

  const resetError = () => {
    dispatch(clearContent());
    setError(null);
  };

  const diceRoll = () => {
    const prefix = props.content.data.prefix ? props.content.data.prefix + " " : "";
    const postfix = props.content.data.postfix ? " " + props.content.data.postfix : "";
    try {
      setCurrentThrow(prefix + diceThrow(content, props.content.data.table) + postfix);
    } catch (e) {
      setError(e.message);
    }
  };

  if (currentThrow === null && error === null) {
    diceRoll();
    return null;
  }

  return (
    <Box sx={{ width: '100%' }}>
      {error ?
        <Stack spacing={2} direction="column"
          justifyContent="space-evenly"
          alignItems="center">
          <div>Content Error: {error}. Resetting content to the default one.</div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <Button onClick={resetError} startIcon={<ErrorIcon />} variant='contained'>Dismiss</Button>
          </div>
        </Stack>
        :
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
      }
    </Box>
  );

};


export default Table;
