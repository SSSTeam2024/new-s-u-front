import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";
import { useUpdateDepartementMutation } from "features/departement/departement";

const EditDepartement = () => {
  document.title = " Modifier Département | Application Smart Institute";
  const navigate = useNavigate();
  const { state: departement } = useLocation();
  const [editDepartement] = useUpdateDepartementMutation();

  const [formData, setFormData] = useState({
    _id: "",
    name_fr: "",
    name_ar: "",
    description: "",
    volume_horaire: "",
    nom_chef_dep: "",
    SignatureFileBase64String: "",
    SignatureFileExtension: "",
    signature: "",
  });

  useEffect(() => {
    if (departement) {
      setFormData({
        _id: departement._id,
        name_fr: departement.name_fr,
        name_ar: departement.name_ar,
        description: departement.description,
        volume_horaire: departement.volume_horaire,
        nom_chef_dep: departement.nom_chef_dep,
        SignatureFileBase64String: departement.SignatureFileBase64String || "",
        SignatureFileExtension: departement.SignatureFileExtension || "",
        signature: departement.signature,
      });
    }
  }, [departement]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  function convertToBase64(
    file: File
  ): Promise<{ base64Data: string; extension: string }> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const base64String = fileReader.result as string;
        // const base64Data = base64String.split(",")[1]; // Extract only the Base64 data
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
  const handlePDFUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("SignatureFileBase64String") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const newPDF = base64Data + "." + extension;
      console.log(extension);
      setFormData({
        ...formData,
        signature: newPDF,
        SignatureFileBase64String: base64Data,
        SignatureFileExtension: extension,
      });
    }
  };

  const errorAlert = (message: string) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const onSubmitDépartement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await editDepartement(formData).unwrap();
      notify();
      navigate("/gestion-departements/liste-departements");
    } catch (error: any) {
      console.log(error);
    }
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Département a été modifié avec succès",
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
              <Form className="tablelist-form" onSubmit={onSubmitDépartement}>
                <div
                  id="alert-error-msg"
                  className="d-none alert alert-danger py-2"
                ></div>
                <input type="hidden" id="id-field" />
                <Row>
                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="name_fr">Nom département (FR)</Form.Label>
                      <Form.Control
                        type="text"
                        id="name_fr"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.name_fr}
                      />
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="name_ar">Nom département (AR)</Form.Label>
                      <Form.Control
                        type="text"
                        id="name_ar"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.name_ar}
                        style={{ direction: "rtl", textAlign: "right" }}
                      />
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="nom_chef_dep">
                        Nom chef département
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="nom_chef_dep"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.nom_chef_dep}
                      />
                    </div>
                  </Col>
                  <Col lg={3}>
                    <div className="mb-3">
                      <label htmlFor="statusSelect" className="form-label">
                        Signature chef département
                      </label>
                      <Form.Control
                        name="SignatureFileBase64String"
                        onChange={handlePDFUpload}
                        type="file"
                        id="SignatureFileBase64String"
                        accept=".pdf"
                        placeholder="Choose File"
                        className="text-muted"
                      />
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="description">Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        id="description"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.description}
                      />
                    </div>
                  </Col>
                </Row>

                <div className="modal-footer">
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      className="btn-ghost-danger"
                      onClick={() => {
                        navigate("/gestion-departements/liste-departements");
                      }}
                    >
                      Retour
                    </Button>
                    <Button variant="success" id="add-btn" type="submit">
                      Ajouter
                    </Button>
                  </div>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditDepartement;