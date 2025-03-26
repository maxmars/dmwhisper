import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@mui/material';
import { Typography } from '@mui/material';


export default function DungeonSetup(props) {

  const { t } = useTranslation();
  const dungeonSetpieces = useSelector((st) => st.content.dungeonSetpieces);
  const dungeonMonsterSets = useSelector((st) => st.content.dungeonMonsterSets);
  const dungeonTrapSets = useSelector((st) => st.content.dungeonTrapSets);
  const dungeonTreasureSets = useSelector((st) => st.content.dungeonTreasureSets);
  const dungeonPuzzleSets = useSelector((st) => st.content.dungeonPuzzleSets);

  const dungeonSetpiecesNames = useMemo(
    () => dungeonSetpieces.map((item) => {
      return {
        label: item.id,
      }
    }).sort((a, b) => a.label.localeCompare(b.label)),
    [dungeonSetpieces],
  );

  const dungeonMonsterSetsNames = useMemo(
    () => dungeonMonsterSets.map((item) => {
      return {
        label: item.id,
      }
    }).sort((a, b) => a.label.localeCompare(b.label)),
    [dungeonMonsterSets],
  );

  const dungeonTrapSetsNames = useMemo(
    () => dungeonTrapSets.map((item) => {
      return {
        label: item.id,
      }
    }).sort((a, b) => a.label.localeCompare(b.label)),
    [dungeonTrapSets],
  );

  const dungeonTreasureSetsNames = useMemo(
    () => dungeonTreasureSets.map((item) => {
      return {
        label: item.id,
      }
    }).sort((a, b) => a.label.localeCompare(b.label)),
    [dungeonTreasureSets],
  );

  const dungeonPuzzleSetsNames = useMemo(
    () => dungeonPuzzleSets.map((item) => {
      return {
        label: item.id,
      }
    }).sort((a, b) => a.label.localeCompare(b.label)),
    [dungeonPuzzleSets],
  );

  return (
    <Grid container sx={{ width: '100%' }}>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12}><Typography>{t("Dungeon data")}</Typography></Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12} sx={{ display: 'flex', alignItems: 'center' }}>
        <Autocomplete
          disablePortal
          id="setpiecesIDs"
          options={dungeonSetpiecesNames}
          sx={{ width: '100%' }}
          value={props.setpieceId}
          onChange={(event, newValue) => {
            try {
              props.onDungeonSetpieceIdChanged(newValue.label);
            } catch (e) {
              // nothing
            }
          }}
          renderInput={(params) => <TextField {...params} label={t("Dungeon set piece id") + ".."} />}
        />
      </Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12}>
          <TextField
            type="number"
            onChange={(event) => props.onDungeonRoomsChanged(event.target.value)}
            value={props.rooms}
            id="new-rooms-number"
            label={t("Number of rooms")}
            variant="outlined"
            sx={{ width: "100%" }} />
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
      <Grid size={12} sx={{ display: 'flex', alignItems: 'center' }}>
        <Autocomplete
          disablePortal
          id="monstersIDs"
          options={dungeonMonsterSetsNames}
          sx={{ width: '100%' }}
          value={props.monsterSetId}
          onChange={(event, newValue) => {
            try {
              props.onDungeonMonsterSetIdChanged(newValue.label);
            } catch (e) {
              // nothing
            }
          }}
          renderInput={(params) => <TextField {...params} label={t("Dungeon monster set id") + ".."} />}
        />
      </Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12} sx={{ display: 'flex', alignItems: 'center' }}>
        <Autocomplete
          disablePortal
          id="treasuresIDs"
          options={dungeonTreasureSetsNames}
          sx={{ width: '100%' }}
          value={props.treasureSetId}
          onChange={(event, newValue) => {
            try {
              props.onDungeonTreasureSetIdChanged(newValue.label);
            } catch (e) {
              // nothing
            }
          }}
          renderInput={(params) => <TextField {...params} label={t("Dungeon treasure set id") + ".."} />}
        />
      </Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12} sx={{ display: 'flex', alignItems: 'center' }}>
        <Autocomplete
          disablePortal
          id="trapsIDs"
          options={dungeonTrapSetsNames}
          sx={{ width: '100%' }}
          value={props.trapSetId}
          onChange={(event, newValue) => {
            try {
              props.onDungeonTrapSetIdChanged(newValue.label);
            } catch (e) {
              // nothing
            }
          }}
          renderInput={(params) => <TextField {...params} label={t("Dungeon trap set id") + ".."} />}
        />
      </Grid>
      <Grid size={12}>&nbsp;</Grid>
      <Grid size={12} sx={{ display: 'flex', alignItems: 'center' }}>
        <Autocomplete
          disablePortal
          id="puzzlesIDs"
          options={dungeonPuzzleSetsNames}
          sx={{ width: '100%' }}
          value={props.puzzleSetId}
          onChange={(event, newValue) => {
            try {
              props.onDungeonPuzzleSetIdChanged(newValue.label);
            } catch (e) {
              // nothing
            }
          }}
          renderInput={(params) => <TextField {...params} label={t("Dungeon puzzle set id") + ".."} />}
        />
      </Grid>
      <Grid size={12}>&nbsp;</Grid>
    </Grid>
  );
}

