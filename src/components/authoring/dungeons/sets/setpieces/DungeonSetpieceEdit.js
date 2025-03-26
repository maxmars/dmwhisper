import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FormControl, InputLabel, MenuItem, Select, Button, Grid, Typography, TextField, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Editor } from 'ckeditor5-custom-build/build/ckeditor';
import { updateDungeonSetpieceHeader, updateDungeonSetpieceItem } from '../../../../../store/slices/content.js';
import TablesChooser from '../../../tables/TablesChooser.js';
import { uuidv4 } from '../../../../../utils/index.js';


const DungeonSetpieceEdit = (props) => {

  const { t } = useTranslation();
  // const [unsavedContent, setUnsavedContent] = useState("no");
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editedSetpieceId, setEditedSetpieceId] = useState(props.itemId);
  const setpieces = useSelector((st) => st.content.dungeonSetpieces);
  const setpiece = setpieces.find((setpiece) => setpiece.id === props.itemId);
  const [editedSetpieceDescription, setEditedSetpieceDescription] = useState(setpiece.description);
  const theme = useTheme();
  const [alert, setAlert] = useState(null);
  const [itemAlert, setItemAlert] = useState(null);
  const [currentMenuTable, setCurrentMenuTable] = useState(undefined);
  const [currentMenuContent, setCurrentMenuContent] = useState('');

  const [newLabel, setNewLabel] = useState(null);
  const [newPositionInDungeon, setNewPositionInDungeon] = useState("any"); // any, start, middle, end
  const [newRate, setNewRate] = useState("common"); // common (70%), uncommon (25%), rare (5%). Only for "any" and "middle" positions
  const [newMaxOccurrences, setNewMaxOccurrences] = useState(100);
  const mounted = useRef();

  const rows = setpiece.rng.map((rng, index) => {
    let description = rng.description;

    return {
      id: index + 1,
      description: description,
      position: rng.positionInDungeon,
    }
  });

  const dispatch = useDispatch();

  // CKEditor stuff
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

      // elToApply = document.getElementsByTagName("a");

      // if (elToApply) {
      //   const elArray = Array.from(elToApply);
      //   elArray.forEach(element => {
      //     if (theme.palette.mode === "dark") {
      //       element.setAttribute("style", "color: white !important; background-color: black !important;");
      //     } else {
      //       element.setAttribute("style", "color: black !important; background-color: white !important;");
      //     }
      //   });
      // }
    }, 250);
  }

  let lng = navigator.language.substring(0, 2).toLocaleLowerCase();

  if (lng === "en") {
    lng = "en-gb";
  }

  require('ckeditor5-custom-build/build/translations/' + lng + '.js');
  // End CKEditor stuff

  useEffect(() => {
    const handleBackButton = (event) => {
      window.history.pushState({ noBackExitsApp: true }, '');
      event.preventDefault();
      props.endEditing();
    };

    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const updateHeader = () => {

    if (setpieces.find((setpiece) => setpiece.id === editedSetpieceId) && editedSetpieceId !== props.itemId) {
      setAlert(t('Setpiece Set ID already exists'));
      return;
    }

    if (editedSetpieceId === '') {
      setAlert(t('Setpiece Set ID cannot be blank'));
      return;
    }

    if (editedSetpieceId === props.itemId && editedSetpieceDescription === props.itemDescription) {
      setAlert(t('No changes to save'));
      return;
    }

    dispatch(updateDungeonSetpieceHeader({
      originalDungeonSetpieceId: props.itemId,
      dungeonSetpieceId: editedSetpieceId,
      dungeonSetpieceDescription: editedSetpieceDescription,
    }));

    props.endEditing();
  }

  const columns = [
    {
      field: 'id',
      headerName: t('id'),
      width: window.innerWidth * 0.05,
    },
    {
      field: 'description',
      headerName: t('Description'),
      width: window.innerWidth * 0.6,
    },
    {
      field: 'position',
      headerName: t('Position in Dungeon'),
      width: window.innerWidth * 0.2,
    },
    {
      field: 'actions',
      headerName: t('Delete'),
      type: 'actions',
      width: window.innerWidth * 0.15,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label={t("Delete")}
          onClick={() => setItemToDelete(params.id)} />
      ]
    },
  ];

  const addRng = () => {
    const newRng = {
      description: newLabel,
      // TODO
      textContent: currentMenuContent,
      table: currentMenuTable,
      // TODO Unused ATM
      minAppears: 0,
      maxAppears: newMaxOccurrences,
      positionInDungeon: newPositionInDungeon,
      appearanceRate: newRate,
      width: 1,
      height: 1,
      imgUrl: '',
    }

    const newRngs = [...setpiece.rng, newRng];

    dispatch(updateDungeonSetpieceItem({
      dungeonSetpieceId: props.itemId,
      item: newRngs,
    }));

    // document.getElementById('new-result').value = '';
    setCurrentMenuTable(undefined);
  }

  const deleteRng = (itemToDelete) => {
    const newRng = setpiece.rng.filter((rng, index) => index !== itemToDelete - 1);
    dispatch(updateDungeonSetpieceItem({
      dungeonSetpieceId: props.itemId,
      item: newRng,
    }));

    setItemToDelete(null);
  }

  const editRNGValues = (rngId) => {
    setNewLabel(setpiece.rng[rngId - 1].description);
    setNewPositionInDungeon(setpiece.rng[rngId - 1].positionInDungeon);
    setNewRate(setpiece.rng[rngId - 1].appearanceRate);
    setNewMaxOccurrences(setpiece.rng[rngId - 1].maxAppears);
    setCurrentMenuTable(setpiece.rng[rngId - 1].table);
    setCurrentMenuContent(setpiece.rng[rngId - 1].textContent);
  }

  if (itemToDelete === null) {

    return (
      <Grid container >
        <Grid
          style={{ display: 'flex', justifyContent: 'center' }}
          sx={{
            bgcolor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText
          }}
          size={12}>
          <Typography>{t("Edited setpiece:")} {props.itemId}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <TextField id="setpiece-set-id"
            label={t("Setpiece Set ID")}
            variant="outlined"
            sx={{ width: "100%" }}
            value={editedSetpieceId ? editedSetpieceId : ''}
            onChange={(event) => setEditedSetpieceId(event.target.value)}
          />
        </Grid>
        <Grid size={12}>
          <TextField id="setpiece-set-description"
            label={t("Setpiece Set Description")}
            variant="outlined"
            sx={{ width: "100%" }}
            value={editedSetpieceDescription ? editedSetpieceDescription : ''}
            onChange={(event) => setEditedSetpieceDescription(event.target.value)} />
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        {alert ?
          <>
            <Grid size={12}>
              <Alert severity='error' onClose={() => setAlert(null)}>
                {alert}
              </Alert>
            </Grid>
            <Grid size={12}>&nbsp;</Grid>
          </>
          :
          null}
        <Grid size={12}>
          <Button onClick={updateHeader} startIcon={<SaveAltIcon />} style={{ width: '100%' }} variant="contained" color="primary">{t("Update header info")}</Button>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid
          style={{ display: 'flex', justifyContent: 'center' }}
          sx={{
            bgcolor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText
          }}
          size={12}>
          <Typography>{t("List of RNG values")}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <Typography>{t("Click on the bin to delete values.")}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid
          style={{ height: (rows ? (rows.length * 52) + 56 : "100") + "px", overflow: "scroll" }}
          size={12}>
          <DataGrid       
            sx={{ '& .MuiDataGrid-columnHeadersInner': { backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText } }}     
            onRowClick={(params) => editRNGValues(params.row.id)}
            rows={rows}
            columns={columns}
            hideFooterPagination={true}
            paginationModel={{ page: 0, pageSize: 100 }}
          />
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid
          style={{ display: 'flex', justifyContent: 'center' }}
          sx={{
            bgcolor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText
          }}
          size={12}>
          <Typography>{t("Add a new RNG:")}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <FormControl fullWidth>
            <InputLabel id="dungeon-position-select-label">{t("Position in dungeon")}</InputLabel>
            <Select
              labelId="dungeon-position-select-label"
              id="dungeon-position-select"
              value={newPositionInDungeon}
              label="Position in dungeon"
              onChange={(event) => setNewPositionInDungeon(event.target.value)}
            >
              <MenuItem value={"start"}>Start</MenuItem>
              <MenuItem value={"middle"}>Middle</MenuItem>
              <MenuItem value={"end"}>End</MenuItem>
              <MenuItem value={"any"}>Any</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <FormControl fullWidth>
            <InputLabel id="appearance-rate-select-label">{t("Appearance Rate")}</InputLabel>
            <Select
              labelId="appearance-rate-select-label"
              id="dappearance-rate-select"
              value={newRate}
              label="Appearance Rate"
              onChange={(event) => setNewRate(event.target.value)}
              disabled={newPositionInDungeon === "start" || newPositionInDungeon === "end"}
            >
              <MenuItem value={"common"}>Common</MenuItem>
              <MenuItem value={"uncommon"}>Uncommon</MenuItem>
              <MenuItem value={"rare"}>Rare</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <TextField
            onChange={(event) => setNewLabel(event.target.value)}
            value={newLabel ? newLabel : ''}
            id="new-label"
            label={newLabel ? "" : t("Setpiece label")}
            variant="outlined"
            sx={{ width: "100%" }} />
        </Grid>
        <Grid size={12}>
          <TextField
            type="number"
            onChange={(event) => setNewMaxOccurrences(event.target.value)}
            value={newMaxOccurrences ? newMaxOccurrences : ''}
            id="new-max-occurrences"
            label={newMaxOccurrences ? "" : t("Max occurrences")}
            variant="outlined"
            sx={{ width: "100%" }} />
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <CKEditor
          editor={Editor}
          data={currentMenuContent}
          config={{ language: { ui: navigator.language.substring(0, 2), content: navigator.language.substring(0, 2) } }}
          onReady={editor => {
            // You can store the "editor" and use when it is needed.
            //console.log('Editor is ready to use!', editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            //console.log({ event, editor, data });
            setCurrentMenuContent(data);
            //setUnsavedContent("yes");
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
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}><Typography>{t("Roll on the following tables:")}</Typography></Grid>
        <Grid size={12}>
          <TablesChooser
            tablesIds={currentMenuTable && currentMenuTable.trim().length > 0 ? currentMenuTable.trim().split(' ').map((item) => {
              return {
                label: item,
                id: uuidv4()
              }
            }) : null}
            onTablesChange={(tables) => {
              if (tables !== currentMenuTable) {
                setCurrentMenuTable(tables);
                // setUnsavedContent("yes");
              }
            }}
          />
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        {itemAlert ?
          <>
            <Grid size={12}>
              <Alert severity='error' onClose={() => setItemAlert(null)}>
                {itemAlert}
              </Alert>
            </Grid>
            <Grid size={12}>&nbsp;</Grid>
          </>
          :
          null}
        <Grid size={12}>
          <Button onClick={addRng} startIcon={<AddIcon />} style={{ width: '100%' }} variant="contained" color="primary">{t("Add new RNG")}</Button>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <Button onClick={props.endEditing} startIcon={<ArrowBackIosNewIcon />} style={{ width: '100%' }} variant="contained" color="primary">{t("Back to setpieces list")}</Button>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
      </Grid >
    );
  } else {
    // get result from itemToDelete
    const result = setpiece.rng.find((rng, index) => index === itemToDelete - 1).description;

    return (
      <Grid container >
        <Grid size={12}>&nbsp;</Grid>
        <Grid
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          sx={{
            bgcolor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText
          }}
          size={12}>
          <Typography>{t("Warning! RNG is about to be deleted")}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <Typography>{t("Do you really want to delete RNG")} {itemToDelete} ({result})?</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          size={6}>
          <Button onClick={() => deleteRng(itemToDelete)} startIcon={<CheckIcon />} variant="contained" color="primary">{t("Yes")}</Button>
        </Grid>
        <Grid
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          size={6}>
          <Button onClick={() => setItemToDelete(null)} startIcon={<CloseIcon />} variant="contained" color="primary">{t("No")}</Button>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
      </Grid >
    );
  }

}

export default DungeonSetpieceEdit;