import React, { useEffect, useState } from 'react';
//import Grid from '@mui/material/Grid';
import { getDungeonRooms } from '../../../snippets/dungeons/DungeonLib';
import DungeonCanvas from './DungeonCanvas';
import { Dungeon } from '../../../snippets/dungeons/Dungeon.js';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


export default function DungeonMap(props) {

    const DungeonCreate = (rooms) => {

        try {
            const dungeonWidth = props.content.data.dungeon.rooms * 3;
            const dungeonHeight = props.content.data.dungeon.rooms * 4;

            const roomTypes = rooms ? rooms.map((room, index) => {
                return {
                    name: index,
                    occurrences: 1
                };
            }) : [];

            const newDungeon = new Dungeon(dungeonWidth, dungeonHeight, roomTypes);
            newDungeon.generateRooms(3, 4);
            return newDungeon;
        } catch (e) {
            return null;
        }
    }

    const [dungeonRooms, setDungeonRooms] = useState(null);
    const [dungeon, setDungeon] = useState(DungeonCreate(null));
    const [roomContentsDialogOpen, setRoomContentsDialogOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(0);
    const { t } = useTranslation();

    useEffect(() => {
        try {
            setDungeon(DungeonCreate(dungeonRooms));
        } catch (e) {
            console.error(e);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.content.data.dungeon.rooms, dungeonRooms]);

    useEffect(() => {
        try {
            const roomsResult = getDungeonRooms(props.content.data.dungeon.setpiece, props.content.data.dungeon.rooms,
                props.content.data.dungeon.trapSet, props.content.data.dungeon.puzzleSet,
                props.content.data.dungeon.monsterSet, props.content.data.dungeon.treasureSet);

            if (roomsResult.statusMessage === 'success') {
                setDungeonRooms(roomsResult.rooms);
            }
        } catch (e) {
            console.error(e);
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

    const onRoomSelect = (room) => {
        setSelectedRoom(room);
    }

    const onInfoClick = () => {
        setRoomContentsDialogOpen(true);
    }

    const getRoomInfoDialog = () => {
        try {
            return (
                <Dialog onClose={(e) => setRoomContentsDialogOpen(false)} open={roomContentsDialogOpen}>
                    <DialogTitle>{dungeonRooms[selectedRoom].description}</DialogTitle>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Typography>{t('Room Description')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <div dangerouslySetInnerHTML={{ __html: dungeonRooms[selectedRoom].textContent }} />
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                        >
                            <Typography>{t('Monsters') + ': ' + dungeonRooms[selectedRoom].monster.description}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <div dangerouslySetInnerHTML={{ __html: dungeonRooms[selectedRoom].monster.textContent }} />
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                        >
                            <Typography>{t('Traps')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <div dangerouslySetInnerHTML={{ __html: dungeonRooms[selectedRoom].trap.textContent }} />
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                        >
                            <Typography>{t('Treasures')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <div dangerouslySetInnerHTML={{ __html: dungeonRooms[selectedRoom].treasure.textContent }} />
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                        >
                            <Typography>{t('Puzzles') + ': ' + dungeonRooms[selectedRoom].puzzle.description}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <div dangerouslySetInnerHTML={{ __html: dungeonRooms[selectedRoom].puzzle.textContent }} />
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Dialog>
            );
        } catch (e) {
            return null;
        }
    }

    try {
        return (
            <Grid container >
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    {getRoomInfoDialog()}
                </Grid>
                <Grid item xs={12}>
                    <DungeonCanvas
                        style={{ width: '90%' }}
                        dungeon={dungeon}
                        selectedRoom={selectedRoom}
                        onRoomSelect={onRoomSelect}
                        onInfoClick={onInfoClick}
                        roomTypes={roomTypes}
                        roomMinSize={3} roomMaxSize={4} />
                </Grid>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'left' }}>
                    <Typography>{dungeonRooms && dungeonRooms[selectedRoom] ? dungeonRooms[selectedRoom].description : ""}</Typography>
                </Grid>
            </Grid>
        );
    } catch (e) {
        return null;
    }

};