import * as React from 'react';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import useTheme from '@mui/private-theming/useTheme';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateSetpieceHeader, updateSetpieceRng } from '../../../../store/slices/content.js';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import TablesChooser from '../../tables/TablesChooser.js';
import { uuidv4 } from '../../../../utils/index.js';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Editor } from 'ckeditor5-custom-build/build/ckeditor';
import { useEffect } from 'react';
import { useRef } from 'react';


export default function SetpieceEdit(props) {

  const { t } = useTranslation();
  // const [unsavedContent, setUnsavedContent] = useState("no");
  const [rngToDelete, setRNGToDelete] = useState(null);
  const [editedSetpieceId, setEditedSetpieceId] = useState(props.setpieceId);
  const setpieces = useSelector((st) => st.content.setpieces);
  const setpiece = setpieces.find((setpiece) => setpiece.id === props.setpieceId);
  const [editedSetpieceDescription, setEditedSetpieceDescription] = useState(setpiece.description);
  const theme = useTheme();
  const [alert, setAlert] = useState(null);
  const [rngAlert, setRngAlert] = useState(null);
  const [currentMenuTable, setCurrentMenuTable] = useState(undefined);
  const [currentMenuContent, setCurrentMenuContent] = useState('');

  const [newMin, setNewMin] = useState(null);
  const [newMax, setNewMax] = useState(null);
  const [newResult, setNewResult] = useState(null);
  const mounted = useRef();

  const rows = setpiece.rng.map((rng) => {
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

    if (setpieces.find((setpiece) => setpiece.id === editedSetpieceId) && editedSetpieceId !== props.setpieceId) {
      setAlert(t('Set piece ID already exists'));
      return;
    }

    if (editedSetpieceId === '') {
      setAlert(t('Set piece ID cannot be blank'));
      return;
    }

    if (editedSetpieceId === props.setpieceId && editedSetpieceDescription === props.setpieceDescription) {
      setAlert(t('No changes to save'));
      return;
    }

    dispatch(updateSetpieceHeader({
      originalSetpieceId: props.setpieceId,
      setpieceId: editedSetpieceId,
      setpieceDescription: editedSetpieceDescription,
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
          onClick={() => setRNGToDelete(params.id)} />
      ]
    },
  ];

  const addRng = () => {
    if (document.getElementById('new-min').value === '') {
      setRngAlert(t('Min value cannot be blank'));
      return;
    }

    if (document.getElementById('new-max').value === '') {
      setRngAlert(t('Max value cannot be blank'));
      return;
    }

    if (parseInt(document.getElementById('new-min').value) > parseInt(document.getElementById('new-max').value)) {
      setRngAlert(t('Min value cannot be greater than max value'));
      return;
    }

    if (setpiece.rng.find((rng) => rng.min === parseInt(document.getElementById('new-min').value) && rng.max === parseInt(document.getElementById('new-max').value))) {
      setRngAlert(t('RNG value already exists'));
      return;
    }

    const newRng = {
      min: parseInt(document.getElementById('new-min').value),
      max: parseInt(document.getElementById('new-max').value),
      description: document.getElementById('new-result').value,
      // TODO
      textContent: currentMenuContent,
      table: currentMenuTable,
      // TODO Unused ATM
      minAppears: 0,
      maxAppears: 1000,
      width: 1,
      height: 1,
      imgUrl: '',
    }

    const newRngs = [...setpiece.rng, newRng];

    dispatch(updateSetpieceRng({
      setpieceId: props.setpieceId,
      rng: newRngs,
    }));

    document.getElementById('new-min').value = '';
    document.getElementById('new-max').value = '';
    document.getElementById('new-result').value = '';
    setCurrentMenuTable(undefined);
  }

  const deleteRng = (rngToDelete) => {
    const newRng = setpiece.rng.filter((rng) => rng.min + '-' + rng.max !== rngToDelete);
    dispatch(updateSetpieceRng({
      setpieceId: props.setpieceId,
      rng: newRng,
    }));

    setRNGToDelete(null);
  }

  const editRNGValues = (rngId) => {
    setNewMin(rngId.split('-')[0]);
    setNewMax(rngId.split('-')[1]);
    setNewResult(setpiece.rng.find((rng) => rng.min + '-' + rng.max === rngId).description);
    setCurrentMenuTable(setpiece.rng.find((rng) => rng.min + '-' + rng.max === rngId).table);
    setCurrentMenuContent(setpiece.rng.find((rng) => rng.min + '-' + rng.max === rngId).textContent);
  }

  if (rngToDelete === null) {

    return (
      <Grid container >
        <Grid item xs={12} bgcolor={theme.palette.warning.main} color={theme.palette.warning.contrastText} style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography>{t("Edited setpiece:")} {props.setpieceId}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <TextField id="setpiece-id"
            label={t("Set piece ID")}
            variant="outlined"
            sx={{ width: "100%" }}
            value={editedSetpieceId ? editedSetpieceId : ''}
            onChange={(event) => setEditedSetpieceId(event.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField id="setpiece-description"
            label={t("Set piece Description")}
            variant="outlined"
            sx={{ width: "100%" }}
            value={editedSetpieceDescription ? editedSetpieceDescription : ''}
            onChange={(event) => setEditedSetpieceDescription(event.target.value)} />
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
        <Grid item xs={12} bgcolor={theme.palette.warning.main} color={theme.palette.warning.contrastText} style={{ display: 'flex', justifyContent: 'center' }}>
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
            paginationModel={{ page: 1, pageSize: 1000 }}
          />
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12} bgcolor={theme.palette.warning.main} color={theme.palette.warning.contrastText} style={{ display: 'flex', justifyContent: 'center' }}>
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
            onChange={(event) => setNewResult(event.target.value)}
            value={newResult ? newResult : ''}
            id="new-result"
            label={newResult ? "" : t("Room label")}
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
        {rngAlert ?
          <>
            <Grid item xs={12}>
              <Alert severity='error' onClose={() => setRngAlert(null)}>
                {rngAlert}
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
          <Button onClick={props.endEditing} startIcon={<ArrowBackIosNewIcon />} style={{ width: '100%' }} variant="contained" color="primary">{t("Back to setpieces list")}</Button>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
      </Grid >
    );
  } else {
    // get result from rngToDelete
    const result = setpiece.rng.find((rng) => rng.min + '-' + rng.max === rngToDelete).result;

    return <Grid container >
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12} bgcolor={theme.palette.warning.main} color={theme.palette.warning.contrastText} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>{t("Warning! RNG is about to be deleted")}</Typography>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>
        <Typography>{t("Do you really want to delete RNG")} {rngToDelete} ({result})?</Typography>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button onClick={() => deleteRng(rngToDelete)} startIcon={<CheckIcon />} variant="contained" color="primary">{t("Yes")}</Button>
      </Grid>
      <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button onClick={() => setRNGToDelete(null)} startIcon={<CloseIcon />} variant="contained" color="primary">{t("No")}</Button>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
    </Grid >
  }

}