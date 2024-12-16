import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CasinoIcon from '@mui/icons-material/Casino';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useSelector, useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { getDungeonRooms, layoutRooms } from '../../../snippets/dungeons/DungeonLib.js';
import DungeonComponent from './DungeonComponent.js';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { setDungeonExploreDefaults, setLastTableContent } from '../../../store/slices/content.js';
import { addThrow } from '../../../store/slices/throws.js';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';


export default function DungeonExplore(props) {

    const content = useSelector((st) => st.content);
    const { dngnsetpiece, roomsnumber, dngnmonsterset, dngngtrapset, dngntreasureset, dngnpuzzleset } = useParams();

    const initialContent = {
        numberOfRooms: useSelector((st) => st.content.dungeonExploreDefaults && st.content.dungeonExploreDefaults.numberOfRooms ?
            st.content.dungeonExploreDefaults.numberOfRooms : 10),
        dungeonSetpiece: useSelector((st) => st.content.dungeonExploreDefaults && st.content.dungeonExploreDefaults.setpiece ?
            st.content.dungeonExploreDefaults.setpiece : ""),
        dungeonMonsterSet: useSelector((st) => st.content.dungeonExploreDefaults && st.content.dungeonExploreDefaults.monsterset ?
            st.content.dungeonExploreDefaults.monsterset : ""),
        dungeonTrapSet: useSelector((st) => st.content.dungeonExploreDefaults && st.content.dungeonExploreDefaults.trapset ?
            st.content.dungeonExploreDefaults.trapset : ""),
        dungeonTreasureSet: useSelector((st) => st.content.dungeonExploreDefaults && st.content.dungeonExploreDefaults.treasureset ?
            st.content.dungeonExploreDefaults.treasureset : ""),
        dungeonPuzzleSet: useSelector((st) => st.content.dungeonExploreDefaults && st.content.dungeonExploreDefaults.puzzleset ?
            st.content.dungeonExploreDefaults.puzzleset : "")
    }

    if (dngnsetpiece) {
        initialContent.dungeonSetpiece = dngnsetpiece;

        initialContent.numberOfRooms = roomsnumber ? roomsnumber : 10;
        initialContent.dungeonMonsterSet = dngnmonsterset ? dngnmonsterset : "";
        initialContent.dungeonTrapSet = dngngtrapset ? dngngtrapset : "";
        initialContent.dungeonTreasureSet = dngntreasureset ? dngntreasureset : "";
        initialContent.dungeonPuzzleSet = dngnpuzzleset ? dngnpuzzleset : "";
    }

    const [numberOfRooms, setNumberOfRooms] =
        useState(initialContent.numberOfRooms);
    const [dungeonSetpiece, setDungeonSetpiece] =
        useState(initialContent.dungeonSetpiece);
    const [dungeonMonsterSet, setDungeonMonsterSet] =
        useState(initialContent.dungeonMonsterSet);
    const [dungeonTrapSet, setDungeonTrapSet] =
        useState(initialContent.dungeonTrapSet);
    const [dungeonTreasureSet, setDungeonTreasureSet] =
        useState(initialContent.dungeonTreasureSet);
    const [dungeonPuzzleSet, setDungeonPuzzleSet] =
        useState(initialContent.dungeonPuzzleSet);

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const dungeonSetpieces = useSelector((st) => st.content.dungeonSetpieces ? st.content.dungeonSetpieces : []);
    const dungeonMonsterSets = useSelector((st) => st.content.dungeonMonsterSets ? st.content.dungeonMonsterSets : []);
    const dungeonTrapSets = useSelector((st) => st.content.dungeonTrapSets ? st.content.dungeonTrapSets : []);
    const dungeonTreasureSets = useSelector((st) => st.content.dungeonTreasureSets ? st.content.dungeonTreasureSets : []);
    const dungeonPuzzleSets = useSelector((st) => st.content.dungeonPuzzleSets ? st.content.dungeonPuzzleSets : []);

    const generateRooms = () => {
        try {
            const roomsResult = getDungeonRooms(dungeonSetpiece, numberOfRooms,
                dungeonTrapSet, dungeonPuzzleSet,
                dungeonMonsterSet, dungeonTreasureSet);

            if (roomsResult.statusMessage === 'success') {
                try {
                    const dungeonWidth = numberOfRooms * 3;
                    const dungeonHeight = numberOfRooms * 3;

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

                setDungeonRooms(roomsResult.rooms);

                return roomsResult.rooms;
            }

            return dungeonRooms;
        } catch (e) {
            console.error(e);
        }

    }

    const [dungeonRooms, setDungeonRooms] = useState(null);
    const [pageMode, setPageMode] = useState(dngnsetpiece ? 'play' : 'setup');

    const dungeonSetpiecesNames = useMemo(
        () => dungeonSetpieces.map((item) => {
            return {
                label: item.id,
            }
        }).sort((a, b) => a.label.localeCompare(b.label)),
        [dungeonSetpieces],
    );

    const dungeonMonsterSetsNames = useMemo(
        () => dungeonMonsterSets
            .map((item) => {
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

    useEffect(() => {
        const handleBackButton = (event) => {
            window.history.pushState({ noBackExitsApp: true }, '');
            event.preventDefault();
            if (pageMode !== 'setup') {
                setPageMode('setup');
            }
        };

        window.addEventListener('popstate', handleBackButton);

        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        try {
            const lastTableContent = !dngnsetpiece && content.lastTableContent['dungeonExplore'] ?
                content.lastTableContent['dungeonExplore'] : null;

            if (lastTableContent && lastTableContent.diceThrow && lastTableContent.diceThrow.dungeonRooms) {
                setDungeonRooms(lastTableContent.diceThrow.dungeonRooms);
            } else {
                generateRooms();
            }

        } catch (e) {
            console.error(e);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dngnsetpiece]);

    const diceRoll = () => {
        const generatedRooms = generateRooms();

        try {
            dispatch(setLastTableContent({
                contentId: props.content.id + "TAB" + props.currentTab,
                diceThrow: {
                    dungeonRooms: generatedRooms
                },
                htmlContent: null
            }));
        } catch (e) {
            // Nothing
        }

        setDungeonRooms(generatedRooms);
    }

    const saveRoll = () => {
        const contentToSave = {
            dungeonName: dungeonSetpiece,
            dungeonRooms: dungeonRooms
        };
        dispatch(addThrow({ result: contentToSave, timestamp: format(new Date(), "yyyy-MM-dd' 'HH:mm:ss") }));
    };

    const contentPersist = () => {
        if (numberOfRooms !== initialContent.numberOfRooms ||
            dungeonSetpiece !== initialContent.dungeonSetpiece ||
            dungeonMonsterSet !== initialContent.dungeonMonsterSet ||
            dungeonTrapSet !== initialContent.dungeonTrapSet ||
            dungeonTreasureSet !== initialContent.dungeonTreasureSet ||
            dungeonPuzzleSet !== initialContent.dungeonPuzzleSet) {

            const dungeonRooms = generateRooms();

            dispatch(setDungeonExploreDefaults(
                {
                    setpiece: dungeonSetpiece,
                    monsterset: dungeonMonsterSet,
                    treasureset: dungeonTreasureSet,
                    trapset: dungeonTrapSet,
                    puzzleset: dungeonPuzzleSet,
                    numberOfRooms: numberOfRooms
                }
            ));
            dispatch(setLastTableContent({
                contentId: 'dungeonExplore',
                diceThrow: {
                    dungeonRooms: dungeonRooms,
                },
                htmlContent: null
            }));

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
                        onChange={(event) => {
                            try {
                                setNumberOfRooms(event.target.value);
                            } catch (e) {
                                // nothing
                            }
                        }}
                        value={numberOfRooms}
                        id="new-rooms-number"
                        label={t("Number of rooms")}
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
                        variant="contained" onClick={() => {
                            contentPersist();
                            setPageMode('play');
                        }}>{t("Play")}</Button>
                </Grid>
            </Grid>
        );
    }

    const getDungeonPlayer = () => {
        if (dungeonRooms === null) {
            diceRoll();
            return null;
        }

        return (
            <Grid container >
                <Grid item xs={12}>
                    <DungeonComponent
                        style={{ width: '90%' }}
                        dungeonRooms={dungeonRooms} />
                </Grid>
                <Grid item xs={12} style={{ margin: '1em', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Button onClick={diceRoll} startIcon={<CasinoIcon />} variant='contained'>{t("Roll")}</Button>
                    <Button onClick={saveRoll} startIcon={<SaveAltIcon />} variant='contained'>{t("Save")}</Button>
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={() => setPageMode("setup")} startIcon={<ArrowBackIosNewIcon />} style={{ width: '100%' }} variant="contained" color="primary">{t("Back to dungeon setup")}</Button>
                </Grid>
                <Grid item xs={12}>&nbsp;</Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', verticalAlign: 'center' }}>
                    <Button sx={{ width: '90%' }} variant="outlined" onClick={() => window.history.back()}>{t("Back")}</Button>
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
        console.log(e);
        return null;
    }

};