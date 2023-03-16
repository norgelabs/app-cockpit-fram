// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Posição Consolidada',
    path: '/dashboard/app',
    icon: icon(''),
  },
  {
    title: 'Carteira',
    path: '/dashboard/carteira',
    icon: icon(''),
  },
  {
    title: 'Investimentos',
    path: '/dashboard/products',
    icon: icon(''),
  },
  {
    title: 'Extratos',
    path: '/dashboard/extratos',
    icon: icon(''),
  },
  // {
  //   title: 'Lançamentos Projetados',
  //   path: '/login',
  //   icon: icon(''),
  // },
  // {
  //   title: 'Liquidação',
  //   path: '/404',
  //   icon: icon(''),
  // },
];

export default navConfig;
