import * as React from 'react';


export default function DungeonMap(props) {

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

    const gridcolwidth = 100 / gridrowcells;

    return (
        <div>
            {[...Array(gridrowcells)].map((_, i) => (
                <div key={i}>
                    <br />
                    <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                        {[...Array(gridrowcells)].map((_, j) => (
                            <div style={{ display: 'flex', flexBasis: gridcolwidth + '%', flexGrow: '0', justifyContent: 'center', backgroundColor: 'beige', color: 'black' }}>
                                <br />
                                <div style={{ display: 'flex', alignItems: 'center' }}>This</div>
                                <br />&nbsp;
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <br />
            {[...Array(gridrowcells)].map((_, i) => (
                <div key={"l" + i} style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                    {[...Array(gridrowcells)].map((_, j) => (
                        <div key={i + ".." + j} style={{ width: '100%' }}>
                            <br />
                            <div key={i + "-" + j} style={{ display: 'flex', flexBasis: '100%', flexGrow: '0', justifyContent: 'center', backgroundColor: 'beige', color: 'black' }}>
                                <br />
                                <div style={{ display: 'flex', alignItems: 'center' }}>..</div>
                                <br />&nbsp;
                            </div>
                        </div>
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
