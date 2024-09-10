import * as React from 'react';
import { getRng, mergeContentAndTables, setLastTableContent } from '../../store/slices/content.js';
import { uuidv4 } from '../../utils/index.js';
import useTheme from '@mui/private-theming/useTheme';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import CasinoIcon from '@mui/icons-material/Casino';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addThrow } from '../../store/slices/throws.js';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ErrorIcon from '@mui/icons-material/Error';


export default function AreaMap(props) {

    const content = useSelector((st) => st.content);
    const theme = useTheme();
    const dark = theme.palette.mode === "dark";
    const { t } = useTranslation();
    const [cells, setCells] = React.useState(null);
    const [gridrowcells, setGridrowcells] = React.useState(2);
    const [gridrowdensity, setGridrowdensity] = React.useState(2);
    const [error, setError] = React.useState(null);
    const dispatch = useDispatch();

    const diceRoll = () => {
        try {
            let mapgridrowcells = 3;

            switch (parseInt(map.grid)) {
                case 1:
                    mapgridrowcells = 3;
                    break;
                case 2:
                    mapgridrowcells = 4;
                    break;
                case 3:
                    mapgridrowcells = 5;
                    break;
                default:
                    mapgridrowcells = 5;
                    break;
            }

            let mapgridrowdensity = 25;

            switch (parseInt(map.density)) {
                case 1:
                    mapgridrowdensity = 25;
                    break;

                case 2:
                    mapgridrowdensity = 40;
                    break;

                case 3:
                    mapgridrowdensity = 65;
                    break;

                default:
                    mapgridrowdensity = 40;
                    break;
            }

            const cellnumber = gridrowcells * gridrowcells;
            const setpiece = content.setpieces.find((sp) => sp.id === map.setpiece);
            let mapcells = new Array(cellnumber).fill(null);

            mapcells = mapcells.map((_, i) => {

                try {
                    if (Math.random() * 100 < gridrowdensity) {
                        const setpiecerng = getRng(setpiece);
                        const tables = setpiecerng.table.trim().split(" ");

                        return {
                            description: setpiecerng.description,
                            content: mergeContentAndTables(setpiecerng.textContent, tables, content),
                            id: uuidv4()
                        }
                    } else {
                        return null;
                    }
                } catch (e) {
                    return "Error!";
                }
            });

            dispatch(setLastTableContent({
                contentId: props.content.id + "TAB" + props.currentTab,
                diceThrow: {
                    cells: mapcells,
                    gridrowcells: mapgridrowcells,
                    gridrowdensity: mapgridrowdensity
                },
                htmlContent: null
            }));

            setCells(mapcells);
            setGridrowcells(mapgridrowcells);
            setGridrowdensity(mapgridrowdensity);
        } catch (e) {
            setError(e.message);
        }
    }

    useEffect(() => {
        getLastContentOrRoll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.content.id, props.content.data.table, props.currentTab]);

    useEffect(() => {
        getLastContentOrRoll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!props.content || !props.content.data || !props.content.data.map) {
        return null;
    }

    const map = props.content.data.map;

    if (!map.setpiece || map.setpiece.length === 0 ||
        !map.grid || !map.density) {
        return null;
    }

    const saveRoll = () => {
        const contentToSave = {
            cells: cells,
            gridrowcells: gridrowcells,
            gridrowdensity: gridrowdensity
        };
        dispatch(addThrow({ result: contentToSave, timestamp: format(new Date(), "yyyy-MM-dd' 'HH:mm:ss") }));
    };

    const resetError = () => {
        setError(null);
    };

    const getLastContentOrRoll = () => {
        try {
            const cleanedId = props.content.id.replace(/[^0-9a-zA-Z]/g, '') + "TAB" + props.currentTab;
            const lastTableContent = content.lastTableContent[cleanedId] ? content.lastTableContent[cleanedId] : null;

            if (lastTableContent) {
                setCells(lastTableContent.diceThrow.cells);
                setGridrowcells(lastTableContent.diceThrow.gridrowcells);
                setGridrowdensity(lastTableContent.diceThrow.gridrowdensity);
            } else {
                diceRoll();
            }
        } catch (e) {
            diceRoll();
        }
    }

    if (!cells && !error) {
        getLastContentOrRoll();
        return null;
    }

    if (error) {
        return (
            <Box sx={{ width: '100%' }}>
                <Stack spacing={2} direction="column"
                    justifyContent="space-evenly"
                    alignItems="center">
                    <div>{t("Content Error:")} {error}. {t("Please check content for errors.")}</div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <Button onClick={resetError} startIcon={<ErrorIcon />} variant='contained'>{t("Dismiss")}</Button>
                    </div>
                </Stack>
            </Box>
        );
    }

    return (
        <div id="topdiv">
            <div style={{ width: '100%' }}>
                <div style={{ margin: '1em', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Button onClick={diceRoll} startIcon={<CasinoIcon />} variant='contained'>{t("Roll")}</Button>
                    <Button onClick={saveRoll} startIcon={<SaveAltIcon />} variant='contained'>{t("Save")}</Button>
                </div>
            </div>
            <br />
            {[...Array(gridrowcells)].map((_, i) => (
                <div key={"map" + i}>
                    <br />
                    <div style={{ display: 'flex', width: '100%' }}>
                        {[...Array(gridrowcells)].map((_, j) => {
                            let description = "";

                            if (cells[i * gridrowcells + j]) {
                                try {
                                    description = cells[i * gridrowcells + j].content.split("</h1>")[0].substr(4);
                                    if (description.length > 15) {
                                        description = description.substring(0, 13) + "..";
                                    }
                                } catch (error) {
                                    description = cells[i * gridrowcells + j].description;
                                }
                            }

                            return (<div key={"cell" + i + "-" + j} style={{ display: 'flex', flexBasis: (100 / gridrowcells) + '%', border: "2px solid " + (dark ? "black" : "white"), flexGrow: '0', justifyContent: 'center', backgroundColor: cells[i * gridrowcells + j] ? "orange" : "transparent" }}>
                                <br />
                                <div style={{ display: 'flex', alignItems: 'center' }}>{cells[i * gridrowcells + j] ? <a href={"#" + cells[i * gridrowcells + j].id} style={{ color: "white", fontSize: "12px !important" }}>{description}</a> : " "}</div>
                                <br />&nbsp;
                            </div>);

                        })}
                    </div>
                </div>
            ))}
            <br />
            {[...Array(gridrowcells)].map((_, i) => (
                <div key={"content" + i} style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                    {[...Array(gridrowcells)].map((_, j) => (
                        cells[i * gridrowcells + j] ?
                            <div key={i + ".." + j} style={{ width: '100%' }} id={cells[i * gridrowcells + j].id} >
                                <br />
                                <div key={i + "-" + j} style={{ display: 'block', flexBasis: '100%', flexGrow: '0', justifyContent: 'left', border: "2px solid orange" }}>
                                    <div style={{ width: "100%" }} />
                                    {"[" + (i + 1) + ", " + (j + 1) + "] " + t("Description") + ": " + cells[i * gridrowcells + j].description}
                                    <div style={{ width: "100%", textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: cells[i * gridrowcells + j].content }} />
                                    <div style={{ width: "100%" }} />
                                    <div style={{ width: "100%" }}>
                                        <a href="#topdiv" style={{ color: dark ? "yellow" : "blue" }}>{t("Back to top")}</a>
                                    </div>
                                    <div style={{ width: "100%" }} />
                                </div>
                            </div>
                            : null
                    ))}
                </div>
            ))}
            <br />
            <br />
            <div style={{ width: '100%' }}>
                <div style={{ margin: '1em', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Button onClick={diceRoll} startIcon={<CasinoIcon />} variant='contained'>{t("Roll")}</Button>
                    <Button onClick={saveRoll} startIcon={<SaveAltIcon />} variant='contained'>{t("Save")}</Button>
                </div>
            </div>
        </div>
    );
}
