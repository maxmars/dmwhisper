import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { getDungeonRooms } from '../../../snippets/dungeons/DungeonLib.js';
import DungeonCanvas from './DungeonCanvas.js';
import { Dungeon } from '../../../snippets/dungeons/Dungeon.js';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


export default function DungeonExplore(props) {

    const [numberOfRooms, setNumberOfRooms] = useState(10);
    const [dungeonSetpiece, setDungeonSetpiece] = useState(null);
    const [dungeonMonsterSet, setDungeonMonsterSet] = useState(null);
    const [dungeonTrapSet, setDungeonTrapSet] = useState(null);
    const [dungeonTreasureSet, setDungeonTreasureSet] = useState(null);
    const [dungeonPuzzleSet, setDungeonPuzzleSet] = useState(null);

    const { t } = useTranslation();
    const dungeonSetpieces = useSelector((st) => st.content.dungeonSetpieces ? st.content.dungeonSetpieces : []);
    const dungeonMonsterSets = useSelector((st) => st.content.dungeonMonsterSets ? st.content.dungeonMonsterSets : []);
    const dungeonTrapSets = useSelector((st) => st.content.dungeonTrapSets ? st.content.dungeonTrapSets : []);
    const dungeonTreasureSets = useSelector((st) => st.content.dungeonTreasureSets ? st.content.dungeonTreasureSets : []);
    const dungeonPuzzleSets = useSelector((st) => st.content.dungeonPuzzleSets ? st.content.dungeonPuzzleSets : []);

    const DungeonCreate = (rooms) => {

        try {
            const dungeonWidth = numberOfRooms * 3;
            const dungeonHeight = numberOfRooms * 3;

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
    const [pageMode, setPageMode] = useState('setup');

    const dungeonSetpiecesNames = useMemo(
        () => dungeonSetpieces.map((item) => {
            return {
                label: item.id,
            }
        }),
        [dungeonSetpieces],
    );

    const dungeonMonsterSetsNames = useMemo(
        () => dungeonMonsterSets.map((item) => {
            return {
                label: item.id,
            }
        }),
        [dungeonMonsterSets],
    );

    const dungeonTrapSetsNames = useMemo(
        () => dungeonTrapSets.map((item) => {
            return {
                label: item.id,
            }
        }),
        [dungeonTrapSets],
    );

    const dungeonTreasureSetsNames = useMemo(
        () => dungeonTreasureSets.map((item) => {
            return {
                label: item.id,
            }
        }),
        [dungeonTreasureSets],
    );

    const dungeonPuzzleSetsNames = useMemo(
        () => dungeonPuzzleSets.map((item) => {
            return {
                label: item.id,
            }
        }),
        [dungeonPuzzleSets],
    );

    useEffect(() => {
        try {
            setDungeon(DungeonCreate(dungeonRooms));
        } catch (e) {
            console.error(e);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numberOfRooms, dungeonRooms]);

    useEffect(() => {
        try {
            const roomsResult = getDungeonRooms(dungeonSetpiece, numberOfRooms,
                dungeonTrapSet, dungeonPuzzleSet,
                dungeonMonsterSet, dungeonTreasureSet);

            if (roomsResult.statusMessage === 'success') {
                setDungeonRooms(roomsResult.rooms);
                setSelectedRoom(0);
            }
        } catch (e) {
            console.error(e);
        }
    }, [dungeonSetpiece, numberOfRooms, dungeonTrapSet, dungeonPuzzleSet, dungeonMonsterSet, dungeonTreasureSet]);

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

    const getDungeonSetup = () => {
        return (
            <Grid container sx={{ width: '100%' }}>
                <Grid item xs={12}>&nbsp;</Grid>
                <Grid item xs={12}><Typography>{t("Dungeon data")}</Typography></Grid>
                <Grid item xs={12}>&nbsp;</Grid>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Autocomplete
                        disablePortal
                        id="setpiecesIDs"
                        options={dungeonSetpiecesNames}
                        sx={{ width: '100%' }}
                        value={dungeonSetpiece}
                        onChange={(event, newValue) => {
                            try {
                                setDungeonSetpiece(newValue.label);
                            } catch (e) {
                                // nothing
                            }
                        }}
                        renderInput={(params) => <TextField {...params} label={t("Dungeon set piece id") + ".."} />}
                    />
                </Grid>
                <Grid item xs={12}>&nbsp;</Grid>
                <Grid item xs={12}>
                    <TextField
                        type="number"
                        onChange={(event) => setNumberOfRooms(event.target.value)}
                        value={numberOfRooms}
                        id="new-rooms-number"
                        label={t("Numero di stanze")}
                        variant="outlined"
                        sx={{ width: "100%" }} />
                </Grid>
                <Grid item xs={12}>&nbsp;</Grid>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Autocomplete
                        disablePortal
                        id="monstersIDs"
                        options={dungeonMonsterSetsNames}
                        sx={{ width: '100%' }}
                        value={dungeonMonsterSet}
                        onChange={(event, newValue) => {
                            try {
                                setDungeonMonsterSet(newValue.label);
                            } catch (e) {
                                // nothing
                            }
                        }}
                        renderInput={(params) => <TextField {...params} label={t("Dungeon monster set id") + ".."} />}
                    />
                </Grid>
                <Grid item xs={12}>&nbsp;</Grid>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Autocomplete
                        disablePortal
                        id="treasuresIDs"
                        options={dungeonTreasureSetsNames}
                        sx={{ width: '100%' }}
                        value={dungeonTreasureSet}
                        onChange={(event, newValue) => {
                            try {
                                setDungeonTreasureSet(newValue.label);
                            } catch (e) {
                                // nothing
                            }
                        }}
                        renderInput={(params) => <TextField {...params} label={t("Dungeon treasure set id") + ".."} />}
                    />
                </Grid>
                <Grid item xs={12}>&nbsp;</Grid>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Autocomplete
                        disablePortal
                        id="trapsIDs"
                        options={dungeonTrapSetsNames}
                        sx={{ width: '100%' }}
                        value={dungeonTrapSet}
                        onChange={(event, newValue) => {
                            try {
                                setDungeonTrapSet(newValue.label);
                            } catch (e) {
                                // nothing
                            }
                        }}
                        renderInput={(params) => <TextField {...params} label={t("Dungeon trap set id") + ".."} />}
                    />
                </Grid>
                <Grid item xs={12}>&nbsp;</Grid>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Autocomplete
                        disablePortal
                        id="puzzlesIDs"
                        options={dungeonPuzzleSetsNames}
                        sx={{ width: '100%' }}
                        value={dungeonPuzzleSet}
                        onChange={(event, newValue) => {
                            try {
                                setDungeonPuzzleSet(newValue.label);
                            } catch (e) {
                                // nothing
                            }
                        }}
                        renderInput={(params) => <TextField {...params} label={t("Dungeon puzzle set id") + ".."} />}
                    />
                </Grid>
                <Grid item xs={12}>&nbsp;</Grid>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button disabled={numberOfRooms && dungeonSetpiece && dungeonTrapSet && dungeonPuzzleSet && dungeonMonsterSet && dungeonTreasureSet ? false : true}
                        variant="contained" onClick={() => setPageMode('play')}>{t("Play")}</Button>
                </Grid>
            </Grid>
        );
    }

    const getDungeonPlayer = () => {
        return (
            <Grid container >
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    {getRoomInfoDialog()}
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={() => setPageMode("setup")} startIcon={<ArrowBackIosNewIcon />} style={{ width: '100%' }} variant="contained" color="primary">{t("Back to dungeon setup")}</Button>
                </Grid>
                <Grid item xs={12}>&nbsp;</Grid>
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
    }

    try {
        if (pageMode === 'setup') {
            return getDungeonSetup();
        } else {
            return getDungeonPlayer();
        }
    } catch (e) {
        return null;
    }

};