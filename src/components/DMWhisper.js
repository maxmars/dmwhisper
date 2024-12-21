import { useState } from 'react';
import ContentTree from './contenttree/ContentTree';
import AuthoringMenu from './authoring/AuthoringMenu';
import InputMenu from './filemanagement/InputMenu';
import OutputMenu from './filemanagement/OutputMenu';
import ContentsList from './filemanagement/ContentsList';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DataObjectIcon from '@mui/icons-material/DataObject';
import TableChartIcon from '@mui/icons-material/TableChart';
import InfoIcon from '@mui/icons-material/Info';
import Info from './info/Info';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DungeonExplore from './contentwidgets/dungeons/DungeonExplore';
// import EngineeringIcon from '@mui/icons-material/Engineering';
// import Test from './testbed/Test';
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
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { Navigate, useNavigate, Routes, Route } from 'react-router-dom';
import SpotlightedContent from './contenttree/SpotlightedContent';
import GeneralCounters from './contentwidgets/counters/GeneralCounters';
import SavedResultsComponent from './results/SavedResultsComponent';


const DMWhisper = () => {

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [darkTheme, setDarkTheme] = useState(createTheme({
    palette: {
      mode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    },
  }));

  const navigate = useNavigate();

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    setDarkTheme(createTheme({
      palette: {
        mode: event.matches ? 'dark' : 'light'
      },
    }));
  });

  React.useEffect(() => {
    const handleBackButton = (event) => {      
      if (window.history.length < 2 && event.state) {
        window.history.pushState({ noBackExitsApp: true }, '');
      }
    };

    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <ListItemButton onClick={() => navigate("browse")}>
            <ListItemIcon>
              <TableChartIcon />
            </ListItemIcon>
            <ListItemText primary={t("Browse")} />
          </ListItemButton>
        </ListItem>
        <ListItem key="saved" disablePadding>
          <ListItemButton onClick={() => navigate("saved")}>
            <ListItemIcon>
              <StarRateIcon />
            </ListItemIcon>
            <ListItemText primary={t("Saved") + " (" + throws.sequence.length + ")"} />
          </ListItemButton>
        </ListItem>
        <ListItem key="dungeon" disablePadding>
          <ListItemButton onClick={() => navigate("dungeon")}>
            <ListItemIcon>
              <AccountTreeIcon />
            </ListItemIcon>
            <ListItemText primary={t("Dungeon Explore")} />
          </ListItemButton>
        </ListItem>
        <ListItem key="counter" disablePadding>
          <ListItemButton onClick={() => navigate("counter")}>
            <ListItemIcon>
              <DonutLargeIcon />
            </ListItemIcon>
            <ListItemText primary={t("Counter")} />
          </ListItemButton>
        </ListItem>
        <ListItem key="edit_content" disablePadding>
          <ListItemButton onClick={() => navigate("edit_content")}>
            <ListItemIcon>
              <DataObjectIcon />
            </ListItemIcon>
            <ListItemText primary={t("Edit content")} />
          </ListItemButton>
        </ListItem>
        <ListItem key="list_of_contents" disablePadding>
          <ListItemButton onClick={() => navigate("list_of_contents")}>
            <ListItemIcon>
              <FormatListBulletedIcon />
            </ListItemIcon>
            <ListItemText primary={t("List of contents")} />
          </ListItemButton>
        </ListItem>
        <ListItem key="input" disablePadding>
          <ListItemButton onClick={() => navigate("input")}>
            <ListItemIcon>
              <InputIcon />
            </ListItemIcon>
            <ListItemText primary={t("Import data")} />
          </ListItemButton>
        </ListItem>
        <ListItem key="output" disablePadding>
          <ListItemButton onClick={() => navigate("output")}>
            <ListItemIcon>
              <OutputIcon />
            </ListItemIcon>
            <ListItemText primary={t("Export data")} />
          </ListItemButton>
        </ListItem>
        <ListItem key="user_manual" disablePadding>
          <ListItemButton onClick={() => window.open("https://marsiglietti.it/DMWhisper-manual-1.26.0.pdf", "_blank", null)}>
            <ListItemIcon>
              <ImportContactsIcon />
            </ListItemIcon>
            <ListItemText primary={t("User manual")} />
          </ListItemButton>
        </ListItem>
        <ListItem key="info" disablePadding>
          <ListItemButton onClick={() => navigate("info")}>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary={t("Info")} />
          </ListItemButton>
        </ListItem>
        {/* <ListItem key="test" disablePadding>
          <ListItemButton onClick={() => setTab(8)}>
            <ListItemIcon>
              <EngineeringIcon />
            </ListItemIcon>
            <ListItemText primary={t("Test")} />
          </ListItemButton>
        </ListItem> */}
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
        <Routes>
          <Route path="/" element={<Navigate to="browse" replace />} />
          <Route path="spotlight/:path" element={<SpotlightedContent />} />
          <Route path="browse" element={<ContentTree />} />
          <Route path="saved" element={<SavedResultsComponent />} />
          <Route path="dungeon/:dngnsetpiece?/:roomsnumber?/:dngnmonsterset?/:dngngtrapset?/:dngntreasureset?/:dngnpuzzleset?" element={<DungeonExplore />} />
          <Route path="counter" element={<GeneralCounters />} />
          <Route path="edit_content" element={<AuthoringMenu />} />
          <Route path="list_of_contents" element={<ContentsList />} />
          <Route path="input" element={<InputMenu />} />
          <Route path="output" element={<OutputMenu />} />
          <Route path="info" element={<Info />} />
        </Routes>
          {/* {tab === 8 && <Test />} */}
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
