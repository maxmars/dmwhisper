import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getContent, getContentMetaData, getContentName } from '../../store/slices/content';
import { useSelector } from 'react-redux';
import { useState } from 'react';
//import SelectedContent from './SelectedContent';
import Button from '@mui/material/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import HomeIcon from '@mui/icons-material/Home';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import './style.css'

const columns = [
    { field: 'label', headerName: 'Content', flex: 1 },
];

const MenuEdit = (props) => {

    const [path, setPath] = useState("");
    const tree = useSelector((st) => st.content).tree;
    const content = getContent(tree, path);
    const contentMetaData = getContentMetaData(tree, path);
    const contentName = getContentName(tree, path);
    const ctyp = contentMetaData.type ? contentMetaData.type : "menu";
    const [contentType, setContentType] = useState(ctyp);

    const backOneLevel = () => {
        // If there's a dot in the path, remove the last part
        if (path.indexOf(".") > -1) {
            setPath(path.substring(0, path.lastIndexOf(".")));
            return;
        }
        // Otherwise, set the path to empty
        setPath("");
    }

    const onClick = (rowId) => {
        const newPath = path.length > 0 ? path + "." + rowId : rowId;
        const newContentMetaData = getContentMetaData(tree, newPath);
        const newCtyp = newContentMetaData.type ? newContentMetaData.type : "menu";
        setContentType(newCtyp);
        setPath(newPath);
    };

    const handleContentTypeChange = (event) => {
        if (event.target.value !== contentType) {
            setContentType(event.target.value);
        }
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <Button startIcon={<ArrowBackIosNewIcon />} sx={{ margin: "5px", width: "95%" }} variant="contained" color="primary" onClick={props.returnToMenu}>Main menu</Button>
            </Grid>
            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={3}>
                <Button startIcon={<ArrowBackIosNewIcon />} style={{ marginRight: "7px" }} variant="contained" color="primary" onClick={backOneLevel}>Back</Button>
            </Grid>
            <Grid item xs={3}>
                <Button startIcon={<HomeIcon />} style={{ marginLeft: "7px" }} variant="contained" color="primary" onClick={() => setPath("")}>Home</Button>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h6" component="div" style={{ textAlign: 'center' }}>{contentName}</Typography>
            </Grid>

            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={12}>
                {
                    path.length > 0 ?
                        <TextField
                            value={contentMetaData.id}
                            id="content-id"
                            label={contentMetaData.id ? "" : "Content ID"}
                            variant="outlined"
                            sx={{ width: "100%" }} />
                        :
                        <TextField
                            disabled={true}
                            value="ID: HOME"
                            id="content-id"
                            label=""
                            variant="outlined"
                            sx={{ width: "100%" }} />
                }
            </Grid>
            <Grid item xs={12}>
                {
                    path.length > 0 ?
                        <TextField
                            value={contentMetaData.label}
                            id="content-label"
                            label={contentMetaData.label ? "" : "Content Label"}
                            variant="outlined"
                            sx={{ width: "100%" }} />
                        :
                        <TextField
                            disabled={true}
                            value="LABEL: HOME"
                            id="content-label"
                            label=""
                            variant="outlined"
                            sx={{ width: "100%" }} />
                }
            </Grid>
            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={12}><Typography>Content Type</Typography></Grid>
            <Grid item xs={12}>
                <Select
                    labelId="content-type-select-label"
                    id="content-type-select"
                    value={contentType}
                    disabled={path.length === 0}
                    label="Content Type"
                    onChange={handleContentTypeChange}
                    sx={{ width: "100%" }}
                >
                    <MenuItem value="menu">Menu</MenuItem>
                    <MenuItem value="information">Information</MenuItem>
                    <MenuItem value="table">Table</MenuItem>
                </Select>
            </Grid>
            <Grid item xs={12}>&nbsp;</Grid>

            <Grid item xs={12} style={{ height: "100%" }}>
                {
                    contentMetaData.type === "menu" || !contentMetaData.type ?
                        <DataGrid
                            rows={content}
                            columns={columns}
                            height="100%"
                            width="100%"
                            onRowClick={(data) => onClick(data.row.id)}
                        /> : null
                }
            </Grid>
            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={12}>&nbsp;</Grid>
        </Grid>
    );

};


export default MenuEdit;
