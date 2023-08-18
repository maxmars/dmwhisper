import { Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import ResultsList from './results/ResultsList';
import ContentTree from './contenttree/ContentTree';
import Settings from './settings/Settings';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SettingsIcon from '@mui/icons-material/Settings';
import TableChartIcon from '@mui/icons-material/TableChart';
import BookmarksIcon from '@mui/icons-material/Bookmarks';


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

  const [tab, setTab] = useState(1);
  const throws = useSelector((st) => st.throws);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'auto', height: '15vh' }}>
        <Tabs value={tab} onChange={handleChange} variant="scrollable">
          <Tab icon={<SettingsIcon />} label="Settings" iconPosition="start" />
          <Tab icon={<TableChartIcon />} label="Tables" iconPosition="start" />
          <Tab icon={<BookmarksIcon />} label={"Results (" + throws.sequence.length + ")"} iconPosition="start" />
        </Tabs>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'scroll', height: '85vh', width: '100%' }}>
        {tab === 0 && <Settings />}
        {tab === 1 && <ContentTree />}
        {tab === 2 && <ResultsList />}
      </div>
    </ThemeProvider>

  );
}

export default DMWhisper;
