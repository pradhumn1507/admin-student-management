import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { registerUser } from '../redux/slices/authSlice';
import { Button, Input, Form, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: { name: string; email: string; password: string }) => {
    try {
      await dispatch(registerUser(values)).unwrap();
      message.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      message.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '20px', marginTop: '50px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Admin Register</Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
      </Form>
      <p style={{ textAlign: 'center' }}>
        Already have an account? <a onClick={() => navigate('/login')}>Login</a>
      </p>
    </div>
  );
};

export default Register;
