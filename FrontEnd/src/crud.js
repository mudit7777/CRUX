import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { validateAge, validateName } from "./useValidation";

const CRUD = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [isActive, setIsActive] = useState(0);

  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editIsActive, setEditIsActive] = useState("");
  const [editId, setEditId] = useState("");

  const [errors, setErrors] = useState({});

  const empData = [
    { id: 1, name: "Manik", age: 29, isActive: 1 },
    { id: 2, name: "Trump", age: 64, isActive: 1 },
    { id: 3, name: "Bulle Shah", age: 76, isActive: 0 },
  ];

  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get("https://localhost:7285/api/Employee")
      .then((result) => setData(result.data))
      .catch((error) => console.log(error));
  };

  const handleEdit = (id) => {
    handleShow();
    axios
      .get(`https://localhost:7285/api/Employee/${id}`)
      .then((result) => {
        setEditName(result.data.name);
        setEditAge(result.data.age);
        setEditIsActive(result.data.isActive);
        setEditId(id);
      })
      .catch((error) => console.log(error));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this employee") === true) {
      axios
        .delete(`https://localhost:7285/api/Employee?id=${id}`)
        .then((result) => {
          if (result.status === 200) {
            toast.success("Employee has been deleted");
            getData();
          }
        })
        .catch((error) => toast.error(error));
    }
  };

  const handleUpdate = () => {
    const url = `https://localhost:7285/api/Employee/${editId}`;
    const data = {
      id: editId,
      name: editName,
      age: editAge,
      isActive: editIsActive,
    };

    axios
      .put(url, data)
      .then((result) => {
        handleClose();
        getData();
        clear();
        toast.success("Employee has been updated");
      })
      .catch((error) => toast.error(error));
  };

  const handleSave = () => {
    const ageErrors = validateAge(age);
    const nameErrors = validateName(name);
    const allErrors = { ...ageErrors, ...nameErrors };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      Object.values(allErrors).forEach((error) => toast.error(error));
      return;
    }

    const url = "https://localhost:7285/api/Employee";
    const data = { id: 0, name: name, age: age, isActive: isActive };

    axios
      .post(url, data)
      .then((result) => {
        getData();
        clear();
        toast.success("Employee has been added");
      })
      .catch((error) => toast.error(error));
  };

  const clear = () => {
    setName("");
    setAge("");
    setIsActive(0);
    setEditName("");
    setEditAge("");
    setEditIsActive(0);
    setEditId("");
    setErrors({});
  };

  const handleActiveChange = (e) => {
    setIsActive(e.target.checked ? 1 : 0);
  };

  const handleEditActiveChange = (e) => {
    setEditIsActive(e.target.checked ? 1 : 0);
  };

  return (
    <>
      <Container className="mt-4">
        <ToastContainer />
        <Card className="p-4">
          <h4>Add Employee</h4>
          <Form>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    isInvalid={errors.name}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    isInvalid={errors.age}
                  />
                </Form.Group>
              </Col>
              <Col className="mt-4">
                <Form.Check
                  type="checkbox"
                  label="IsActive"
                  checked={isActive === 1}
                  onChange={handleActiveChange}
                />
              </Col>
              <Col className="mt-4">
                <Button variant="primary" onClick={handleSave}>
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>

        <h4 className="mt-5">Employee List</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>S No.</th>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>IsActive</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0
              ? data.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.age}</td>
                    <td>{item.isActive ? "Yes" : "No"}</td>
                    <td>
                      <Button
                        variant="info"
                        className="me-2"
                        onClick={() => handleEdit(item.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              : "Loading..."}
          </tbody>
        </Table>
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="text"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col className="mt-4">
                <Form.Check
                  type="checkbox"
                  label="IsActive"
                  checked={editIsActive === 1}
                  onChange={handleEditActiveChange}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CRUD;
