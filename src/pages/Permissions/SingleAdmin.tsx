// import React, { useEffect, useState } from "react";
// import { Button, Col, Form, Container, Card, Row, Spinner, Dropdown } from "react-bootstrap";
// import Breadcrumb from "Common/BreadCrumb";
// import { useFetchAllUsersQuery } from "features/account/accountSlice";
// import { useFetchUserPermissionsByUserIdQuery, useDeleteUserPermissionsMutation } from "features/userPermissions/userPermissionSlice";
// import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
// import { useLocation } from "react-router-dom";
// import img1 from "assets/images/users/avatar-1.jpg";
// import img4 from "assets/images/small/img-4.jpg"

// interface Permission {
//   _id: string;
//   name: string;
//   path: string;
//   section: string;
//   sub_section: string;
//   __v: number;
// }

// interface User {
//   _id?: string;
//   name: string;
//   email: string;
//   login: string;
//   role_id: string;
//   departement_id: string;
//   password: string;
//   api_token: string;
//   photo: string;
//   app_name: string;
//   status: string;
//   permissions: any[];
// }

// const SingleAdmin = () => {
//   document.title = "Page Admin | Smart University";
//   const location = useLocation();
//   const userId = location.state._id;
//   console.log("userId", userId)

//   const { data: permissions = [], isLoading: isLoadingPermissions } = useFetchUserPermissionsByUserIdQuery({ userId });
//   console.log("permissions", permissions)
//   const [deleteUserPermissions, { isLoading: isDeletingPermissions }] = useDeleteUserPermissionsMutation();
//   const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});
//   const [allChecked, setAllChecked] = useState<boolean>(false);

//   const { data: usersResponse, isLoading: isLoadingUsers } = useFetchAllUsersQuery();


//   useEffect(() => {
//     if (permissions) {
//       const initialCheckedState: { [key: string]: boolean } = {};
//       permissions.forEach((permission: any) => {
//         initialCheckedState[permission._id] = false;
//       });
//       setCheckedState(initialCheckedState);
//     }
//   }, [permissions]);

//   const handleCheckAll = (key: string) => {
//     const newCheckedState: { [key: string]: boolean } = {};
//     if (key === "all") {
//       Object.keys(checkedState).forEach((key) => {
//         newCheckedState[key] = true;
//       });
//       setCheckedState(newCheckedState);
//       setAllChecked(true);
//     } else if (key === "none") {
//       Object.keys(checkedState).forEach((key) => {
//         newCheckedState[key] = false;
//       });
//       setCheckedState(newCheckedState);
//       setAllChecked(false);
//     }
//   };

//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, checked } = e.target;
//     setCheckedState((prevState) => ({
//       ...prevState,
//       [id]: checked,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();


//     const permissionIds = Object.keys(checkedState).filter((key) => checkedState[key]);
//     console.log("permissionIds", permissionIds)

//     try {
//       await deleteUserPermissions({ userId, permissionIds }).unwrap();
//       toast.success("Permissions deleted successfully!");

//       const initialCheckedState: { [key: string]: boolean } = {};
//       permissions?.forEach(permission => {
//         initialCheckedState[permission._id] = false;
//       });
//       setCheckedState(initialCheckedState);
//     } catch (error) {
//       toast.error("Failed to delete permissions. Please try again.");
//     }
//   };

//   const groupPermissions = (permissions: Permission[]): { [section: string]: { [sub_section: string]: Permission[] } } => {
//     const grouped: { [section: string]: { [sub_section: string]: Permission[] } } = {};

//     permissions.forEach((permission) => {
//       if (!grouped[permission.section]) {
//         grouped[permission.section] = {};
//       }
//       if (!grouped[permission.section][permission.sub_section]) {
//         grouped[permission.section][permission.sub_section] = [];
//       }
//       grouped[permission.section][permission.sub_section].push(permission);
//     });

//     return grouped;
//   };

//   const groupedPermissions = permissions ? groupPermissions(permissions) : {};

