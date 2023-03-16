import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
// @mui
import {
    Box,
    Card,
    Chip,
    Divider,
    Grid,
    Table,
    Stack,
    Avatar,
    Button,
    Popover,
    MenuItem,
    Container,
    Typography,
} from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
// components
import ExtratosServices from '../services/ExtratosServices';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import SvgColor from '../components/svg-color';
import DataTable from 'src/components/DataTable';
import { format } from 'date-fns';
// sections
import SelectDate from '../components/selectDate';
import ClienteContext from 'src/contexts/ClienteContext';

const ExtratosService = new ExtratosServices();

// ----------------------------------------------------------------------
const columns = [
    { field: 'dataVencimento', headerName: 'Data', width: 200, sortable: false },
    { field: 'descricao', headerName: 'Descrição', width: 430, sortable: false },
    { field: 'valor', headerName: 'Valor (R$)', width: 230, sortable: false },
];
// ----------------------------------------------------------------------

export default function ExtratosPage() {

    const [open, setOpen] = useState(null);

    const [loading1, setLoading1] = useState(false);

    const [loading2, setLoading2] = useState(false);

    const [periodoExtrato, setPeriodoExtrato] = useState('2');

    const [extrato, setExtrato] = useState([]);

    const [lancFuturos, setLancFuturos] = useState([]);

    const { cliente } = useContext(ClienteContext);

    function formatResult(obj) {
        let arr = [];
        if (obj != null) {
            obj.forEach(element => {
                element.dataVencimento = format(Date.parse(element.dataVencimento), 'dd/MM/yyyy');
                element.valor = element.valor.toLocaleString('pt-br', { minimumFractionDigits: 2 });

                arr.push(element)
            });
        }

        console.log('OBJ -->> ' + JSON.stringify(arr));

        return arr;
    }

    useEffect(() => {
        if (periodoExtrato != 'avulso') {
            setLoading1(true);
            const fetchData = async () => {
                console.log('useEffect idCliente ' + cliente.idCliente)
                const ret = await ExtratosService.getExtrato(cliente.idCliente, periodoExtrato)
                console.log('useEffect extrato ' + ret)
                setExtrato(formatResult(ret));
                setLoading1(false);
            }

            fetchData()
        }
    }, [cliente, periodoExtrato])

    useEffect(() => {
        setLoading2(true);
        const fetchData = async () => {
            console.log('useEffect idCliente (lanc Futuros) ' + cliente.idCliente)
            const ret = await ExtratosService.getLancamentosFuturos(cliente.idCliente)
            console.log('useEffect lanc Futuros ' + ret)

            setLancFuturos(formatResult(ret));
            setLoading2(false);
        }

        fetchData()

    }, [cliente])

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(event.target.dataInicial.value)
        console.log(event.target.dataFinal.value)

        const dataPeriodo = await ExtratosService.getExtrato(cliente.idCliente, periodoExtrato, event.target.dataInicial.value, event.target.dataFinal.value);
        console.log(dataPeriodo)
        setExtrato(formatResult(dataPeriodo));
    }

    return (
        <>
            <Helmet>
                <title> Extratos | Cockpit FRAM </title>
            </Helmet>

            <Container>
                <Stack direction="column" alignItems="left" justifyContent="left" mb={2}>
                    <Stack direction="row" alignItems="left" justifyContent="left">
                        {/*<SvgColor src={`/assets/icons/navbar/ic_analytics.svg`} sx={{ mb: 1, mr: 1, width: 40, height: 40 }} />
                         <Iconify icon={'eva:trending-up-fill'} sx={{ mb: 1, mr: 1, width: 42, height: 42, color: '#f60' }} /> */}
                        <Typography variant="h3" gutterBottom>
                            Extratos
                        </Typography>
                    </Stack>
                    <Typography variant="subtitle2">
                        Cliente: <b>{cliente.nome}</b>
                    </Typography>
                </Stack>
                <Divider />
                <Stack direction="row" alignItems="center" justifyContent="left" mb={3} mt={5}>
                    <Typography variant="h4">
                        Extrato por período
                    </Typography>
                </Stack>

                <Stack mb={3} direction="row" alignItems="center" justifyContent="space-between">
                    <Grid>
                        <ToggleButtonGroup value={periodoExtrato} exclusive sx={{ mb: 3, display: 'block' }}>
                            <ToggleButton value={'2'} onClick={() => setPeriodoExtrato('2')}> 2 dias </ToggleButton>
                            <ToggleButton value={'5'} onClick={() => setPeriodoExtrato('5')}> 5 dias </ToggleButton>
                            <ToggleButton value={'30'} onClick={() => setPeriodoExtrato('30')}> 30 dias </ToggleButton>
                            <ToggleButton value={'avulso'} onClick={() => setPeriodoExtrato('avulso')}> Período </ToggleButton>
                        </ToggleButtonGroup>
                        {periodoExtrato == 'avulso'
                            ?
                            <Stack mb={2} direction="row" alignItems="left" justifyContent="start">
                                <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
                                    <SelectDate label="Data inicial" name="dataInicial" />
                                    <Typography variant="h6" ml={2} mr={2} mt={2}> a </Typography>
                                    <SelectDate label="Data final" name="dataFinal" />
                                    <Button type="submit" variant="contained" marginLeft="7px" sx={{ marginLeft: 4 }}>
                                        Buscar
                                    </Button>
                                </form>
                            </Stack>
                            : null
                        }
                    </Grid>
                </Stack>

                {loading1
                    ?
                    <Card>
                        <Stack direction="row" alignItems="center" justifyContent="center" mb={2} mt={2}>
                            <CircularProgress />
                        </Stack>
                    </Card>
                    :
                    <Card>
                        {extrato.length > 0
                            ?
                            <Scrollbar>
                                <DataTable columns={columns} rows={extrato} />
                            </Scrollbar>
                            :
                            <Stack direction="row" alignItems="center" justifyContent="center" mb={2} mt={2}>
                                <Typography gutterBottom>
                                    Sem resultados para o período selecionado
                                </Typography>
                            </Stack>
                        }
                    </Card>
                }

                {/* LANÇAMENTOS FUTUROS */}
                <Stack direction="row" alignItems="center" justifyContent="left" mb={3} mt={5}>
                    <Typography variant="h4">
                        Lançamentos Futuros
                    </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="left" mb={3}>
                    <Typography variant="subtitle2">
                        Lançamentos agendados para os próximos 15 dias
                    </Typography>
                </Stack>

                {loading2
                    ?
                    <Card>
                        <Stack direction="row" alignItems="center" justifyContent="center" mb={2} mt={2}>
                            <CircularProgress />
                        </Stack>
                    </Card>
                    :
                    <Card>
                    {lancFuturos.length > 0
                        ?
                        <Scrollbar>
                            <DataTable columns={columns} rows={lancFuturos} />
                        </Scrollbar>
                        :
                        <Stack direction="row" alignItems="center" justifyContent="center" mb={2} mt={2}>
                            <Typography gutterBottom>
                                Sem lançamentos futuros para os próximos 15 dias
                            </Typography>
                        </Stack>
                    }
                </Card>
                }

            </Container>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        p: 1,
                        width: 140,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <MenuItem>
                    <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                    Editar
                </MenuItem>

                <MenuItem sx={{ color: 'error.main' }}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                    Apagar
                </MenuItem>
            </Popover>
        </>
    );
}
