import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Information from '../contentwidgets/Information';
import Table from '../contentwidgets/Table';


const SelectedContent = (props) => {

  const getProperWidget = () => {

    switch (props.selectedContent.type) {
      case "information":
        return <Information content={props.selectedContent} />;

      case "table":
        return <Table content={props.selectedContent} />;

      default:
        return null;
    }

  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Grid
        container
        sx={{
          marginLeft: '20px',
          marginRight: '20px',
          height: '10%',
          width: '97vw',
          overflowY: 'hidden',
          overflowX: 'hidden',
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '20px',
            paddingBottom: '20px',
            backgroundColor: '#1976d2',
            color: 'white',
            width: '100%',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {props.selectedContent.label}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          marginLeft: '20px',
          marginRight: '20px',
          height: '79%',
          width: '97vw',
          overflowY: 'scroll',
          overflowX: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Grid item xs={12}>
          { getProperWidget() }
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          marginLeft: '20px',
          marginRight: '20px',
          minHeight: '10%',
          height: '10%',
          width: '97vw',
          overflowY: 'hidden',
          overflowX: 'hidden',
        }}
      >
        <Grid item xs={12}>
          <Button sx={{ width: '100%' }} variant="outlined" onClick={() => props.clearSelectedContent()}>Back</Button>
        </Grid>
      </Grid>
    </div>
  );

};


export default SelectedContent;
