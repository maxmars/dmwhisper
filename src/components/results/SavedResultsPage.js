import { useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import { Button, Grid2 as Grid, List, ListItem, TextField, Box, AccordionSummary, AccordionDetails, Accordion } from '@mui/material';
import html2pdf from 'html2pdf.js';
import Typography from '@mui/material/Typography';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Editor } from 'ckeditor5-custom-build/build/ckeditor';
import { useState } from 'react';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { clearThrows, updateThrow, deleteThrow } from '../../store/slices/throws.js';
import { useTranslation } from 'react-i18next';
import { copyIntoClipboard } from '../../utils/index.js';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';
import DungeonComponent from '../contentwidgets/dungeons/DungeonComponent.js';
import AreaMapComponent from '../contentwidgets/areamaps/AreaMapComponent.js';
import { downloadJson } from '../../utils/index.js';
import UploadIcon from '@mui/icons-material/Upload';
import ClearThrowsConfirm from './ClearThrowsConfirm.js';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const SavedResultsPage = ({ showImportContentWidget, showGenAiWidget }) => {

  //#region Component initializations
  const savepagesearchtext = localStorage.getItem("savepagesearchtext");

  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const { t } = useTranslation();
  const throws = useSelector((st) => st.throws);
  const dispatch = useDispatch();
  const mounted = useRef();
  const [editedThrow, setEditedThrow] = useState(null);
  const [currentEditedContent, setCurrentEditedContent] = useState("");
  const [throwToBeDeleted, setThrowToBeDeleted] = useState(null);
  const [searchText, setSearchText] = useState(savepagesearchtext ? savepagesearchtext : "");
  const [confirmClearThrows, setConfirmClearThrows] = useState(false);
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

      //     elToApply = document.getElementsByTagName("a");

      //     if (elToApply) {
      //       const elArray = Array.from(elToApply);
      //       elArray.forEach(element => {
      //         if (theme.palette.mode === "dark") {
      //           element.setAttribute("style", "color: white !important; background-color: black !important; font-size: 12px !important;");
      //         } else {
      //           element.setAttribute("style", "color: black !important; background-color: white !important; font-size: 12px !important;");
      //         }
      //       });
      //     }
    }, 250);
  }

  let lng = navigator.language.substring(0, 2).toLocaleLowerCase();

  if (lng === "en") {
    lng = "en-gb";
  }

  require('ckeditor5-custom-build/build/translations/' + lng + '.js');
  //#endregion CKEditor stuff

  //#region page events
  const clearAllThrows = (rowId) => {
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

  const saveAsPdf = (elementId) => {
    const element = document.getElementById(elementId);

    const backgroundColor = (dark ? "black" : "white");
    const html2canvasOpts = { backgroundColor: backgroundColor, scale: 1 };

    if (elementId.includes("dungeondraw")) {
      html2canvasOpts.width = window.innerWidth;
    }

    const opt = {
      margin: 1,
      filename: elementId + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: html2canvasOpts,
      jsPDF: { format: 'a4' }
    };

    html2pdf(element, opt);
  }
  //#endregion page events

  //#region render
  if (confirmClearThrows) {
    return (
      <ClearThrowsConfirm
        onYesClick={() => {
          clearAllThrows();
          setConfirmClearThrows(false);
        }}
        onNoClick={() => {
          setConfirmClearThrows(false);
        }}
      />
    );
  }

  if (throwToBeDeleted !== null) {
    return (
      <Grid container sx={{ overflow: 'scroll' }}>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid sx={{ display: "flex", justifyContent: "space-around" }} size={12}>
          <Typography>{t("Are you sure you want to delete the content in slot")}?</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid sx={{ display: "flex", justifyContent: "space-around" }} size={12}>
          <Button variant="contained" color="primary" onClick={throwDelete}>{t("Yes")}</Button>
          <Button variant="contained" color="primary" onClick={() => setThrowToBeDeleted(null)}>{t("No")}</Button>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>&nbsp;</Grid>
      </Grid>
    );
  } else if (editedThrow !== null) {
    return (
      <Grid container sx={{ overflow: 'scroll' }}>
        <Grid size={12}>
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
        <Grid size={12}>
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
        <Grid size={12}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', width: "100%" }}>
            <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField id="input-with-sx" label="" variant="standard" sx={{ width: "100%" }}
              value={searchText}
              onChange={(event) => {
                localStorage.setItem("savepagesearchtext", event.target.value);
                setSearchText(event.target.value);
              }} />
          </Box>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {throws.sequence.map((throwResult, index) => {
              if (throwResult.result.cells) {

                const filtered = throwResult.result.cells.filter(cell => {
                  if (searchText.length === 0) {
                    return true;
                  }

                  if (cell) {
                    return cell.content.toLowerCase().includes(searchText.toLowerCase());
                  } else {
                    return false;
                  }
                });

                if (filtered.length === 0) {
                  return null;
                }

                return (
                  <ListItem key={"ris" + index}>
                    <Accordion style={{ width: "100%" }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index}-content`} id={`panel${index}-header`} >
                        <Typography>{t("Mappa salvata in data") + " " + throwResult.timestamp}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div style={{ maxWidth: "100%", width: "100%", backgroundColor: dark ? 'black' : 'white' }} id={"areamapdraw" + index}>
                          <AreaMapComponent cells={throwResult.result.cells} gridrowcells={throwResult.result.gridrowcells} dark={dark} />
                          <br /><br />
                        </div>
                        <Grid container sx={{ overflow: 'scroll' }}>
                          <Grid size={12}>
                            <DeleteIcon sx={{ borderRadius: '3px', color: "white", backgroundColor: "#0089ff", cursor: "pointer" }} onClick={() => {
                              setThrowToBeDeleted(index);
                              setCurrentEditedContent(null);
                            }} />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <PictureAsPdfIcon sx={{ borderRadius: '3px', color: "white", backgroundColor: "#0089ff", cursor: "pointer" }} onClick={() => {
                              saveAsPdf("areamapdraw" + index);
                            }} />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <DownloadIcon sx={{ borderRadius: '3px', color: "white", backgroundColor: "#0089ff", cursor: "pointer" }} onClick={() => {
                              downloadJson({ contentType: "areamap", contentData: throwResult.result }, "savedMapContent.json");
                            }} />
                          </Grid>
                          <Grid sx={{ mt: 1 }} size={12}>
                            {throwResult.timestamp}
                          </Grid>
                          <Grid size={12}>
                            <Box sx={[{
                              width: '100%',
                              borderBottom: '1px solid'
                            }, dark ? {
                              borderColor: 'yellow'
                            } : {
                              borderColor: 'blue'
                            }]} />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </ListItem>
                );
              } else if (throwResult.result.dungeonRooms) {
                if (searchText.length > 0 && !throwResult.result.dungeonName.toLowerCase().includes(searchText.toLowerCase())) {
                  return null;
                }
                return (
                  <ListItem key={"dungeon" + index}>
                    <Accordion style={{ width: "100%" }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index}-content`} id={`panel${index}-header`} >
                        <Typography>{t("Dungeon") + " " + throwResult.result.dungeonName}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div style={{ backgroundColor: dark ? 'black' : 'white' }} id={"dungeondraw" + index}>
                          <div>{t("Dungeon") + " " + throwResult.result.dungeonName}</div>
                          <br />
                          <DungeonComponent dungeonRooms={throwResult.result.dungeonRooms} />
                          <br />
                          <br />
                        </div>
                        <Grid container sx={{ overflow: 'scroll' }}>
                          <Grid size={12}>
                            <DeleteIcon sx={{ borderRadius: '3px', color: "white", backgroundColor: "#0089ff", cursor: "pointer" }} onClick={() => {
                              setThrowToBeDeleted(index);
                              setCurrentEditedContent(null);
                            }} />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <PictureAsPdfIcon sx={{ borderRadius: '3px', color: "white", backgroundColor: "#0089ff", cursor: "pointer" }} onClick={() => {
                              saveAsPdf("dungeondraw" + index);
                            }} />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <DownloadIcon sx={{ borderRadius: '3px', color: "white", backgroundColor: "#0089ff", cursor: "pointer" }} onClick={() => {
                              downloadJson({ contentType: "dungeon", contentData: throwResult.result }, "savedDungeonContent.json");
                            }} />
                          </Grid>
                          <Grid sx={{ mt: 1 }} size={12}>
                            {throwResult.timestamp}
                          </Grid>
                          <Grid size={12}>
                            <Box sx={[{
                              width: '100%',
                              borderBottom: '1px solid'
                            }, dark ? {
                              borderColor: 'yellow'
                            } : {
                              borderColor: 'blue'
                            }]} />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </ListItem>
                );
              } else {
                if (searchText.length > 0 && !throwResult.result.toLowerCase().includes(searchText.toLowerCase())) {
                  return null;
                }
                return (
                  <ListItem key={"ris" + index}>
                    <Accordion style={{ width: "100%" }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index}-content`} id={`panel${index}-header`} >
                        <Typography>{t("Contenuto salvato in data") + " " + throwResult.timestamp}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div>
                          <div style={{ maxWidth: "100%", width: "100%", backgroundColor: dark ? 'black' : 'white' }} id={"throwHtmlContent" + index} dangerouslySetInnerHTML={{ __html: throwResult.result }} />
                          <br /><br />
                        </div>
                        <Grid container sx={{ overflow: 'scroll' }}>
                          <Grid size={12}>
                            <EditIcon sx={{ borderRadius: '3px', color: "white", backgroundColor: "#0089ff", cursor: "pointer" }} onClick={() => {
                              setEditedThrow(index);
                              setCurrentEditedContent(throwResult.result);
                            }} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <AutoAwesomeIcon sx={{ borderRadius: '3px', color: "white", backgroundColor: "#0089ff", cursor: "pointer" }} onClick={() => {
                              showGenAiWidget(throwResult.result);
                            }} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <ContentCopyIcon sx={{ borderRadius: '3px', color: "white", backgroundColor: "#0089ff", cursor: "pointer" }} onClick={() => {
                              throwCopy(index);
                            }} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <DeleteIcon sx={{ borderRadius: '3px', color: "white", backgroundColor: "#0089ff", cursor: "pointer" }} onClick={() => {
                              setThrowToBeDeleted(index);
                              setCurrentEditedContent(null);
                            }} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <PictureAsPdfIcon sx={{ borderRadius: '3px', color: "white", backgroundColor: "#0089ff", cursor: "pointer" }} onClick={() => {
                              saveAsPdf("throwHtmlContent" + index);
                            }} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <DownloadIcon sx={{ borderRadius: '3px', color: "white", backgroundColor: "#0089ff", cursor: "pointer" }} onClick={() => {
                              downloadJson({ contentType: "text", contentData: throwResult.result }, "savedTextContent.json");
                            }} />
                          </Grid>
                          <Grid sx={{ mt: 1 }} size={12}>
                            {throwResult.timestamp}
                          </Grid>
                          <Grid size={12}>
                            <Box sx={[{
                              width: '100%',
                              borderBottom: '1px solid'
                            }, dark ? {
                              borderColor: 'yellow'
                            } : {
                              borderColor: 'blue'
                            }]} />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </ListItem>
                );
              }
            })}
          </List>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          {
            throws.sequence.length > 0 ?
              <Button style={{ width: '100%' }} variant="contained" color="primary" onClick={() => setConfirmClearThrows(true)}>{t("Clean")}</Button>
              : null
          }
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <Button startIcon={<UploadIcon />} onClick={showImportContentWidget} style={{ width: '100%' }} variant="contained" color="primary">{t("Import data")}</Button>
        </Grid>
      </Grid>
    );
  }
  //#endregion render
};
export default SavedResultsPage;