
import { useState } from 'react';
import SavedRolls from './SavedResultsPage';
import ImportContentPage from './ImportContentPage';
import SelectPromptPage from '../contentwidgets/SelectPromptPage';


const SavedResultsComponent = () => {

    const [pageContent, setPageContent] = useState("");
    const [pageMode, setPageMode] = useState("savedresultsshow");

    const showSavedResults = () => {
        setPageMode("savedresultsshow");
    }

    const showImportContentWidget = () => {
        setPageMode("importcontent");
    }

    const showGenAiWidget = (pageContent) => {
        setPageContent(pageContent);
        setPageMode("genaiprocess");
    }

    if (pageMode === "savedresultsshow") {
        return (
            <SavedRolls showImportContentWidget={showImportContentWidget} showGenAiWidget={showGenAiWidget} />
        );
    } else if (pageMode === "genaiprocess") {
        return (
            <SelectPromptPage pageContent={pageContent} onCancel={showSavedResults} />
        );
    } else {
        return (
            <ImportContentPage showSavedResults={showSavedResults} />
        );
    }
};


export default SavedResultsComponent;
