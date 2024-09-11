import React, { useEffect, useState } from 'react';
//import Grid from '@mui/material/Grid';
import { getDungeonRooms } from '../../../snippets/dungeons/DungeonLib';
import DungeonCanvas from './DungeonCanvas';


export default function DungeonMap(props) {

    const [dungeonRooms, setDungeonRooms] = useState(null);

    useEffect(() => {
        const roomsResult = getDungeonRooms(props.content.data.dungeon.setpiece, props.content.data.dungeon.rooms,
            props.content.data.dungeon.trapSet, props.content.data.dungeon.puzzleSet,
            props.content.data.dungeon.monsterSet, props.content.data.dungeon.treasureSet);

        if (roomsResult.statusMessage === 'success') {
            setDungeonRooms(roomsResult.rooms);
        }
    }, [props.content.data.dungeon.setpiece, props.content.data.dungeon.rooms,
    props.content.data.dungeon.trapSet, props.content.data.dungeon.puzzleSet,
    props.content.data.dungeon.monsterSet, props.content.data.dungeon.treasureSet]);

    const roomTypes = dungeonRooms ? dungeonRooms.map((room, index) => {
        return {
            name: index,
            occurrences: 1
        };
    }) : [];

    return (
        <DungeonCanvas width={props.content.data.dungeon.rooms * 3}
                height={props.content.data.dungeon.rooms * 4}
                roomTypes={roomTypes}
                roomMinSize={3} roomMaxSize={4} />
    );

};