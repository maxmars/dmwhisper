import * as React from 'react';


export default function DungeonMap(props) {

    return (
        <div>
            {[...Array(5)].map((_, i) => (
                <div key={i}>
                    <br />
                    <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                        <div style={{ display: 'flex', flexBasis: '20%', flexGrow: '0', justifyContent: 'center', backgroundColor: 'beige', color: 'black' }}>
                            <br />
                            <div style={{ display: 'flex', alignItems: 'center' }}>This</div>
                            <br />&nbsp;
                        </div>
                        <div style={{ display: 'flex', flexBasis: '20%', flexGrow: '0', justifyContent: 'center', backgroundColor: 'aliceblue', color: 'black' }}>
                            <br />
                            <div style={{ display: 'flex', alignItems: 'center' }}>is</div>
                            <br />&nbsp;
                        </div>
                        <div style={{ display: 'flex', flexBasis: '20%', flexGrow: '0', justifyContent: 'center', backgroundColor: 'lightgray', color: 'black' }}>
                            <br />
                            <div style={{ display: 'flex', alignItems: 'center' }}>a</div>
                            <br />&nbsp;
                        </div>
                        <div style={{ display: 'flex', flexBasis: '20%', flexGrow: '0', justifyContent: 'center', backgroundColor: 'lightskyblue', color: 'black' }}>
                            <br />
                            <div style={{ display: 'flex', alignItems: 'center' }}>rather basic and primitive, but effective, layout and color</div>
                            <br />&nbsp;
                        </div>
                        <div style={{ display: 'flex', flexBasis: '20%', flexGrow: '0', justifyContent: 'center', backgroundColor: 'lightsalmon', color: 'black' }}>
                            <br />
                            <div style={{ display: 'flex', alignItems: 'center' }}>test</div>
                            <br />&nbsp;
                        </div>
                    </div>
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
