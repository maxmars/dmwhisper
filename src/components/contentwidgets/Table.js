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
import { diceThrow, getTable } from '../../store/slices/content';
import { addThrow } from '../../store/slices/throws';
import { format } from 'date-fns';
import ErrorIcon from '@mui/icons-material/Error';
import CasinoIcon from '@mui/icons-material/Casino';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import useTheme from '@mui/private-theming/useTheme';
import { useTranslation } from 'react-i18next';
import { padLeft } from '../../utils';

const Table = (props) => {

  const { t } = useTranslation();
  const content = useSelector((st) => st.content);
  const [mode, setMode] = useState("rockandroll");
  const [currentThrow, setCurrentThrow] = useState(null);
  const [currentHtmlContent, setCurrentHtmlContent] = useState(props.content && props.content.data ? props.content.data.textContent : "");
  const [error, setError] = useState(null);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();
  const multipleTables = props.content && props.content.data && props.content.data.table ? props.content.data.table.indexOf(" ") > -1 : false;

  const saveRoll = () => {
    const contentToSave = currentThrow && currentThrow.length > 0 ? currentThrow : currentHtmlContent;
    dispatch(addThrow({ result: contentToSave, timestamp: format(new Date(), "yyyy-MM-dd' 'HH:mm:ss") }));
  };

  const resetError = () => {
    setError(null);
  };

  const diceRoll = () => {

    if (props.content && props.content.data && props.content.data.textContent && props.content.data.textContent.indexOf("@@") > -1) {

      let tables = props.content.data.table.trim().split(" ");

      tables = tables.map((table) => {
        return diceThrow(content, table);
      });

      let htmlContent = props.content.data.textContent;
      tables.forEach((table, index) => {
        htmlContent = htmlContent.replace("@@" + padLeft(index + 1, 2), table);
      });
      setCurrentHtmlContent(htmlContent);
      setCurrentThrow("");

    } else {
      const prefix = props.content.data.prefix ? props.content.data.prefix + " " : "";
      const postfix = props.content.data.postfix ? " " + props.content.data.postfix : "";
      try {
        setCurrentThrow(prefix + diceThrow(content, props.content.data.table.trim()) + postfix);
        let htmlContent = props.content.data.textContent;
        setCurrentHtmlContent(htmlContent);
      } catch (e) {
        setError(e.message);
      }
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

  useEffect(() => {
    diceRoll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.content.data.table]);

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
            <div>{t("Content Error:")} {error}. {t("Please check content for errors.")}</div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <Button onClick={resetError} startIcon={<ErrorIcon />} variant='contained'>{t("Dismiss")}</Button>
            </div>
          </Stack>
          :
          <Stack spacing={2} direction="column"
            justifyContent="space-evenly"
            alignItems="center">
            <div dangerouslySetInnerHTML={{ __html: currentHtmlContent }} />
            {currentThrow && currentThrow.length > 0 ? <div>{currentThrow}</div> : null}
            <br />
            <div style={{ width: '100%' }}>
              <div style={{ margin: '1em', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <Button onClick={diceRoll} startIcon={<CasinoIcon />} variant='contained'>{t("Roll")}</Button>
                <Button onClick={saveRoll} startIcon={<SaveAltIcon />} variant='contained'>{t("Save")}</Button>
              </div>
              <div style={{ margin: '1em', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <Button disabled={multipleTables} onClick={() => setMode("consult")} startIcon={<MenuBookIcon />} variant='contained'>{t("Browse")}</Button>
                {
                  autoUpdate ?
                    <Button onClick={() => setAutoUpdate(false)} startIcon={<UpdateDisabledIcon />} variant='contained'>{t("Stop auto update")}</Button>
                    :
                    <Button onClick={() => setAutoUpdate(true)} startIcon={<UpdateIcon />} variant='contained'>{t("Auto update")}</Button>
                }
              </div>
            </div>
          </Stack>
        }
      </Box>
    );
  } else {
    try {
      const table = getTable(content, props.content.data.table.trim());
      const items = table.rng.map(item => {
        return <>
          <Grid item xs={3} key={"dice" + item.min + "-" + item.max} style={{ display: "flex", justifyContent: "flex-end" }} >
            <div style={{ marginRight: "1em" }}>{item.min}-{item.max}</div>
          </Grid>
          <Grid item xs={9} key={"result" + item.min + "-" + item.max}>
            <div>{item.result ? item.result : item.table}</div>
          </Grid>
        </>
      });

      return <>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={3} style={{ display: "flex", justifyContent: "flex-end" }} bgcolor={theme.palette.warning.main} color={theme.palette.warning.contrastText}>
            <div style={{ marginRight: "1em" }}>{t("Roll")}</div>
          </Grid>
          <Grid item xs={9} bgcolor={theme.palette.warning.main} color={theme.palette.warning.contrastText}>
            <div>{t("Description")}</div>
          </Grid>
          {items}
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12} style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <Button onClick={() => setMode("rockandroll")} startIcon={<CasinoIcon />} variant='contained'>{t("Return to rolling mode")}</Button>
          </Grid>
          <Grid item xs={12}>&nbsp;</Grid>
        </Grid>
      </>;
    } catch (e) {
      return null;
    }
  }
};


export default Table;
