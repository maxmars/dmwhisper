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
import BookmarksIcon from '@mui/icons-material/Bookmarks';
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

        dispatch(setTabPath({
            tab: tab,
            path: newPath
        }));

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

        dispatch(setTabPath({
            tab: tab,
            path: newPath
        }));

        setPath(newPath);
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
                        dispatch(setTabPath({
                            tab: tab,
                            path: newPath
                        }));
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
                        dispatch(setTabPath({
                            tab: tab,
                            path: newPath
                        }));
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
        dispatch(setTabPath({
            tab: tab,
            path: nextPath
        }));

        return null;
    }

    try {
        let tabName1 = tab === 0 ? contentName : (wholeContent.tabPaths && wholeContent.tabPaths[0] ? getContentMetaData(tree, wholeContent.tabPaths[0]).label : t("Home"));
        let tabName2 = tab === 1 ? contentName : (wholeContent.tabPaths && wholeContent.tabPaths[1] ? getContentMetaData(tree, wholeContent.tabPaths[1]).label : t("Home"));
        let tabName3 = tab === 2 ? contentName : (wholeContent.tabPaths && wholeContent.tabPaths[2] ? getContentMetaData(tree, wholeContent.tabPaths[2]).label : t("Home"));
        let tabName4 = tab === 3 ? contentName : (wholeContent.tabPaths && wholeContent.tabPaths[3] ? getContentMetaData(tree, wholeContent.tabPaths[3]).label : t("Home"));
        let tabName5 = tab === 4 ? contentName : (wholeContent.tabPaths && wholeContent.tabPaths[4] ? getContentMetaData(tree, wholeContent.tabPaths[4]).label : t("Home"));

        if (tab !== 0 && tabName1.length > 12) tabName1 = tabName1.substring(0, 10) + "..";
        if (tab !== 1 && tabName2.length > 12) tabName2 = tabName2.substring(0, 10) + "..";
        if (tab !== 2 && tabName3.length > 12) tabName3 = tabName3.substring(0, 10) + "..";
        if (tab !== 3 && tabName4.length > 12) tabName4 = tabName4.substring(0, 10) + "..";
        if (tab !== 4 && tabName5.length > 12) tabName5 = tabName5.substring(0, 10) + "..";

        return (
            <div style={{height: '100%'}}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'auto', height: '12%' }}>
                    <Tabs value={tab} onChange={handleChange} variant="scrollable">
                        <Tab icon={<BookmarksIcon />} label={tabName1} iconPosition="start" />
                        <Tab icon={<BookmarksIcon />} label={tabName2} iconPosition="start" />
                        <Tab icon={<BookmarksIcon />} label={tabName3} iconPosition="start" />
                        <Tab icon={<BookmarksIcon />} label={tabName4} iconPosition="start" />
                        <Tab icon={<BookmarksIcon />} label={tabName5} iconPosition="start" />
                    </Tabs>
                </div>
                <br />
                <div style={{ height: '88%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {selectedContent === null ?
                        <div style={{ height: '88vh', width: '100%'}}>
                            <div style={{ height: '10%', width: '100%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <IconButton style={{ marginRight: "7px" }} variant="contained" color="primary" onClick={backOneLevel}><ArrowBackIosNewIcon /></IconButton>
                                <IconButton style={{ marginLeft: "7px" }} variant="contained" color="primary" onClick={goToHomeMenu}><HomeIcon /></IconButton>
                                <Typography variant="h6" component="div" style={{ width: '60%', textAlign: 'center' }}>{contentName}</Typography>
                            </div>
                            <div style={{ height: '90%', width: '100%' }}>
                                <DataGrid
                                    sx={{ '& .MuiDataGrid-columnHeadersInner': { backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText } }}
                                    rows={currentContent}
                                    columns={columns}
                                    height="100%"
                                    width="100%"
                                    onRowClick={(data) => onClick(data.row.id)}
                                />
                            </div>
                        </div>
                        :
                        <SelectedContent selectedContent={selectedContent}
                            clearSelectedContent={backOneLevel}
                            goToPreviousContent={goToPreviousContent}
                            goToNextContent={goToNextContent}
                            goToContent={goToContent} />}
                </div>
            </div>
        );
    } catch (e) {
        dispatch(clearTabPath());
        document.location.href = document.location.href.substring(0, document.location.href.indexOf('?'));
        return null;
    }
};


export default ContentTree;
