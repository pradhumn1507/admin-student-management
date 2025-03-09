import { Form, Input, Button, message, Typography } from "antd";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { changePassword } from "../redux/slices/adminSlice";

const { Title } = Typography;

const ChangePassword = ({ closeModal }: { closeModal: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();

  const onFinish = async (values: { oldPassword: string; newPassword: string }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Authentication failed. Please log in again.");
        return;
      }

      await dispatch(changePassword({ values, token })).unwrap();
      message.success("Password changed successfully!");
      closeModal();
    } catch (err: any) {
      message.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "20px", marginTop: "50px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
      <Title level={2} style={{ textAlign: "center" }}>Change Password</Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Old Password" name="oldPassword" rules={[{ required: true, message: "Enter your old password" }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item label="New Password" name="newPassword" rules={[{ required: true, message: "Enter your new password" }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Update Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
