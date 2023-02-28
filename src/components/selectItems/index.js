import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectItems({ options, placeHolder, childToParent }) {
    const [periodo, setPeriodo] = useState('');

    useEffect(() => {
        childToParent(periodo);
        console.log('periodo', periodo)
    }, [periodo])

    const handleChange = (event) => {
        setPeriodo(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 165 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{placeHolder}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={periodo}
                    label={placeHolder}
                    onChange={handleChange}
                >
                    {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}