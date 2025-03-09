import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../redux/slices/authSlice";
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const { Title } = Typography;

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const location = useLocation();
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenFromURL = searchParams.get("token");
    if (tokenFromURL) {
      setToken(tokenFromURL);
    } else {
      message.error("Invalid or expired reset link");
    }
  }, [location.search]);

  const handleResetPassword = async () => {
    if (!token) {
      message.error("Invalid reset link");
      return;
    }
  
    try {
      const res = await dispatch(resetPassword({ token, newPassword })).unwrap();
  
      if (res?.message) {
        message.success(res.message);
    
      } else {
        message.success("Password reset successfully.");
      }
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      message.error(err?.message || "Something went wrong!");
    }
  };
  

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "20px", marginTop: "50px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", borderRadius: "8px" }}>
      <Title level={2} style={{ textAlign: "center" }}>Reset Password</Title>
      <Form onFinish={handleResetPassword} layout="vertical">
        <Form.Item label="New Password" required>
          <Input.Password
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Reset Password
        </Button>
      </Form>
    </div>
  );
};

export default ResetPassword;
