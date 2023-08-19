import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getContent, getContentName } from '../../store/slices/content';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import SelectedContent from './SelectedContent';
import Button from '@mui/material/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import HomeIcon from '@mui/icons-material/Home';
import Typography from '@mui/material/Typography';
import './style.css'

const columns = [
    { field: 'label', headerName: 'Content', flex: 1 },
];

const ContentTree = () => {

    const [path, setPath] = useState("");
    const [selectedContent, setSelectedContent] = useState(null);
    const tree = useSelector((st) => st.content).tree;
    const content = getContent(tree, path);
    const contentName = getContentName(tree, path);

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
                        <Button startIcon={<ArrowBackIosNewIcon />} style={{ marginRight: "2px" }} variant="contained" color="primary" onClick={backOneLevel}>Back</Button>
                        <Button startIcon={<HomeIcon />} style={{ marginLeft: "2px" }} variant="contained" color="primary" onClick={() => setPath("")}>Home</Button>
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
