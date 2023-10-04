import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Information from '../contentwidgets/Information';
import Table from '../contentwidgets/Table';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './SelectedContent.css';


const SelectedContent = (props) => {

  const { t } = useTranslation();

  const getProperWidget = () => {

    try {
      switch (props.selectedContent.type) {
        case "information":
          return <Information content={props.selectedContent} />;

        case "table":
          return <Table content={props.selectedContent} />;

        default:
          return null;
      }
    } catch (e) {
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
          height: '4em',
          width: '97vw',
          overflowY: 'hidden',
          overflowX: 'hidden',
          backgroundColor: '#1976d2',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Grid item xs={1}>
          <IconButton style={{ marginRight: "7px" }} variant="contained" onClick={props.clearSelectedContent}>
            <ArrowBackIosNewIcon sx={{ 'color': 'white !important' }} />
          </IconButton>
        </Grid>
        <Grid item xs={11}>
          <Typography variant="h6" component="div" style={{ textAlign: 'center' }}>{props.selectedContent ? props.selectedContent.label : ""}</Typography>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          marginLeft: '20px',
          marginRight: '20px',
          height: '75%',
          width: '97vw',
          overflowY: 'scroll',
          overflowX: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Grid item xs={12}>
          {getProperWidget()}
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
      </Grid>
      <Grid
        container
        sx={{
          marginLeft: '20px',
          marginRight: '20px',
          minHeight: '14%',
          height: '14%',
          width: '97vw',
          overflowY: 'hidden',
          overflowX: 'hidden',
        }}
      >
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', verticalAlign: 'center'}}>
          <Button startIcon={<ArrowBackIcon />} sx={{ width: '90%' }} variant="outlined" onClick={() => props.goToPreviousContent()}>&nbsp;</Button>
        </Grid>
        <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', verticalAlign: 'center'}}>
          <Button sx={{ width: '90%' }} variant="outlined" onClick={() => props.clearSelectedContent()}>{t("Back")}</Button>
        </Grid>
        <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', verticalAlign: 'center'}}>
          <Button endIcon={<ArrowForwardIcon />} sx={{ width: '99100%' }} variant="outlined" onClick={() => props.goToNextContent()}>&nbsp;</Button>
        </Grid>
      </Grid>
    </div>
  );

};


export default SelectedContent;
