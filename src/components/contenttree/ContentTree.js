import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getContent, setContent, getContentName, initialState } from '../../store/slices/content';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import SelectedContent from './SelectedContent';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import HomeIcon from '@mui/icons-material/Home';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import './style.css'

const ContentTree = () => {

    const { t } = useTranslation();
    const [path, setPath] = useState("");
    const [selectedContent, setSelectedContent] = useState(null);
    const tree = useSelector((st) => st.content).tree;
    const content = getContent(tree, path);
    const contentName = getContentName(tree, path);
    const dispatch = useDispatch();

    const columns = [
        { field: 'label', headerName: t('Content'), flex: 1 },
    ];

    if (!content) {
        dispatch(setContent(initialState));
    }

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
        const contentType = content.find(item => item.id === rowId).type;

        if (contentType === "menu") {
            setPath(path.length > 0 ? path + "." + rowId : rowId);
            return;
        }

        const selectedContent = content.find(item => item.id === rowId);
        setSelectedContent(selectedContent);
    };

    const clearSelectedContent = () => {
        setSelectedContent(null);
    };

    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', verticalAlign: 'center' }}>
            {selectedContent === null ?

                <div style={{ height: '90%', width: '100%' }}>
                    <div style={{ height: '10%', width: '100%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <IconButton style={{ marginRight: "7px" }} variant="contained" color="primary" onClick={backOneLevel}><ArrowBackIosNewIcon /></IconButton>
                        <IconButton style={{ marginLeft: "7px" }} variant="contained" color="primary" onClick={() => setPath("")}><HomeIcon /></IconButton>
                        <Typography variant="h6" component="div" style={{ width: '60%', textAlign: 'center' }}>{contentName}</Typography>
                    </div>
                    <DataGrid
                        rows={content}
                        columns={columns}
                        height="100%"
                        width="100%"
                        onRowClick={(data) => onClick(data.row.id)}
                    />
                </div>
                :
                <SelectedContent selectedContent={selectedContent} clearSelectedContent={clearSelectedContent} />}
        </div>
    );

};


export default ContentTree;
