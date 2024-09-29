import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DungeonCanvas from './DungeonCanvas.js';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { mergeContentAndTables } from '../../../store/slices/content.js';
import { useTranslation } from 'react-i18next';


export default function DungeonComponent(props) {

    const content = useSelector((st) => st.content);
    const { t } = useTranslation();

    const [roomContentsDialogOpen, setRoomContentsDialogOpen] = useState(false);

    const [selectedRoom, setSelectedRoom] = useState(0);
    const [selectedRoomDescription, setSelectedRoomDescription] = useState("");
    const [selectedRoomMonster, setSelectedRoomMonster] = useState("");
    const [selectedRoomTrap, setSelectedRoomTrap] = useState("");
    const [selectedRoomTreasure, setSelectedRoomTreasure] = useState("");
    const [selectedRoomPuzzle, setSelectedRoomPuzzle] = useState("");

    const setSelectedRoomContents = (room) => {
        if (!props.dungeonRooms || room < 0 || room >= props.dungeonRooms.length) {
            return;
        }

        if (props.dungeonRooms[room].table) {
            const tables = props.dungeonRooms[room].table.trim().split(" ");
            setSelectedRoomDescription(mergeContentAndTables(props.dungeonRooms[room].textContent, tables, content));
        } else {
            setSelectedRoomDescription(props.dungeonRooms[room].textContent);
        }

        if (props.dungeonRooms[room].monster.table) {
            const tables = props.dungeonRooms[room].monster.table.trim().split(" ");
            setSelectedRoomMonster(mergeContentAndTables(props.dungeonRooms[room].monster.textContent, tables, content));
        } else {
            setSelectedRoomMonster(props.dungeonRooms[room].monster.textContent);
        }

        if (props.dungeonRooms[room].trap.table) {
            const tables = props.dungeonRooms[room].trap.table.trim().split(" ");
            setSelectedRoomTrap(mergeContentAndTables(props.dungeonRooms[room].trap.textContent, tables, content));
        } else {
            setSelectedRoomTrap(props.dungeonRooms[room].trap.textContent);
        }

        if (props.dungeonRooms[room].treasure.table) {
            const tables = props.dungeonRooms[room].treasure.table.trim().split(" ");
            setSelectedRoomTreasure(mergeContentAndTables(props.dungeonRooms[room].treasure.textContent, tables, content));
        } else {
            setSelectedRoomTreasure(props.dungeonRooms[room].treasure.textContent);
        }

        if (props.dungeonRooms[room].puzzle.table) {
            const tables = props.dungeonRooms[room].puzzle.table.trim().split(" ");
            setSelectedRoomPuzzle(mergeContentAndTables(props.dungeonRooms[room].puzzle.textContent, tables, content));
        } else {
            setSelectedRoomPuzzle(props.dungeonRooms[room].puzzle.textContent);
        }
    }

    useEffect(() => {
        try {
            setSelectedRoomContents(0);
        } catch (e) {
            // nothing
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRoomSelect = (room) => {
        if (selectedRoom === room) {
            try {
                if (selectedRoom >= 0 && selectedRoom < props.dungeonRooms.length) {
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
                    <DialogTitle>{props.dungeonRooms[selectedRoom].description}</DialogTitle>
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
                            <Typography>{t('Monsters') + ': ' + props.dungeonRooms[selectedRoom].monster.description}</Typography>
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
                            <Typography>{t('Traps') + ': ' + props.dungeonRooms[selectedRoom].trap.description}</Typography>
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
                            <Typography>{t('Treasures') + ': ' + props.dungeonRooms[selectedRoom].treasure.description}</Typography>
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
                            <Typography>{t('Puzzles') + ': ' + props.dungeonRooms[selectedRoom].puzzle.description}</Typography>
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
        return (
            <Grid container >
                <Grid item xs={12}>
                    <DungeonCanvas
                        style={{ width: '100%' }}
                        dungeonRooms={props.dungeonRooms}
                        selectedRoom={selectedRoom}
                        onRoomSelect={onRoomSelect}
                        onInfoClick={onInfoClick} />
                </Grid>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'left' }}>
                    <Typography>{props.dungeonRooms && props.dungeonRooms[selectedRoom] ? props.dungeonRooms[selectedRoom].description : t("No room selected.")}</Typography>
                </Grid>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    {getRoomInfoDialog()}
                </Grid>
            </Grid>
        );
    } catch (e) {
        return null;
    }

};