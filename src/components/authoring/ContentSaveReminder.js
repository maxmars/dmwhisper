import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import './style.css';


export default function ContentSaveReminder(props) {

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
                <Typography>{t("Warning!")}</Typography>
            </Grid>
            <Grid size={12}>&nbsp;</Grid>
            <Grid size={12}>&nbsp;</Grid>
            <Grid size={12}>
                <Typography>{t("There is unsaved content. Do you want to save?")}</Typography>
            </Grid>
            <Grid size={12}>&nbsp;</Grid>
            <Grid size={12}>&nbsp;</Grid>
            <Grid size={12} style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Button onClick={props.saveHandler} variant="contained" color="primary">{t("Yes")}</Button>
                <Button onClick={props.discardHandler} variant="contained" color="primary">{t("No")}</Button>
            </Grid>
            <Grid size={12}>&nbsp;</Grid>
        </Grid >
    );

};
