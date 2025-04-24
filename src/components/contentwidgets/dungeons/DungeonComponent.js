import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DungeonCanvas from './DungeonCanvas.js';
import { Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTranslation } from 'react-i18next';
import { getRoomContent } from '../../../snippets/dungeons/DungeonLib.js';


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

        const roomContent = getRoomContent(props.dungeonRooms, content, room);

        setSelectedRoomDescription(roomContent.description);
        setSelectedRoomMonster(roomContent.monsters);
        setSelectedRoomTrap(roomContent.traps);
        setSelectedRoomTreasure(roomContent.treasures);
        setSelectedRoomPuzzle(roomContent.puzzles);
    }

    useEffect(() => {
        try {
            setSelectedRoom(0);
            setSelectedRoomContents(0);
        } catch (e) {
            // nothing
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.dungeonRooms]);

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
                                <div style={{marginLeft: '1rem'}} dangerouslySetInnerHTML={{ __html: selectedRoomDescription }} />
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
                                <div style={{marginLeft: '1rem'}} dangerouslySetInnerHTML={{ __html: selectedRoomMonster }} />
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
                                <div style={{marginLeft: '1rem'}} dangerouslySetInnerHTML={{ __html: selectedRoomTrap }} />
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
                                <div style={{marginLeft: '1rem'}} dangerouslySetInnerHTML={{ __html: selectedRoomTreasure }} />
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
                                <div style={{marginLeft: '1rem'}} dangerouslySetInnerHTML={{ __html: selectedRoomPuzzle }} />
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
                <Grid size={12}>
                    <DungeonCanvas
                        style={{ width: '100%' }}
                        dungeonRooms={props.dungeonRooms}
                        corridorLayout={props.dungeonCorridorsLayout}
                        selectedRoom={selectedRoom}
                        onRoomSelect={onRoomSelect}
                        onInfoClick={onInfoClick} />
                </Grid>
                <Grid size={12} style={{ display: 'flex', justifyContent: 'left' }}>
                    <Typography>{props.dungeonRooms && props.dungeonRooms[selectedRoom] ? props.dungeonRooms[selectedRoom].description : t("No room selected.")}</Typography>
                </Grid>
                <Grid size={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    {getRoomInfoDialog()}
                </Grid>
            </Grid>
        );
    } catch (e) {
        return null;
    }

};