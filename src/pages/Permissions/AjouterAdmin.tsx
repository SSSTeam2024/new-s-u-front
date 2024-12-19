import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAddUserMutation, AddUser } from "features/account/accountSlice";
import { useFetchEnseignantsQuery, Enseignant } from "features/enseignant/enseignantSlice";
import { useFetchPersonnelsQuery, Personnel } from "features/personnel/personnelSlice";
import { useFetchAllPermissionsQuery, useUpdateUserPermissionsMutation, useFetchUserPermissionsByUserIdQuery, useUpdateUserPermissionsHistoryMutation } from "features/userPermissions/userPermissionSlice"; // Replace with actual slice name


interface Permission {
  _id: string;
  name: string;
  path: string;
  section: string;
  sub_section: string;
  __v: number;
}

// Define the SubmissionData interface
interface SubmissionData extends Partial<AddUser> {
  enseignantId?: string; // Optional
  personnelId?: string; // Optional
}
const CreateAdmin = () => {
  document.title = "Ajouter Utilisateur | Smart Institute";
  const navigate = useNavigate();
  const [addUser] = useAddUserMutation<AddUser>();
  const { data: enseignants = [] } = useFetchEnseignantsQuery();
  const { data: personnels = [] } = useFetchPersonnelsQuery();



  const [formData, setFormData] = useState<Partial<AddUser>>({
    
    _id:"",
    personnelId: "",
    enseignantId: "",
    login: "",
    service: "",
    password: "",
    app_name: "",
    status: "",
   
  });
  const [step, setStep] = useState(1);
  const [selectUser, setSelectedUser] = useState("");
  const [userType, setUserType] = useState("");

  // Determine label based on selected value
  const getSecondLabel = () => {
    switch (userType) {
      case "enseignant":
        return "Liste des enseignants";
      case "personnel":
        return "Liste des personnels";
      default:
        return "Liste"; // Default label
    }
  };

  const handleUserTypeChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setUserType(e.target.value);
    // Reset the selected user ID based on user type change
    setFormData((prevState) => ({
      ...prevState,
      personnelId: "",
      enseignantId: ""
    }));
    setSelectedUser(""); // Clear previous selection
  };

  const onChangeUser = (e:any) => {
    const selectedId = e.target.value;
    setSelectedUser(selectedId);
  
    // Update formData based on the user type
    if (userType === "enseignant") {
      setFormData((prevState) => ({
        ...prevState,
        enseignantId: selectedId,
        personnelId: "", // Clear personnel ID if switching to enseignant
      }));
    } else if (userType === "personnel") {
      setFormData((prevState) => ({
        ...prevState,
        personnelId: selectedId,
        enseignantId: "", // Clear enseignant ID if switching to personnel
      }));
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create a new object for submission with the correct type
    const submissionData: SubmissionData = {
      login: formData.login,
      password: formData.password,
      service: formData.service,
      app_name: formData.app_name,
      status: formData.status,
      
    };

    // Add the relevant user ID based on user type
    if (userType === "enseignant" && formData.enseignantId) {
      submissionData.enseignantId = formData.enseignantId;
    } else if (userType === "personnel" && formData.personnelId) {
      submissionData.personnelId = formData.personnelId;
    }

    // Validate to check if either personnelId or enseignantId is set
    if (!submissionData.enseignantId && !submissionData.personnelId) {
      Swal.fire("Erreur", "Veuillez sélectionner un utilisateur.", "error");
      return; // Stop submission if no user selected
    }

    try {
      const userResponse = await addUser(submissionData).unwrap();
     
       setUserId(userResponse?._id!); // Store the _id of the created user for later use
      Swal.fire("Succès", "Utilisateur ajouté avec succès", "success");
      setStep(3);
       console.log("userResponse",userResponse)
    } catch (error) {
      Swal.fire("Erreur", "Une erreur s'est produite lors de l'ajout", "error");
    }
  };

  const handleNextStep = () => setStep((prevStep) => prevStep + 1);

  const handlePreviousStep = () => setStep((prevStep) => prevStep - 1);


  // permissions stuff 
  const { data: allPermissions = [], isLoading: isLoadingAllPermissions } = useFetchAllPermissionsQuery();
  const { data: userPermissions = [], isLoading: isLoadingUserPermissions } = useFetchUserPermissionsByUserIdQuery({ userId: "" });
 
  const [userId, setUserId] = useState<string | null>(null);

  const [updateUserPermissions, { isLoading: isUpdatingPermissions }] = useUpdateUserPermissionsHistoryMutation();
  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});
  

  //use effect permissions 

  useEffect(() => {
    if (userPermissions.length && allPermissions.length) {
        const initialCheckedState: { [key: string]: boolean } = {};
        
        // Set up initial checked state based on userPermissions and allPermissions
        allPermissions.forEach((permission: Permission) => {
            initialCheckedState[permission._id] = userPermissions.some(up => up._id === permission._id);
        });

        // Update state only if it differs from the existing state
        setCheckedState((prevState) => {
            if (JSON.stringify(prevState) === JSON.stringify(initialCheckedState)) {
                return prevState; // Avoid unnecessary re-render if no changes
            }
            return initialCheckedState;
        });
    }
}, [JSON.stringify(userPermissions), JSON.stringify(allPermissions)]);

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

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setCheckedState((prevState) => ({
      ...prevState,
      [id]: checked,
    }));
  };

  const handleSubmitPermissions = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const permissionIds = Object.keys(checkedState).filter((key) => checkedState[key]);

    try {
      const storedUserId = userId ?? ""; // Provide a fallback if userId is null
      await updateUserPermissions({ userId: storedUserId, permissionIds }).unwrap();
      Swal.fire("Succès", "Permissions assigned", "success");
    } catch (error) {
      Swal.fire("Erreur", "Une erreur s'est produite lors de l'ajout", "error");
    }
  };

  if (isLoadingAllPermissions || isLoadingUserPermissions) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container fluid className="page-content">
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3 avatar-sm">
                <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                  <i className="bi bi-person-lines-fill"></i>
                </div>
              </div>
              <h5 className="card-title mb-0">Nouveau Utilisateur</h5>
            </Card.Header>

            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {step === 1 && (
                  <>
                    <Row>
                      <Col lg={4}>
                        <Form.Group controlId="intended_for">
                          <Form.Label>Destiné aux</Form.Label>
                          <Form.Select
                            value={userType}
                            onChange={handleUserTypeChange}
                            className="text-muted"
                          >
                            <option value="">Sélectionner</option>
                            <option value="enseignant">Enseignants</option>
                            <option value="personnel">Personnels</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col lg={4}>
                        <Form.Group controlId="userList">
                          <Form.Label>{getSecondLabel()}</Form.Label>
                          <Form.Select
                            value={selectUser}
                            onChange={onChangeUser}
                            className="text-muted"
                          >
                            <option value="">Sélectionner un utilisateur</option>
                            {userType === "enseignant" &&
                              enseignants.map((enseignant) => (
                                <option key={enseignant._id} value={enseignant._id}>
                                  {enseignant.prenom_fr} {enseignant.nom_fr}
                                </option>
                              ))}
                            {userType === "personnel" &&
                              personnels.map((personnel) => (
                                <option key={personnel._id} value={personnel._id}>
                                  {personnel.prenom_fr} {personnel.nom_fr}
                                </option>
                              ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-end mt-3">
                      <Button variant="primary" onClick={handleNextStep}>
                        Suivant
                      </Button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <Row>
                      <Col lg={4}>
                        <Form.Group controlId="login">
                          <Form.Label>Nom d'utilisateur</Form.Label>
                          <Form.Control
                            type="text"
                            name="login"
                            value={formData.login}
                            onChange={onChange}
                            autoComplete="off"
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={4}>
                        <Form.Group controlId="password">
                          <Form.Label>Mot de passe</Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={onChange}
                            autoComplete="new-password"
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={4}>
                        <Form.Group controlId="service">
                          <Form.Label>Service</Form.Label>
                          <Form.Control
                            type="text"
                            name="service"
                            value={formData.service}
                            onChange={onChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col lg={4}>
                        <Form.Group controlId="app_name">
                          <Form.Label>Nom de l'application</Form.Label>
                          <Form.Control
                            type="text"
                            name="app_name"
                            value={formData.app_name}
                            onChange={onChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={4}>
                        <Form.Group controlId="status">
                          <Form.Label>Status</Form.Label>
                          <Form.Control
                            type="text"
                            name="status"
                            value={formData.status}
                            onChange={onChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-between mt-3">
                      <Button variant="secondary" onClick={handlePreviousStep}>
                        Précédent
                      </Button>
                      <Button variant="primary" type="submit">
                       Ajouter
                      </Button>
                    </div>
                  </>
                )}
                {step === 3 && (
                  // Step 3: Assign Permissions
                
                  
      
                  <Form onSubmit={handleSubmitPermissions}>
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
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateAdmin;
