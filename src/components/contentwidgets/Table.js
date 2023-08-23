import * as React from 'react';
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import UpdateIcon from '@mui/icons-material/Update';
import UpdateDisabledIcon from '@mui/icons-material/UpdateDisabled';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { diceThrow, clearContent, getTable } from '../../store/slices/content';
import { addThrow } from '../../store/slices/throws';
import { format } from 'date-fns';
import ErrorIcon from '@mui/icons-material/Error';
import CasinoIcon from '@mui/icons-material/Casino';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const Table = (props) => {

  const content = useSelector((st) => st.content);
  const [mode, setMode] = useState("rockandroll");
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

  if (mode === "rockandroll") {
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
            <div style={{ width: '100%' }}>
              <div style={{ margin: '1em', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <Button onClick={diceRoll} startIcon={<CasinoIcon />} variant='contained'>Roll</Button>
                <Button onClick={saveRoll} startIcon={<SaveAltIcon />} variant='contained'>Save</Button>
              </div>
              <div style={{ margin: '1em', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <Button onClick={() => setMode("consult")} startIcon={<MenuBookIcon />} variant='contained'>Consult</Button>
                {
                  autoUpdate ?
                    <Button onClick={() => setAutoUpdate(false)} startIcon={<UpdateDisabledIcon />} variant='contained'>Stop auto update</Button>
                    :
                    <Button onClick={() => setAutoUpdate(true)} startIcon={<UpdateIcon />} variant='contained'>Auto update</Button>
                }
              </div>
            </div>
          </Stack>
        }
      </Box>
    );
  } else {
    const table = getTable(content, props.content.data.table);
    const items = table.rng.map(item => {
      return <>
        <Grid item xs={3}>
          <div>{item.min}-{item.max}</div>
        </Grid>
        <Grid item xs={9}>
          <div>{item.result ? item.result : item.table}</div>
        </Grid>
      </>
    });

    return <>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={3}>
          <div>Die</div>
        </Grid>
        <Grid item xs={9}>
          <div>Description</div>
        </Grid>
        {items}
        <Grid item xs={12}>&nbsp;
        </Grid>
        <Grid item xs={12} style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <Button onClick={() => setMode("rockandroll")} startIcon={<CasinoIcon />} variant='contained'>Return to rolling mode</Button>
        </Grid>
      </Grid>
    </>;
  }

};


export default Table;
