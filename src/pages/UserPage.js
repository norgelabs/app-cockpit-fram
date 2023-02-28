import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useContext, useEffect, useState } from 'react';
// @mui
import {
  Box,
  Card,
  Chip,
  Grid,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
import {
  AppWidgetSummary
} from '../sections/@dashboard/app';
// components
import RentabilidadeServices from '../services/RentabilidadeServices';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import SvgColor from '../components/svg-color';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import CLIENTES from '../_mock/clientes';

import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
import SelectClientes from '../components/selectClientes';
import SelectItems from '../components/selectItems';
import SelectDate from '../components/selectDate';
import ClienteContext from 'src/contexts/ClienteContext';

const RentabilidadeService = new RentabilidadeServices();

// ----------------------------------------------------------------------

const OPCOES_PERIODO = [
  { value: 1, label: 'Neste ano' },
  { value: 2, label: '12 meses' },
  { value: 3, label: 'Todo o período' },
];

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'descricao', label: 'Descrição', alignRight: false },
  { id: 'empresa', label: 'Empresa', alignRight: false },
  { id: 'quantidade', label: 'Quantidade', alignRight: false },
  { id: 'mes', label: '% Mês', alignRight: false },
  { id: 'ano', label: '% Ano', alignRight: false },
  { id: 'valor', label: 'Valor (R$)', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.descricao.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [rentDiaria, setRentDiaria] = useState('');

  const [rentMes, setRentMes] = useState('');

  const [rentAno, setRentAno] = useState('');

  const [rent12meses, setRent12meses] = useState('');

  const [rentInicio, setRentInicio] = useState('');

  const [rentPeriodo, setRentPeriodo] = useState('');

  const { cliente } = useContext(ClienteContext);

  useEffect(() => {
    const fetchData = async () => {
      console.log('useEffect idCliente ' + cliente.idCliente)
      const dataDiaria = await RentabilidadeService.get(cliente.idCliente, 'diaria');
      const dataMes = await RentabilidadeService.get(cliente.idCliente, 'mes');
      const dataAno = await RentabilidadeService.get(cliente.idCliente, 'ano');
      const data12meses = await RentabilidadeService.get(cliente.idCliente, '12meses');
      const dataIncio = await RentabilidadeService.get(cliente.idCliente, 'inicio');
      console.log('useEffect dataDiaria ' + dataDiaria)

      setRentDiaria(dataDiaria);
      setRentMes(dataMes);
      setRentAno(dataAno);
      setRent12meses(data12meses);
      setRentInicio(dataIncio);
    }

    fetchData()

  }, [cliente])

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = CLIENTES.map((n) => n.descricao);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - CLIENTES.length) : 0;

  const filteredUsers = applySortFilter(CLIENTES, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const [idCliente, setIdCliente] = useState(0);

  const [periodo, setPeriodo] = useState(0);

  const [dataIni, setDataIni] = useState('');

  const [dataFim, setDataFim] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(event.target.dataInicial.value)
    console.log(event.target.dataFinal.value)

    const dataPeriodo = await RentabilidadeService.get(cliente.idCliente, 'periodo', event.target.dataInicial.value, event.target.dataFinal.value);
    console.log(dataPeriodo)
    setRentPeriodo(dataPeriodo);
  }

  // const handleChangeDataInicial = (event) => {
  //   event.preventDefault();
  //   console.log(event.target.nome.value)
  // }

  // const handleChangeDataInicial = (event) => {
  //   event.preventDefault();
  //   console.log(event.target.nome.value)
  // }

  return (
    <>
      <Helmet>
        <title> Carteira | Cockpit FRAM </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="left" mb={3}>
          <SvgColor src={`/assets/icons/navbar/ic_analytics.svg`} sx={{ mb: 1, mr: 1, width: 40, height: 40 }} />
          {/* <Iconify icon={'eva:trending-up-fill'} sx={{ mb: 1, mr: 1, width: 42, height: 42, color: '#f60' }} /> */}
          <Typography variant="h3" gutterBottom>
            Rentabilidade
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="left" mb={3}>
          <Typography variant="subtitle2">
            {cliente.nome}
          </Typography>
        </Stack>
        <Stack mb={2} direction="row" alignItems="center" justifyContent="space-between">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} md={2}>
              <AppWidgetSummary title="Diária" total={rentDiaria ? rentDiaria+'%' : '-'} icon={'ant-design:android-filled'} />
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <AppWidgetSummary title="No mês" total={rentMes ? rentMes+'%' : '-'} color="info" icon={'ant-design:apple-filled'} />
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <AppWidgetSummary title="No ano" total={rentAno ? rentAno+'%' : '-'} color="warning" icon={'ant-design:windows-filled'} />
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <AppWidgetSummary title="12 meses" total={rent12meses ? rent12meses+'%' : '-'} color="error" icon={'ant-design:bug-filled'} />
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <AppWidgetSummary title="Todo o período" total={rentInicio ? rentInicio+'%' : '-'} icon={'ant-design:bug-filled'} />
            </Grid>
          </Grid>

          {/* <SelectClientes childToParent={getIdClienteChildren} /> */}
          {/* <Button onClick={handleClickCheck}>Clique no PAI</Button> */}
          {/* <BlogPostsSearch posts={POSTS} /> */}
          {/* <BlogPostsSort options={SORT_OPTIONS} /> */}
          {/* <SelectItems options={OPCOES_PERIODO} placeHolder="Período" childToParent={getDataSelectItemChildren} />
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickCheck}>
            Gerar
          </Button> */}
        </Stack>

        <Stack mt={5} direction="column" alignItems="left" justifyContent="start">
          <Stack mb={2} direction="column" alignItems="left" justifyContent="start">
            <Typography variant="h5"> Pesquisar rentabilidade por período </Typography>
          </Stack>
          <Stack mb={2} direction="row" alignItems="left" justifyContent="start">
            <form onSubmit={handleSubmit} style={{display: 'flex'}}>
              <SelectDate label="Data inicial" name="dataInicial" />
              <Typography variant="h6" ml={2} mr={2} mt={2}> a </Typography>
              <SelectDate label="Data final" name="dataFinal" />
              <Button type="submit" variant="contained" marginLeft="7px" sx={{ marginLeft: 4 }}>
                Buscar
              </Button>
            </form>
          </Stack>
          <Stack mb={2} direction="row" alignItems="left" justifyContent="start">
            <Box
              sx={{
                bgcolor: 'background.paper',
                boxShadow: 2,
                borderRadius: 2,
                p: 2,
                minWidth: 200,
              }}
            >
              <Typography variant="h3" ml={2} mr={2} mt={1} color="green">{rentPeriodo ? rentPeriodo+'%' : '-'}</Typography>
            </Box>
          </Stack>
        </Stack>

        {/* <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 1000 }}>
              <Table margin-left="20px">
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={CLIENTES.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, descricao, empresa, quantidade, mes, ano, valor } = row;
                    const selectedUser = selected.indexOf(descricao) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="normal">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {descricao}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{empresa}</TableCell>

                        <TableCell align="left">{quantidade}</TableCell>

                        <TableCell align="left">{mes}</TableCell>

                        <TableCell align="left">{ano}</TableCell>

                        <TableCell align="left">{valor}</TableCell>

                        <TableCell align="left">
                          <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 40]}
            component="div"
            count={CLIENTES.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card> */}
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
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
