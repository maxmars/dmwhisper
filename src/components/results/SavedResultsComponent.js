
import { useState } from 'react';
import SavedRolls from './SavedResultsPage';
import ImportContentPage from './ImportContentPage';


const SavedResultsComponent = () => {

    const [pageMode, setPageMode] = useState("savedresultsshow");

    const showSavedResults = () => {
        setPageMode("savedresultsshow");
    }

    const showImportContentWidget = () => {
        setPageMode("importcontent");
    }

    if (pageMode === "savedresultsshow") {
        return (
            <SavedRolls showImportContentWidget={showImportContentWidget} />
        );
    } else {
        return (
            <ImportContentPage showSavedResults={showSavedResults} />
        );
    }
};


export default SavedResultsComponent;
