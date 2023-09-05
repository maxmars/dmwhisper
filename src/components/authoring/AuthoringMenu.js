import React from 'react';
import { useState } from 'react';
import { Grid, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import PasteJson from './PasteJson';


const AuthoringMenu = () => {

  const content = useSelector((st) => st.content);

  const [pageMode, setPageMode] = useState('menu');

  const returnToMenu = () => {
    setPageMode('menu');
  };

  const copyContentToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(content));
  };

  switch (pageMode) {
    case 'menu':
      return (
        <Grid container>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button startIcon={<EditIcon />} onClick={() => true} variant="contained" color="primary">Edit current content</Button>
          </Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button startIcon={<ContentCopyIcon />} onClick={copyContentToClipboard} variant="contained" color="primary">Copy content as JSON to clipboard</Button>
          </Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button startIcon={<ContentPasteIcon />} onClick={() => setPageMode('parse')} variant="contained" color="primary">Paste and parse JSON as content</Button>
          </Grid>
        </Grid>
      );

    case 'parse':
    default:
      return <PasteJson returnToMenu={returnToMenu} />;
  }
};


export default AuthoringMenu;
