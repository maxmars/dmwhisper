import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import './style.css'

const Menu = (props) => {

    const { t } = useTranslation();
    const theme = useTheme();

    const columns = [
        { field: 'label', headerName: t('Content'), flex: 1 },
    ];

    try {
        return (
            <>
                <br />
                <div id="datagridhome" style={{ height: "70vh", width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <DataGrid
                        sx={{ '& .MuiDataGrid-columnHeadersInner': { backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText } }}
                        rows={props.content.data.children}
                        columns={columns}
                        height="100%"
                        width="100%"
                        onRowClick={(data) => props.goToContent(data.row.id)}
                    />
                </div>
            </>
        );
    } catch (e) {
        return null;
    }

};


export default Menu;
