import * as React from 'react';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Information from '../contentwidgets/Information';
import Table from '../contentwidgets/Table';
import AreaMap from '../contentwidgets/areamaps/AreaMap';
import DungeonMap from '../contentwidgets/dungeons/DungeonMap';
import Menu from '../contentwidgets/Menu';
import { useTranslation } from 'react-i18next';
import './SelectedContent.css';


const SelectedContent = (props) => {

  const { t } = useTranslation();

  const getProperWidget = () => {

    try {
      switch (props.selectedContent.type) {
        case "information":
          return <Information 
            backButton={props.backButton}
            homeMenu={props.homeMenu}
            bookmarkMenu={props.bookmarkMenu}
            currentTab={props.currentTab} 
            content={props.selectedContent} />;

        case "table":
          return <Table 
            backButton={props.backButton}
            homeMenu={props.homeMenu}
            bookmarkMenu={props.bookmarkMenu}
            currentTab={props.currentTab} 
            content={props.selectedContent} />;

        case "map":
          const mapData = props.selectedContent;
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

          return <AreaMap 
            backButton={props.backButton}
            homeMenu={props.homeMenu}
            bookmarkMenu={props.bookmarkMenu}
            currentTab={props.currentTab} 
            content={props.selectedContent} />;

        case "dungeon":
          const dungeonData = props.selectedContent;
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

          return <DungeonMap 
            backButton={props.backButton}
            homeMenu={props.homeMenu}
            bookmarkMenu={props.bookmarkMenu}
            currentTab={props.currentTab} 
            content={props.selectedContent} />;

        default:
          return <Menu currentTab={props.currentTab} content={props.selectedContent} goToContent={props.goToContent} />
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
          height: '80%',
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
          minHeight: '14%',
          height: '14%',
          width: '97vw',
          overflowY: 'hidden',
          overflowX: 'hidden',
        }}
      >
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12} sx={{ display: 'flex', justifyContent: 'center', verticalAlign: 'center' }}>
          <Button sx={{ width: '90%' }} variant="outlined" onClick={() => props.clearSelectedContent()}>{t("Back")}</Button>
        </Grid>
      </Grid>
    </div>
  );

};


export default SelectedContent;
