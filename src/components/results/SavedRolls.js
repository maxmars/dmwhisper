import { useSelector } from 'react-redux';
import { Button, Grid, List, ListItem, ListItemText } from '@mui/material';
import { useDispatch } from 'react-redux';
import { clearThrows } from '../../store/slices/throws';
import { useTranslation } from 'react-i18next';
import { uuidv4 } from '../../utils/index.js';
import useTheme from '@mui/private-theming/useTheme';

const ResultsList = () => {

  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const { t } = useTranslation();
  const throws = useSelector((st) => st.throws);
  const dispatch = useDispatch();

  const onClick = (rowId) => {
    dispatch(clearThrows(rowId));
  };

  const getDungeonMapHtml = (cells, gridrowcells, gridrowdensity) => {
    const mapUuid = uuidv4();
    return <div id={"topdiv" + mapUuid}>
      {[...Array(gridrowcells)].map((_, i) => (
        <div key={"map" + i}>
          <br />
          <div style={{ display: 'flex', width: '100%' }}>
            {[...Array(gridrowcells)].map((_, j) => (
              <div key={"cell" + i + "-" + j} style={{ display: 'flex', flexBasis: (100 / gridrowcells) + '%', border: "2px solid " + (dark ? "black" : "white"), flexGrow: '0', justifyContent: 'center', backgroundColor: cells[i * gridrowcells + j] ? "orange" : "transparent" }}>
                <br />
                <div style={{ display: 'flex', alignItems: 'center' }}>{cells[i * gridrowcells + j] ? <a href={"#" + cells[i * gridrowcells + j].id} style={{ color: "white" }}>{cells[i * gridrowcells + j].description}</a> : " "}</div>
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
              <div key={i + ".." + j} style={{ width: '100%' }} id={cells[i * gridrowcells + j].id} >
                <br />
                <div key={i + "-" + j} style={{ display: 'block', flexBasis: '100%', flexGrow: '0', justifyContent: 'left', border: "2px solid orange" }}>
                  <div style={{ width: "100%" }} />
                  {"[" + (i + 1) + ", " + (j + 1) + "] " + t("Description") + ": " + cells[i * gridrowcells + j].description}
                  <div style={{ width: "100%", textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: cells[i * gridrowcells + j].content }} />
                  <div style={{ width: "100%" }} />
                  <div style={{ width: "100%" }}>
                    <a href={"#topdiv" + mapUuid} style={{ color: dark ? "yellow" : "blue" }}>{t("Back to top")}</a>
                  </div>
                  <div style={{ width: "100%" }} />
                </div>
              </div>
              : null
          ))}
        </div>
      ))}
      <br />

    </div>
  }

  return (
    <Grid container sx={{ overflow: 'scroll' }}>
      <Grid item xs={12}>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {throws.sequence.map((throwResult, index) => {
            if (throwResult.result.cells) {
              return <ListItem key={"ris" + index}>
                <ListItemText primary={getDungeonMapHtml(throwResult.result.cells, throwResult.result.gridrowcells, throwResult.result.gridrowdensity)} 
                              secondary={throwResult.timestamp} />
              </ListItem>
            } else {
              return (
                <ListItem key={"ris" + index}>
                  <ListItemText primary={<div dangerouslySetInnerHTML={{ __html: throwResult.result }} />} secondary={throwResult.timestamp} />
                </ListItem>
              );
            }
          })}
        </List>
      </Grid>
      <Grid item xs={12}>
        {
          throws.sequence.length > 0 ?
            <Button style={{ width: '100%' }} variant="contained" color="primary" onClick={onClick}>{t("Clean")}</Button>
            : null
        }
      </Grid>
    </Grid>
  );
};


export default ResultsList;
