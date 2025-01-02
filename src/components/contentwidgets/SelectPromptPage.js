import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { Shuffle as ShuffleIcon } from '@mui/icons-material';
import { Close as CloseIcon } from '@mui/icons-material';
import openai from 'openai';
import { addThrow } from '../../store/slices/throws';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { CircularProgress } from '@mui/material';


const SelectPromptPage = ({ pageContent, onCancel }) => {
    const [prompts, setPrompts] = useState([]);
    const [selectedPrompt, setSelectedPrompt] = useState(null);
    const [editableText, setEditableText] = useState('');
    const [genaiAnwser, setGenaiAnwser] = useState(null);
    const [showSpinner, setShowSpinner] = useState(false);

    const dispatch = useDispatch();

    const configuration = {
        apiKey: localStorage.getItem('apiKey') ? localStorage.getItem('apiKey') : 'no api key configured!',
        dangerouslyAllowBrowser: true,
    };
    const openaiInstance = new openai(configuration);

    const handleSendToChatGPT = async () => {

        setShowSpinner(true);

        try {
            const completion = await openaiInstance.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{
                    role: 'user',
                    content: editableText + "\"" + pageContent + "\"",
                }],
                // max_tokens: 50,
            });

            const answer = completion.choices[0].message;

            if (answer && answer.content && typeof answer.content === 'string') {
                const formattedAnswer = answer.content.replace(/\n/g, '<br />');
                //console.log('Risposta da OpenAI:', formattedAnswer);
                setGenaiAnwser(formattedAnswer);
            }
            setShowSpinner(false);

        } catch (error) {
            console.error('Errore nella richiesta a OpenAI:', JSON.stringify(error));
            setGenaiAnwser('Errore nella richiesta a OpenAI: ' + JSON.stringify(error));
            setShowSpinner(false);
        }
    };

    useEffect(() => {
        const savedPrompts = localStorage.getItem('prompts');
        if (savedPrompts) setPrompts(JSON.parse(savedPrompts));
    }, []);

    const handleSelectPrompt = (prompt) => {
        setSelectedPrompt(prompt);
        setEditableText(prompt.text);
    };

    const handleCancel = () => {
        setSelectedPrompt(null);
        setEditableText('');
        onCancel();
    };

    const handleSave = () => {
        // Implementa la logica per salvare la risposta di GenAI
        dispatch(addThrow({ result: genaiAnwser, timestamp: format(new Date(), "yyyy-MM-dd' 'HH:mm:ss") }));
        onCancel();
    }

    if (showSpinner) {
        return (
            <div style={{ padding: 20 }}>
                <Typography variant="h5">Invio del prompt a ChatGPT in corso...</Typography>
                <CircularProgress />
            </div>
        );
    }

    if (genaiAnwser && genaiAnwser !== null && genaiAnwser !== '') {
        return (
            <div style={{ padding: 20 }}>
                <Typography variant="h5">Risposta di GenAI:</Typography>
                <div dangerouslySetInnerHTML={{ __html: genaiAnwser }} />
                <Button startIcon={<ShuffleIcon />} variant="contained" color="primary" onClick={handleSave} style={{ marginTop: 10 }}>
                    Salva
                </Button>&nbsp;&nbsp;&nbsp;
                <Button startIcon={<CloseIcon />} variant="contained" color="primary" onClick={handleCancel} style={{ marginTop: 10 }}>
                    Annulla
                </Button>
            </div>
        );
    } else {
        return (
            <div style={{ padding: 20 }}>
                <Typography variant="h5">Seleziona un Prompt da inviare a ChatGPT insieme al contenuto della pagina</Typography>
                <Typography>Nota: devi avere già configurato una Api Key nelle Impostazioni. Le chiamate API di ChatGPT sono a pagamento e dovrai avere credito sufficiente per queste chiamate.</Typography>
                <List>
                    {prompts.map((prompt, index) => (
                        <ListItemButton key={index} onClick={() => handleSelectPrompt(prompt)}>
                            <ListItemText primary={prompt.name} />
                        </ListItemButton>
                    ))}
                </List>
                {selectedPrompt && (
                    <div>
                        <TextField
                            label="Modifica Prompt"
                            value={editableText}
                            onChange={(e) => setEditableText(e.target.value)}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                        />
                        <Button variant="contained" color="primary" onClick={handleSendToChatGPT}>
                            Invia a ChatGPT
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleCancel} style={{ marginLeft: 10 }}>
                            Annulla
                        </Button>
                    </div>
                )}
            </div>
        );
    }
};

export default SelectPromptPage;
