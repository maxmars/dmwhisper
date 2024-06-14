import { useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Grid, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Editor } from 'ckeditor5-custom-build/build/ckeditor';
import { useState } from 'react';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { clearThrows, updateThrow } from '../../store/slices/throws';
import { useTranslation } from 'react-i18next';
import { uuidv4 } from '../../utils/index.js';
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
            element.setAttribute("style", "color: white !important; background-color: black !important;");
          } else {
            element.setAttribute("style", "color: black !important; background-color: white !important;");
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

  if (editedThrow !== null) {
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
                    <ListItemText primary={<div dangerouslySetInnerHTML={{ __html: throwResult.result }} />} secondary={<div style={{display: 'flex', alignItems: 'center'}}><EditIcon sx={{ borderRadius: '5px', backgroundColor: "#ffa726", cursor: "pointer" }} onClick={() => {
                        setEditedThrow(index);
                        setCurrentEditedContent(throwResult.result);
                      }}/>&nbsp;{throwResult.timestamp}</div>} />
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
  }
};


export default ResultsList;
