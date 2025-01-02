import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const ConfigPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [prompts, setPrompts] = useState([]);
  const [newPromptName, setNewPromptName] = useState('');
  const [newPromptText, setNewPromptText] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('apiKey');
    const savedPrompts = localStorage.getItem('prompts');
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedPrompts) setPrompts(JSON.parse(savedPrompts));
  }, []);

  const handleAddPrompt = () => {
    const newPrompt = { name: newPromptName, text: newPromptText };
    if (editingIndex === -1) {
      setPrompts([...prompts, newPrompt]);
    } else {
      const updatedPrompts = [...prompts];
      updatedPrompts[editingIndex] = newPrompt;
      setPrompts(updatedPrompts);
      setEditingIndex(-1);
    }
    setNewPromptName('');
    setNewPromptText('');
  };

  const handleEditPrompt = (index) => {
    setNewPromptName(prompts[index].name);
    setNewPromptText(prompts[index].text);
    setEditingIndex(index);
  };

  const handleDeletePrompt = (index) => {
    const updatedPrompts = prompts.filter((_, i) => i !== index);
    setPrompts(updatedPrompts);
  };

  const handleSave = () => {
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('prompts', JSON.stringify(prompts));
    alert('Impostazioni salvate!');
  };

  return (
    <div style={{ padding: 20 }}>
      <TextField
        label="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Nome Prompt"
        value={newPromptName}
        onChange={(e) => setNewPromptName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Testo Prompt"
        value={newPromptText}
        onChange={(e) => setNewPromptText(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleAddPrompt}>
        {editingIndex === -1 ? 'Aggiungi Prompt' : 'Modifica Prompt'}
      </Button>
      <List>
        {prompts.map((prompt, index) => (
          <ListItem key={index} secondaryAction={
            <>
              <IconButton edge="end" onClick={() => handleEditPrompt(index)}>
                <Edit />
              </IconButton>
              <IconButton edge="end" onClick={() => handleDeletePrompt(index)}>
                <Delete />
              </IconButton>
            </>
          }>
            <ListItemText primary={prompt.name} secondary={prompt.text} />
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="secondary" onClick={handleSave} style={{ marginTop: 20 }}>
        Salva
      </Button>
    </div>
  );
};

export default ConfigPage;
