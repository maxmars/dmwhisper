import { useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Grid, List, ListItem, ListItemText, TextField, Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Editor } from 'ckeditor5-custom-build/build/ckeditor';
import { useState } from 'react';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { clearThrows, updateThrow, deleteThrow } from '../../store/slices/throws';
import { useTranslation } from 'react-i18next';
import { copyIntoClipboard } from '../../utils/index.js';
import useTheme from '@mui/private-theming/useTheme';
import { format } from 'date-fns';

const ResultsList = () => {

  //#region Component initializations
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const { t } = useTranslation();
  const throws = useSelector((st) => st.throws);
  const dispatch = useDispatch();
  const mounted = useRef();
  const [editedThrow, setEditedThrow] = useState(null);
  const [currentEditedContent, setCurrentEditedContent] = useState("");
  const [throwToBeDeleted, setThrowToBeDeleted] = useState(null);
  const [searchText, setSearchText] = useState("");
  //#endregion


  //#region CKEditor stuff
  useEffect(() => {
    ckEditorThemeSync();
  });

  const ckEditorThemeSync = () => {
    setTimeout(() => {
      let elToApply = document.getElementsByClassName("ck-content")[0];
      if (elToApply) {
        if (!mounted.current) {
          // do componentDidMount logic
          if (theme.palette.mode === "dark") {
            elToApply.setAttribute("style", "color: white !important; background-color: black !important;");
          } else {
            elToApply.setAttribute("style", "color: black !important; background-color: white !important;");
          }
          mounted.current = true;
        } else {
          if (theme.palette.mode === "dark") {
            elToApply.setAttribute("style", "color: white !important; background-color: black !important;");
          } else {
            elToApply.setAttribute("style", "color: black !important; background-color: white !important;");
          }
        }
      }

      elToApply = document.getElementsByTagName("a");

      if (elToApply) {
        const elArray = Array.from(elToApply);
        elArray.forEach(element => {
          if (theme.palette.mode === "dark") {
            element.setAttribute("style", "color: white !important; background-color: black !important; font-size: 12px !important;");
          } else {
            element.setAttribute("style", "color: black !important; background-color: white !important; font-size: 12px !important;");
          }
        });
      }
    }, 250);
  }

  let lng = navigator.language.substring(0, 2).toLocaleLowerCase();

  if (lng === "en") {
    lng = "en-gb";
  }

  require('ckeditor5-custom-build/build/translations/' + lng + '.js');
  //#endregion CKEditor stuff

  //#region page events
  const onClick = (rowId) => {
    dispatch(clearThrows(rowId));
  };

  const throwDelete = () => {
    dispatch(deleteThrow({ index: throwToBeDeleted }));
    setThrowToBeDeleted(null);
  };

  const throwCopy = async (rowId) => {
    try {
      const html = document.getElementById("throwHtmlContent" + rowId).outerHTML; // throws.sequence[rowId].result;
      const text = document.getElementById("throwHtmlContent" + rowId).textContent;

      await copyIntoClipboard(html, text);
      console.log('HTML fragment copied to clipboard');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }
  //#endregion page events

  //#region dungeon map stuff
  const getDungeonMapHtml = (index, cells, gridrowcells, gridrowdensity) => {
    const mapId = "throwHtmlContent" + index;

    return <div id={mapId}>
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
                    <a href={"#" + mapId} style={{ color: dark ? "yellow" : "blue" }}>{t("Back to top")}</a>
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
  //#endregion dungeon map stuff

  //#region render
  if (throwToBeDeleted !== null) {
    return (
      <Grid container sx={{ overflow: 'scroll' }}>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-around" }}>
          <Typography>{t("Are you sure you want to delete the content in slot")}?</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-around" }}>
          <Button variant="contained" color="primary" onClick={throwDelete}>{t("Yes")}</Button>
          <Button variant="contained" color="primary" onClick={() => setThrowToBeDeleted(null)}>{t("No")}</Button>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>&nbsp;</Grid>
      </Grid>
    );
  } else if (editedThrow !== null) {
    return (
      <Grid container sx={{ overflow: 'scroll' }}>
        <Grid item xs={12}>
          <CKEditor
            editor={Editor}
            data={currentEditedContent}
            config={{ language: { ui: navigator.language.substring(0, 2), content: navigator.language.substring(0, 2) } }}
            onReady={editor => {
              // You can store the "editor" and use when it is needed.
              //console.log('Editor is ready to use!', editor);
              ckEditorThemeSync();
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              //console.log({ event, editor, data });
              setCurrentEditedContent(data);
            }}
            onBlur={(event, editor) => {
              //console.log('Blur.', editor);
              ckEditorThemeSync();
            }}
            onFocus={(event, editor) => {
              //console.log('Focus.', editor);
              ckEditorThemeSync();
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button style={{ width: '100%' }} variant="contained" color="primary" onClick={() => {
            setEditedThrow(null);
            dispatch(updateThrow({ index: editedThrow, result: currentEditedContent, timestamp: format(new Date(), "yyyy-MM-dd' 'HH:mm:ss") }));
          }}>{t("Save and Close")}</Button>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid container sx={{ overflow: 'scroll' }}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', width: "100%" }}>
            <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField id="input-with-sx" label="" variant="standard" sx={{ width: "100%" }}
              value={searchText}
              onChange={(event) => { setSearchText(event.target.value) }} />
          </Box>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {throws.sequence.map((throwResult, index) => {
              if (throwResult.result.cells) {

                const filtered = throwResult.result.cells.filter(cell => {
                  if (cell) {
                    return cell.content.toLowerCase().includes(searchText.toLowerCase());
                  } else {
                    return false;
                  }
                });

                if (filtered.length === 0) {
                  return null;
                }

                return <ListItem key={"ris" + index}>
                  <ListItemText primary={<div>{getDungeonMapHtml(index, throwResult.result.cells, throwResult.result.gridrowcells, throwResult.result.gridrowdensity)}<br /><br /></div>}
                    secondary={<div style={{ display: 'flex', alignItems: 'center' }}>
                      <DeleteIcon sx={{ borderRadius: '3px', color: "white", backgroundColor: "#0089ff", cursor: "pointer" }} onClick={() => {
                        setThrowToBeDeleted(index);
                        setCurrentEditedContent(null);
                      }} />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <ContentCopyIcon sx={{ borderRadius: '3px', color: "white", backgroundColor: "#0089ff", cursor: "pointer" }} onClick={() => {
                        throwCopy(index);
                      }} />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {throwResult.timestamp}</div>} />
                </ListItem>
              } else {

                if (searchText.length > 0 && !throwResult.result.toLowerCase().includes(searchText.toLowerCase())) {
                  return null;
                }

                return (
                  <ListItem key={"ris" + index}>
                    <ListItemText primary={<div><div id={"throwHtmlContent" + index} dangerouslySetInnerHTML={{ __html: throwResult.result }} /><br /><br /></div>}
                      secondary={<div style={{ display: 'flex', alignItems: 'center' }}>
                        <EditIcon sx={{ borderRadius: '3px', color: "white", backgroundColor: "#0089ff", cursor: "pointer" }} onClick={() => {
                          setEditedThrow(index);
                          setCurrentEditedContent(throwResult.result);
                        }} />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <DeleteIcon sx={{ borderRadius: '3px', color: "white", backgroundColor: "#0089ff", cursor: "pointer" }} onClick={() => {
                          setThrowToBeDeleted(index);
                          setCurrentEditedContent(null);
                        }} />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <ContentCopyIcon sx={{ borderRadius: '3px', color: "white", backgroundColor: "#0089ff", cursor: "pointer" }} onClick={() => {
                          throwCopy(index);
                        }} />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {throwResult.timestamp}</div>} />
                  </ListItem>
                );
              }
            })}
          </List>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          {
            throws.sequence.length > 0 ?
              <Button style={{ width: '100%' }} variant="contained" color="primary" onClick={onClick}>{t("Clean")}</Button>
              : null
          }
        </Grid>
      </Grid>
    );
  }
  //#endregion render


};


export default ResultsList;
