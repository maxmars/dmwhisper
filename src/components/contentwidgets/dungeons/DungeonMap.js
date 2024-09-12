import React, { useEffect, useState } from 'react';
//import Grid from '@mui/material/Grid';
import { getDungeonRooms } from '../../../snippets/dungeons/DungeonLib';
import DungeonCanvas from './DungeonCanvas';
import { Dungeon } from '../../../snippets/dungeons/Dungeon.js';
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
    }

    const [dungeonRooms, setDungeonRooms] = useState(null);
    const [dungeon, setDungeon] = useState(DungeonCreate(null));
    const [roomContentsDialogOpen, setRoomContentsDialogOpen] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        setDungeon(DungeonCreate(dungeonRooms));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.content.data.dungeon.rooms, dungeonRooms]);

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
        <div>
            <Dialog onClose={(e) => setRoomContentsDialogOpen(false)} open={roomContentsDialogOpen}>
                <DialogTitle>{t('Dungeon Room')}</DialogTitle>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography>{t('Room contents')}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                            malesuada lacus ex, sit amet blandit leo lobortis eget.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <Typography>{t('Monsters')}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                            malesuada lacus ex, sit amet blandit leo lobortis eget.
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
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                            malesuada lacus ex, sit amet blandit leo lobortis eget.
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
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                            malesuada lacus ex, sit amet blandit leo lobortis eget.
                        </Typography>
                    </AccordionDetails>
                </Accordion>            
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <Typography>{t('Puzzles')}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                            malesuada lacus ex, sit amet blandit leo lobortis eget.
                        </Typography>
                    </AccordionDetails>
                </Accordion>            
            </Dialog>
            <DungeonCanvas
                dungeon={dungeon}
                width={props.content.data.dungeon.rooms * 3}
                height={props.content.data.dungeon.rooms * 4}
                roomTypes={roomTypes}
                roomMinSize={3} roomMaxSize={4} />
        </div>
    );

};