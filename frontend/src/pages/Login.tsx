import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { loginUser } from '../redux/slices/authSlice';
import { Button, Input, Form, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await dispatch(loginUser(values)).unwrap();
      message.success('Login successful!');
      navigate('/dashboard');
    } catch (err: any) {
      message.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '20px', marginTop: '50px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Admin Login</Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email" >
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
      </Form>
      <p style={{ textAlign: 'center' }}>
        Don't have an account? <a onClick={() => navigate('/register')}>Register</a>
      </p>
    </div>
  );
};

export default Login;
