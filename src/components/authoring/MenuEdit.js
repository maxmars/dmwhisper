import * as React from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { getContent, getContentMetaData, getContentName, updateContent, addMenuItem, updateContentHeader, updateContentType } from '../../store/slices/content';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
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
import { useTranslation } from 'react-i18next';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '../../ckeditor/ckeditor';
import i18n from '../../i18n/i18n';

import './style.css'



const MenuEdit = (props) => {

    const { t } = useTranslation();
    const [newContentId, setNewContentId] = useState("");
    const [newContentLabel, setNewContentLabel] = useState("");
    const [newContentType, setNewContentType] = useState("menu");
    const [menuToDelete, setMenuToDelete] = useState(null);
    const [path, setPath] = useState("");
    const tree = useSelector((st) => st.content).tree;
    const content = getContent(tree, path);
    const contentMetaData = getContentMetaData(tree, path);
    const [currentMenuId, setCurrentMenuId] = useState(contentMetaData.id);
    const [currentMenuLabel, setCurrentMenuLabel] = useState(contentMetaData.label);
    const ctcntnt = contentMetaData.data && contentMetaData.data.textContent ? contentMetaData.data.textContent : [];
    const [currentMenuContent, setCurrentMenuContent] = useState(ctcntnt);
    const cttbl = contentMetaData.data && contentMetaData.data.table ? contentMetaData.data.table : undefined;
    const [currentMenuTable, setCurrentMenuTable] = useState(cttbl);
    const contentName = getContentName(tree, path);
    const ctyp = contentMetaData.type ? contentMetaData.type : "menu";
    const [currentContentType, setCurrentContentType] = useState(ctyp);
    const theme = useTheme();

    if (theme.palette.mode === "dark") {
        require('./ckeditor-dark.css');
    }

    require('../../ckeditor/translations/' + navigator.language.substring(0, 2) + '.js');

    const dispatch = useDispatch();

    const columns = [
        {
            field: 'label',
            headerName: t('Content'),
            flex: 1
        },
        {
            field: 'actions',
            type: 'actions',
            width: window.innerWidth * 0.15,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label={t("Delete")}
                    onClick={() => {
                        setMenuToDelete(params.id);
                    }
                    } />
            ]
        },
    ];

    const backToRootMenu = () => {
        setCurrentMenuId(undefined);
        setCurrentMenuLabel(undefined);
        setCurrentContentType("menu");
        setCurrentMenuContent([]);
        setCurrentMenuTable(undefined);
        setPath("");
    }

    const backOneLevel = () => {
        // If there's a dot in the path, remove the last part
        if (path.indexOf(".") > -1) {
            const newPath = path.substring(0, path.lastIndexOf("."));
            const newContentMetaData = getContentMetaData(tree, newPath);
            const newCtyp = newContentMetaData.type ? newContentMetaData.type : "menu";
            setCurrentMenuId(newContentMetaData.id);
            setCurrentMenuLabel(newContentMetaData.label);
            setCurrentContentType(newCtyp);
            setCurrentMenuContent(newContentMetaData.data.textContent);
            setCurrentMenuTable(newContentMetaData.data.table ? newContentMetaData.data.table : "");
            setPath(newPath);
            return;
        }
        // Otherwise, set the path to empty
        setCurrentMenuId(undefined);
        setCurrentMenuLabel(undefined);
        setCurrentContentType("menu");
        setCurrentMenuContent([]);
        setCurrentMenuTable(undefined);
        setPath("");
    }

    const onClick = (rowId) => {
        const newPath = path.length > 0 ? path + "." + rowId : rowId;
        const newContentMetaData = getContentMetaData(tree, newPath);
        const newCtyp = newContentMetaData.type ? newContentMetaData.type : "menu";
        setCurrentMenuId(newContentMetaData.id);
        setCurrentMenuLabel(newContentMetaData.label);
        setCurrentContentType(newCtyp);
        setCurrentMenuContent(newContentMetaData.data.textContent);
        setCurrentMenuTable(newContentMetaData.data.table ? newContentMetaData.data.table : "");
        setPath(newPath);
    };

    const handleContentTypeChange = (event) => {
        if (event.target.value !== currentContentType) {

            dispatch(updateContentType({
                updatedContentType: event.target.value,
                path: path
            }));
            setCurrentContentType(event.target.value);
        }
    }

    const handleNewContentTypeChange = (event) => {
        if (event.target.value !== newContentType) {
            setNewContentType(event.target.value);
        }
    }

    const addNewSubmenu = () => {
        const newContent = {
            id: newContentId,
            label: newContentLabel,
            type: newContentType,
            data: {
                textContent: ""
            }
        };

        if (newContentType === "menu") {
            newContent.data.children = [];
        }

        dispatch(addMenuItem({
            newMenuItem: newContent,
            path: path,
        }));

        setNewContentId("");
        setNewContentLabel("");
        setNewContentType("menu");
    }

    const updateMenuHeader = () => {
        const updatedContentHeader = {
            id: currentMenuId,
            label: currentMenuLabel,
            textContent: currentMenuContent,
            table: currentMenuTable,
            type: currentContentType,
        };

        dispatch(updateContentHeader({
            updatedContentHeader: updatedContentHeader,
            path: path,
        }));
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
        return <Grid container sx={{ height: "100%" }} >
            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={12} bgcolor={theme.palette.warning.main} color={theme.palette.warning.contrastText} style={{ display: 'flex', justifyContent: 'center' }}>
                <Typography>{t("Warning! Menu is about to be deleted")}</Typography>
            </Grid>
            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={12}>
                <Typography>{t("Do you really want to delete RNG")} {menuToDelete} ({menuToDelete})?</Typography>
            </Grid>
            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button onClick={() => deleteMenu(menuToDelete)} startIcon={<CheckIcon />} variant="contained" color="primary">{t("Yes")}</Button>
            </Grid>
            <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button onClick={() => setMenuToDelete(null)} startIcon={<CloseIcon />} variant="contained" color="primary">{t("No")}</Button>
            </Grid>
            <Grid item xs={12}>&nbsp;</Grid>
        </Grid >
    }

    return (
        <Grid container sx={{ height: "100%" }} >
            <Grid item xs={12}>
                <Button startIcon={<ArrowBackIosNewIcon />} sx={{ margin: "5px", width: "95%" }} variant="contained" color="primary" onClick={props.returnToMenu}>{t("Main menu")}</Button>
            </Grid>
            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={1}>
                <IconButton style={{ marginRight: "7px" }} variant="contained" color="primary" onClick={backOneLevel}><ArrowBackIosNewIcon /></IconButton>
            </Grid>
            <Grid item xs={1}>
                <IconButton style={{ marginLeft: "7px" }} variant="contained" color="primary" onClick={() => backToRootMenu()}><HomeIcon /></IconButton>
            </Grid>
            <Grid item xs={10}>
                <Typography variant="h6" component="div" style={{ textAlign: 'center' }}>{contentName}</Typography>
            </Grid>

            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={12} bgcolor={theme.palette.warning.main} color={theme.palette.warning.contrastText} style={{ display: 'flex', justifyContent: 'center' }}>
                <Typography>{t("Menu header")}</Typography>
            </Grid>
            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={12}><Typography>{t("Content ID")}</Typography></Grid>
            <Grid item xs={12}>
                {
                    path.length > 0 ?
                        <TextField
                            value={currentMenuId}
                            onChange={(event) => setCurrentMenuId(event.target.value)}
                            id="content-id"
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
            <Grid item xs={12}><Typography>{t("Content Label")}</Typography></Grid>
            <Grid item xs={12}>
                {
                    path.length > 0 ?
                        <TextField
                            value={currentMenuLabel}
                            onChange={(event) => setCurrentMenuLabel(event.target.value)}
                            id="content-label"
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
            <Grid item xs={12}><Typography>{t("Content Type")}</Typography></Grid>
            <Grid item xs={12}>
                <Select
                    labelId="current-content-type-select-label"
                    id="current-content-type-select"
                    value={currentContentType}
                    disabled={path.length === 0}
                    label={t("Content Type")}
                    onChange={handleContentTypeChange}
                    sx={{ width: "100%" }}
                >
                    <MenuItem value="menu">{t("Menu")}</MenuItem>
                    <MenuItem value="information">{t("Information")}</MenuItem>
                    <MenuItem value="table">{t("Table")}</MenuItem>
                </Select>
            </Grid>
            {
                currentContentType ?
                    <>
                        <Grid item xs={12}>&nbsp;</Grid>
                        <Grid item xs={12}><Typography>{t("Text content")}</Typography></Grid>
                        <Grid item xs={12}>
                            {path.length > 0 ?
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={currentMenuContent}
                                    config= {{language: {ui: navigator.language.substring(0, 2), content: navigator.language.substring(0, 2) }}}
                                    onReady={editor => {
                                        // You can store the "editor" and use when it is needed.
                                        //console.log('Editor is ready to use!', editor);
                                    }}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        //console.log({ event, editor, data });
                                        setCurrentMenuContent(data)
                                    }}
                                    onBlur={(event, editor) => {
                                        //console.log('Blur.', editor);
                                    }}
                                    onFocus={(event, editor) => {
                                        //console.log('Focus.', editor);
                                    }}
                                />
                                :
                                <TextField
                                    value={currentMenuContent}
                                    disabled
                                    id="text-content"
                                    variant="outlined"
                                    sx={{ width: "100%" }}
                                    onChange={(event) => setCurrentMenuContent(event.target.value)}
                                    multiline
                                    minRows={3}
                                    maxRows={8} />
                            }
                        </Grid>
                    </> : null
            }
            {
                currentContentType === "table" ?
                    <>
                        <Grid item xs={12}>&nbsp;</Grid>
                        <Grid item xs={12}><Typography>{t("Table")}</Typography></Grid>
                        <Grid item xs={12}>
                            <TextField
                                value={currentMenuTable}
                                id="table-content"
                                variant="outlined"
                                onChange={(event) => setCurrentMenuTable(event.target.value)}
                                sx={{ width: "100%" }} />
                        </Grid>
                    </> : null
            }
            <Grid item xs={12}>&nbsp;</Grid>
            <Button disabled={!contentMetaData.type} startIcon={<SaveAltIcon />} style={{ width: "100%" }} variant="contained" color="primary" onClick={() => updateMenuHeader()}>{t("Save header data")}</Button>
            {
                !currentContentType || currentContentType === "menu" ?
                    <>
                        <Grid item xs={12}>&nbsp;</Grid>
                        <Grid item xs={12} bgcolor={theme.palette.warning.main} color={theme.palette.warning.contrastText} style={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography>{t("Sub menus")}</Typography>
                        </Grid>
                        <Grid item xs={12}>&nbsp;</Grid>
                        <Grid item xs={12} style={{ height: (content ? (content.length * 52) + 156 : "100") + "px", overflow: "scroll" }}>
                            <DataGrid
                                hideFooter
                                rows={content}
                                columns={columns}
                                width="100%"
                                onRowClick={(data) => onClick(data.row.id)}
                            />
                        </Grid>
                    </> : null
            }
            <Grid item xs={12}>&nbsp;</Grid>
            {
                currentContentType === "menu" ?
                    <>
                        <Grid item xs={12} bgcolor={theme.palette.warning.main} color={theme.palette.warning.contrastText} style={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography>{t("Add a new sub menu")}</Typography>
                        </Grid>
                        <Grid item xs={12}>&nbsp;</Grid>
                        <Grid item xs={12}><Typography>{t("Content ID")}</Typography></Grid>
                        <Grid item xs={12}>
                            <TextField
                                value={newContentId}
                                onChange={(event) => setNewContentId(event.target.value)}
                                id="new-content-id"
                                variant="outlined"
                                sx={{ width: "100%" }} />
                        </Grid>
                        <Grid item xs={12}>&nbsp;</Grid>
                        <Grid item xs={12}><Typography>{t("Content Label")}</Typography></Grid>
                        <Grid item xs={12}>
                            <TextField
                                value={newContentLabel}
                                onChange={(event) => setNewContentLabel(event.target.value)}
                                id="new-content-label"
                                variant="outlined"
                                sx={{ width: "100%" }} />
                        </Grid>
                        <Grid item xs={12}>&nbsp;</Grid>
                        <Grid item xs={12}><Typography>{t("Content Type")}</Typography></Grid>
                        <Grid item xs={12}>
                            <Select
                                labelId="new-content-type-select-label"
                                id="new-content-type-select"
                                value={newContentType}
                                label={t("Content Type")}
                                onChange={handleNewContentTypeChange}
                                sx={{ width: "100%" }}
                            >
                                <MenuItem value="menu">{t("Menu")}</MenuItem>
                                <MenuItem value="information">{t("Information")}</MenuItem>
                                <MenuItem value="table">{t("Table")}</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12}>&nbsp;</Grid>
                        <Button startIcon={<SaveAltIcon />} style={{ width: "100%" }} variant="contained" color="primary" onClick={() => addNewSubmenu()}>{t("Add Sub menu")}</Button>
                        <Grid item xs={12}>&nbsp;</Grid>
                    </> : null
            }
        </Grid >
    );

};


export default MenuEdit;
