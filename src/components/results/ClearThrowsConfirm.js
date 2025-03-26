import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid2 as Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import './style.css';


export default function ClearThrowsConfirm(props) {

    const { t } = useTranslation();
    const theme = useTheme();

    return (
        <Grid container sx={{ height: "100%" }} >
        <Grid size={12}>&nbsp;</Grid>
        <Grid
            size={12}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            sx={{
                bgcolor: theme.palette.warning.main,
                color: theme.palette.warning.contrastText
            }}>
            <Typography>{t("Warning! All saved items are going to be deleted")}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
            <Typography>{t("Do you really want to delete all saved items?")}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>&nbsp;</Grid>
       <Grid size={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button onClick={props.onYesClick} startIcon={<CheckIcon />} variant="contained" color="primary">{t("Yes")}</Button>
        </Grid>
       <Grid size={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button onClick={props.onNoClick} startIcon={<CloseIcon />} variant="contained" color="primary">{t("No")}</Button>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
    </Grid >
    );


};
