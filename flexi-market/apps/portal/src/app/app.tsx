import { LucideIcons, ThemeProvider } from '@e-burgos/tucu-ui';
import { HomePage } from '../pages/HomePage';

const menuItems = [
  {
    name: 'Home',
    path: '/',
    icon: <LucideIcons.LayoutDashboard />,
    component: <HomePage />,
  },
];

export function App() {
  return (
    <ThemeProvider
      logo={{ name: 'portal' }}
      layout="admin"
      brandColor="Blue"
      menuItems={menuItems}
      isAuthenticated
    />
  );
}
