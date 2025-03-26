import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid2 as Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AreaMapCanvas from './AreaMapCanvas';


export default function AreaMapComponent({cells, gridrowcells, dark}) {

    const { t } = useTranslation();
    const [buildingInfoDialogOpen, setBuildingInfoDialogOpen] = React.useState(null);

    const getBuildingInfoDialog = () => {
        try {
            const selectedRoom = cells.find((cell) => cell && cell.id === buildingInfoDialogOpen);

            return (
                <Dialog onClose={(e) => setBuildingInfoDialogOpen(null)} open={buildingInfoDialogOpen !== null}>
                    <DialogTitle>{selectedRoom.description}</DialogTitle>
                    <Accordion defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Typography>{t('Room Description')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <div dangerouslySetInnerHTML={{ __html: selectedRoom.content }} />
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Dialog>
            );
        } catch (e) {
            return null;
        }
    }

    const mapCellClickHandler = (cellId) => {
        setBuildingInfoDialogOpen(cellId);
    }

    return (
        <Grid container >
            <Grid size={12} style={{ display: 'flex', justifyContent: 'center' }}>
                <AreaMapCanvas numCells={gridrowcells} mapCells={cells} onMapCellClicked={mapCellClickHandler} dark={dark} />
            </Grid>
            <Grid size={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    {getBuildingInfoDialog()}
            </Grid>
        </Grid>
    );
}
