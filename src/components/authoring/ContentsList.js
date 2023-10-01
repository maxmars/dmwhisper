import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Grid, Button, Typography, Select, MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import useTheme from '@mui/private-theming/useTheme';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import UploadIcon from '@mui/icons-material/Upload';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { get, getMany, set, del } from 'idb-keyval';
import { useSelector } from 'react-redux';
import { setContent, clearTabPath } from '../../store/slices/content';
import { useDispatch } from 'react-redux';


const ContentsList = () => {

  const { t } = useTranslation();
  const [contentsList, setContentsList] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(1);
  const [contentToDelete, setContentToDelete] = useState(null);
  const theme = useTheme();
  const mainColor = theme.palette.primary.main
  const contrastTextColor = theme.palette.primary.contrastText
  const [message, setMessage] = useState(null);
  const currentContent = useSelector((st) => st.content);
  const dispatch = useDispatch();

  const loadContent = async (id) => {
    const content = await get("content" + id);
    if (content) {
      dispatch(clearTabPath());
      dispatch(setContent(content));
      setMessage(t('Content loaded'));
    } else {
      setMessage(t('No content in slot'));
    }
  }

  useEffect(() => {
    const getContents = async () => {
      const [content1, content2, content3, content4, content5] = await getMany(['content1', 'content2', 'content3', 'content4', 'content5']);
      const list = {
        content1: {
          label: content1 ? content1.label : t('No content'),
          id: 1,
          key: 'content1'
        },
        content2: {
          label: content2 ? content2.label : t('No content'),
          id: 2,
          key: 'content2'
        },
        content3: {
          label: content3 ? content3.label : t('No content'),
          id: 3,
          key: 'content3'
        },
        content4: {
          label: content4 ? content4.label : t('No content'),
          id: 4,
          key: 'content4'
        },
        content5: {
          label: content5 ? content5.label : t('No content'),
          id: 5,
          key: 'content5'
        }
      };

      setContentsList(prevstate => ([list.content1, list.content2, list.content3, list.content4, list.content5]))

    };
    getContents();
  }, [t]);

  const deleteContent = async (id) => {
    await del("content" + id);
    const currentSlots = contentsList;
    currentSlots[id - 1].label = t('No content');
    setContentsList((curval) => [...currentSlots]);
    setMessage(t('Content deleted'));
    setContentToDelete(null);
  }

  const columns = [
    {
      field: 'label',
      headerName: t('Save slots'),
      flex: 1
    },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          icon={<UploadIcon />}
          label={t("Load content slot")}
          onClick={() => {
            loadContent(params.id);
          }
          } />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label={t("Delete")}
          onClick={() => {
            setContentToDelete(params.id);
          }
          } />
      ]
    },
  ];

  const saveContent = async () => {
    const label = document.getElementById('save-label').value ? document.getElementById('save-label').value : t('Unnamed content');

    const savedContent = {
      label: label,
      tree: currentContent.tree,
      tables: currentContent.tables
    }

    await set("content" + selectedSlot, savedContent);

    const currentSlots = contentsList;
    currentSlots[selectedSlot - 1].label = label;
    setContentsList((curval) => [...currentSlots]);
  }

  if (message) {
    return (
      <Grid container sx={{ overflow: 'scroll', height: '100%' }}>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <Typography>
            {message}
          </Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <Button onClick={() => setMessage(null)} variant="contained" sx={{ width: "100%" }}>{t('Ok')}</Button>
        </Grid>
      </Grid>
    );
  }

  if (contentToDelete) {
    return (
      <Grid container sx={{ overflow: 'scroll', height: '100%' }}>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <Typography>
            {t("Are you sure you want to delete the content in slot")} {contentToDelete}? {t("This action cannot be undone.")}
          </Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button onClick={() => deleteContent(contentToDelete)} startIcon={<CheckIcon />} variant="contained" color="primary">{t("Yes")}</Button>
        </Grid>
        <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button onClick={() => setContentToDelete(null)} startIcon={<CloseIcon />} variant="contained" color="primary">{t("No")}</Button>
        </Grid>
      </Grid>
    );
  }

  if (contentsList) {
    return (
      <Grid container sx={{ overflow: 'scroll', height: '100%' }}>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <Typography>
            {t("Save current content in slot")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Select
            id="save-slot"
            value={selectedSlot}
            sx={{ width: "100%" }}
            onChange={(event) => setSelectedSlot(event.target.value)}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <Typography>
            {t("With label")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField id="save-label" label={t("Content label")} variant="outlined" sx={{ width: "100%" }} />
        </Grid>
        <Grid item xs={12}>
          <Typography>
            {t("Overwriting current content, if any")}
          </Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <Button onClick={saveContent} variant="contained" startIcon={<SaveAltIcon />} sx={{ width: "100%" }}>{t('Save now')}</Button>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <Typography>
            {t("Or, load content from a slot:")}
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ height: (contentsList ? (contentsList.length * 52) + 156 : "100") + "px", overflow: "scroll" }}>
          <DataGrid
            sx={{ '& .MuiDataGrid-columnHeadersInner': { backgroundColor: mainColor, color: contrastTextColor } }}
            hideFooter
            rows={contentsList}
            columns={columns}
            width="100%"
          />
        </Grid>
      </Grid>
    );
  } else {
    return null;
  }

};


export default ContentsList;
