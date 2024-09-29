import React, { useEffect, useState } from 'react';
//import Grid from '@mui/material/Grid';
import { getDungeonRooms, layoutRooms } from '../../../snippets/dungeons/DungeonLib';
import DungeonCanvas from './DungeonCanvas';
import Button from '@mui/material/Button';
import CasinoIcon from '@mui/icons-material/Casino';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { mergeContentAndTables, setLastTableContent } from '../../../store/slices/content.js';
import { useSelector, useDispatch } from 'react-redux';


export default function DungeonMap(props) {

    const content = useSelector((st) => st.content);
    const dispatch = useDispatch();

    const [dungeonRooms, setDungeonRooms] = useState(null);
    const [roomContentsDialogOpen, setRoomContentsDialogOpen] = useState(false);

    const [selectedRoom, setSelectedRoom] = useState(0);
    const [selectedRoomDescription, setSelectedRoomDescription] = useState("");
    const [selectedRoomMonster, setSelectedRoomMonster] = useState("");
    const [selectedRoomTrap, setSelectedRoomTrap] = useState("");
    const [selectedRoomTreasure, setSelectedRoomTreasure] = useState("");
    const [selectedRoomPuzzle, setSelectedRoomPuzzle] = useState("");

    const { t } = useTranslation();

    const setSelectedRoomContents = (room) => {
        if (!dungeonRooms || room < 0 || room >= dungeonRooms.length) {
            return;
        }

        if (dungeonRooms[room].table) {
            const tables = dungeonRooms[room].table.trim().split(" ");
            setSelectedRoomDescription(mergeContentAndTables(dungeonRooms[room].textContent, tables, content));
        } else {
            setSelectedRoomDescription(dungeonRooms[room].textContent);
        }

        if (dungeonRooms[room].monster.table) {
            const tables = dungeonRooms[room].monster.table.trim().split(" ");
            setSelectedRoomMonster(mergeContentAndTables(dungeonRooms[room].monster.textContent, tables, content));
        } else {
            setSelectedRoomMonster(dungeonRooms[room].monster.textContent);
        }

        if (dungeonRooms[room].trap.table) {
            const tables = dungeonRooms[room].trap.table.trim().split(" ");
            setSelectedRoomTrap(mergeContentAndTables(dungeonRooms[room].trap.textContent, tables, content));
        } else {
            setSelectedRoomTrap(dungeonRooms[room].trap.textContent);
        }

        if (dungeonRooms[room].treasure.table) {
            const tables = dungeonRooms[room].treasure.table.trim().split(" ");
            setSelectedRoomTreasure(mergeContentAndTables(dungeonRooms[room].treasure.textContent, tables, content));
        } else {
            setSelectedRoomTreasure(dungeonRooms[room].treasure.textContent);
        }

        if (dungeonRooms[room].puzzle.table) {
            const tables = dungeonRooms[room].puzzle.table.trim().split(" ");
            setSelectedRoomPuzzle(mergeContentAndTables(dungeonRooms[room].puzzle.textContent, tables, content));
        } else {
            setSelectedRoomPuzzle(dungeonRooms[room].puzzle.textContent);
        }
    }

    const generateRooms = () => {
        const roomsResult = getDungeonRooms(props.content.data.dungeon.setpiece, props.content.data.dungeon.rooms,
            props.content.data.dungeon.trapSet, props.content.data.dungeon.puzzleSet,
            props.content.data.dungeon.monsterSet, props.content.data.dungeon.treasureSet);

        if (roomsResult.statusMessage === 'success') {
            try {
                const dungeonWidth = props.content.data.dungeon.rooms * 3;
                const dungeonHeight = props.content.data.dungeon.rooms * 3;

                const roomTypes = roomsResult.rooms ? roomsResult.rooms.map((room, index) => {
                    return {
                        name: index,
                        occurrences: 1
                    };
                }) : [];

                const roomsLayout = layoutRooms(roomTypes, 3, 4, dungeonWidth, dungeonHeight);

                roomsResult.rooms.forEach((room, index) => {
                    room.x = roomsLayout[index].x;
                    room.y = roomsLayout[index].y;
                    room.width = roomsLayout[index].width;
                    room.height = roomsLayout[index].height;
                });
            } catch (e) {
                return null;
            }

            return roomsResult.rooms;
        }

        return null;
    }

    const diceRoll = () => {
        const generatedRooms = generateRooms();

        dispatch(setLastTableContent({
            contentId: props.content.id + "TAB" + props.currentTab,
            diceThrow: {
                dungeonRooms: generatedRooms
            },
            htmlContent: null
        }));

        setDungeonRooms(generatedRooms);
        setSelectedRoom(0);
    }

    useEffect(() => {
        setSelectedRoomContents(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dungeonRooms]);

    useEffect(() => {
        try {
            const cleanedId = props.content.id.replace(/[^0-9a-zA-Z]/g, '') + "TAB" + props.currentTab;
            const lastTableContent = content.lastTableContent[cleanedId] ? content.lastTableContent[cleanedId] : null;

            if (lastTableContent) {
                setDungeonRooms(lastTableContent.diceThrow.dungeonRooms);
            } else {
                diceRoll();
            }
        } catch (e) {
            console.error(e);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.content.data.dungeon.setpiece, props.content.data.dungeon.rooms, props.content.data.dungeon.trapSet,
    props.content.data.dungeon.puzzleSet, props.content.data.dungeon.monsterSet, props.content.data.dungeon.treasureSet,
    props.content.id, props.currentTab, content.lastTableContent]);

    const onRoomSelect = (room) => {
        if (selectedRoom === room) {
            try {
                if (selectedRoom >= 0 && selectedRoom < dungeonRooms.length) {
                    setRoomContentsDialogOpen(true);
                }
            } catch (e) {
                // nothing
            }
        } else {
            setSelectedRoom(room);
            setSelectedRoomContents(room);
        }
    }

    const onInfoClick = () => {
        setRoomContentsDialogOpen(true);
    }

    const getRoomInfoDialog = () => {
        try {
            return (
                <Dialog onClose={(e) => setRoomContentsDialogOpen(false)} open={roomContentsDialogOpen}>
                    <DialogTitle>{dungeonRooms[selectedRoom].description}</DialogTitle>
                    <Accordion defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Typography>{t('Room Description')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <div dangerouslySetInnerHTML={{ __html: selectedRoomDescription }} />
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                        >
                            <Typography>{t('Monsters') + ': ' + dungeonRooms[selectedRoom].monster.description}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <div dangerouslySetInnerHTML={{ __html: selectedRoomMonster }} />
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                        >
                            <Typography>{t('Traps')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <div dangerouslySetInnerHTML={{ __html: selectedRoomTrap }} />
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                        >
                            <Typography>{t('Treasures')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <div dangerouslySetInnerHTML={{ __html: selectedRoomTreasure }} />
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                        >
                            <Typography>{t('Puzzles') + ': ' + dungeonRooms[selectedRoom].puzzle.description}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <div dangerouslySetInnerHTML={{ __html: selectedRoomPuzzle }} />
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
        if (!dungeonRooms || dungeonRooms.length === 0) {
            return null;
        }

        return (
            <Grid container >
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    {getRoomInfoDialog()}
                </Grid>
                <Grid item xs={12}>
                    <DungeonCanvas
                        style={{ width: '90%' }}
                        dungeonRooms={dungeonRooms}
                        selectedRoom={selectedRoom}
                        onRoomSelect={onRoomSelect}
                        onInfoClick={onInfoClick} />
                </Grid>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'left' }}>
                    <Typography>{dungeonRooms && dungeonRooms[selectedRoom] ? dungeonRooms[selectedRoom].description : t("No room selected.")}</Typography>
                </Grid>
                <Grid item xs={12} style={{ margin: '1em', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Button onClick={diceRoll} startIcon={<CasinoIcon />} variant='contained'>{t("Roll")}</Button>
                </Grid>
            </Grid>
        );
    } catch (e) {
        return null;
    }

};