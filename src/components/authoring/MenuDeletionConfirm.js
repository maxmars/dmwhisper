import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import useTheme from '@mui/private-theming/useTheme';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import './style.css';


export default function MenuDeletionConfirm(props) {

    const { t } = useTranslation();
    const theme = useTheme();

    return <Grid container sx={{ height: "100%" }} >
    <Grid item xs={12}>&nbsp;</Grid>
    <Grid item xs={12} bgcolor={theme.palette.warning.main} color={theme.palette.warning.contrastText} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>{t("Warning! Menu is about to be deleted")}</Typography>
    </Grid>
    <Grid item xs={12}>&nbsp;</Grid>
    <Grid item xs={12}>&nbsp;</Grid>
    <Grid item xs={12}>
        <Typography>{t("Do you really want to delete RNG")} {props.menuToDelete} ({props.menuToDelete})?</Typography>
    </Grid>
    <Grid item xs={12}>&nbsp;</Grid>
    <Grid item xs={12}>&nbsp;</Grid>
    <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button onClick={props.onYesClick} startIcon={<CheckIcon />} variant="contained" color="primary">{t("Yes")}</Button>
    </Grid>
    <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button onClick={props.onNoClick} startIcon={<CloseIcon />} variant="contained" color="primary">{t("No")}</Button>
    </Grid>
    <Grid item xs={12}>&nbsp;</Grid>
</Grid >


};
