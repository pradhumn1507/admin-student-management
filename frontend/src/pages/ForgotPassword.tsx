import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../redux/slices/authSlice";
import { Form, Input, Button, message } from "antd";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleForgotPassword = async () => {
    try {
      const res = await dispatch(forgotPassword(email));
      if (res.payload) {
        message.success("Reset link sent to your email");
        setEmail("");
      }
    } catch (err) {
      console.error("Error sending reset link:", err);
    }
  };

  return (
    <Form onFinish={handleForgotPassword} layout="vertical">
      <h2>Forgot Password</h2>
      <Form.Item label="Email" required>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading} block>
        Send Reset Link
      </Button>
    </Form>
  );
};

export default ForgotPassword;
