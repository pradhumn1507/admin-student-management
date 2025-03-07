import { useState, useEffect } from "react";
import { Form, Input, Button, Select, Upload, Modal, message } from "antd";
import { UploadOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { addStudent ,editStudent} from "../redux/slices/studentSlice";

const { Option } = Select;

const StudentForm = ({ visible, onClose, student }: any) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(student?.profileImage || null);
  const { loading } = useSelector((state: RootState) => state.students);

  useEffect(() => {
    if (student) {
      form.setFieldsValue(student);
      setProfileImage(student.profileImage || null);
    } else {
      form.resetFields();
      setProfileImage(null);
    }
  }, [student, visible]);

  const handleUpload = async (file: any) => {
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
    return false; // Prevent auto-upload
  };

  const handleFinish = async (values: any) => {
    try {
      await dispatch(addStudent({ ...values, profileImage })).unwrap();
      message.success(student ? "Student updated successfully!" : "Student added successfully!");
      onClose();
    } catch (error: any) {
      message.error(error.message || "Failed to add student");
    }
  };

  return (
    <Modal title={student ? "Edit Student" : "Add Student"} open={visible} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item label="Name" name="name" rules={[{ required: true, message: "Name is required" }]}>
          <Input placeholder="Enter student name" />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Enter a valid email" }]}>
          <Input placeholder="Enter email" />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: "Password is required" }]}>
          <Input.Password placeholder="Enter password" iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
        </Form.Item>
        <Form.Item label="Phone No." name="phone" rules={[{ required: true, message: "Phone number is required" }]}>
          <Input placeholder="Enter phone number" />
        </Form.Item>
        <Form.Item label="Qualification" name="qualification">
          <Input placeholder="Enter qualification" />
        </Form.Item>
        <Form.Item label="Gender" name="gender" rules={[{ required: true, message: "Select gender" }]}>
          <Select placeholder="Select gender">
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Profile Image">
          <Upload beforeUpload={handleUpload} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Upload Profile Image</Button>
          </Upload>
          {profileImage && (
            <>
              <img src={profileImage} alt="Profile" onClick={() => setPreviewVisible(true)} style={{ width: 100, marginTop: 10, cursor: "pointer" }} />
              <Modal open={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
                <img alt="Profile Preview" style={{ width: "100%" }} src={profileImage} />
              </Modal>
            </>
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {student ? "Update Student" : "Add Student"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StudentForm;
