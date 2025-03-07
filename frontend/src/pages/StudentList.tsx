import { useEffect, useState } from "react";
import { Button, Table, Space, Modal, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchStudents } from "../redux/slices/studentSlice";
import StudentForm from "./StudentForm";

const StudentList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { students, loading } = useSelector((state: RootState) => state.students);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);

  useEffect(() => {
    dispatch(fetchStudents());
    console.log(students)
  }, [dispatch]);

  const openAddModal = () => {
    setEditingStudent(null);
    setModalVisible(true)
  };

  const openEditModal = (student: any) => {
    setEditingStudent(student);
    setModalVisible(true);
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Qualification", dataIndex: "qualification", key: "qualification" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    {
      title: "Profile Image",
      dataIndex: "profileImage",
      key: "profileImage",
      render: (profileImage: string) =>
        profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            style={{ width: 50, cursor: "pointer" }}
            onClick={() => Modal.info({ title: "Profile Image", content: <img src={profileImage} alt="Profile" style={{ width: "100%" }} /> })}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button type="primary" onClick={() => openEditModal(record)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: "20px" }}>
      <Table columns={columns} dataSource={students} rowKey="email" loading={loading} pagination={{ pageSize: 5 }} />
      <StudentForm visible={modalVisible} onClose={() => setModalVisible(false)} student={editingStudent} />
    </div>
  );
};

export default StudentList;
