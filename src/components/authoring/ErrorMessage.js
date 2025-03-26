import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import './style.css';


export default function ErrorMessage(props) {

    const { t } = useTranslation();
    const theme = useTheme();

    return (
        <Grid container sx={{ height: "100%" }} >
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid
            item
            xs={12}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            sx={{
                bgcolor: theme.palette.warning.main,
                color: theme.palette.warning.contrastText
            }}>
            <Typography>{t("Warning!")}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>
            <Typography>{t(props.errorMessage)}</Typography>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button onClick={props.onOkClick} variant="contained" color="primary">{t("Ok")}</Button>
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
    </Grid >
    );


};
