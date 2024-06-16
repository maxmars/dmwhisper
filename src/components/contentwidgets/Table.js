import * as React from 'react';
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import UpdateIcon from '@mui/icons-material/Update';
import UpdateDisabledIcon from '@mui/icons-material/UpdateDisabled';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { diceThrow, getTable, setLastTableContent, rollAndReplace, mergeContentAndTables } from '../../store/slices/content';
import { addThrow } from '../../store/slices/throws';
import { format } from 'date-fns';
import ErrorIcon from '@mui/icons-material/Error';
import CasinoIcon from '@mui/icons-material/Casino';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import useTheme from '@mui/private-theming/useTheme';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';

export default function Table(props) {

  //#region Component initialization
  const { t } = useTranslation();
  const content = useSelector((st) => st.content);
  const [mode, setMode] = useState("rockandroll");
  const [currentThrow, setCurrentThrow] = useState(null);
  const [currentHtmlContent, setCurrentHtmlContent] = useState(null);
  const [error, setError] = useState(null);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();
  const multipleTables = props.content && props.content.data && props.content.data.table ? props.content.data.table.indexOf(" ") > -1 : false;
  const [minDieValue, setMinDieValue] = useState(null);
  const [maxDieValue, setMaxDieValue] = useState(null);
  //#endregion

  //#region Component functions
  const saveRoll = () => {
    const contentToSave = currentThrow && currentThrow.length > 0 ? currentThrow : currentHtmlContent;
    dispatch(addThrow({ result: contentToSave, timestamp: format(new Date(), "yyyy-MM-dd' 'HH:mm:ss") }));
  };

  const resetError = () => {
    setError(null);
  };

  const getCurrentContents = () => {
    if (props.content && props.content.data) {
      if (props.content.data.textContent && props.content.data.textContent.indexOf("@@") > -1) {

        let tables = props.content.data.table.trim().split(" ");

        try {
          let htmlContent = mergeContentAndTables(props.content.data.textContent, tables, content, minDieValue, maxDieValue);

          return {
            throw: "",
            htmlContent: htmlContent
          };
        } catch (e) {
          setError(e.message);

          return {
            throw: "",
            htmlContent: ""
          };
        }

      } else {
        const prefix = props.content.data.prefix ? props.content.data.prefix + " " : "";
        const postfix = props.content.data.postfix ? " " + props.content.data.postfix : "";
        try {
          let htmlContent = props.content.data.textContent;
          let tables = props.content.data.table.trim().split(" ");

          return {
            throw: rollAndReplace(prefix +
              diceThrow(content, props.content.data.table.trim(), tables, minDieValue, maxDieValue) +
              postfix),
            htmlContent: rollAndReplace(htmlContent)
          };
        } catch (e) {
          setError(e.message);

          return {
            throw: "",
            htmlContent: ""
          };
        }
      }
    }
  }

  const diceRoll = () => {

    const currentContents = getCurrentContents();

    dispatch(setLastTableContent({
      contentId: props.content.id + "TAB" + props.currentTab,
      diceThrow: currentContents.throw,
      htmlContent: currentContents.htmlContent
    }));

    setCurrentThrow(currentContents.throw);
    setCurrentHtmlContent(currentContents.htmlContent);

  };
  //#endregion

  //#region Component lifecycle
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

  const getLastContentOrRoll = () => {
    try {
      const cleanedId = props.content.id.replace(/[^0-9a-zA-Z]/g, '') + "TAB" + props.currentTab;
      const lastTableContent = content.lastTableContent[cleanedId] ? content.lastTableContent[cleanedId] : null;

      setMode("rockandroll");

      if (lastTableContent) {
        setCurrentThrow(lastTableContent.diceThrow);
        setCurrentHtmlContent(lastTableContent.htmlContent);
      } else {
        diceRoll();
      }
    } catch (e) {
      diceRoll();
    }
  }

  useEffect(() => {
    getLastContentOrRoll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.content.id, props.content.data.table, props.currentTab]);

  useEffect(() => {
    getLastContentOrRoll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Component rendering
  if (currentThrow === null && error === null) {
    getLastContentOrRoll();
    return null;
  }

  try {
    if (!multipleTables) {
      if (minDieValue === null || maxDieValue === null) {
        setMinDieValue(1);

        let maxTempDieValue = 1;
        const table = getTable(content, props.content.data.table.trim());

        table.rng.forEach(item => {
          if (item.max > maxTempDieValue) {
            maxTempDieValue = item.max;
          }
        });

        setMaxDieValue(maxTempDieValue);

        return null;
      }
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
              <div style={{ width: '100%' }}>
                <div style={{ margin: '1em', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', gap: '5%', alignItems: 'center' }}>
                  <Button onClick={diceRoll} startIcon={<CasinoIcon />} variant='contained' sx={{ width: "30%" }}>{t("Roll")}</Button>
                  {multipleTables ? <Button onClick={saveRoll} startIcon={<SaveAltIcon />} variant='contained'>{t("Save")}</Button>
                    :
                    <>
                      <Typography sx={{ width: "35%", display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>{t("Min")}:
                        <TextField
                          value={minDieValue}
                          onChange={(event) => {
                            const value = parseInt(event.target.value.trim());
                            if (value > 0) {
                              setMinDieValue(value);
                            }
                          }}
                          id="min-die-value"
                          variant="outlined" sx={{ width: "60%" }} />
                      </Typography>
                      <Typography sx={{ width: "35%", display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>{t("Max")}:
                        <TextField
                          value={maxDieValue}
                          onChange={(event) => {
                            const value = parseInt(event.target.value.trim());
                            if (value >= minDieValue) {
                              setMaxDieValue(value);
                            }
                          }}
                          id="max-die-value"
                          variant="outlined" sx={{ width: "60%" }} />
                      </Typography>
                    </>
                  }
                </div>
              </div>
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
        const items = table.rng.toSorted((a, b) => a.min - b.min).map(item => {
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
  } catch (e) {
    return null;
  }
  //#endregion

};