//   if (isLoadingPermissions || isLoadingUsers) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
//         <Spinner animation="border" variant="primary" />
//       </div>
//     );
//   }

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid={true}>
//           <Breadcrumb title="" pageTitle="Permissions" />
//           <Row className="mb-4">
//             <Col lg={12}>
//               <Card>
//                 <Card.Header>
//                   <h5 className="card-title mb-0">Admin Details</h5>
//                 </Card.Header>
//                 <Card.Body>
//                   <Card className="border-0 shadow-none mb-0">
//                     <Card.Body className="rounded profile-basic" style={{ backgroundImage: `url(${img4})`, backgroundSize: "cover" }}></Card.Body>
//                     <Card.Body>
//                       <div className="mt-n5 text-center">
//                         <img src={img1} alt="" className="avatar-lg rounded-circle p-1 bg-body mt-n3" />
//                       </div>
//                     </Card.Body>
//                     <Card.Body className="pt-0 text-center">
//                       <h5 className="fs-17">{location.state.name}</h5>
//                       <div className="mb-3 text-muted">
//                         <i className="bi bi-geo-alt"></i> {location.state.app_name}
//                       </div>
//                       <p>{location.state.email}</p>
//                       <div className="hstack gap-2 justify-content-center">
//                         <Button variant="primary">Invite to Project</Button>
//                         <Button variant='outline-info' className="btn-icon"><i className="bi bi-chat-left-text"></i></Button>
//                         <Dropdown>
//                           <Dropdown.Toggle variant="outline-danger" className="btn-icon">
//                             <i className="bi bi-three-dots-vertical"></i>
//                           </Dropdown.Toggle>
//                           <Dropdown.Menu>
//                             <Dropdown.Item>Action</Dropdown.Item>
//                             <Dropdown.Item>Another action</Dropdown.Item>
//                             <Dropdown.Item>Something else here</Dropdown.Item>
//                           </Dropdown.Menu>
//                         </Dropdown>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>

//           <Col lg={12}>
//             <Card>
//               <Card.Header className="d-flex justify-content-between align-items-center">
//                 <h5 className="card-title mb-0">User Permissions</h5>
//                 {allChecked === false ? (
//                   <Button variant="info" className="me-2" onClick={() => handleCheckAll("all")}>
//                     Check All
//                   </Button>
//                 ) : (
//                   <Button variant="info" className="me-2" onClick={() => handleCheckAll("none")}>
//                     Uncheck All
//                   </Button>
//                 )}
//               </Card.Header>
//             </Card>
//           </Col>

//           <Form onSubmit={handleSubmit}>
//             <Col lg={12}>
//               {Object.keys(groupedPermissions).map((section) => (
//                 <Card className="mb-3" key={section}>
//                   <Card.Header className="d-flex align-items-center bg-info-subtle text-white">
//                     <Form.Check
//                       type="checkbox"
//                       id={`section-${section}`}
//                       onChange={(e) => {
//                         const { checked } = e.target;
//                         const newState = { ...checkedState };
//                         Object.keys(groupedPermissions[section]).forEach(subSection => {
//                           groupedPermissions[section][subSection].forEach(permission => {
//                             newState[permission._id] = checked;
//                           });
//                         });
//                         setCheckedState(newState);
//                       }}
//                       className="me-2"
//                     />
//                     <h5 className="mb-0">{section}</h5>
//                   </Card.Header>
//                   <Card.Body>
//                     <Row>
//                       {Object.keys(groupedPermissions[section]).map((sub_section, index) => (
//                         <Col lg={4} key={index} className="mb-3">
//                           <div className="border p-2 rounded">
//                             <div className="d-flex align-items-center mb-2">
//                               <Form.Check
//                                 type="checkbox"
//                                 id={`sub-section-${sub_section}`}
//                                 onChange={(e) => {
//                                   const { checked } = e.target;
//                                   const newState = { ...checkedState };
//                                   groupedPermissions[section][sub_section].forEach(permission => {
//                                     newState[permission._id] = checked;
//                                   });
//                                   setCheckedState(newState);
//                                 }}
//                                 className="me-2"
//                               />
//                               <h5 className="mb-0">{sub_section}</h5>
//                             </div>
//                             <ul className="list-group ">
//                               {groupedPermissions[section][sub_section].map(permission => (
//                                 <li key={permission._id} className="border-0 list-group-item mb-0">
//                                   <Form.Check
//                                     type="checkbox"
//                                     id={permission._id}
//                                     onChange={handleCheckboxChange}
//                                     checked={checkedState[permission._id] || false}
//                                     label={permission.name}
//                                   />
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>

