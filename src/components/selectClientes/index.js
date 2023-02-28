import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ClienteServices from '../../services/ClienteServices';
import ClienteContext from 'src/contexts/ClienteContext';

const ClienteService = new ClienteServices();

const clientes = [
    { id: 1, title: "Vicente Augusto" },
    { id: 2, title: "Carlos Silveira" },
    { id: 3, title: "Eva Bastos" },
    { id: 4, title: "Silvana Oliveira Castro" }
];

export default function SelectClientes({ childToParent }) {

    const { cliente, setCliente } = useContext(ClienteContext);
    const [value, setValue] = useState(cliente);
    const [listaClientes, setListaClientes] = useState([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            // get the data from the api
            const data = await ClienteService.get();
            // convert the data to json
            setListaClientes(data);
            console.log('ret API 1', data)
        }

        fetchData()
    }, []);

    useEffect(() => {
        //childToParent(value);
        setCliente(value)
        console.log('cliente', cliente)
        //console.log('ret API 2', data)
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
                getOptionLabel={(option) => option.nome || ""}
                inputValue={inputValue}
                onInputChange={(_, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                id="controllable-states-demo"
                options={listaClientes}
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