import * as React from 'react';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Information from '../contentwidgets/Information';
import Table from '../contentwidgets/Table';
import AreaMap from '../contentwidgets/areamaps/AreaMap';
import DungeonMap from '../contentwidgets/dungeons/DungeonMap';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useTranslation } from 'react-i18next';
import './SpotlightedContent.css';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getContentMetaData } from '../../store/slices/content';


const SpotlightedContent = (props) => {

  const { t } = useTranslation();
  const { path } = useParams();
  const wholeContent = useSelector((st) => st.content);
  const tree = wholeContent.tree;

  const spotlightedContent = getContentMetaData(tree, path);

  const getProperWidget = () => {

    try {
      switch (spotlightedContent.type) {
        case "information":
          return <Information currentTab={-1} content={spotlightedContent} />;

        case "table":
          return <Table currentTab={-1} content={spotlightedContent} />;

        case "map":
          const mapData = spotlightedContent;
          if (!mapData.data || !mapData.data.map ||
            !mapData.data.map.setpiece || !mapData.data.map.density ||
            !mapData.data.map.grid) {
            return (
              <div>
                <br />
                <br />
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <Typography>{'Error: Map data missing or incomplete'}</Typography>
                </div>
              </div>
            );
          }

          return <AreaMap currentTab={-1} content={spotlightedContent} />;

        case "dungeon":
          const dungeonData = spotlightedContent;
          if (!dungeonData.data || !dungeonData.data.dungeon ||
            !dungeonData.data.dungeon.rooms || !dungeonData.data.dungeon.setpiece ||
            !dungeonData.data.dungeon.trapSet || !dungeonData.data.dungeon.puzzleSet ||
            !dungeonData.data.dungeon.monsterSet || !dungeonData.data.dungeon.treasureSet) {
            return (
              <div>
                <br />
                <br />
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <Typography>{'Error: Dungeon data missing or incomplete'}</Typography>
                </div>
              </div>
            );
          }

          return <DungeonMap currentTab={-1} content={spotlightedContent} />;

        default:
          return <div>Link not found.</div>;
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
          display: 'flex',
          alignItems: 'center',
        }}
      >
       <Grid size={1}>
          <IconButton style={{ marginRight: "7px" }} variant="contained" onClick={() => window.history.back()}>
            <ArrowBackIosNewIcon />
          </IconButton>
        </Grid>
       <Grid size={11}>
          <Typography variant="h6" component="div" style={{ textAlign: 'center' }}>{spotlightedContent ? spotlightedContent.label : ""}</Typography>
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
        <Grid size={12} sx={{ height: "100%" }}>
          {getProperWidget()}
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
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
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12} sx={{ display: 'flex', justifyContent: 'center', verticalAlign: 'center' }}>
          <Button sx={{ width: '90%' }} variant="outlined" onClick={() => window.history.back()}>{t("Back")}</Button>
        </Grid>
      </Grid>
    </div>
  );

};


export default SpotlightedContent;
