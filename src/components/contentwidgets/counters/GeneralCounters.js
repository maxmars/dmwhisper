import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Button, Box } from '@mui/material';
import CounterComponent from './CounterComponent'; // Assicurati di avere importato il CounterComponent
import { useSelector, useDispatch } from 'react-redux';
import { setCounterData } from '../../../store/slices/content.js';

function GeneralCounters() {
    const savedCounterData = useSelector((st) => st.content.counterData);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [counters, setCounters] = useState(savedCounterData ? savedCounterData : []);

    const handleAddCounter = () => {
        const newCounters = [...counters, 
            { 
                id: Date.now(), 
                maxCounter: 5, 
                initialValue: 0, 
                currentValue: 0, 
                counterName: "Counter" 
            }];
        setCounters(newCounters);

        dispatch(setCounterData({counterData: newCounters}));
    };

    const handleEditCounter = (counterData) => {
        const savedCounters = JSON.parse(JSON.stringify(counters));
        const editedCounter = savedCounters.find((item) => item.id === counterData.counterId);

        editedCounter.maxCounter = counterData.maxCounter;
        editedCounter.initialValue = counterData.initialValue;
        editedCounter.currentValue = counterData.currentValue;
        editedCounter.counterName = counterData.counterName;

        const updatedCounters = savedCounters.map((item) => {
            if (item.id === counterData.counterId) {
                return editedCounter;
            }
            return item;
        });

        setCounters(updatedCounters);
        dispatch(setCounterData({counterData: updatedCounters}));

        console.log(updatedCounters);
    }

    const handleRemoveCounter = (id) => {
        setCounters(counters.filter(counter => counter.id !== id));
        dispatch(setCounterData({ counterData: counters.filter(counter => counter.id !== id)}));
    };

    return (
        <Grid direction="column" spacing={2}>
            {counters.map(counter => (
                <Grid size={12} key={counter.id}>
                    <CounterComponent 
                        counterEditHandler={handleEditCounter}
                        counterId={counter.id}
                        maxCounter={counter.maxCounter}
                        initialValue={counter.initialValue}
                        currentValue={counter.currentValue}
                        counterName={counter.counterName}
                        sx={{ width: "100%" }} 
                    />
                    <Box
                        // Facoltativo: per visualizzare i confini dell'elemento
                        style={{ border: '1px solid #000', height: '100px' }}
                        sx={{
                            width: "90%",
                            margin: "0 auto",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                        <Button sx={{ width: "100%" }} variant="contained" color="secondary" onClick={() => handleRemoveCounter(counter.id)}>
                            {t("Remove")}
                        </Button>
                    </Box>
                </Grid>
            ))}
            <Grid>
                <Box
                    // Facoltativo: per visualizzare i confini dell'elemento
                    style={{ border: '1px solid #000', height: '100px' }}
                    sx={{
                        width: "90%",
                        margin: "0 auto",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Button sx={{ width: "100%" }} variant="contained" color="primary" onClick={handleAddCounter}>
                    {t("Add")}
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
}

export default GeneralCounters;
