import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid2 as Grid } from '@mui/material';
import { Typography } from '@mui/material';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';


export default function MapSetup(props) {

  const { t } = useTranslation();
  const setpieces = useSelector((st) => st.content.setpieces);

  const setpiecesNames = useMemo(
    () => setpieces.map((item) => {
      return {
        label: item.id,
      }
    }),
    [setpieces],
  );

  return (
    <Grid container sx={{ width: '100%' }}>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12}><Typography>{t("Map data")}</Typography></Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12} sx={{ display: 'flex', alignItems: 'center' }}>
        <Autocomplete
          disablePortal
          id="setpiecesIDs"
          options={setpiecesNames}
          sx={{ width: '100%' }}
          value={props.setpieceId}
          onChange={(event, newValue) => {
            props.onSetpieceIdChanged(newValue.label);
          }}
          renderInput={(params) => <TextField {...params} label={t("Set piece id") + ".."} />}
        />
      </Grid>
      <Grid size={12}>&nbsp;</Grid>
      <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">{t("Density")}</FormLabel>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={props.density}
          onChange={(event) => props.onDensityChanged(event.target.value)}
        >
          <FormControlLabel value="1" control={<Radio />} label={t("Low")} />
          <FormControlLabel value="2" control={<Radio />} label={t("Mid")} />
          <FormControlLabel value="3" control={<Radio />} label={t("High")} />
        </RadioGroup>
      </FormControl>
      <Grid size={12}>&nbsp;</Grid>
      <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">{t("Grid size")}</FormLabel>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={props.gridsize}
          onChange={(event) => props.onGridsizeChanged(event.target.value)}
        >
          <FormControlLabel value="1" control={<Radio />} label="3x3" />
          <FormControlLabel value="2" control={<Radio />} label="4x4" />
          <FormControlLabel value="3" control={<Radio />} label="5x5" />
        </RadioGroup>
      </FormControl>
    </Grid>
  );
}

