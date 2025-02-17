import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "flatpickr/dist/flatpickr.min.css";
import { useAddNewVaribaleGlobaleMutation, useFetchVaribaleGlobaleQuery, VaribaleGlobale } from "features/variableGlobale/variableGlobaleSlice";

function convertToBase64(
  file: File
): Promise<{ base64Data: string; extension: string }> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const base64String = fileReader.result as string;
      const [, base64Data] = base64String.split(","); // Extract only the Base64 data
      const extension = file.name.split(".").pop() ?? ""; // Get the file extension
      resolve({ base64Data, extension });
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
    fileReader.readAsDataURL(file);
  });
}

const AjouterVariablesGlobales = () => {
  document.title = " Variables Globales | ENIGA";
  const navigate = useNavigate();
  const [newVariableGlobale] = useAddNewVaribaleGlobaleMutation();

  const {data: globalVars} = useFetchVaribaleGlobaleQuery();
  console.log(globalVars);
// Function to get the last object



  const initialVariableGlobale = {
    
    directeur_ar: "",
    directeur_fr: "",
    secretaire_ar: "",
    secretaire_fr: "",
    abreviation: "",
    annee_universitaire: "",
    signature_directeur_base64: "",
    signature_directeur_extension: "",
    signature_secretaire_base64: "",
    signature_secretaire_extension: "",
    etablissement_ar: "",
    etablissement_fr: "",
    logo_etablissement_base64: "",
    logo_etablissement_extension: "",
    logo_universite_base64: "",
    logo_universite_extension: "",
    logo_republique_base64: "",
    logo_republique_extension: "",
    universite_ar: "",
    universite_fr: "",
    address_ar: "",
    address_fr: "",
    gouvernorat_ar: "",
    gouvernorat_fr: "",
    code_postal: "",
    phone: "",
    fax: "",
    website: "",
    signature_directeur: "",
    signature_secretaire: "",
    logo_etablissement: "",
    logo_universite: "",
    logo_republique: "",
    createdAt: "",
    places: [
      { longitude: "", latitude: "", placeName: "", rayon:"" } 
  ]
  };
  const lastVariableGlobale = globalVars?.length ? globalVars[globalVars.length - 1] : initialVariableGlobale;
  const [variableGlobale, setVariableGlobale] = useState(
    initialVariableGlobale
  );
  
console.log("last",lastVariableGlobale)

  useEffect(() => {
    if (lastVariableGlobale) {
      setVariableGlobale(lastVariableGlobale);
    }
  }, [globalVars]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setVariableGlobale((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const [yearControl, setYearControl] = useState<string>("");

  const onChangeStudyYear = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log(e.target.value);

    // if(e.target.value.length < 9){
    //   setYearControl("Année universitaire doit respecter la forme: yyyy/yyyy");
    // }
    // if(e.target.value.length === 9){
      setYearControl("");
      setVariableGlobale((prevState) => ({
        ...prevState,
        annee_universitaire: e.target.value,
      }));
    // }

    // if(e.target.value.length > 9){
    //   setYearControl("Année universitaire doit respecter la forme: yyyy/yyyy");
    //   setVariableGlobale((prevState) => ({
    //   ...prevState,
    //   annee_universitaire: '',
    // }));
    // }

  };

  const handleFileUploadSignatureDirecteur = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("signature_directeur_base64") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const profileImage = `data:image/${extension};base64,${base64Data}`;
      setVariableGlobale({
        ...variableGlobale,
        signature_directeur: profileImage,
        signature_directeur_base64: base64Data,
        signature_directeur_extension: extension,
      });
    }
  };

  const handleFileUploadSignatureSecretaire = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("signature_secretaire_base64") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const profileImage = `data:image/${extension};base64,${base64Data}`;
      setVariableGlobale({
        ...variableGlobale,
        signature_secretaire: profileImage,
        signature_secretaire_base64: base64Data,
        signature_secretaire_extension: extension,
      });
    }
  };

  const handleFileUploadLogoEtablissement = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("logo_etablissement_base64") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const profileImage = `data:image/${extension};base64,${base64Data}`;
      setVariableGlobale({
        ...variableGlobale,
        logo_etablissement: profileImage,
        logo_etablissement_base64: base64Data,
        logo_etablissement_extension: extension,
      });
    }
  };

  const handleFileUploadLogoUniversite = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("logo_universite_base64") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const profileImage = `data:image/${extension};base64,${base64Data}`;
      setVariableGlobale({
        ...variableGlobale,
        logo_universite: profileImage,
        logo_universite_base64: base64Data,
        logo_universite_extension: extension,
      });
    }
  };

  const handleFileUploadLogoEepublique = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("logo_republique_base64") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const profileImage = `data:image/${extension};base64,${base64Data}`;
      console.log(profileImage.includes('data:image'))
      setVariableGlobale({
        ...variableGlobale,
        logo_republique: profileImage,
        logo_republique_base64: base64Data,
        logo_republique_extension: extension,
      });
    }
  };


  const handlePlaceChange = (index: number, event: React.ChangeEvent<any>) => {
    const target = event.target as HTMLInputElement;
    const { name, value } = target;
  
    setVariableGlobale((prevState) => {
      const updatedPlaces = [...prevState.places];
  
      // Ensure the place exists at this index before modifying
      if (!updatedPlaces[index]) {
        updatedPlaces[index] = { placeName: "", longitude: "", latitude: "", rayon: "" };
      }
  
      updatedPlaces[index] = { ...updatedPlaces[index], [name]: value };
  
      return { ...prevState, places: updatedPlaces };
    });
  };
  

  const addPlace = () => {
    setVariableGlobale({
      ...variableGlobale,
      places: [...variableGlobale.places, { placeName: "", latitude: "", longitude:"", rayon: "" }],
    });
  };
  const removePlace = (index: number) => {
    setVariableGlobale((prev) => ({
      ...prev,
      places: prev.places.filter((_, i) => i !== index),
    }));
  };

  // const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   // newVariableGlobale(variableGlobale).then(() =>
  //   //   setVariableGlobale(initialVariableGlobale)
  //   // );

  //    // Compare the current form state with the last object
  // const isModified = JSON.stringify(variableGlobale) !== JSON.stringify(lastVariableGlobale);

  // // If no modifications, use the last object to create a new one
  // const newObject = isModified ? variableGlobale : lastVariableGlobale;

  // console.log(newObject);

  // newVariableGlobale({ ...newObject, _id: undefined }).then(() =>
  //   setVariableGlobale(initialVariableGlobale)
  // );
  //   notify();
  //   navigate("/variable/liste-variables-globales");
  // };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const isModified = JSON.stringify(variableGlobale) !== JSON.stringify(lastVariableGlobale);
  
    const newObject = isModified ? variableGlobale : lastVariableGlobale;
  
    console.log("submit",newObject); 
  
    newVariableGlobale({ ...newObject, _id: undefined })
      .then(() => {
        setVariableGlobale(initialVariableGlobale);
      })
      .catch((error) => {
       
        console.error("Error:", error);
      });
  
   
    notify();
  
    navigate("/variable/liste-variables-globales");
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Variable Globale has been created successfully",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col lg={12}>
              <Card>
               
                <Card.Body>
                  <div className="mb-3">
                    <Form className="tablelist-form" onSubmit={onSubmit}>
                      <Row>
                        <Card.Header className="mb-3">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar-sm">
                                <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                  <i className="bi bi-person-lines-fill"></i>
                                </div>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h5 className="card-title">Directeur</h5>
                            </div>
                          </div>
                        </Card.Header>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Form.Label htmlFor="directeur_ar">
                              <h4 className="card-title mb-0">
                                Nom du directeur (ar)
                              </h4>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="directeur_ar"
                              id="directeur_ar"
                              placeholder="Nom du directeur (ar)"
                              value={variableGlobale.directeur_ar}
                              onChange={onChange}
                            />
                          </div>
                        </Col>
                        {/* nom directeur fr*/}
                        <Col lg={4}>
                          <div className="mb-3">
                            <Form.Label htmlFor="directeur_fr">
                              <h4 className="card-title mb-0">
                                Nom du directeur (fr)
                              </h4>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="directeur_fr"
                              id="directeur_fr"
                              placeholder="Nom du directeur (fr)"
                              value={variableGlobale.directeur_fr}
                              onChange={onChange}
                            />
                          </div>
                        </Col>
                        <Col lg={2}>
                          <div className="mb-3">
                            <Form.Label htmlFor="signature_directeur_base64">
                              <h4 className="card-title mb-0">
                                Signature du directeur
                              </h4>
                            </Form.Label>

                            <Form.Control
                              name="signature_directeur_base64"
                              type="file"
                              id="signature_directeur_base64"
                              accept="*"
                              placeholder="Choose File"
                              className="text-muted"
                              onChange={handleFileUploadSignatureDirecteur}
                            />
                   
                          </div>
                        </Col>
                        <Col lg={2}>
                        <div>
                        {
                            variableGlobale.signature_directeur.includes('data:image')? (
                              <img
                                src={`${variableGlobale.signature_directeur}`}
                                alt="signature_directeur-img"
                                id="signature_directeur"
                                className="avatar-lg d-block mx-auto"
                              />
                            ): (<img
                              src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/signatureDirecteurFiles/${variableGlobale.signature_directeur}`}
                              alt="signature_directeur-img"
                              id="signature_directeur"
                              className="avatar-lg d-block mx-auto"
                            />)
                          }
                      </div></Col>
                      </Row>
                      <Row>
                        <Card.Header className="mb-3">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar-sm">
                                <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                  <i className="bi bi-person-lines-fill"></i>
                                </div>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h5 className="card-title">Secrétaire Général</h5>
                            </div>
                          </div>
                        </Card.Header>
                        {/* nom directeur ar*/}
                        <Col lg={4}>
                          <div className="mb-3">
                            <Form.Label htmlFor="secretaire_ar">
                              <h4 className="card-title mb-0">
                                Nom du secrétaire général (ar)
                              </h4>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="secretaire_ar"
                              id="secretaire_ar"
                              placeholder="Nom du secrétaire général (ar)"
                              value={variableGlobale.secretaire_ar}
                              onChange={onChange}
                            />
                          </div>
                        </Col>
                        {/* nom directeur fr*/}
                        <Col lg={4}>
                          <div className="mb-3">
                            <Form.Label htmlFor="secretaire_fr">
                              <h4 className="card-title mb-0">
                                Nom du secrétaire général (fr)
                              </h4>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="secretaire_fr"
                              id="secretaire_fr"
                              placeholder="Nom du secrétaire général (fr)"
                              value={variableGlobale.secretaire_fr}
                              onChange={onChange}
                            />
                          </div>
                        </Col>
                        <Col lg={2}>
                          <div className="mb-3">
                            <Form.Label htmlFor="signature_secretaire_base64">
                              <h4 className="card-title mb-0">
                                Signature du secrétaire général
                              </h4>
                            </Form.Label>
                            <Form.Control
                              name="signature_secretaire_base64"
                              type="file"
                              id="signature_secretaire_base64"
                              accept="*"
                              placeholder="Choose File"
                              className="text-muted"
                              onChange={handleFileUploadSignatureSecretaire}
                            />
                          </div>
                        </Col>
                        <Col lg={2}>
                        <div>
                        {
                            variableGlobale.signature_secretaire.includes('data:image')? (
                              <img
                                src={`${variableGlobale.signature_secretaire}`}
                                alt="signature_secretaire-img"
                                id="signature_secretaire"
                                className="avatar-lg d-block mx-auto"
                              />
                            ): (<img
                              src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/signatureSecretaireFiles/${variableGlobale.signature_secretaire}`}
                              alt="signature_secretaire-img"
                              id="signature_secretaire"
                              className="avatar-lg d-block mx-auto"
                            />)
                          }

  </div></Col>
                      </Row>

                      <Row>
                        <Card.Header className="mb-3">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar-sm">
                                <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                  <i className="bi bi-person-lines-fill"></i>
                                </div>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h5 className="card-title">Université</h5>
                            </div>
                          </div>
                        </Card.Header>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Form.Label htmlFor="universite_fr">
                              <h4 className="card-title mb-0">
                                Nom de l'université (fr)
                              </h4>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="universite_fr"
                              id="universite_fr"
                              placeholder="Nom de l'université (fr)"
                              value={variableGlobale.universite_fr}
                              onChange={onChange}
                            />
                          </div>
                        </Col>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Form.Label htmlFor="universite_ar">
                              <h4 className="card-title mb-0">
                                Nom de l'université (Ar)
                              </h4>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="universite_ar"
                              id="universite_ar"
                              placeholder="Nom de l'université (Ar)"
                              value={variableGlobale.universite_ar}
                              onChange={onChange}
                            />
                          </div>
                        </Col>
                        <Col lg={2}>
                          <div className="mb-3">
                            <Form.Label htmlFor="logo_universite_base64">
                              <h4 className="card-title mb-0">
                                Logo de l'université
                              </h4>
                            </Form.Label>
                            <Form.Control
                              name="logo_universite_base64"
                              type="file"
                              id="logo_universite_base64"
                              accept="*"
                              placeholder="Choose File"
                              className="text-muted"
                              onChange={handleFileUploadLogoUniversite}
                            />
                          </div>
                        </Col>
                        <Col lg={2}>
                        <div>
                          {
                            variableGlobale.logo_universite.includes('data:image')? (
                              <img
                                src={`${variableGlobale.logo_universite}`}
                                alt="logo_universite-img"
                                id="logo_universite"
                                className="avatar-lg d-block mx-auto"
                              />
                            ): (<img
                              src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoUniversiteFiles/${variableGlobale.logo_universite}`}
                              alt="logo_universite-img"
                              id="logo_universite"
                              className="avatar-lg d-block mx-auto"
                            />)
                          }
  </div></Col>
                        <Row>
                          <Card.Header className="mb-3">
                            <div className="d-flex">
                              <div className="flex-shrink-0 me-3">
                                <div className="avatar-sm">
                                  <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                    <i className="bi bi-person-lines-fill"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="card-title">Etablissement </h5>
                              </div>
                            </div>
                          </Card.Header>

                          <Col lg={3}>
                            <div className="mb-3">
                              <Form.Label htmlFor="etablissement_fr">
                                <h4 className="card-title mb-0">
                                  Nom de l'établissement (fr)
                                </h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="etablissement_fr"
                                id="etablissement_fr"
                                placeholder="Nom de l'établissement (fr)"
                                value={variableGlobale.etablissement_fr}
                                onChange={onChange}
                              />
                            </div>
                          </Col>
                          <Col lg={3}>
                            <div className="mb-3">
                              <Form.Label htmlFor="etablissement_ar">
                                <h4 className="card-title mb-0">
                                  Nom de l'établissement (Ar)
                                </h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="etablissement_ar"
                                id="etablissement_ar"
                                placeholder="Nom de l'établissement (Ar)"
                                value={variableGlobale.etablissement_ar}
                                onChange={onChange}
                              />
                            </div>
                          </Col>
                          <Col lg={2}>
                            <div className="mb-3">
                              <Form.Label htmlFor="abreviation">
                                <h4 className="card-title mb-0">
                                  Abreviation
                                </h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="abreviation"
                                id="abreviation"
                                placeholder="abreviation"
                                value={variableGlobale.abreviation}
                                onChange={onChange}
                              />
                            </div>
                          </Col>
                          <Col lg={2}>
                          <div className="mb-3">
                            <Form.Label htmlFor="logo_etablissement_base64">
                              <h4 className="card-title mb-0">
                                Logo de l'établissement
                              </h4>
                            </Form.Label>
                            <Form.Control
                              name="logo_etablissement_base64"
                              type="file"
                              id="logo_etablissement_base64"
                              accept="*"
                              placeholder="Choose File"
                              className="text-muted"
                              onChange={handleFileUploadLogoEtablissement}
                            />
                          </div>
                        </Col>
                        <Col lg={2}>
                        <div>
                        {
                            variableGlobale.logo_etablissement.includes('data:image')? (
                              <img
                                src={`${variableGlobale.logo_etablissement}`}
                                alt="logo_etablissement-img"
                                id="logo_etablissement"
                                className="avatar-lg d-block mx-auto"
                              />
                            ): (<img
                              src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoEtablissementFiles/${variableGlobale.logo_etablissement}`}
                              alt="logo_etablissement-img"
                              id="logo_etablissement"
                              className="avatar-lg d-block mx-auto"
                            />)
                          }
  </div></Col>
                        </Row>
                      </Row>
                      <Row>
                        <Card.Header className="mb-3">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar-sm">
                                <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                  <i className="bi bi-person-lines-fill"></i>
                                </div>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h5 className="card-title">Adresse</h5>
                            </div>
                          </div>
                        </Card.Header>
                        <Row>
                          <Col lg={4}>
                            <div className="mb-3">
                              <Form.Label htmlFor="address_fr">
                                <h4 className="card-title mb-0">
                                  Adresse (fr)
                                </h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="address_fr"
                                id="address_fr"
                                placeholder="Adresse (fr)"
                                value={variableGlobale.address_fr}
                                onChange={onChange}
                              />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div className="mb-3">
                              <Form.Label htmlFor="address_ar">
                                <h4 className="card-title mb-0">
                                  gouvernorat (fr)
                                </h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="gouvernorat_fr"
                                id="gouvernorat_fr"
                                placeholder="gouvernorat"
                                value={variableGlobale.gouvernorat_fr}
                                onChange={onChange}
                              />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div className="mb-3">
                              <Form.Label htmlFor="address_ar">
                                <h4 className="card-title mb-0">Code postal</h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="code_postal"
                                id="code_postal"
                                placeholder="code postal"
                                value={variableGlobale.code_postal}
                                onChange={onChange}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={4}>
                            <div
                              className="mb-3"
                              style={{ direction: "rtl", textAlign: "right" }}
                            >
                              <Form.Label
                                htmlFor="address_fr"
                                style={{ direction: "rtl", textAlign: "right" }}
                              >
                                <h4 className="card-title mb-0">العنوان </h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="address_ar"
                                id="address_ar"
                                placeholder="العنوان"
                                value={variableGlobale.address_ar}
                                onChange={onChange}
                              />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div
                              className="mb-3"
                              style={{ direction: "rtl", textAlign: "right" }}
                            >
                              <Form.Label
                                htmlFor="address_ar"
                                style={{ direction: "rtl", textAlign: "right" }}
                              >
                                <h4 className="card-title mb-0">الولاية </h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="gouvernorat_ar"
                                id="gouvernorat_ar"
                                placeholder="الولاية"
                                value={variableGlobale.gouvernorat_ar}
                                onChange={onChange}
                              />
                            </div>
                          </Col>
                          <Col lg={2}>
                          <div className="mb-3">
                            <Form.Label htmlFor="logo_republique_base64">
                              <h4 className="card-title mb-0">
                                Logo de la république
                              </h4>
                            </Form.Label>
                            <Form.Control
                              name="logo_republique_base64"
                              type="file"
                              id="logo_republique_base64"
                              accept="*"
                              placeholder="Choose File"
                              className="text-muted"
                              onChange={handleFileUploadLogoEepublique}
                            />
                          </div>
                        </Col>
                        <Col lg={2}>
                        <div>
                          {variableGlobale.logo_republique.includes('data:image')? (
                            <img
                            src={`${variableGlobale.logo_republique}`}
                            alt="logo_republique-img"
                            id="logo_republique"
                            className="avatar-lg d-block mx-auto"
                          />
                          ): (<img
                            src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoRepubliqueFiles/${variableGlobale.logo_republique}`}
                            alt="logo_republique-img"
                            id="logo_republique"
                            className="avatar-lg d-block mx-auto"
                          />)}
    
  </div></Col>
                        </Row>
                      </Row>
                      <Row>
                        <Card.Header className="mb-3">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar-sm">
                                <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                  <i className="bi bi-person-lines-fill"></i>
                                </div>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h5 className="card-title">Info</h5>
                            </div>
                          </div>
                        </Card.Header>
                        <Col lg={3}>
                          <div className="mb-3">
                            <Form.Label htmlFor="phone">
                              <h4 className="card-title mb-0">
                                Numéro téléphone
                              </h4>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="phone"
                              name="phone"
                              placeholder="Numéro téléphone"
                              value={variableGlobale.phone}
                              onChange={onChange}
                            />
                          </div>
                        </Col>
                        <Col lg={3}>
                          <div className="mb-3">
                            <Form.Label htmlFor="fax">
                              <h4 className="card-title mb-0">Numéro Fax</h4>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="fax"
                              name="fax"
                              placeholder="Numéro fax"
                              value={variableGlobale.fax}
                              onChange={onChange}
                            />
                          </div>
                        </Col>
                        <Col lg={3}>
                          <div className="mb-3">
                            <Form.Label htmlFor="website">
                              <h4 className="card-title mb-0">Site Web</h4>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="website"
                              name="website"
                              placeholder="Site Web"
                              value={variableGlobale.website}
                              onChange={onChange}
                            />
                          </div>
                        </Col>
                        <Col lg={3}>
                          <div className="mb-3">
                            <Form.Label htmlFor="website">
                              <h4 className="card-title mb-0">Année universitaire</h4>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="website"
                              name="website"
                              placeholder="yyyy/yyyy"
                              value={variableGlobale.annee_universitaire}
                              onChange={onChangeStudyYear}
                            />
                            <br />
                            <p className="text-danger">{yearControl}</p>
                          </div>
                        </Col>
                      </Row>
                      <Row>
  <Card.Header className="mb-3">
    <div className="d-flex">
      <div className="flex-shrink-0 me-3">
        <div className="avatar-sm">
          <div className="avatar-title rounded-circle bg-light text-primary fs-20">
            <i className="bi bi-geo-alt-fill"></i>
          </div>
        </div>
      </div>
      <div className="flex-grow-1">
        <h5 className="card-title">Places</h5>
      </div>
    </div>
  </Card.Header>

  {variableGlobale.places.map((place, index) => (
    <Row key={index}>
      <Col lg={2}>
        <div className="mb-3">
          <Form.Label htmlFor={`place-placeName-${index}`}>
            <h4 className="card-title mb-0">Nom du Lieu</h4>
          </Form.Label>
          <Form.Control
            type="text"
            name="placeName"
            id={`place-placeName-${index}`}
            placeholder="Nom du Lieu"
            value={place.placeName}
            onChange={(e) => handlePlaceChange(index, e)}
          />
        </div>
      </Col>
      <Col lg={3}>
        <div className="mb-3">
          <Form.Label htmlFor={`place-longitude-${index}`}>
            <h4 className="card-title mb-0">Longitude</h4>
          </Form.Label>
          <Form.Control
            type="text"
            name="longitude"
            id={`place-longitude-${index}`}
            placeholder="Longitude"
            value={place.longitude}
            onChange={(e) => handlePlaceChange(index, e)}
          />
        </div>
      </Col>
      <Col lg={3}>
        <div className="mb-3">
          <Form.Label htmlFor={`place-latitude-${index}`}>
            <h4 className="card-title mb-0">Latitude</h4>
          </Form.Label>
          <Form.Control
            type="text"
            name="latitude"
            id={`place-latitude-${index}`}
            placeholder="Latitude"
            value={place.latitude}
            onChange={(e) => handlePlaceChange(index, e)}
          />
        </div>
      </Col>
      <Col lg={2}>
        <div className="mb-3">
          <Form.Label htmlFor={`place-rayon-${index}`}>
            <h4 className="card-title mb-0">Rayon</h4>
          </Form.Label>
          <Form.Control
            type="text"
            name="rayon"
            id={`place-rayon-${index}`}
            placeholder="Rayon"
            value={place.rayon}
            onChange={(e) => handlePlaceChange(index, e)}
          />
        </div>
      </Col>
      <Col lg={2} className="d-flex align-items-center">
        <Button variant="danger" onClick={() => removePlace(index)}>
          <i className="bi bi-trash"></i> 
        </Button>
      </Col>
    </Row>
  ))}

  <Col lg={12} className="mt-3">
    <Button variant="primary" onClick={addPlace}>
      Ajouter un Lieu
    </Button>
  </Col>
</Row>
                      <Col lg={12}>
                        <div className="hstack gap-2 justify-content-end">
                          <Button variant="primary" id="add-btn" type="submit">
                            Enregister les variables
                          </Button>
                        </div>
                      </Col>
                    </Form>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AjouterVariablesGlobales;
