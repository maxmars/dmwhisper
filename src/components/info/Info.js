import { Grid, Typography, Link } from '@mui/material';
import logo from './logo_dmwhisper.jpeg';

const Info = () => {

  return (
    <Grid container sx={{ overflow: 'scroll' }}>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h4">DM Whisper</Typography>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography m={2} variant='body'>v. 1.0.2</Typography>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <img alt="DMWhisper logo" style={{ maxWidth: '98%', maxHeight: '98%' }} src={logo} />
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Typography m={2} variant="h6">An app that helps Dungeon Masters run Role Playing Games sessions,
          by rolling dice and instantly looking up table items, with a few twists.</Typography>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Typography m={2} variant="body">By <Link href="mailto:maxmars@gmail.com">Massimiliano Marsiglietti</Link>, published under the Apache 2.0 Open Source license.</Typography>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Typography m={2} variant="body">See the product home page for information about how to configure it yourself.</Typography>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Link href="https://github.com/maxmars/dmwhisper">github.com/maxmars/dmwhisper</Link>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
    </Grid>
  );
};


export default Info;
