import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { logoutAdmin } from "../redux/slices/adminSlice";
import { Button, Typography, message, Avatar, Dropdown, Menu, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined, EditOutlined, LogoutOutlined, PlusOutlined } from "@ant-design/icons";
import StudentList from "../pages/StudentList";
import ChangePassword from "../pages/ChangePassword";
import ForgotPassword from "../pages/ForgotPassword";
import EditProfile from "../pages/EditProfile";
import StudentForm from "../pages/StudentForm";
import axiosInstance from "../utils/axiosInstance";
const { Title } = Typography;

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<{
    name: string;
    email: string;
    lastLogin: string;
    profilePic?: string;
  } | null>(() => {
    const storedProfilePic = localStorage.getItem("profilePic");
    return storedProfilePic ? { name: "", email: "", lastLogin: "", profilePic: storedProfilePic } : null;
  });
  const updateProfilePic = (pic: string) => {
    setAdmin((prev) => (prev ? { ...prev, profilePic: pic } : prev));
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [studentModalVisible, setStudentModalVisible] = useState(false);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axiosInstance.get("/api/admin/admin-details", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAdmin(response.data);

        if (response.data.profilePic) {
          localStorage.setItem("profilePic", response.data.profilePic);
        }
      } catch (error) {
        console.error("Error fetching admin details:", error);
        navigate("/login");
      }
    };

    fetchAdminDetails();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutAdmin());
      localStorage.removeItem("token");
      message.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      message.error("Logout failed");
    }
  };

  const openModal = (type: string) => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<LockOutlined />} onClick={() => openModal("changePassword")}>
        Change Password
      </Menu.Item>
      <Menu.Item key="2" icon={<EditOutlined />} onClick={() => openModal("editProfile")}>
        Edit Profile Picture
      </Menu.Item>
      <Menu.Item key="3" icon={<UserOutlined />} onClick={() => openModal("forgotPassword")}>
        Forgot Password
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: "20px", marginTop: "50px" }}>
      <Title level={2}>Admin Dashboard</Title>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <p><strong>Name:</strong> {admin?.name}</p>
          <p><strong>Email:</strong> {admin?.email}</p>
          <p><strong>Last Login:</strong> {admin?.lastLogin ? new Date(admin.lastLogin).toLocaleString() : "N/A"}</p>
        </div>

        <Dropdown overlay={menu} trigger={["click"]}>
  <Avatar
    size={64}
    src={admin?.profilePic || localStorage.getItem("profilePic") || "https://www.gravatar.com/avatar?d=mp"}
    icon={!admin?.profilePic && !localStorage.getItem("profilePic") && <UserOutlined />}
    style={{ cursor: "pointer" }}
  />
</Dropdown>

      </div>

      <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Button>
      <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }} onClick={() => setStudentModalVisible(true)}>
        Add Student
      </Button>
      <StudentList />
      <Modal title={modalType.replace(/([A-Z])/g, " $1")} visible={modalVisible} onCancel={closeModal} footer={null}>
  {modalType === "changePassword" && <ChangePassword closeModal={closeModal} />}
  {modalType === "forgotPassword" && <ForgotPassword />}
  {modalType === "editProfile" && <EditProfile closeModal={closeModal} updateProfilePic={updateProfilePic}/>}
</Modal>

<StudentForm visible={studentModalVisible} onClose={() => setStudentModalVisible(false)} onSubmit={() => setStudentModalVisible(false)} student={null} />
    </div>
  );
};

export default Dashboard;
