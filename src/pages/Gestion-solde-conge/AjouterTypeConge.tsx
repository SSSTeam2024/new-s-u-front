import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row
} from "react-bootstrap";
import Flatpickr from "react-flatpickr";
import Dropzone from "react-dropzone";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";
import "flatpickr/dist/flatpickr.min.css";
import Select from "react-select";
import { useAddAvisEtudiantMutation, Avis } from "features/avisEtudiant/avisEtudiantSlice";
import { Classe, useFetchClassesQuery } from "features/classe/classe";
import { useNavigate } from "react-router-dom";
import { RootState } from 'app/store';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from 'features/account/authSlice'; 
import { useAddLeaveTypeMutation, LeaveType } from "features/congé/leaveTypeSlice";

const AjouterLeaveType = () => {
  document.title = "Ajouter type de congé | Smart University";
  const navigate = useNavigate();


  const [addLeaveType] = useAddLeaveTypeMutation();


  
  const [formData, setFormData] = useState<Partial<LeaveType>>({
    _id:"",
    name_fr:"",
    maxDays:0,
    Accumulable:false,
    
    description:""
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

//   const onSelectChange = (selectedOption: any) => {
//     setFormData((prevState) => ({
//       ...prevState,
//       grades: { ...prevState, grade: selectedOption.value, maxDays: prevState.grades?.maxDays ?? 0 },
//     }));
//   };


  const onDescriptionChange = (event: any, editor: any) => {
    const data = editor.getData();
    setFormData((prevState) => ({
      ...prevState,
      description: data,
    }));
  };

  const onAccumulableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      Accumulable: e.target.checked,
    }));
  };

  
  const onSubmitTypeConge = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addLeaveType(formData).then(() => setFormData(formData));
    notify();
    navigate("/type-conge/Liste-type-conge");
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Avis has been created successfully",
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
                  <Card.Header>
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar-sm">
                          <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                            <i className="bi bi-person-lines-fill"></i>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="card-title">Nouveau type de congé</h5>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body></Card.Body>
                  <div className="mb-3">
                    <Form className="tablelist-form" onSubmit={onSubmitTypeConge}>
                      <input type="hidden" id="_id" value={formData._id} />
                      <Form.Group className="mb-3">
                        <Form.Label>Titre</Form.Label>
                        <Form.Control
                          type="text"
                          id="title"
                          value={formData.name_fr ?? ""}
                          onChange={onChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          type="text"
                          id="description"
                          value={formData.description ?? ""}
                          onChange={onChange}
                          required
                        />
                      </Form.Group>


                      <Form.Group className="mb-3">
                        <Form.Label>Grade</Form.Label>
                        <Select
                          options={[
                            { value: "A", label: "Grade A" },
                            { value: "B", label: "Grade B" },
                            // Add more grades as needed
                          ]}
                     
                          placeholder="Sélectionnez un grade"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Max Days</Form.Label>
                        <Form.Control
                          type="number"
                          id="maxDays"
                          value={formData.maxDays ?? 0}
                          onChange={(e) => setFormData({ ...formData, maxDays: Number(e.target.value) })}
                          min={0}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Accumulable</Form.Label>
                        <Form.Check
                          type="switch"
                          id="Accumulable"
                          label="Accumulable"
                          checked={formData.Accumulable}
                          onChange={onAccumulableChange}
                        />
                      </Form.Group>

                      <div className="mb-3 text-end">
                        <Button type="submit" color="primary">Enregistrer</Button>
                      </div>
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

export default AjouterLeaveType;
