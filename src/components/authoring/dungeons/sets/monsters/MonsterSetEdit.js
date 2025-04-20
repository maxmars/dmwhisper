import * as React from 'react';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useTheme } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useSelector, useDispatch } from 'react-redux';
import { updateDungeonMonsterSetHeader, updateDungeonMonsterSetItem } from '../../../../../store/slices/content.js';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import TablesChooser from '../../../tables/TablesChooser.js';
import { uuidv4 } from '../../../../../utils/index.js';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Editor } from 'ckeditor5-custom-build/build/ckeditor';
import { useEffect } from 'react';
// import { useRef } from 'react';


const MonsterSetEdit = (props) => {

  const { t } = useTranslation();
  // const [unsavedContent, setUnsavedContent] = useState("no");
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editedMonsterSetId, setEditedMonsterSetId] = useState(props.itemId);
  const monsterSets = useSelector((st) => st.content.dungeonMonsterSets);
  const monsterSet = monsterSets.find((monster) => monster.id === props.itemId);
  const [editedMonsterSetDescription, setEditedMonsterDescription] = useState(monsterSet.description);
  const theme = useTheme();
  const [alert, setAlert] = useState(null);
  const [itemAlert, setItemAlert] = useState(null);
  const [currentMenuTable, setCurrentMenuTable] = useState(undefined);
  const [currentMenuContent, setCurrentMenuContent] = useState('');

  const [newMin, setNewMin] = useState(null);
  const [newMax, setNewMax] = useState(null);
  const [newLabel, setNewLabel] = useState(null);
  const [newMaxOccurrences, setNewMaxOccurrences] = useState(100);
  // const mounted = useRef();

  const rows = monsterSet.rng.map((rng) => {
    let description = rng.description;

    return {
      id: rng.min + '-' + rng.max,
      description: description,
    }
  });

  const dispatch = useDispatch();

  // CKEditor stuff
  // useEffect(() => {
  //   ckEditorThemeSync();
  // });

  // const ckEditorThemeSync = () => {
  //   setTimeout(() => {
  //     let elToApply = document.getElementsByClassName("ck-content")[0];
  //     if (elToApply) {
  //       if (!mounted.current) {
  //         // do componentDidMount logic
  //         if (theme.palette.mode === "dark") {
  //           elToApply.setAttribute("style", "color: white !important; background-color: black !important;");
  //         } else {
  //           elToApply.setAttribute("style", "color: black !important; background-color: white !important;");
  //         }
  //         mounted.current = true;
  //       } else {
  //         if (theme.palette.mode === "dark") {
  //           elToApply.setAttribute("style", "color: white !important; background-color: black !important;");
  //         } else {
  //           elToApply.setAttribute("style", "color: black !important; background-color: white !important;");
  //         }
  //       }
  //     }

  //     // elToApply = document.getElementsByTagName("a");

  //     // if (elToApply) {
  //     //   const elArray = Array.from(elToApply);
  //     //   elArray.forEach(element => {
  //     //     if (theme.palette.mode === "dark") {
  //     //       element.setAttribute("style", "color: white !important; background-color: black !important;");
  //     //     } else {
  //     //       element.setAttribute("style", "color: black !important; background-color: white !important;");
  //     //     }
  //     //   });
  //     // }
  //   }, 250);
  // }

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
  }, [props, props.endEditing]);
  
  const updateHeader = () => {

    if (monsterSets.find((monster) => monster.id === editedMonsterSetId) && editedMonsterSetId !== props.itemId) {
      setAlert(t('Monster Set ID already exists'));
      return;
    }

    if (editedMonsterSetId === '') {
      setAlert(t('Monster Set ID cannot be blank'));
      return;
    }

    if (editedMonsterSetId === props.itemId && editedMonsterSetDescription === props.itemDescription) {
      setAlert(t('No changes to save'));
      return;
    }

    dispatch(updateDungeonMonsterSetHeader({
      originalDungeonMonsterSetId: props.itemId,
      dungeonMonsterSetId: editedMonsterSetId,
      dungeonMonsterSetDescription: editedMonsterSetDescription,
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

    if (monsterSet.rng.find((rng) => rng.min === parseInt(document.getElementById('new-min').value) && rng.max === parseInt(document.getElementById('new-max').value))) {
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

    const newRngs = [...monsterSet.rng, newRng];

    dispatch(updateDungeonMonsterSetItem({
      dungeonMonsterSetId: props.itemId,
      item: newRngs,
    }));

    document.getElementById('new-min').value = '';
    document.getElementById('new-max').value = '';
    //document.getElementById('new-result').value = '';
    setCurrentMenuTable(undefined);
  }

  const deleteRng = (itemToDelete) => {
    const newRng = monsterSet.rng.filter((rng) => rng.min + '-' + rng.max !== itemToDelete);
    dispatch(updateDungeonMonsterSetItem({
      dungeonMonsterSetId: props.itemId,
      item: newRng,
    }));

    setItemToDelete(null);
  }

  const editRNGValues = (rngId) => {
    setNewMin(rngId.split('-')[0]);
    setNewMax(rngId.split('-')[1]);
    setNewLabel(monsterSet.rng.find((rng) => rng.min + '-' + rng.max === rngId).description);
    setNewMaxOccurrences(monsterSet.rng.find((rng) => rng.min + '-' + rng.max === rngId).maxAppears);
    setCurrentMenuTable(monsterSet.rng.find((rng) => rng.min + '-' + rng.max === rngId).table);
    setCurrentMenuContent(monsterSet.rng.find((rng) => rng.min + '-' + rng.max === rngId).textContent);
  }

  if (itemToDelete === null) {

    return (
      <Grid container >
        <Grid
          size={12}
          style={{ display: 'flex', justifyContent: 'center' }}
          sx={{
            bgcolor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText
          }}>
          <Typography>{t("Edited monster set:")} {props.itemId}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <TextField id="monster-set-id"
            label={t("Monster Set ID")}
            variant="outlined"
            sx={{ width: "100%" }}
            value={editedMonsterSetId ? editedMonsterSetId : ''}
            onChange={(event) => setEditedMonsterSetId(event.target.value)}
          />
        </Grid>
        <Grid size={12}>
          <TextField id="monster-set-description"
            label={t("Monster Set Description")}
            variant="outlined"
            sx={{ width: "100%" }}
            value={editedMonsterSetDescription ? editedMonsterSetDescription : ''}
            onChange={(event) => setEditedMonsterDescription(event.target.value)} />
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
          size={12}
          style={{ display: 'flex', justifyContent: 'center' }}
          sx={{
            bgcolor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText
          }}>
          <Typography>{t("List of RNG values")}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <Typography>{t("Click on the bin to delete values.")}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12} style={{ height: (rows ? (rows.length * 52) + 56 : "100") + "px", overflow: "scroll" }}>
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
          size={12}
          style={{ display: 'flex', justifyContent: 'center' }}
          sx={{
            bgcolor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText
          }}>
          <Typography>{t("Add a new RNG:")}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <TextField
            onChange={(event) => setNewMin(event.target.value)}
            value={newMin ? newMin : ''}
            id="new-min"
            label={newMin ? "" : t("Min value")}
            type='number'
            variant="outlined"
            sx={{ width: "100%" }} />
        </Grid>
        <Grid size={12}>
          <TextField
            onChange={(event) => setNewMax(event.target.value)}
            value={newMax ? newMax : ''}
            id="new-max"
            label={newMax ? "" : t("Max value")}
            type='number'
            variant="outlined"
            sx={{ width: "100%" }} />
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <TextField
            onChange={(event) => setNewLabel(event.target.value)}
            value={newLabel ? newLabel : ''}
            id="new-label"
            label={newLabel ? "" : t("Monster label")}
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
            //ckEditorThemeSync();
          }}
          onFocus={(event, editor) => {
            //console.log('Focus.', editor);
            //ckEditorThemeSync();
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
          <Button onClick={props.endEditing} startIcon={<ArrowBackIosNewIcon />} style={{ width: '100%' }} variant="contained" color="primary">{t("Back to monster sets list")}</Button>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
      </Grid >
    );
  } else {
    // get result from itemToDelete
    const result = monsterSet.rng.find((rng) => rng.min + '-' + rng.max === itemToDelete).result;

    return (
      <Grid container >
        <Grid size={12}>&nbsp;</Grid>
        <Grid
          size={12}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          sx={{
            bgcolor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText
          }}>
          <Typography>{t("Warning! RNG is about to be deleted")}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
          <Typography>{t("Do you really want to delete RNG")} {itemToDelete} ({result})?</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>&nbsp;</Grid>
       <Grid size={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button onClick={() => deleteRng(itemToDelete)} startIcon={<CheckIcon />} variant="contained" color="primary">{t("Yes")}</Button>
        </Grid>
       <Grid size={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button onClick={() => setItemToDelete(null)} startIcon={<CloseIcon />} variant="contained" color="primary">{t("No")}</Button>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
      </Grid >
    );
  }

}

export default MonsterSetEdit;