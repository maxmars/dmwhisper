import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import './style.css';


export default function ContentLoadedFeedback(props) {

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
            <Typography>{t(props.title)}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>
            <Typography>{t(props.message)}</Typography>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12}>&nbsp;</Grid>
        <Grid size={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button onClick={props.onOkClick} startIcon={<CheckIcon />} variant="contained" color="primary">{t("Ok")}</Button>
        </Grid>
        <Grid size={12}>&nbsp;</Grid>
    </Grid >
    );


};