//                         </Col>
//                       ))}
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               ))}

//             </Col>
//             <Button type="submit" variant="primary" disabled={isDeletingPermissions} className="mt-3">
//               {isDeletingPermissions ? 'Suppression...' : 'Supprimer Permissions'}
//             </Button>
//           </Form>
//         </Container>
//       </div>
//       <ToastContainer />
//     </React.Fragment>
//   );
// };

// export default SingleAdmin;

import React, { useState } from "react";
import { Button, Col, Container, Card, Row, Spinner } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { useFetchAllUsersQuery } from "features/account/accountSlice";
import { useFetchUserPermissionsByUserIdQuery } from "features/userPermissions/userPermissionSlice";
import { useLocation } from "react-router-dom";
import img1 from "assets/images/users/avatar-1.jpg";
import img4 from "assets/images/small/img-4.jpg";

interface Permission {
  _id: string;
  name: string;
  path: string;
  section: string;
  sub_section: string;
  __v: number;
}

const SingleAdmin = () => {
  document.title = "Page Admin | Smart University";
  const location = useLocation();
  const userId = location.state._id;
  console.log("userId", userId);

  const { data: permissions = [], isLoading: isLoadingPermissions } = useFetchUserPermissionsByUserIdQuery({ userId });
  console.log("permissions", permissions);
  const { data: usersResponse, isLoading: isLoadingUsers } = useFetchAllUsersQuery();

  const [expandedSections, setExpandedSections] = useState<{ [section: string]: boolean }>({});

  const toggleSection = (section: string) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
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
          <Row className="mb-4">
            <Col lg={12}>
              <Card>
                <Card.Header>
                  <h5 className="card-title mb-0">Admin Details</h5>
                </Card.Header>
                <Card.Body>
                  <Card className="border-0 shadow-none mb-0">
                    <Card.Body className="rounded profile-basic" style={{ backgroundImage: `url(${img4})`, backgroundSize: "cover" }}></Card.Body>
                    <Card.Body>
                      <div className="mt-n5 text-center">
                        <img src={img1} alt="" className="avatar-lg rounded-circle p-1 bg-body mt-n3" />
                      </div>
                    </Card.Body>
                    <Card.Body className="pt-0 text-center">
                      <h5 className="fs-17">{location.state.name}</h5>
                      <div className="mb-3 text-muted">
                        <i className="bi bi-geo-alt"></i> {location.state.app_name}
                      </div>
                      <p>{location.state.email}</p>
                      <div className="hstack gap-2 justify-content-center">
                        <Button variant="primary">Invite to Project</Button>
                        <Button variant='outline-info' className="btn-icon"><i className="bi bi-chat-left-text"></i></Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Col lg={12}>
            <Card>
              <Card.Header>
                <h5 className="card-title mb-0">User Permissions</h5>
              </Card.Header>
            </Card>
          </Col>

          <Col lg={12}>
            {Object.keys(groupedPermissions).map((section) => (
              <Card className="mb-3" key={section}>
                <Card.Header className="d-flex align-items-center bg-info-subtle text-white justify-content-between">
                  <h5 className="mb-0">{section}</h5>
                  {/* <Button variant="light" onClick={() => toggleSection(section)}>
                    {expandedSections[section] ? "Hide" : "Show"}
                  </Button> */}
                  <Button variant="light" onClick={() => toggleSection(section)}>
                    <i className={`bi ${expandedSections[section] ? "bi-caret-up-fill" : "bi-caret-down-fill"}`}></i>
                  </Button>

                </Card.Header>
                {expandedSections[section] && (
                  <Card.Body>
                    <Row>
                      {Object.keys(groupedPermissions[section]).map((sub_section, index) => (
                        <Col lg={4} key={index} className="mb-3">
                          <div className="border p-2 rounded">
                            <h5 className="mb-2">{sub_section}</h5>
                            <ul className="list-group">
                              {groupedPermissions[section][sub_section].map(permission => (
                                <li key={permission._id} className="border-0 list-group-item mb-0">
                                  {permission.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                )}
              </Card>
            ))}
          </Col>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SingleAdmin;

