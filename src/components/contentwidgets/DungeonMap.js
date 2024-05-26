import * as React from 'react';
import { useSelector } from 'react-redux';
import { getRng, mergeContentAndTables } from '../../store/slices/content';
import { uuidv4 } from '../../utils/index.js';


export default function DungeonMap(props) {

    const content = useSelector((st) => st.content);

    if (!props.content || !props.content.data || !props.content.data.map) {
        return null;
    }

    const map = props.content.data.map;

    if (!map.setpiece || map.setpiece.length === 0 ||
        !map.grid || !map.density) {
        return null;
    }

    let gridrowcells = 3;

    switch (map.grid) {
        case 1:
            gridrowcells = 3;
            break;
        case 2:
            gridrowcells = 5;
            break;
        case 3:
            gridrowcells = 7;
            break;
        default:
            gridrowcells = 5;
            break;
    }

    let gridrowdensity = 25;

    switch (map.density) {
        case 1:
            gridrowdensity = 25;
            break;

        case 2:
            gridrowdensity = 50;
            break;

        case 3:
            gridrowdensity = 75;
            break;

        default:
            gridrowdensity = 50;
            break;
    }

    const gridcolwidth = 100 / gridrowcells;
    const cellnumber = gridrowcells * gridrowcells;
    const setpiece = content.setpieces.find((sp) => sp.id === map.setpiece);
    let cells = new Array(cellnumber).fill(null);

    cells = cells.map((_, i) => {

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

    return (
        <div id="topdiv">
            {[...Array(gridrowcells)].map((_, i) => (
                <div key={"map" + i}>
                    <br />
                    <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                        {[...Array(gridrowcells)].map((_, j) => (
                            <div key={"cell" + i + "-" + j} style={{ display: 'flex', flexBasis: gridcolwidth + '%', flexGrow: '0', justifyContent: 'center', backgroundColor: 'beige', color: 'black' }}>
                                <br />
                                <div style={{ display: 'flex', alignItems: 'center' }}>{cells[i * gridrowcells + j] ? <a href={"#" + cells[i * gridrowcells + j].id}>{cells[i * gridrowcells + j].description}</a> : " "}</div>
                                <br />&nbsp;
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <br />
            {[...Array(gridrowcells)].map((_, i) => (
                <div key={"content" + i} style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                    {[...Array(gridrowcells)].map((_, j) => (
                        cells[i * gridrowcells + j] ?
                            <div key={i + ".." + j} style={{ width: '100%' }}>
                                <br />
                                <div key={i + "-" + j} style={{ display: 'block', flexBasis: '100%', flexGrow: '0', justifyContent: 'left', backgroundColor: 'beige', color: 'black' }}>
                                    <div style={{ width: "100%" }} />
                                    <div style={{ width: "100%", textAlign: 'left' }} id={cells[i * gridrowcells + j].id} dangerouslySetInnerHTML={{ __html: cells[i * gridrowcells + j].content }} />
                                    <div style={{ width: "100%" }} />
                                    <div style={{ width: "100%" }}>
                                        <a href="#topdiv">Torna in alto</a>
                                    </div>
                                    <div style={{ width: "100%" }} />
                                </div>
                            </div>
                            : null
                    ))}
                </div>
            ))}
        </div>
    );
}

/*
    <Grid container spacing={2} columns={15}>
        <Grid item xs={3} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Paper elevation={3}>Entrata del dungeon</Paper>
        </Grid>
        <Grid item xs={3}>
            <Paper elevation={3}>Camera da letto</Paper>
        </Grid>
        <Grid item xs={3}>
            <Paper elevation={3}>Edificio di 7 piani, con sicurezza</Paper>
        </Grid>
        <Grid item xs={3}>
            <Paper elevation={3}>Sala da the</Paper>
        </Grid>
        <Grid item xs={3}>
            <Paper elevation={3}>Cripta</Paper>
        </Grid>
    </Grid>
*/
