import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
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
import { mergeContentAndTables, setDungeonExploreDefaults } from '../../../store/slices/content.js';


export default function DungeonExplore(props) {

    const content = useSelector((st) => st.content);

    const [numberOfRooms, setNumberOfRooms] =
        useState(useSelector((st) => st.content.dungeonExploreDefaults && st.content.dungeonExploreDefaults.numberOfRooms ?
            st.content.dungeonExploreDefaults.numberOfRooms : 10));
    const [dungeonSetpiece, setDungeonSetpiece] =
        useState(useSelector((st) => st.content.dungeonExploreDefaults && st.content.dungeonExploreDefaults.setpiece ?
            st.content.dungeonExploreDefaults.setpiece : ""));
    const [dungeonMonsterSet, setDungeonMonsterSet] =
        useState(useSelector((st) => st.content.dungeonExploreDefaults && st.content.dungeonExploreDefaults.monsterset ?
            st.content.dungeonExploreDefaults.monsterset : ""));
    const [dungeonTrapSet, setDungeonTrapSet] =
        useState(useSelector((st) => st.content.dungeonExploreDefaults && st.content.dungeonExploreDefaults.trapset ?
            st.content.dungeonExploreDefaults.trapset : ""));
    const [dungeonTreasureSet, setDungeonTreasureSet] =
        useState(useSelector((st) => st.content.dungeonExploreDefaults && st.content.dungeonExploreDefaults.treasureset ?
            st.content.dungeonExploreDefaults.treasureset : ""));
    const [dungeonPuzzleSet, setDungeonPuzzleSet] =
        useState(useSelector((st) => st.content.dungeonExploreDefaults && st.content.dungeonExploreDefaults.puzzleset ?
            st.content.dungeonExploreDefaults.puzzleset : ""));

    const dispatch = useDispatch();
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
    const [selectedRoomDescription, setSelectedRoomDescription] = useState("");
    const [selectedRoomMonster, setSelectedRoomMonster] = useState("");
    const [selectedRoomTrap, setSelectedRoomTrap] = useState("");
    const [selectedRoomTreasure, setSelectedRoomTreasure] = useState("");
    const [selectedRoomPuzzle, setSelectedRoomPuzzle] = useState("");

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

    const setSelectedRoomContents = (room) => {
        if (room < 0 || room >= dungeonRooms.length) {
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
                setSelectedRoomContents(0);
            }
        } catch (e) {
            console.error(e);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dungeonSetpiece, numberOfRooms, dungeonTrapSet, dungeonPuzzleSet, dungeonMonsterSet, dungeonTreasureSet]);

    const roomTypes = dungeonRooms ? dungeonRooms.map((room, index) => {
        return {
            name: index,
            occurrences: 1
        };
    }) : [];

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
                            <Typography>{t('Traps') + ': ' + dungeonRooms[selectedRoom].trap.description}</Typography>
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
                            <Typography>{t('Treasures') + ': ' + dungeonRooms[selectedRoom].treasure.description}</Typography>
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
                                dispatch(setDungeonExploreDefaults(
                                    {
                                        setpiece: newValue.label,
                                        monsterset: dungeonMonsterSet,
                                        treasureset: dungeonTreasureSet,
                                        trapset: dungeonTrapSet,
                                        puzzleset: dungeonPuzzleSet,
                                        numberOfRooms: numberOfRooms
                                    }
                                ));
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
                        onChange={(event) => {
                            try {
                                setNumberOfRooms(event.target.value);
                                dispatch(setDungeonExploreDefaults(
                                    {
                                        setpiece: dungeonSetpiece,
                                        monsterset: dungeonMonsterSet,
                                        treasureset: dungeonTreasureSet,
                                        trapset: dungeonTrapSet,
                                        puzzleset: dungeonPuzzleSet,
                                        numberOfRooms: event.target.value
                                    }
                                ));
                            } catch (e) {
                                // nothing
                            }
                        }}
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
                                dispatch(setDungeonExploreDefaults(
                                    {
                                        setpiece: dungeonSetpiece,
                                        monsterset: newValue.label,
                                        treasureset: dungeonTreasureSet,
                                        trapset: dungeonTrapSet,
                                        puzzleset: dungeonPuzzleSet,
                                        numberOfRooms: numberOfRooms
                                    }
                                ));
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
                                dispatch(setDungeonExploreDefaults(
                                    {
                                        setpiece: dungeonSetpiece,
                                        monsterset: dungeonMonsterSet,
                                        treasureset: newValue.label,
                                        trapset: dungeonTrapSet,
                                        puzzleset: dungeonPuzzleSet,
                                        numberOfRooms: numberOfRooms
                                    }
                                ));
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
                                dispatch(setDungeonExploreDefaults(
                                    {
                                        setpiece: dungeonSetpiece,
                                        monsterset: dungeonMonsterSet,
                                        treasureset: dungeonTreasureSet,
                                        trapset: newValue.label,
                                        puzzleset: dungeonPuzzleSet,
                                        numberOfRooms: numberOfRooms
                                    }
                                ));
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
                                dispatch(setDungeonExploreDefaults(
                                    {
                                        setpiece: dungeonSetpiece,
                                        monsterset: dungeonMonsterSet,
                                        treasureset: dungeonTreasureSet,
                                        trapset: dungeonTrapSet,
                                        puzzleset: newValue.label,
                                        numberOfRooms: numberOfRooms
                                    }
                                ));
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
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    {getRoomInfoDialog()}
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={() => setPageMode("setup")} startIcon={<ArrowBackIosNewIcon />} style={{ width: '100%' }} variant="contained" color="primary">{t("Back to dungeon setup")}</Button>
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