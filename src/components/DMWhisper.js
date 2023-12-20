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
import InfoIcon from '@mui/icons-material/Info';
import Info from './info/Info';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setContent, clearTabPath } from '../store/slices/content';
import { useTranslation } from 'react-i18next';
import InputIcon from '@mui/icons-material/Input';
import OutputIcon from '@mui/icons-material/Output';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import StarRateIcon from '@mui/icons-material/StarRate';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';


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
  const [tab, setTab] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const throws = useSelector((st) => st.throws);

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

  const leftMenu = () => (
    <Box
      sx={{ width: 300 }}
      role="presentation"
      onClick={() => setMenuOpen(!menuOpen)}
      onKeyDown={() => setMenuOpen(!menuOpen)}
    >
      <List>
        <ListItem key="browse" disablePadding>
          <ListItemButton onClick={() => setTab(0)}>
            <ListItemIcon>
              <TableChartIcon />
            </ListItemIcon>
            <ListItemText primary={t("Browse")} />
          </ListItemButton>
        </ListItem>
        <ListItem key="saved" disablePadding>
          <ListItemButton onClick={() => setTab(1)}>
            <ListItemIcon>
              <StarRateIcon />
            </ListItemIcon>
            <ListItemText primary={t("Saved") + " (" + throws.sequence.length + ")"} />
          </ListItemButton>
        </ListItem>
        <ListItem key="edit_content" disablePadding>
          <ListItemButton onClick={() => setTab(2)}>
            <ListItemIcon>
              <DataObjectIcon />
            </ListItemIcon>
            <ListItemText primary={t("Edit content")} />
          </ListItemButton>
        </ListItem>
        <ListItem key="list_of_contents" disablePadding>
          <ListItemButton onClick={() => setTab(3)}>
            <ListItemIcon>
              <FormatListBulletedIcon />
            </ListItemIcon>
            <ListItemText primary={t("List of contents")} />
          </ListItemButton>
        </ListItem>
        <ListItem key="input" disablePadding>
          <ListItemButton onClick={() => setTab(4)}>
            <ListItemIcon>
              <InputIcon />
            </ListItemIcon>
            <ListItemText primary={t("Import data")} />
          </ListItemButton>
        </ListItem>
        <ListItem key="output" disablePadding>
          <ListItemButton onClick={() => setTab(5)}>
            <ListItemIcon>
              <OutputIcon />
            </ListItemIcon>
            <ListItemText primary={t("Export data")} />
          </ListItemButton>
        </ListItem>
        <ListItem key="user_manual" disablePadding>
          <ListItemButton onClick={() => window.open("https://marsiglietti.it/DMWhisper-manual-1.20.0.pdf", "_blank", null)}>
            <ListItemIcon>
              <ImportContactsIcon />
            </ListItemIcon>
            <ListItemText primary={t("User manual")} />
          </ListItemButton>
        </ListItem>
        <ListItem key="info" disablePadding>
          <ListItemButton onClick={() => setTab(6)}>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary={t("Info")} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  try {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div key="left" style={{ paddingLeft: "2em" }}>
          <IconButton aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)} edge="start" color="inherit" >
            <MenuIcon />
          </IconButton>
          <br />
          <br />
          <Drawer
            anchor="left"
            open={menuOpen}
            onClose={() => setMenuOpen(!menuOpen)}
          >
            {leftMenu()}
          </Drawer>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'scroll', width: '100%', height: '100%' }}>
          {tab === 0 && <ContentTree />}
          {tab === 1 && <ResultsList />}
          {tab === 2 && <AuthoringMenu />}
          {tab === 3 && <ContentsList />}
          {tab === 4 && <InputMenu />}
          {tab === 5 && <OutputMenu />}
          {tab === 6 && <Info />}
        </div>
      </ThemeProvider>

    );
  } catch (error) {
    dispatch(clearTabPath());
    document.location.href = document.location.href.substring(0, document.location.href.indexOf('?'));
    return null;
  }
}

export default DMWhisper;
