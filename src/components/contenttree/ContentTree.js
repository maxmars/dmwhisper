import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getContent, getContentMetaData, getContentName, setTabPath, clearTabPath } from '../../store/slices/content';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import SelectedContent from './SelectedContent';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import HomeIcon from '@mui/icons-material/Home';
import Typography from '@mui/material/Typography';
import { Tab, Tabs } from '@mui/material';
import NotesIcon from '@mui/icons-material/Notes';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import useTheme from '@mui/private-theming/useTheme';
import './style.css'

const ContentTree = () => {

    const wholeContent = useSelector((st) => st.content);
    const tree = wholeContent.tree;
    const [tab, setTab] = useState(0);
    const { t } = useTranslation();
    const theme = useTheme();
    const initialTabPath = wholeContent.tabPaths ? wholeContent.tabPaths[0] : "";
    const [path, setPath] = useState(initialTabPath);
    let initialContent = getContent(tree, path);
    const [currentContent, setCurrentContent] = useState(initialContent ? initialContent : null);
    const [contentName, setContentName] = useState(getContentName(tree, path));
    const [selectedContent, setSelectedContent] = useState(initialContent ? null : getContentMetaData(tree, path));
    const dispatch = useDispatch();

    const columns = [
        { field: 'label', headerName: t('Content'), flex: 1 },
    ];

    const upperPath = () => {
        let newPath = path;

        // If there's a dot in the path, remove the last part
        if (path.indexOf(".") > -1) {
            newPath = path.substring(0, path.lastIndexOf("."));
        } else {
            newPath = "";
        }

        return newPath
    }

    const pathLeaf = () => {
        let newPath = path;

        // If there's a dot in the path, remove the last part
        if (path.indexOf(".") > -1) {
            newPath = path.substring(path.lastIndexOf(".") + 1);
        }

        return newPath;
    }

    const backOneLevel = () => {
        let newPath = upperPath();

        const newCurrentContent = getContentMetaData(tree, newPath);
        setContentName(getContentName(tree, newPath));

        if (!newCurrentContent.type || newCurrentContent.type === "menu") {
            setCurrentContent(getContent(tree, newPath));
            setSelectedContent(null);
        } else {
            setCurrentContent(newCurrentContent);
            setSelectedContent(newCurrentContent);
        }

        setPath(newPath);

    }


    const onClick = (rowId) => {
        const contentType = currentContent.find(item => item.id === rowId).type;
        const newPath = path.length > 0 ? path + "." + rowId : rowId;

        dispatch(setTabPath({
            tab: tab,
            path: newPath
        }));

        const newCurrentContent = getContentMetaData(tree, newPath);

        setContentName(getContentName(tree, newPath));
        setPath(newPath);

        if (!contentType || contentType === "menu") {
            setCurrentContent(getContent(tree, newPath));
            setSelectedContent(null);
            return;
        }

        setCurrentContent(newCurrentContent);
        const selectedContent = currentContent.find(item => item.id === rowId);
        setSelectedContent(selectedContent);
    };

    const goToHomeMenu = () => {
        const newPath = "";
        const newCurrentContent = getContentMetaData(tree, newPath);
        setContentName(getContentName(tree, newPath));

        if (!newCurrentContent.type || newCurrentContent.type === "menu") {
            setCurrentContent(getContent(tree, newPath));
            setSelectedContent(null);
        } else {
            setCurrentContent(newCurrentContent);
            setSelectedContent(newCurrentContent);
        }

        setPath("");
    };

    const handleChange = (event, newValue) => {
        const tabPath = wholeContent.tabPaths ? wholeContent.tabPaths[newValue] : "";

        const newCurrentContent = getContentMetaData(tree, tabPath);

        setContentName(getContentName(tree, tabPath));

        if (!newCurrentContent.type || newCurrentContent.type === "menu") {
            setCurrentContent(getContent(tree, tabPath));
            setSelectedContent(null);
        } else {
            setCurrentContent(newCurrentContent);
            setSelectedContent(newCurrentContent);
        }

        setPath(tabPath);
        setTab(newValue);
    }

    if (!currentContent && !selectedContent) {
        dispatch(clearTabPath());
        goToHomeMenu();
    }

    const goToPreviousContent = () => {
        const newPath = upperPath();
        const newCurrentContent = getContent(tree, newPath);
        const myPathLeaf = pathLeaf();

        if (newCurrentContent) {
            newCurrentContent.find((item, index) => {
                if (item.id === myPathLeaf) {
                    const previousItem = newCurrentContent[index - 1];
                    if (previousItem) {
                        const previousPath = newPath + (newPath && newPath.length > 0 ? "." : "") + previousItem.id;
                        const previousCurrentContent = getContentMetaData(tree, previousPath);
                        setContentName(getContentName(tree, previousPath));
                        setPath(previousPath);
                        setCurrentContent(previousCurrentContent);
                        setSelectedContent(previousCurrentContent);
                    }
                    return true;
                }
                return false;
            });
        }

        return null;
    }

    const goToNextContent = () => {
        const newPath = upperPath();
        const newCurrentContent = getContent(tree, newPath);
        const myPathLeaf = pathLeaf();

        if (newCurrentContent) {
            newCurrentContent.find((item, index) => {
                if (item.id === myPathLeaf) {
                    const nextItem = newCurrentContent[index + 1];
                    if (nextItem) {
                        const nextPath = newPath + (newPath && newPath.length > 0 ? "." : "") + nextItem.id;
                        const nextCurrentContent = getContentMetaData(tree, nextPath);
                        setContentName(getContentName(tree, nextPath));
                        setPath(nextPath);
                        setCurrentContent(nextCurrentContent);
                        setSelectedContent(nextCurrentContent);
                    }
                    return true;
                }
                return false;
            });
        }

        return null;
    }

    const goToContent = (newPath) => {
        let nextPath = null;

        if (path.length > 0) {
            nextPath = path + "." + newPath;
        } else {
            nextPath = newPath;
        }

        const nextCurrentContent = getContentMetaData(tree, nextPath);
        setContentName(getContentName(tree, nextPath));
        setPath(nextPath);
        setCurrentContent(nextCurrentContent);
        setSelectedContent(nextCurrentContent);

        return null;
    }

    try {
        return (
            <>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'auto', height: '12%' }}>
                    <Tabs value={tab} onChange={handleChange} variant="scrollable">
                        <Tab icon={<NotesIcon />} label={t("Bookmark ") + "1"} iconPosition="start" />
                        <Tab icon={<NotesIcon />} label={t("Bookmark ") + "2"} iconPosition="start" />
                        <Tab icon={<NotesIcon />} label={t("Bookmark ") + "3"} iconPosition="start" />
                        <Tab icon={<NotesIcon />} label={t("Bookmark ") + "4"} iconPosition="start" />
                        <Tab icon={<NotesIcon />} label={t("Bookmark ") + "5"} iconPosition="start" />
                    </Tabs>
                </div>
                <div style={{ height: '88%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {selectedContent === null ?

                        <div style={{ height: '90%', width: '100%' }}>
                            <div style={{ height: '10%', width: '100%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <IconButton style={{ marginRight: "7px" }} variant="contained" color="primary" onClick={backOneLevel}><ArrowBackIosNewIcon /></IconButton>
                                <IconButton style={{ marginLeft: "7px" }} variant="contained" color="primary" onClick={goToHomeMenu}><HomeIcon /></IconButton>
                                <Typography variant="h6" component="div" style={{ width: '60%', textAlign: 'center' }}>{contentName}</Typography>
                            </div>
                            <DataGrid
                                sx={{ '& .MuiDataGrid-columnHeadersInner': { backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText } }}
                                rows={currentContent}
                                columns={columns}
                                height="100%"
                                width="100%"
                                onRowClick={(data) => onClick(data.row.id)}
                            />
                        </div>
                        :
                        <SelectedContent selectedContent={selectedContent} 
                                         clearSelectedContent={backOneLevel} 
                                         goToPreviousContent={goToPreviousContent} 
                                         goToNextContent={goToNextContent}
                                         goToContent={goToContent} />}
                </div>
            </>
        );
    } catch (e) {
        return null;
    }

};


export default ContentTree;
