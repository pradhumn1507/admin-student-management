import { useState } from "react";
import { Form, Button, Upload, message, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axiosInstance from "../utils/axiosInstance";

const { Title } = Typography;

const EditProfile = ({ closeModal, updateProfilePic }: { closeModal: () => void; updateProfilePic: (pic: string) => void }) => {
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const onFinish = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Authentication failed. Please log in again.");
        return;
      }

      await axiosInstance.put(
        "/api/admin/edit-profile-picture",
        { profilePicture },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success("Profile updated successfully");

      if (profilePicture) {
        localStorage.setItem("profilePic", profilePicture);
      }

      updateProfilePic(profilePicture || "");
      closeModal();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    return false; // Prevent default upload behavior
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "20px" }}>
      <Title level={2} style={{ textAlign: "center" }}>Edit Profile</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Profile Picture">
          <Upload beforeUpload={handleUpload} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Upload Profile Picture</Button>
          </Upload>
          {profilePicture && <img src={profilePicture} alt="Profile" style={{ width: "100px", marginTop: "10px" }} />}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Update Profile
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProfile;
