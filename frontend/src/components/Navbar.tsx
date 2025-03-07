import { Layout, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const { Header } = Layout;

const Navbar = () => {
  const dispatch = useDispatch();

  return (
    <Header style={{ display: 'flex', justifyContent: 'space-between' }}>
      <h2 style={{ color: 'white' }}>Admin Dashboard</h2>
      <Button type="primary" onClick={() => dispatch(logout())}>
        Logout
      </Button>
    </Header>
  );
};

export default Navbar;
