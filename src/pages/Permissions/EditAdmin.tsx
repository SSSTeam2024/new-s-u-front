
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Container, Card, Row, Spinner } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { useFetchAllPermissionsQuery, useUpdateUserPermissionsMutation, useFetchUserPermissionsByUserIdQuery, useUpdateUserPermissionsHistoryMutation } from "features/userPermissions/userPermissionSlice"; // Replace with actual slice name
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from "react-router-dom";
import img1 from "assets/images/users/avatar-1.jpg";
import img4 from "assets/images/small/img-4.jpg"

interface Permission {
  _id: string;
  name: string;
  path: string;
  section: string;
  sub_section: string;
  __v: number;
}

const EditAdmin = () => {
  document.title = "Page Admin | Smart University";
  const location = useLocation();
  const userId = location.state._id;

  const { data: allPermissions = [], isLoading: isLoadingAllPermissions } = useFetchAllPermissionsQuery();
  const { data: userPermissions = [], isLoading: isLoadingUserPermissions } = useFetchUserPermissionsByUserIdQuery({ userId });
  const [updateUserPermissions, { isLoading: isUpdatingPermissions }] = useUpdateUserPermissionsHistoryMutation();
  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (userPermissions && allPermissions) {
      const initialCheckedState: { [key: string]: boolean } = {};
      allPermissions.forEach((permission: Permission) => {
        initialCheckedState[permission._id] = userPermissions.some(up => up._id === permission._id);
      });
      setCheckedState(initialCheckedState);
    }
  }, [userPermissions, allPermissions]);

  const handleCheckAll = (key: string) => {
    const newCheckedState: { [key: string]: boolean } = {};
    if (key === "all") {
      Object.keys(checkedState).forEach((key) => {
        newCheckedState[key] = true;
      });
      setCheckedState(newCheckedState);
    } else if (key === "none") {
      Object.keys(checkedState).forEach((key) => {
        newCheckedState[key] = false;
      });
      setCheckedState(newCheckedState);
    }
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setCheckedState((prevState) => ({
      ...prevState,
      [id]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const permissionIds = Object.keys(checkedState).filter((key) => checkedState[key]);

    try {
      await updateUserPermissions({ userId, permissionIds }).unwrap();
      toast.success("Permissions updated successfully!");
    } catch (error) {
      toast.error("Failed to update permissions. Please try again.");
    }
  };

  if (isLoadingAllPermissions || isLoadingUserPermissions) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Group permissions by section and subsection
  const groupPermissions = (permissions: Permission[]): { [section: string]: { [sub_section: string]: Permission[] } } => {
    const grouped: { [section: string]: { [sub_section: string]: Permission[] } } = {};

    permissions.forEach((permission) => {
      if (!grouped[permission.section]) {
        grouped[permission.section] = {};
      }
      if (!grouped[permission.section][permission.sub_section]) {
        grouped[permission.section][permission.sub_section] = [];
      }
      grouped[permission.section][permission.sub_section].push(permission);
    });

    return grouped;
  };

  const groupedPermissions = groupPermissions(allPermissions);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="" pageTitle="Permissions" />
          <Row className="mb-4">
            <Col lg={12}>
              <Card>
                <Card.Header>
                  <h5 className="card-title mb-0">Admin Details</h5>
                </Card.Header>
                <Card.Body>
                  {/* Render admin details UI */}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Col lg={12}>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">User Permissions</h5>
                <Button variant="info" className="me-2" onClick={() => handleCheckAll("all")}>
                  Check All
                </Button>
                <Button variant="info" className="me-2" onClick={() => handleCheckAll("none")}>
                  Uncheck All
                </Button>
              </Card.Header>
            </Card>
          </Col>

          <Form onSubmit={handleSubmit}>
            <Col lg={12}>
              {/* Render grouped permissions */}
              {Object.keys(groupedPermissions).map((section) => (
                <Card className="mb-3" key={section}>
                  <Card.Header className="d-flex align-items-center bg-info-subtle text-white">
                    <Form.Check
                      type="checkbox"
                      id={`section-${section}`}
                      label={section}
                      checked={Object.values(groupedPermissions[section]).every(subSection => Object.values(subSection).every(permission => checkedState[permission._id]))}
                      onChange={(e) => {
                        const { checked } = e.target;
                        const newState = { ...checkedState };
                        Object.values(groupedPermissions[section]).forEach(subSection => {
                          Object.values(subSection).forEach(permission => {
                            newState[permission._id] = checked;
                          });
                        });
                        setCheckedState(newState);
                      }}
                      className="me-2"
                    />
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      {Object.keys(groupedPermissions[section]).map((subSection, index) => (
                        <Col lg={4} key={index} className="mb-3">
                          <div className="border p-2 rounded">
                            <div className="d-flex align-items-center mb-2">
                              <Form.Check
                                type="checkbox"
                                id={`sub-section-${subSection}`}
                                label={subSection}
                                checked={Object.values(groupedPermissions[section][subSection]).every(permission => checkedState[permission._id])}
                                onChange={(e) => {
                                  const { checked } = e.target;
                                  const newState = { ...checkedState };
                                  Object.values(groupedPermissions[section][subSection]).forEach(permission => {
                                    newState[permission._id] = checked;
                                  });
                                  setCheckedState(newState);
                                }}
                                className="me-2"
                              />
                            </div>
                            <ul className="list-group">
                              {groupedPermissions[section][subSection].map(permission => (
                                <li key={permission._id} className="border-0 list-group-item mb-0">
                                  <Form.Check
                                    type="checkbox"
                                    id={permission._id}
                                    label={permission.name}
                                    onChange={(e) => handleCheckboxChange(permission._id, e.target.checked)}
                                    checked={checkedState[permission._id] || false}
                                  />
                                </li>
                              ))}
                            </ul>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </Col>
            <Button type="submit" variant="primary" disabled={isUpdatingPermissions}>
              {isUpdatingPermissions ? 'Updating...' : 'Update Permissions'}
            </Button>
          </Form>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default EditAdmin;


