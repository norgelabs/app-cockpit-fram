// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Posição Consolidada',
    path: '/dashboard/app',
    icon: icon('ic_user'),
  },
  {
    title: 'Carteira',
    path: '/dashboard/user',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Investimentos',
    path: '/dashboard/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'Solicitações',
    path: '/dashboard/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'Lançamentos Projetados',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Liquidação',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
