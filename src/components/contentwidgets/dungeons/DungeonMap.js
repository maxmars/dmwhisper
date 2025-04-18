import React, { useEffect, useState } from 'react';
import { getDungeonRooms, layoutRooms, getCorridorLayout } from '../../../snippets/dungeons/DungeonLib';
import DungeonComponent from './DungeonComponent';
import Button from '@mui/material/Button';
import CasinoIcon from '@mui/icons-material/Casino';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { setLastTableContent } from '../../../store/slices/content.js';
import { useSelector, useDispatch } from 'react-redux';
import { addThrow } from '../../../store/slices/throws.js';
import { format } from 'date-fns';


export default function DungeonMap(props) {

    const content = useSelector((st) => st.content);
    const dispatch = useDispatch();

    const [dungeonRooms, setDungeonRooms] = useState(null);
    const [corridorLayout, setCorridorLayout] = useState(null);

    const { t } = useTranslation();

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
        const corridorLayout = getCorridorLayout(generatedRooms);

        if (props.currentTab > -1) {
            dispatch(setLastTableContent({
                contentId: props.content.id + "TAB" + props.currentTab,
                diceThrow: {
                    dungeonRooms: generatedRooms,
                    dungeonCorridorsLayout: corridorLayout
                },
                htmlContent: null
            }));
        }

        setCorridorLayout(corridorLayout);
        setDungeonRooms(generatedRooms);
    }

    const saveRoll = () => {
        const contentToSave = {
            dungeonName: props.content.label,
            dungeonRooms: dungeonRooms,
            dungeonCorridorsLayout: getCorridorLayout(dungeonRooms),
        };
        dispatch(addThrow({ result: contentToSave, timestamp: format(new Date(), "yyyy-MM-dd' 'HH:mm:ss") }));
    };

    useEffect(() => {
        try {
            if (props.currentTab > -1) {
                const cleanedId = props.content.id.replace(/[^0-9a-zA-Z]/g, '') + "TAB" + props.currentTab;
                const lastTableContent = content.lastTableContent[cleanedId] ? content.lastTableContent[cleanedId] : null;

                if (lastTableContent && lastTableContent.diceThrow && lastTableContent.diceThrow.dungeonRooms) {
                    setDungeonRooms(lastTableContent.diceThrow.dungeonRooms);
                    setCorridorLayout(lastTableContent.diceThrow.dungeonCorridorsLayout);
                } else {
                    diceRoll();
                }
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

    try {
        if (!dungeonRooms || dungeonRooms.length === 0) {
            return null;
        }

        return (
            <Grid container >
                <Grid size={12}>
                    <DungeonComponent
                        style={{ width: '90%' }}
                        dungeonRooms={dungeonRooms}
                        dungeonCorridorsLayout={corridorLayout} />
                </Grid>
                <Grid size={12} style={{ margin: '1em', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Button onClick={diceRoll} startIcon={<CasinoIcon />} variant='contained'>{t("Roll")}</Button>
                    <Button onClick={saveRoll} startIcon={<SaveAltIcon />} variant='contained'>{t("Save")}</Button>
                </Grid>
            </Grid>
        );
    } catch (e) {
        return null;
    }

};