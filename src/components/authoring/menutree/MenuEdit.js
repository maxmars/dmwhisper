import * as React from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
    getContent, getContentMetaData, getContentName, updateContent, addMenuItem,
    updateContentHeader, updateContentType, setClipboardAction, deleteMenuItem
} from '../../../store/slices/content.js';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
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
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useDispatch } from 'react-redux';
import useTheme from '@mui/private-theming/useTheme';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { useTranslation } from 'react-i18next';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Editor } from 'ckeditor5-custom-build/build/ckeditor';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TablesChooser from '../tables/TablesChooser.js';
import './style.css';
import { uuidv4 } from '../../../utils/index.js';
import ContentSaveReminder from '../ContentSaveReminder.js';
import ErrorMessage from '../ErrorMessage.js';
import MenuDeletionConfirm from './MenuDeletionConfirm';
import MapSetup from '../maps/MapSetup.js';


export default function MenuEdit(props) {

    //#region Component initializations
    const { t } = useTranslation();
    const [unsavedContent, setUnsavedContent] = useState("no");
    const [errorMessage, setErrorMessage] = useState(null);
    const [newContentId, setNewContentId] = useState("");
    const [newContentLabel, setNewContentLabel] = useState("");
    const [newContentType, setNewContentType] = useState("menu");
    const [menuToDelete, setMenuToDelete] = useState(null);
    const [path, setPath] = useState("");
    const wholeContent = useSelector((st) => st.content);
    const tree = useSelector((st) => st.content).tree;
    const content = getContent(tree, path);
    const contentMetaData = getContentMetaData(tree, path);
    const [currentMenuId, setCurrentMenuId] = useState(contentMetaData.id);
    const [currentMenuLabel, setCurrentMenuLabel] = useState(contentMetaData.label);

    const ctcntnt = contentMetaData.data && contentMetaData.data.textContent ? contentMetaData.data.textContent : [];
    const [currentMenuContent, setCurrentMenuContent] = useState(ctcntnt);

    const cttbl = contentMetaData.data && contentMetaData.data.table ? contentMetaData.data.table : undefined;
    const [currentMenuTable, setCurrentMenuTable] = useState(cttbl);

    const ctmap = contentMetaData.data && contentMetaData.data.map ? contentMetaData.data.map : { setpiece: "", density: 2, grid: 2 };
    const [currentMenuSetpiece, setCurrentMenuSetpiece] = useState(ctmap.setpiece);
    const [currentMenuDensity, setCurrentMenuDensity] = useState(ctmap.density);
    const [currentMenuGrid, setCurrentMenuGrid] = useState(ctmap.grid);

    const contentName = getContentName(tree, path);
    const ctyp = contentMetaData.type ? contentMetaData.type : "menu";
    const [currentContentType, setCurrentContentType] = useState(ctyp);
    const theme = useTheme();
    const [headerInfoOpen, setHeaderInfoOpen] = useState(currentContentType !== "menu");
    const mounted = useRef();

    useEffect(() => {
        setUnsavedContent("no");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentMetaData]);
    //#endregion Component initializations

    //#region CKEditor stuff
    useEffect(() => {
        ckEditorThemeSync();
    });

    const ckEditorThemeSync = () => {
        setTimeout(() => {
            let elToApply = document.getElementsByClassName("ck-content")[0];
            if (elToApply) {
                if (!mounted.current) {
                    // do componentDidMount logic
                    if (theme.palette.mode === "dark") {
                        elToApply.setAttribute("style", "color: white !important; background-color: black !important;");
                    } else {
                        elToApply.setAttribute("style", "color: black !important; background-color: white !important;");
                    }
                    mounted.current = true;
                } else {
                    if (theme.palette.mode === "dark") {
                        elToApply.setAttribute("style", "color: white !important; background-color: black !important;");
                    } else {
                        elToApply.setAttribute("style", "color: black !important; background-color: white !important;");
                    }
                }
            }

            elToApply = document.getElementsByTagName("a");

            if (elToApply) {
                const elArray = Array.from(elToApply);
                elArray.forEach(element => {
                    if (theme.palette.mode === "dark") {
                        element.setAttribute("style", "color: white !important; background-color: black !important;");
                    } else {
                        element.setAttribute("style", "color: black !important; background-color: white !important;");
                    }
                });
            }
        }, 250);
    }

    let lng = navigator.language.substring(0, 2).toLocaleLowerCase();

    if (lng === "en") {
        lng = "en-gb";
    }

    require('ckeditor5-custom-build/build/translations/' + lng + '.js');
    //#endregion CKEditor stuff

    const dispatch = useDispatch();

    const columns = [
        {
            field: 'label',
            headerName: t('Sub menus'),
            flex: 1
        },
        {
            field: 'actions',
            type: 'actions',
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<ArrowUpwardIcon />}
                    label={t("Move up")}
                    onClick={() => {
                        raiseMenu(params.id);
                    }
                    } />,
                <GridActionsCellItem
                    icon={<ArrowDownwardIcon />}
                    label={t("Move down")}
                    onClick={() => {
                        lowerMenu(params.id);
                    }
                    } />,
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

    const backToRootMenuCheck = () => {
        if (unsavedContent === "yes") {
            setUnsavedContent("andbacktoroot");
            return;
        }
        backToRootMenu();
    }

    const backToRootMenu = () => {
        setCurrentMenuId(undefined);
        setCurrentMenuLabel(undefined);
        setCurrentContentType("menu");
        setCurrentMenuContent([]);
        setCurrentMenuTable(undefined);
        setCurrentMenuSetpiece("");
        setCurrentMenuDensity(2);
        setCurrentMenuGrid(2);
        setHeaderInfoOpen(false);
        setPath("");
    }

    const backOneLevelCheck = () => {
        if (unsavedContent === "yes") {
            setUnsavedContent("andbackonelevel");
            return;
        }
        backOneLevel();
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
            setCurrentMenuSetpiece(newContentMetaData.data.map ? newContentMetaData.data.map.setpiece : "");
            setCurrentMenuDensity(newContentMetaData.data.map ? newContentMetaData.data.map.density : 2);
            setCurrentMenuGrid(newContentMetaData.data.map ? newContentMetaData.data.map.grid : 2);
            setHeaderInfoOpen(newCtyp !== "menu");
            setPath(newPath);
            return;
        }
        // Otherwise, set the path to empty
        setCurrentMenuId(undefined);
        setCurrentMenuLabel(undefined);
        setCurrentContentType("menu");
        setCurrentMenuContent([]);
        setCurrentMenuTable(undefined);
        setCurrentMenuSetpiece("");
        setCurrentMenuDensity(2);
        setCurrentMenuGrid(2);
        setHeaderInfoOpen(false);
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
        setCurrentMenuSetpiece(newContentMetaData.data.map ? newContentMetaData.data.map.setpiece : "");
        setCurrentMenuDensity(newContentMetaData.data.map ? newContentMetaData.data.map.density : 2);
        setCurrentMenuGrid(newContentMetaData.data.map ? newContentMetaData.data.map.grid : 2);
        setHeaderInfoOpen(newCtyp !== "menu");
        setPath(newPath);
    };

    const handleContentTypeChange = (event) => {
        if (event.target.value !== currentContentType) {

            dispatch(updateContentType({
                updatedContentType: event.target.value,
                path: path
            }));
            setCurrentContentType(event.target.value);
            setUnsavedContent("yes");
        }
    }

    const handleNewContentTypeChange = (event) => {
        if (event.target.value !== newContentType) {
            setNewContentType(event.target.value);
            setUnsavedContent("yes");
        }
    }

    const addNewSubmenu = () => {
        if (newContentId.trim().length === 0) {
            return;
        }

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
            map: { setpiece: currentMenuSetpiece, density: currentMenuDensity, grid: currentMenuGrid },
            type: currentContentType,
        };

        dispatch(updateContentHeader({
            updatedContentHeader: updatedContentHeader,
            path: path,
        }));

        let tempPath = null;

        if (path.indexOf(".") > -1) {
            tempPath = path.substring(0, path.lastIndexOf(".")) + "." + currentMenuId;
        } else {
            tempPath = currentMenuId;
        }

        setPath(tempPath);
        setUnsavedContent("no");
    }

    const deleteMenu = (menuToDelete) => {
        const newContent = content.filter((item) => item.id !== menuToDelete);
        dispatch(updateContent({
            updatedContent: newContent,
            path: path,
        }));

        setMenuToDelete(null);
    }

    const raiseMenu = (menuToRaise) => {

        const menuToRaiseIndex = content.findIndex((item) => item.id === menuToRaise);

        if (menuToRaiseIndex === 0) {
            return;
        }

        const menuToRaiseItem = content[menuToRaiseIndex];
        const swappedContent = content.filter((item) => item.id !== menuToRaise);
        swappedContent.splice(menuToRaiseIndex - 1, 0, menuToRaiseItem);
        dispatch(updateContent({
            updatedContent: swappedContent,
            path: path,
        }));
    }

    const lowerMenu = (menuToLower) => {

        const menuToLowerIndex = content.findIndex((item) => item.id === menuToLower);

        if (menuToLowerIndex === content.length - 1) {
            return;
        }

        const menuToLowerItem = content[menuToLowerIndex];
        const swappedContent = content.filter((item) => item.id !== menuToLower);
        swappedContent.splice(menuToLowerIndex + 1, 0, menuToLowerItem);
        dispatch(updateContent({
            updatedContent: swappedContent,
            path: path,
        }));
    }

    const copyContent = (path) => {
        dispatch(setClipboardAction({
            clipboardAction: "copy",
            copiedContent: path,
        }));
    }

    const cutContent = (path) => {
        dispatch(setClipboardAction({
            clipboardAction: "cut",
            copiedContent: path,
        }));
    }

    const pasteContent = (contentState, targetPath) => {
        const sourcePath = contentState.copiedContent;

        if (sourcePath === undefined || sourcePath === null || sourcePath === "") {
            setErrorMessage("No content to paste");
            return;
        }

        if (targetPath === sourcePath) {
            setErrorMessage("Cannot paste in the same menu of the source");
            return;
        }

        if (contentState.clipboardAction === "cut" && targetPath.startsWith(sourcePath)) {
            setErrorMessage("Cannot cut and paste inside the same content");
            return;
        }

        const sourceContent = getContentMetaData(contentState.tree, sourcePath);

        dispatch(addMenuItem({
            newMenuItem: sourceContent,
            path: targetPath
        }));

        if (contentState.clipboardAction === "cut") {
            dispatch(deleteMenuItem({
                path: sourcePath
            }));
        }

        dispatch(setClipboardAction({
            clipboardAction: "clear"
        }));
    }

    if (unsavedContent !== "yes" && unsavedContent !== "no") {

        return <ContentSaveReminder saveHandler={() => {
            if (unsavedContent === "andbackonelevel") {
                setUnsavedContent("no");
                updateMenuHeader();
                backOneLevel();
            } else {
                setUnsavedContent("no");
                updateMenuHeader();
                backToRootMenu();
            }
        }} discardHandler={() => {
            if (unsavedContent === "andbackonelevel") {
                setUnsavedContent("no");
                backOneLevel();
            } else {
                setUnsavedContent("no");
                backToRootMenu();
            }
        }} />

    }

    if (errorMessage) {
        return <ErrorMessage errorMessage={errorMessage} onOkClick={() => setErrorMessage(null)} />
    }

    if (menuToDelete) {
        return <MenuDeletionConfirm menuToDelete={menuToDelete} onYesClick={() => deleteMenu(menuToDelete)} onNoClick={() => setMenuToDelete(null)} />
    }

    return (
        <Grid container sx={{ height: "100%" }} >
            <Grid item xs={12}>
                <Button startIcon={<ArrowBackIosNewIcon />} sx={{ margin: "5px", width: "95%" }} variant="contained" color="primary" onClick={props.returnToMenu}>{t("Main menu")}</Button>
            </Grid>
            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={1}>
                <IconButton style={{ marginRight: "7px" }} variant="contained" color="primary" onClick={() => backOneLevelCheck()}><ArrowBackIosNewIcon /></IconButton>
            </Grid>
            <Grid item xs={1}>
                <IconButton style={{ marginLeft: "7px" }} variant="contained" color="primary" onClick={() => backToRootMenuCheck()}><HomeIcon /></IconButton>
            </Grid>
            <Grid item xs={10}>
                <Typography variant="h6" component="div" style={{ textAlign: 'center' }}>{contentName}</Typography>
            </Grid>

            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button startIcon={<ContentCutIcon />} disabled={path === ""} style={{ width: "100%" }} variant="contained" color="warning" onClick={() => cutContent(path)}>{t("Cut")}</Button>
            </Grid>
            <Grid item xs={1}>&nbsp;</Grid>
            <Grid item xs={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button startIcon={<ContentCopyIcon />} disabled={path === ""} style={{ width: "100%" }} variant="contained" color="warning" onClick={() => copyContent(path)}>{t("Copy")}</Button>
            </Grid>
            <Grid item xs={1}>&nbsp;</Grid>
            <Grid item xs={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button startIcon={<ContentPasteIcon />} disabled={wholeContent.clipboardAction === null} style={{ width: "100%" }} variant="contained" color="warning" onClick={() => pasteContent(wholeContent, path)}>{t("Paste")}</Button>
            </Grid>

            <Grid item xs={12}>&nbsp;</Grid>

            <Grid item xs={12}>
                <Accordion expanded={headerInfoOpen} onChange={(event, newExpanded) => setHeaderInfoOpen(newExpanded)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="menuheader-content"
                        id="menuheader-header"
                    >
                        <Typography>{t("Menu header")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container>
                            <Grid item xs={12}>&nbsp;</Grid>
                            <Grid item xs={12}><Typography>{t("Content ID")}</Typography></Grid>
                            <Grid item xs={12}>
                                {
                                    path.length > 0 ?
                                        <TextField
                                            value={currentMenuId}
                                            onChange={(event) => {
                                                setCurrentMenuId(event.target.value.trim().replace(/\./g, "-"));
                                                setUnsavedContent("yes");
                                            }}
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
                                            onChange={(event) => {
                                                setCurrentMenuLabel(event.target.value);
                                                setUnsavedContent("yes");
                                            }}
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
                                    <MenuItem value="map">{t("Map")}</MenuItem>
                                </Select>
                            </Grid>
                            {
                                currentContentType && (currentContentType === "table" || currentContentType === "information") ?
                                    <>
                                        <Grid item xs={12}>&nbsp;</Grid>
                                        <Grid item xs={12}><Typography>{t("Text content")}</Typography></Grid>
                                        <Grid item xs={12}>
                                            <CKEditor
                                                editor={Editor}
                                                data={currentMenuContent}
                                                config={{ language: { ui: navigator.language.substring(0, 2), content: navigator.language.substring(0, 2) } }}
                                                onReady={editor => {
                                                    // You can store the "editor" and use when it is needed.
                                                    //console.log('Editor is ready to use!', editor);
                                                }}
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    //console.log({ event, editor, data });
                                                    setCurrentMenuContent(data);
                                                    setUnsavedContent("yes");
                                                }}
                                                onBlur={(event, editor) => {
                                                    //console.log('Blur.', editor);
                                                    ckEditorThemeSync();
                                                }}
                                                onFocus={(event, editor) => {
                                                    //console.log('Focus.', editor);
                                                    ckEditorThemeSync();
                                                }}
                                            />
                                        </Grid>
                                        {
                                            currentContentType === "table" ?
                                                <>
                                                    <Grid item xs={12}>&nbsp;</Grid>
                                                    <Grid item xs={12}><Typography>{t("Roll on the following tables:")}</Typography></Grid>
                                                    <Grid item xs={12}>
                                                        <TablesChooser
                                                            tablesIds={currentMenuTable && currentMenuTable.trim().length > 0 ? currentMenuTable.trim().split(' ').map((item) => { return { label: item, id: uuidv4() } }) : null}
                                                            onTablesChange={(tables) => {
                                                                if (tables !== currentMenuTable) {
                                                                    setCurrentMenuTable(tables);
                                                                    setUnsavedContent("yes");
                                                                }
                                                            }}
                                                        />
                                                    </Grid>
                                                </> : null
                                        }
                                    </> : null
                            }
                            {
                                currentContentType && (currentContentType === "map") ?
                                    <>
                                        <Grid item xs={12}>&nbsp;</Grid>
                                        <MapSetup 
                                            setpieceId={currentMenuSetpiece} 
                                            density={currentMenuDensity} 
                                            gridsize={currentMenuGrid} 
                                            onSetpieceIdChanged={(newSetpieceId) => {
                                                setCurrentMenuSetpiece(newSetpieceId);
                                                setUnsavedContent("yes");
                                            }}
                                            onDensityChanged={(newDensity) => {
                                                setCurrentMenuDensity(newDensity);
                                                setUnsavedContent("yes");
                                            }}
                                            onGridsizeChanged={(newGridsize) => {
                                                setCurrentMenuGrid(newGridsize);
                                                setUnsavedContent("yes");
                                            }}
                                        />
                                    </> : null

                            }
                            <Grid item xs={12}>&nbsp;</Grid>
                            <Button disabled={!contentMetaData.type} startIcon={<SaveAltIcon />} style={{ width: "100%" }} variant="contained" color="primary" onClick={() => updateMenuHeader()}>{t("Save header data")}</Button>
                        </Grid>
                    </AccordionDetails>
                </Accordion>

            </Grid>
            {
                !currentContentType || currentContentType === "menu" ?
                    <>
                        <Grid item xs={12}>&nbsp;</Grid>
                        <Grid item xs={12} style={{ height: (content ? (content.length * 52) + 156 : "100") + "px", overflow: "scroll" }}>
                            <DataGrid
                                sx={{ '& .MuiDataGrid-columnHeadersInner': { backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText } }}
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
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="menuadd-content"
                            id="menuadd-header"
                        >
                            <Typography>{t("Add a new sub menu")}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container>
                                <Grid item xs={12}><Typography>{t("Content ID")}</Typography></Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        value={newContentId}
                                        onChange={(event) => setNewContentId(event.target.value.trim().replace(/\./g, "-"))}
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
                                        <MenuItem value="map">{t("Map")}</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={12}>&nbsp;</Grid>
                                <Button startIcon={<SaveAltIcon />} style={{ width: "100%" }} variant="contained" color="primary" onClick={() => addNewSubmenu()}>{t("Add Sub menu")}</Button>
                                <Grid item xs={12}>&nbsp;</Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion> : null
            }
        </Grid >
    );

};

/* an alternative to the use of CKEditor was to use a simple textarea for the text content

    <TextField
        value={currentMenuContent}
        disabled
        id="text-content"
        variant="outlined"
        sx={{ width: "100%" }}
        onChange={(event) => {
            setCurrentMenuContent(event.target.value);
            setUnsavedContent("yes");
        }}
        multiline
        minRows={3}
        maxRows={8} />

*/
