import { Outlet } from 'react-router-dom';
import TopToolBar from '../components/TopToolBar'
import { Box } from '@mui/joy';


const Layout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopToolBar />
      <Outlet />
    </Box>
  );
};

export default Layout;