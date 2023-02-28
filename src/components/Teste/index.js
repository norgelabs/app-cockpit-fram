import * as React from 'react';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const clientes = [
    { id: 264, title: "Vicente Augusto" },
    { id: 264, title: "Carlos Silveira" },
    { id: 264, title: "Eva Bastos" },
    { id: 264, title: "Silvana Oliveira Castro" }
];

export default function SelectClientes({ childToParent }) {

    const [value, setValue] = useState({});
    const [inputValue, setInputValue] = useState(clientes[0].title);

    useEffect(() => {
        childToParent(value);
        console.log('value', value)
    }, [value])

    return (
        <div>
            {/* <div>{`value: ${value.id !== null ? `'${value.id}'` : 'null'}`}</div>
            <div>{`inputValue: '${inputValue}'`}</div>
            <br /> */}
            {/* <Button onClick={() => childToParent(value)}>Clique no filho</Button> */}
            <Autocomplete
                value={value}
                onChange={(_, newValue) => {
                    console.log('onChange Ativado!')
                    setValue(newValue);
                }}
                getOptionLabel={(option) => option.title || ""}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                inputValue={inputValue}
                onInputChange={(_, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                id="controllable-states-demo"
                options={clientes}
                sx={{ width: '580px !important' }}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        placeholder="Selecione o cliente..."
                        InputProps={{
                            ...params.InputProps,
                        }}
                        label="Cliente"
                    />
                }
            />
        </div>
    );
}