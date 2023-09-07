import { Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import ResultsList from './results/SavedRolls';
import ContentTree from './contenttree/ContentTree';
import AuthoringMenu from './authoring/AuthoringMenu';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DataObjectIcon from '@mui/icons-material/DataObject';
import TableChartIcon from '@mui/icons-material/TableChart';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import InfoIcon from '@mui/icons-material/Info';
import Info from './info/Info';
import React from 'react';

const DMWhisper = () => {

  const [darkTheme, setDarkTheme] = useState(createTheme({
    palette: {
      mode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    },
  }));

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    setDarkTheme(createTheme({
      palette: {
        mode: event.matches ? 'dark' : 'light'
      },
    }));
  });

  const [tab, setTab] = useState(2);
  const throws = useSelector((st) => st.throws);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'auto', height: '12vh' }}>
        <Tabs value={tab} onChange={handleChange} variant="scrollable">
          <Tab icon={<InfoIcon />} label="Info" iconPosition="start" />
          <Tab icon={<DataObjectIcon />} label="Edit" iconPosition="start" />
          <Tab icon={<TableChartIcon />} label="Browse" iconPosition="start" />
          <Tab icon={<BookmarksIcon />} label={"Saved (" + throws.sequence.length + ")"} iconPosition="start" />
        </Tabs>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'scroll', height: '88vh', width: '100%' }}>
        {tab === 0 && <Info />}
        {tab === 1 && <AuthoringMenu />}
        {tab === 2 && <ContentTree />}
        {tab === 3 && <ResultsList />}
      </div>
    </ThemeProvider>

  );
}

export default DMWhisper;
