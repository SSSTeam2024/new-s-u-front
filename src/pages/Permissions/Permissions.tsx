import React, { useEffect, useState } from "react";
import { Button, Col, Form, Container, Card, Row, Spinner } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { useFetchAllPermissionsQuery, useAssignUserPermissionsMutation } from "features/userPermissions/userPermissionSlice";
import { useFetchAllUsersQuery } from "features/account/accountSlice";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface Permission {
  _id: string;
  name: string;
  path: string;
  section: string;
  sub_section: string;
  __v: number;
}

interface User {
  _id?: string;
  name: string;
  email: string;
  login: string;
  role_id: string;
  departement_id: string;
  password: string;
  api_token: string;
  photo: string;
  app_name: string;
  status: string;
  permissions: any[];
}

const Permissions = () => {
  document.title = "Permissions | Smart University";

  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [allChecked, setAllChecked] = useState<boolean>(false);

  const { data: permissions, isLoading: isLoadingPermissions } = useFetchAllPermissionsQuery();
  const { data: usersResponse, isLoading: isLoadingUsers } = useFetchAllUsersQuery();
  const [assignUserPermissions, { isLoading: isAssigning }] = useAssignUserPermissionsMutation();
  const users: User[] = Array.isArray(usersResponse) ? usersResponse : [];

  useEffect(() => {
    if (permissions) {
      const initialCheckedState: { [key: string]: boolean } = {};
      permissions.forEach((permission: any) => {
        initialCheckedState[permission._id] = false;
      });
      setCheckedState(initialCheckedState);
    }
  }, [permissions]);

  const handleCheckAll = (key: string) => {
    if ( key === "all") {
    const newCheckedState: { [key: string]: boolean } = {};
    Object.keys(checkedState).forEach((key) => {
      newCheckedState[key] = true;
    });
    setCheckedState(newCheckedState);
    setAllChecked(true);
  }
       else if ( key === "none") {
         const newCheckedState: { [key: string]: boolean } = {};
         Object.keys(checkedState).forEach((key) => {
          newCheckedState[key] = false;
        });
       setCheckedState(newCheckedState);
         setAllChecked(false);
       }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setCheckedState((prevState) => ({
      ...prevState,
      [id]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedUserId) {
      toast.error("Please select a user.");
      return;
    }

    const permissionIds = Object.keys(checkedState).filter((key) => checkedState[key]);

    try {
      await assignUserPermissions({ userId: selectedUserId, permissionIds }).unwrap();
      toast.success("Permissions assigned successfully!");

      const initialCheckedState: { [key: string]: boolean } = {};
      permissions?.forEach(permission => {
        initialCheckedState[permission._id] = false;
      });
      setCheckedState(initialCheckedState);
    } catch (error) {
      toast.error("Failed to assign permissions. Please try again.");
    }
  };

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

  const groupedPermissions = permissions ? groupPermissions(permissions) : {};

  if (isLoadingPermissions || isLoadingUsers) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="" pageTitle="Permissions" />
          <Col className="d-flex justify-content-end mb-4">
            {allChecked === false ? (
              <Button variant="info" className="me-2" onClick={() => handleCheckAll("all")}>
                Check All
              </Button>
            ) : (
              <Button variant="info" className="me-2" onClick={() => handleCheckAll("none")}>
                Uncheck All
              </Button>
            )}
            <Form.Group controlId="selectUser" className="ms-2">
              <Form.Control as="select" onChange={(e) => setSelectedUserId(e.target.value)} defaultValue="">
                <option value="" disabled>Select a user</option>
                {users.map((user: User) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Form onSubmit={handleSubmit}>
            <Col lg={12}>
              {Object.keys(groupedPermissions).map((section) => (
                <Card className="mb-3" key={section}>
                  <Card.Header className="d-flex align-items-center bg-info-subtle text-white">
                    <Form.Check
                      type="checkbox"
                      id={`section-${section}`}
                      onChange={(e) => {
                        const { checked } = e.target;
                        const newState = { ...checkedState };
                        Object.keys(groupedPermissions[section]).forEach(subSection => {
                          groupedPermissions[section][subSection].forEach(permission => {
                            newState[permission._id] = checked;
                          });
                        });
                        setCheckedState(newState);
                      }}
                      className="me-2"
                    />
                    <h5 className="mb-0">{section}</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      {Object.keys(groupedPermissions[section]).map((sub_section, index) => (
                        <Col lg={4} key={index} className="mb-3">
                          <div className="border p-2 rounded">
                            <div className="d-flex align-items-center mb-2">
                              <Form.Check
                                type="checkbox"
                                id={`sub-section-${sub_section}`}
                                onChange={(e) => {
                                  const { checked } = e.target;
                                  const newState = { ...checkedState };
                                  groupedPermissions[section][sub_section].forEach(permission => {
                                    newState[permission._id] = checked;
                                  });
                                  setCheckedState(newState);
                                }}
                                className="me-2"
                              />
                              <h5 className="mb-0">{sub_section}</h5>
                            </div>
                            <ul className="list-group ">
                              {groupedPermissions[section][sub_section].map(permission => (
                                <li key={permission._id} className="border-0 list-group-item mb-0">
                                  <Form.Check
                                    type="checkbox"
                                    id={permission._id}
                                    onChange={handleCheckboxChange}
                                    checked={checkedState[permission._id]}
                                    label={permission.name}
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
            <Button type="submit" variant="primary" disabled={isAssigning} className="mt-3">
              {isAssigning ? 'Assigning...' : 'Assign Permissions'}
            </Button>
          </Form>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default Permissions;