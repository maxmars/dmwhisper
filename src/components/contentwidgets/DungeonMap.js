import * as React from 'react';
import Grid from '@mui/material/Grid';
import { getDungeonRooms } from '../../snippets/DungeonLib';


export default function DungeonMap(props) {

    getDungeonRooms(props.content.data.dungeon.setpiece, props.content.data.dungeon.rooms, 
        props.content.data.dungeon.trapSet, props.content.data.dungeon.puzzleSet, 
        props.content.data.dungeon.monsterSet, props.content.data.dungeon.treasureSet);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Grid
                container
                sx={{
                    marginLeft: '20px',
                    marginRight: '20px',
                    height: '75%',
                    width: '97vw',
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Grid item xs={12}>
                    This is a {props.content.type} content test
                </Grid>
                <Grid item xs={12}>&nbsp;</Grid>
                <Grid item xs={4}>
                    Id: {props.content.id}
                </Grid>
                <Grid item xs={8}>
                    Label: {props.content.label}
                </Grid>
                <Grid item xs={12}>&nbsp;</Grid>
                <Grid item xs={8}>
                    Dungeon setpiece: {props.content.data.dungeon.setpiece}
                </Grid>
                <Grid item xs={4}>
                    rooms: {props.content.data.dungeon.rooms}
                </Grid>
                <Grid item xs={12}>&nbsp;</Grid>
                <Grid item xs={12}>
                    Monster set: {props.content.data.dungeon.monsterSet}
                </Grid>
                <Grid item xs={12}>&nbsp;</Grid>
                <Grid item xs={12}>
                    Trap set: {props.content.data.dungeon.trapSet}
                </Grid>
                <Grid item xs={12}>&nbsp;</Grid>
                <Grid item xs={12}>
                    Treasure set: {props.content.data.dungeon.treasureSet}
                </Grid>
                <Grid item xs={12}>&nbsp;</Grid>
                <Grid item xs={12}>
                    Puzzle set: {props.content.data.dungeon.puzzleSet}
                </Grid>
                <Grid item xs={12}>&nbsp;</Grid>
            </Grid>
      </div>
    );

};