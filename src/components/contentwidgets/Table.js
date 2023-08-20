import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import UpdateIcon from '@mui/icons-material/Update';
import UpdateDisabledIcon from '@mui/icons-material/UpdateDisabled';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { diceThrow, clearContent } from '../../store/slices/content';
import { addThrow } from '../../store/slices/throws';
import { format } from 'date-fns';
import ErrorIcon from '@mui/icons-material/Error';
import CasinoIcon from '@mui/icons-material/Casino';

const Table = (props) => {

  const content = useSelector((st) => st.content);
  const [currentThrow, setCurrentThrow] = useState(null);
  const [error, setError] = useState(null);
  const [autoUpdate, setAutoUpdate] = useState(false);
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

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i > 3) {
        if (autoUpdate) {
          diceRoll();
        }

        i = 0;
      }
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoUpdate]);

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
          <br />
          {
            autoUpdate ?
              <div style={{ width: '100%' }}>
                <div style={{ margin: '1em', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                  <Button onClick={diceRoll} startIcon={<CasinoIcon />} variant='contained'>Roll</Button>
                  <Button onClick={saveRoll} startIcon={<SaveAltIcon />} variant='contained'>Save</Button>
                </div>
                <div style={{ margin: '1em', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                  <Button onClick={() => setAutoUpdate(false)} startIcon={<UpdateDisabledIcon />} variant='contained'>Stop auto update</Button>
                </div>
              </div>
              :
              <div style={{ width: '100%' }}>
                <div style={{ margin: '1em', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                  <Button onClick={diceRoll} startIcon={<CasinoIcon />} variant='contained'>Roll</Button>
                  <Button onClick={saveRoll} startIcon={<SaveAltIcon />} variant='contained'>Save</Button>
                </div>
                <div style={{ margin: '1em', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                  <Button onClick={() => setAutoUpdate(true)} startIcon={<UpdateIcon />} variant='contained'>Auto update</Button>
                </div>
              </div>
          }
        </Stack>
      }
    </Box>
  );

};


export default Table;
