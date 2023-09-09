import * as React from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { getContent, getContentMetaData, getContentName, updateContent } from '../../store/slices/content';
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
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import useTheme from '@mui/private-theming/useTheme';
import './style.css'

const MenuEdit = (props) => {

    const [menuToDelete, setMenuToDelete] = useState(null);
    const [path, setPath] = useState("");
    const tree = useSelector((st) => st.content).tree;
    const content = getContent(tree, path);
    const contentMetaData = getContentMetaData(tree, path);
    const contentName = getContentName(tree, path);
    const ctyp = contentMetaData.type ? contentMetaData.type : "menu";
    const [contentType, setContentType] = useState(ctyp);
    const theme = useTheme();

    const dispatch = useDispatch();

    const columns = [
        {
            field: 'label',
            headerName: 'Content',
            flex: 1
        },
        {
            field: 'actions',
            type: 'actions',
            width: window.innerWidth * 0.15,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => {
                        setMenuToDelete(params.id);
                    }
                    } />
            ]
        },
    ];

    const backOneLevel = () => {
        // If there's a dot in the path, remove the last part
        if (path.indexOf(".") > -1) {
            const newPath = path.substring(0, path.lastIndexOf("."));
            const newContentMetaData = getContentMetaData(tree, newPath);
            const newCtyp = newContentMetaData.type ? newContentMetaData.type : "menu";
            setContentType(newCtyp);
            setPath(newPath);
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

    const deleteMenu = (menuToDelete) => {
        const newContent = content.filter((item) => item.id !== menuToDelete);
        dispatch(updateContent({
            updatedContent: newContent,
            path: path,
        }));

        setMenuToDelete(null);
    }

    if (menuToDelete) {
        return <Grid container >
            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={12} bgcolor={theme.palette.info.main} color={theme.palette.info.contrastText} style={{ display: 'flex', justifyContent: 'center' }}>
                <Typography>Warning! Menu is about to be deleted</Typography>
            </Grid>
            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={12}>
                <Typography>Do you really want to delete RNG {menuToDelete} ({menuToDelete})?</Typography>
            </Grid>
            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={() => deleteMenu(menuToDelete)} startIcon={<CheckIcon />} variant="contained" color="primary">Yes</Button>
            </Grid>
            <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={() => setMenuToDelete(null)} startIcon={<CloseIcon />} variant="contained" color="primary">No</Button>
            </Grid>
            <Grid item xs={12}>&nbsp;</Grid>
        </Grid >
    }

    return (
        <Grid container sx={{ overflow: 'scroll' }}>
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
            <Grid item xs={12}><Typography>Content ID</Typography></Grid>
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
            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={12}><Typography>Content Label</Typography></Grid>
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
            {
                contentMetaData.type ?
                    <>
                        <Grid item xs={12}>&nbsp;</Grid>
                        <Grid item xs={12}><Typography>Text content</Typography></Grid>
                        <Grid item xs={12}>
                            <TextField
                                value={contentMetaData.data.textContent}
                                id="text-content"
                                label={contentMetaData.data.textContent ? "" : "Text content"}
                                variant="outlined"
                                sx={{ width: "100%" }}
                                multiline
                                maxRows={8} />
                        </Grid>
                    </> : null
            }
            {
                contentMetaData.type === "table" ?
                    <>
                        <Grid item xs={12}>&nbsp;</Grid>
                        <Grid item xs={12}><Typography>Table</Typography></Grid>
                        <Grid item xs={12}>
                            <TextField
                                value={contentMetaData.data.table}
                                id="table-content"
                                label={contentMetaData.data.table ? "" : "Table content"}
                                variant="outlined"
                                sx={{ width: "100%" }} />
                        </Grid>
                    </> : null
            }
            {
                contentMetaData.type ?
                    <>
                        <Grid item xs={12}>&nbsp;</Grid>
                        <Button startIcon={<SaveAltIcon />} style={{ width: "100%" }} variant="contained" color="primary" onClick={() => setPath("")}>Save header data</Button>
                    </> : null
            }
            {
                contentMetaData.type === "menu" || !contentMetaData.type ?
                    <>
                        <Grid item xs={12}>&nbsp;</Grid>
                        <Grid item xs={12}><Typography>Sub-menu</Typography></Grid>
                        <Grid item xs={12} style={{ height: "100%" }}>
                            <DataGrid
                                rows={content}
                                columns={columns}
                                width="100%"
                                onRowClick={(data) => onClick(data.row.id)}
                            />
                        </Grid>
                    </> : null
            }
            <Grid item xs={12}>&nbsp;</Grid>
        </Grid >
    );

};


export default MenuEdit;
