import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, IconButton, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const ConfigPage = () => {
  const { t } = useTranslation();

  const [apiKey, setApiKey] = useState('');
  const [prompts, setPrompts] = useState([]);
  const [newPromptName, setNewPromptName] = useState('');
  const [newPromptText, setNewPromptText] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [warningMessage, setWarningMessage] = useState(null);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');

  useEffect(() => {
    const savedApiKey = localStorage.getItem('apiKey');
    const savedPrompts = localStorage.getItem('prompts');
    const savedModel = localStorage.getItem('selectedModel');
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedPrompts) setPrompts(JSON.parse(savedPrompts));
    if (savedModel) setSelectedModel(savedModel);
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
    localStorage.setItem('selectedModel', selectedModel);
    setWarningMessage(t("Impostazioni salvate!"));
  };

  if (warningMessage) {
    return (
      <div style={{ padding: 20 }}>
        <Typography variant='h5'>{warningMessage}</Typography>
        <Button variant="contained" color="secondary" onClick={() => setWarningMessage(null)} style={{ marginTop: 20 }}>
          {t('Dismiss')}
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <TextField
        label={t("API Key")}
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>{t("Modello GPT OpenAI")}</InputLabel>
        <Select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <MenuItem value="gpt-4o">gpt-4o</MenuItem>
          <MenuItem value="gpt-4o-mini">gpt-4o-mini</MenuItem>
          <MenuItem value="o1">o1</MenuItem>
          <MenuItem value="o1-mini">o1-mini</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label={t("Nome Prompt")}
        value={newPromptName}
        onChange={(e) => setNewPromptName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label={t("Testo Prompt")}
        value={newPromptText}
        onChange={(e) => setNewPromptText(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleAddPrompt}>
        {editingIndex === -1 ? t('Aggiungi Prompt') : t('Modifica Prompt')}
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
