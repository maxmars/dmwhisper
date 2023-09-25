import { Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import ResultsList from './results/SavedRolls';
import ContentTree from './contenttree/ContentTree';
import AuthoringMenu from './authoring/AuthoringMenu';
import InputMenu from './authoring/InputMenu';
import OutputMenu from './authoring/OutputMenu';
import ContentsList from './authoring/ContentsList';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DataObjectIcon from '@mui/icons-material/DataObject';
import TableChartIcon from '@mui/icons-material/TableChart';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import InfoIcon from '@mui/icons-material/Info';
import Info from './info/Info';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setContent, initialState } from '../store/slices/content';
import { useTranslation } from 'react-i18next';
import InputIcon from '@mui/icons-material/Input';
import OutputIcon from '@mui/icons-material/Output';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

const DMWhisper = () => {

  const { t } = useTranslation();
  const dispatch = useDispatch();

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

  // By default, user is on the "Browse content" tab
  const [tab, setTab] = useState(5);
  const throws = useSelector((st) => st.throws);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  React.useEffect(() => {
    async function fetchContent() {
      const params = new URLSearchParams(window.location.search) // datafile=url
      let datafileUrl = params.get('datafile') // url 

      if (datafileUrl && datafileUrl.length > 0) {  // if datafile is specified in url

        try {
          const datafile = await fetch(datafileUrl, {
            method: 'GET',
            mode: 'no-cors'
          });

          if (datafile && datafile.ok) {
            const datafileJsonString = await datafile.text();
            
            if (dispatch) {
              try {
                dispatch(setContent(JSON.parse(datafileJsonString)));
              } catch (error) {
              }
              window.history.replaceState(null, '', document.location.href.substring(0, document.location.href.indexOf('?')));
            }
          }
        } catch (error) {
          // TODO: handle error
        }

      }
    }
    fetchContent();
  }, [dispatch]);

  try {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'auto', height: '12vh' }}>
          <Tabs value={tab} onChange={handleChange} variant="scrollable">
            <Tab icon={<InfoIcon />} label={t("Info")} iconPosition="start" />
            <Tab icon={<InputIcon />} label={t("Import data")} iconPosition="start" />
            <Tab icon={<OutputIcon />} label={t("Export data")} iconPosition="start" />
            <Tab icon={<FormatListBulletedIcon />} label={t("List of contents")} iconPosition="start" />
            <Tab icon={<DataObjectIcon />} label={t("Edit content")} iconPosition="start" />
            <Tab icon={<TableChartIcon />} label={t("Browse")} iconPosition="start" />
            <Tab icon={<BookmarksIcon />} label={t("Saved") + " (" + throws.sequence.length + ")"} iconPosition="start" />
          </Tabs>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'scroll', height: '88vh', width: '100%' }}>
          {tab === 0 && <Info />}
          {tab === 1 && <InputMenu />}
          {tab === 2 && <OutputMenu />}
          {tab === 3 && <ContentsList />}
          {tab === 4 && <AuthoringMenu />}
          {tab === 5 && <ContentTree />}
          {tab === 6 && <ResultsList />}
        </div>
      </ThemeProvider>

    );
  } catch (error) {
    dispatch(setContent(initialState));
    document.location.href = document.location.href.substring(0, document.location.href.indexOf('?'));
    return null;
  }
}

export default DMWhisper;
