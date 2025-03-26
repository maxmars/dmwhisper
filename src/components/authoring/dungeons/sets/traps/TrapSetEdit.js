import * as React from 'react';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useTheme } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useSelector, useDispatch } from 'react-redux';
import { updateDungeonTrapSetHeader, updateDungeonTrapSetItem } from '../../../../../store/slices/content.js';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import TablesChooser from '../../../tables/TablesChooser.js';
import { uuidv4 } from '../../../../../utils/index.js';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Editor } from 'ckeditor5-custom-build/build/ckeditor';
import { useRef } from 'react';


const TrapSetEdit = (props) => {

  const { t } = useTranslation();
  // const [unsavedContent, setUnsavedContent] = useState("no");
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editedTrapSetId, setEditedTrapSetId] = useState(props.itemId);
  const trapSets = useSelector((st) => st.content.dungeonTrapSets);
  const trapSet = trapSets.find((trap) => trap.id === props.itemId);
  const [editedTrapSetDescription, setEditedTrapDescription] = useState(trapSet.description);
  const theme = useTheme();
  const [alert, setAlert] = useState(null);
  const [itemAlert, setItemAlert] = useState(null);
  const [currentMenuTable, setCurrentMenuTable] = useState(undefined);
  const [currentMenuContent, setCurrentMenuContent] = useState('');

  const [newMin, setNewMin] = useState(null);
  const [newMax, setNewMax] = useState(null);
  const [newLabel, setNewLabel] = useState(null);
  const [newMaxOccurrences, setNewMaxOccurrences] = useState(100);
  const mounted = useRef();

  const rows = trapSet.rng.map((rng) => {
    let description = rng.description;

    return {
      id: rng.min + '-' + rng.max,
      description: description,
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

    if (trapSets.find((trap) => trap.id === editedTrapSetId) && editedTrapSetId !== props.itemId) {
      setAlert(t('Trap Set ID already exists'));
      return;
    }

    if (editedTrapSetId === '') {
      setAlert(t('Trap Set ID cannot be blank'));
      return;
    }

    if (editedTrapSetId === props.itemId && editedTrapSetDescription === props.itemDescription) {
      setAlert(t('No changes to save'));
      return;
    }

    dispatch(updateDungeonTrapSetHeader({
      originalDungeonTrapSetId: props.itemId,
      dungeonTrapSetId: editedTrapSetId,
      dungeonTrapSetDescription: editedTrapSetDescription,
    }));

    props.endEditing();
  }

  const columns = [
    {
      field: 'id',
      headerName: t('RNG'),
      width: window.innerWidth * 0.25,
    },
    {
      field: 'description',
      headerName: t('Description'),
      width: window.innerWidth * 0.6,
    },
    {
      field: 'actions',
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
    if (document.getElementById('new-min').value === '') {
      setItemAlert(t('Min value cannot be blank'));
      return;
    }

    if (document.getElementById('new-max').value === '') {
      setItemAlert(t('Max value cannot be blank'));
      return;
    }

    if (parseInt(document.getElementById('new-min').value) > parseInt(document.getElementById('new-max').value)) {
      setItemAlert(t('Min value cannot be greater than max value'));
      return;
    }

    if (trapSet.rng.find((rng) => rng.min === parseInt(document.getElementById('new-min').value) && rng.max === parseInt(document.getElementById('new-max').value))) {
      setItemAlert(t('RNG value already exists'));
      return;
    }

    const newRng = {
      min: parseInt(document.getElementById('new-min').value),
      max: parseInt(document.getElementById('new-max').value),
      description: document.getElementById('new-label').value,
      // TODO
      textContent: currentMenuContent,
      table: currentMenuTable,
      // TODO Unused ATM
      minAppears: 0,
      maxAppears: document.getElementById('new-max-occurrences').value,
      width: 1,
      height: 1,
      imgUrl: '',
    }

    const newRngs = [...trapSet.rng, newRng];

    dispatch(updateDungeonTrapSetItem({
      dungeonTrapSetId: props.itemId,
      item: newRngs,
    }));

    document.getElementById('new-min').value = '';
    document.getElementById('new-max').value = '';
    document.getElementById('new-result').value = '';
    setCurrentMenuTable(undefined);
  }

  const deleteRng = (itemToDelete) => {
    const newRng = trapSet.rng.filter((rng) => rng.min + '-' + rng.max !== itemToDelete);
    dispatch(updateDungeonTrapSetItem({
      dungeonTrapSetId: props.itemId,
      item: newRng,
    }));

    setItemToDelete(null);
  }

  const editRNGValues = (rngId) => {
    setNewMin(rngId.split('-')[0]);
    setNewMax(rngId.split('-')[1]);
    setNewLabel(trapSet.rng.find((rng) => rng.min + '-' + rng.max === rngId).description);
    setNewMaxOccurrences(trapSet.rng.find((rng) => rng.min + '-' + rng.max === rngId).maxAppears);
    setCurrentMenuTable(trapSet.rng.find((rng) => rng.min + '-' + rng.max === rngId).table);
    setCurrentMenuContent(trapSet.rng.find((rng) => rng.min + '-' + rng.max === rngId).textContent);
  }

  if (itemToDelete === null) {

    return (
      <Grid container >
        <Grid
          item
          xs={12}
          style={{ display: 'flex', justifyContent: 'center' }}
          sx={{
            bgcolor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText
          }}>
          <Typography>{t("Edited trap set:")} {props.itemId}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <TextField id="trap-set-id"
            label={t("Trap Set ID")}
            variant="outlined"
            sx={{ width: "100%" }}
            value={editedTrapSetId ? editedTrapSetId : ''}
            onChange={(event) => setEditedTrapSetId(event.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField id="trap-set-description"
            label={t("Trap Set Description")}
            variant="outlined"
            sx={{ width: "100%" }}
            value={editedTrapSetDescription ? editedTrapSetDescription : ''}
            onChange={(event) => setEditedTrapDescription(event.target.value)} />
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        {alert ?
          <>
            <Grid item xs={12}>
              <Alert severity='error' onClose={() => setAlert(null)}>
                {alert}
              </Alert>
            </Grid>
            <Grid item xs={12}>&nbsp;</Grid>
          </>
          :
          null}
        <Grid item xs={12}>
          <Button onClick={updateHeader} startIcon={<SaveAltIcon />} style={{ width: '100%' }} variant="contained" color="primary">{t("Update header info")}</Button>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid
          item
          xs={12}
          style={{ display: 'flex', justifyContent: 'center' }}
          sx={{
            bgcolor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText
          }}>
          <Typography>{t("List of RNG values")}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <Typography>{t("Click on the bin to delete values.")}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12} style={{ height: (rows ? (rows.length * 52) + 56 : "100") + "px", overflow: "scroll" }}>
          <DataGrid
            sx={{ '& .MuiDataGrid-columnHeadersInner': { backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText } }}
            onRowClick={(params) => editRNGValues(params.row.id)}
            rows={rows}
            columns={columns}
            hideFooterPagination={true}
            paginationModel={{ page: 0, pageSize: 100 }}
          />
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid
          item
          xs={12}
          style={{ display: 'flex', justifyContent: 'center' }}
          sx={{
            bgcolor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText
          }}>
          <Typography>{t("Add a new RNG:")}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <TextField
            onChange={(event) => setNewMin(event.target.value)}
            value={newMin ? newMin : ''}
            id="new-min"
            label={newMin ? "" : t("Min value")}
            type='number'
            variant="outlined"
            sx={{ width: "100%" }} />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={(event) => setNewMax(event.target.value)}
            value={newMax ? newMax : ''}
            id="new-max"
            label={newMax ? "" : t("Max value")}
            type='number'
            variant="outlined"
            sx={{ width: "100%" }} />
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <TextField
            onChange={(event) => setNewLabel(event.target.value)}
            value={newLabel ? newLabel : ''}
            id="new-label"
            label={newLabel ? "" : t("Trap label")}
            variant="outlined"
            sx={{ width: "100%" }} />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="number"
            onChange={(event) => setNewMaxOccurrences(event.target.value)}
            value={newMaxOccurrences ? newMaxOccurrences : ''}
            id="new-max-occurrences"
            label={newMaxOccurrences ? "" : t("Max occurrences")}
            variant="outlined"
            sx={{ width: "100%" }} />
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
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
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}><Typography>{t("Roll on the following tables:")}</Typography></Grid>
        <Grid item xs={12}>
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
        <Grid item xs={12}>&nbsp;</Grid>
        {itemAlert ?
          <>
            <Grid item xs={12}>
              <Alert severity='error' onClose={() => setItemAlert(null)}>
                {itemAlert}
              </Alert>
            </Grid>
            <Grid item xs={12}>&nbsp;</Grid>
          </>
          :
          null}
        <Grid item xs={12}>
          <Button onClick={addRng} startIcon={<AddIcon />} style={{ width: '100%' }} variant="contained" color="primary">{t("Add new RNG")}</Button>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <Button onClick={props.endEditing} startIcon={<ArrowBackIosNewIcon />} style={{ width: '100%' }} variant="contained" color="primary">{t("Back to trap sets list")}</Button>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
      </Grid >
    );
  } else {
    // get result from itemToDelete
    const result = trapSet.rng.find((rng) => rng.min + '-' + rng.max === itemToDelete).result;

    return (
      <Grid container >
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid
          item
          xs={12}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          sx={{
            bgcolor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText
          }}>
          <Typography>{t("Warning! RNG is about to be deleted")}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <Typography>{t("Do you really want to delete RNG")} {itemToDelete} ({result})?</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button onClick={() => deleteRng(itemToDelete)} startIcon={<CheckIcon />} variant="contained" color="primary">{t("Yes")}</Button>
        </Grid>
        <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button onClick={() => setItemToDelete(null)} startIcon={<CloseIcon />} variant="contained" color="primary">{t("No")}</Button>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
      </Grid >
    );
  }

}

export default TrapSetEdit;
