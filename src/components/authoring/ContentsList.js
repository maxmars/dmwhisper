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
import { getMany, set, del } from 'idb-keyval';


const ContentsList = () => {

  const { t } = useTranslation();
  const [contentsList, setContentsList] = useState([]);
  const theme = useTheme();
  const mainColor = theme.palette.primary.main
  const contrastTextColor = theme.palette.primary.contrastText
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const getContents = async () => {
      const [content1, content2, content3] = await getMany(['content1', 'content2', 'content3']);
      const list = {};

      if (content1) {
        list.content1 = {
          label: content1.label,
          id: 1
        }
      } else {
        list.content1 = {
          label: t('No content'),
          id: 1
        }
      }

      if (content2) {
        list.content2 = {
          label: content2.label,
          id: 2
        }
      } else {
        list.content2 = {
          label: t('No content'),
          id: 2
        }
      }

      if (content3) {
        list.content3 = {
          label: content3.label,
          id: 3
        }
      } else {
        list.content3 = {
          label: t('No content'),
          id: 3
        }
      }

      console.log("updated");

      setContentsList(prevstate => ([list.content1, list.content2, list.content3]))

    };
    getContents();
  }, [t]);

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
            //raiseMenu(params.id);
          }
          } />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label={t("Delete")}
          onClick={() => {
            //setMenuToDelete(params.id);
          }
          } />
      ]
    },
  ];

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
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={1}
            label="Age"
            sx={{ width: "100%" }}
            onChange={(event) => console.log(event)}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <Typography>
            {t("With label")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField id="outlined-basic" label={t("Content label")} variant="outlined" sx={{ width: "100%" }} />
        </Grid>
        <Grid item xs={12}>
          <Typography>
            {t("Overwriting current content, if any")}
          </Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
          <Button variant="contained" startIcon={<SaveAltIcon />} sx={{ width: "100%" }}>{t('Save now')}</Button>
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
