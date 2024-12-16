import React, { useState, useEffect } from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';
import { Grid, TextField, Button } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';


function CircularProgressWithLabel({ value, sizePercent = 10, thickness = 3.6 }) {
    const [size, setSize] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setSize(window.innerWidth * (sizePercent / 100));
        };

        handleResize(); // Chiamare immediatamente per impostare la dimensione iniziale
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [sizePercent]);

    return (
        <Box position="relative" display="inline-flex">
            <CircularProgress variant="determinate" value={value} size={size} thickness={thickness} />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="caption" component="div" color="textSecondary">
                    {`${Math.round(value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

// Esempio di utilizzo nel CounterComponent
function CounterComponent(props) {
    const { t } = useTranslation();
    const [mode, setMode] = useState(props.currentValue && props.currentValue > 0 ? 'counter' : 'input');
    const [maxCounter, setMaxCounter] = useState(props.maxCounter);
    const [initialValue, setInitialValue] = useState(props.initialValue);
    const [currentValue, setCurrentValue] = useState(props.currentValue);
    const [counterName, setCounterName] = useState(props.counterName);

    const handleUse = () => {
        setCurrentValue(initialValue);
        setMode('counter');
    };

    const handleIncrement = () => {
        const newCurrentValue = Math.min(currentValue + 1, maxCounter);
        setCurrentValue(newCurrentValue);

        const editedCounter = {
            counterId: props.counterId,
            maxCounter,
            initialValue,
            currentValue: newCurrentValue,
            counterName,
        };

        props.counterEditHandler(editedCounter);
    };

    const handleDecrement = () => {
        const newCurrentValue = Math.max(currentValue - 1, 0);
        setCurrentValue(newCurrentValue);

        const editedCounter = {
            counterId: props.counterId,
            maxCounter,
            initialValue,
            currentValue: newCurrentValue,
            counterName,
        };

        props.counterEditHandler(editedCounter);
    };

    const handleCounterNameChange = (e) => {
        setCounterName(e.target.value);

        const editedCounter = {
            counterId: props.counterId,
            maxCounter,
            initialValue,
            currentValue,
            counterName: e.target.value,
        };

        props.counterEditHandler(editedCounter);
    };

    const handleModify = () => {
        setMode('input');
    };

    const handleMaxCounterChange = (e) => {

        const newMaxCounter = e.target.value.length > 0 ? parseInt(e.target.value) : 0;
        setMaxCounter(newMaxCounter);

        const editedCounter = {
            counterId: props.counterId,
            maxCounter: newMaxCounter,
            initialValue,
            currentValue,
            counterName,
        };

        props.counterEditHandler(editedCounter);
    }

    const handleInitialValueChange = (e) => {
        const newInitialValue = e.target.value.length > 0 ? parseInt(e.target.value) : 0;
        setInitialValue(newInitialValue);

        const editedCounter = {
            counterId: props.counterId,
            maxCounter,
            initialValue: newInitialValue,
            currentValue,
            counterName,
        };

        props.counterEditHandler(editedCounter);
    }

    return (
        <>
            {mode === 'input' ? (
                <Grid justifyContent="center" container spacing={2} direction="column" alignItems="center">
                    <Grid item xs={12} sx={{ width: '100%' }} >&nbsp;</Grid>
                    <Grid item xs={12} sx={{ width: '95%' }} >
                        <TextField
                            sx={{ width: '100%' }}
                            label={t("Counter Label")}
                            value={counterName}
                            onChange={handleCounterNameChange}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ width: '95%' }} >
                        <TextField
                            sx={{ width: '100%' }}
                            label={t("Max Counter Value")}
                            type="number"
                            inputProps={{ min: 0, max: 100 }}
                            value={maxCounter}
                            onChange={handleMaxCounterChange}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ width: '95%' }} >
                        <TextField
                            sx={{ width: '100%' }}
                            label={t("Initial Value")}
                            type="number"
                            inputProps={{ min: 0, max: maxCounter }}
                            value={initialValue}
                            onChange={handleInitialValueChange}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ width: '95%' }} >
                        <Button sx={{ width: '100%' }} variant="contained" onClick={handleUse}>
                        {t("Utilize")}
                        </Button>
                    </Grid>
                </Grid>
            ) : (
                <Grid container spacing={2} direction="column" alignItems="center" sx={{ width: '100%' }}>
                    <Grid item xs={12}>
                        <Typography>{counterName}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <CircularProgressWithLabel value={(currentValue / maxCounter) * 100} sizePercent={30} thickness={6} />
                    </Grid>
                    <Grid item xs={12} container spacing={1} justifyContent="center">
                        <Grid item>
                            <Button variant="contained" onClick={handleDecrement}>
                                <RemoveCircleOutline />
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" onClick={handleIncrement}>
                                <AddCircleOutline />
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={handleModify}>
                        {t("Modify")}
                        </Button>
                    </Grid>
                </Grid>
            )}
        </>
    );
}

export default CounterComponent;
