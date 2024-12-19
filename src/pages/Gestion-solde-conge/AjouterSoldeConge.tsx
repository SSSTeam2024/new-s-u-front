import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAddLeaveBalanceMutation, useAddOrUpdateLeaveBalanceMutation, LeaveBalance } from "features/congé/leaveBalanceSlice";
import { useFetchLeaveTypeQuery, LeaveType, LeaveSubcategory } from "features/congé/leaveTypeSlice";
import { useFetchPersonnelsQuery, Personnel } from "features/personnel/personnelSlice";

import Select from "react-select";
import { RootState } from 'app/store';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from 'features/account/authSlice'; 

interface OptionType {
  value: any;
  label: string;
}

const AjouterSoldeConge = () => {
  document.title = "Ajouter Demande de Congé | Smart University";

  const [personnell, setPersonnel] = useState<Personnel | null>(null);
  const [leaveType, setLeaveType] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<LeaveSubcategory[]>([]);
  const [grade, setGrade] = useState<string>("");



  const navigate = useNavigate();
const [addSoldeConge] = useAddLeaveBalanceMutation();

const { data: leaveTypes } = useFetchLeaveTypeQuery();
const leavetype: LeaveType[] = Array.isArray(leaveTypes) ? leaveTypes : [];


const { data: personnels } = useFetchPersonnelsQuery();
const personnel: Personnel[] = Array.isArray(personnels) ? personnels : [];

const [availableSubcategories, setAvailableSubcategories] = useState<LeaveSubcategory[]>([]);

const [formData, setFormData] = useState<Partial<LeaveBalance>>({
  _id: "",
  personnelId:"",
  leaveType:"",
  subcategory: {
    _id: "",
  name_fr: "",
   name_ar: "",
  maxDays: 0,
  sexe: "Both",
  Accumulable: false
  },
  remainingDays:0,
  daysUsed:0,
  year:0
});


const [formErrors, setFormErrors] = useState({});

const validateForm = () => {
  const errors: any = {};
  if (!formData.personnelId) errors.personnelId = "Personnel is required.";
  if (!formData.leaveType) errors.leaveType = "Type de congé is required.";
  if (!formData.subcategory) errors.subcategory = "Categorie is required.";
  if (!formData.daysUsed) errors.daysUsed = "Jour utilisés is required.";
  if (!formData.year) errors.year = "Année is required.";
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

const handleInputChange = (field: string, value: any) => {
  setFormData((prev) => ({ ...prev, [field]: value }));
  setFormErrors((prev) => ({ ...prev, [field]: undefined }));
};

const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { id, value } = e.target;
  const updatedValue = value === "" ? 0 : parseInt(value);

  setFormData((prevState) => {
    let remainingDays = prevState.remainingDays || 0;

    if (id === "daysUsed") {
      const maxDays =
        selectedsubcat?.value?.maxDays || // Use maxDays from selected subcategory
        leavetype.find((lt) => lt._id === formData.leaveType)?.maxDays || // Fallback to maxDays from leaveType
        0;

      remainingDays = Math.max(0, maxDays - updatedValue); // Ensure non-negative value
    }

    return {
      ...prevState,
      [id]: updatedValue, // Update the field (e.g., daysUsed)
      remainingDays, // Dynamically update remainingDays
    };
  });
};


const onSelectLeaveType = (selectedOption: any) => {
  setFormData((prevState) => ({
    ...prevState,
    leaveType: selectedOption.value,
  }));
};


const onSelectPersonnel = (selectedOption: any) => {
  const selectedPersonnel = personnel.find((c) => c._id === selectedOption?.value);

  // Extract and set the grade ID if it exists
  if (selectedPersonnel?.grade) {
    setGrade(selectedPersonnel.grade._id); 
  } else {
    setGrade(""); 
  }
    setFormData((prevState) => ({
      ...prevState,
      personnelId: selectedOption.value,
    }));
  };

  //leave type change 

  const handleLeaveTypeChange = (selectedOption: any) => {
    
    const selectedLeaveType = leavetype.find((lt) => lt._id === selectedOption.value);
  
    setLeaveType(selectedOption.label)
    setFormData((prev) => ({
      ...prev,
      leaveType: selectedOption.value
    }));
  
    if(selectedOption.label=== "congé annuel"){
      const filteredSubcategories = selectedLeaveType?.subcategories?.filter(
        (subcat) => subcat.GradePersonnel?.includes(grade)
      );
      setSelectedSubcategory(filteredSubcategories!)
    }
    
    setAvailableSubcategories(
      selectedLeaveType?.subcategories?.map((sub) => ({
        ...sub,
        maxDays: sub.maxDays ?? 0,
      })) || []
    );
  };
        
console.log("selectedSubcategory", selectedSubcategory)
const [selectedDate, setSelectedDate] = useState<Date | null>(null);



const [selectedsubcat, setSelectedsubcat] = useState<OptionType | null>(null);
  // This function is triggered when the select Sub Category
  const handleSelectsubcat = (option: OptionType | null) => {
    setSelectedsubcat(option);
  };

const onSubmitDemandeConge = (e: any) => {
  e.preventDefault();
  if (!validateForm()) {
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text: "Veuillez remplir tous les champs obligatoires.",
    });
    return;
  }
  Swal.fire({
    icon: "success",
    title: "Succès",
    text: "Solde de congé ajouté avec succès.",
  });
  if (formData.subcategory) {
    formData.subcategory._id = selectedsubcat?.value?._id;
    formData.subcategory.Accumulable = selectedsubcat?.value?.Accumulable;
    formData.subcategory.maxDays = selectedsubcat?.value?.maxDays;
    formData.subcategory.name_ar = selectedsubcat?.value?.name_ar;
    formData.subcategory.name_fr = selectedsubcat?.value?.name_fr;
    formData.subcategory.sexe = selectedsubcat?.value?.sexe;
  } 
  addSoldeConge(formData).then(() => setFormData(formData));
  notify();
  navigate("/solde-conge/liste-solde-conge");
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

  // Get the current year
  const currentYear = new Date().getFullYear();

  // Generate years: current year and the three previous years
  const years = Array.from({ length: 4 }, (_, index) => currentYear - index);

  const handleYearChange = (selectedOption: any) => {
    setFormData((prevState) => ({
      ...prevState,
      year: selectedOption.value,
    }));
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
                        <h5 className="card-title">Ajouter Solde de congé</h5>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body></Card.Body>
                  <div className="mb-3">
                    <Form className="tablelist-form"  onSubmit={onSubmitDemandeConge}>
                      <input type="hidden" id="id-field" value={formData._id} />
                      <Row>
                        <Row>
                      
                        <Col lg={4} md={6}>
  <div className="mb-3">
    <Form.Label htmlFor="choices-multiple-remove-button">
      <h4 className="card-title mb-0">Nom du Personnel <span className="text-danger">*</span></h4>
    </Form.Label>
    <Select
      options={personnel.map(c => ({
        value: c._id,
        label: (
          <span>
            {`${c.prenom_fr} ${c.nom_fr}`}{" "}
            <span style={{ color: "gray", fontSize: "0.9em" }}>
              ({c.grade?.grade_fr})
            </span>
          </span>
        ),
      }))}
      onChange={onSelectPersonnel}
    />
  </div>
</Col>
                       
<Col lg={4} md={6}>
  <div className="mb-3">
    <Form.Label htmlFor="leaveType">
      <h4 className="card-title mb-0">Type de congé  <span className="text-danger">*</span></h4>
    </Form.Label>
    <Select
      options={leavetype.map((lt) => ({
        value: lt._id,
        label: lt.name_fr,
      }))}
      onChange={handleLeaveTypeChange}
      placeholder="Select Leave Type"
    />
  </div>
</Col>



<Col lg={4} md={6}>
  <div className="mb-3">
    <Form.Label htmlFor="subcategory">
      <h4 className="card-title mb-0">Categorie  <span className="text-danger">*</span></h4>
    </Form.Label>
    {leaveType === "congé annuel" ? 
    <Select
    options={selectedSubcategory.map((sc) => ({
      value: sc,
      label: sc.name_fr,
    }))}
    onChange={handleSelectsubcat}
    isDisabled={!availableSubcategories.length}
  />
    :
    <Select
      options={availableSubcategories.map((sc) => ({
        value: sc,
        label: sc.name_fr,
      }))}
      onChange={handleSelectsubcat}
      isDisabled={!availableSubcategories.length}
      placeholder="Selectionner categorie"
    /> }
  </div>
</Col>
                        </Row>
                        <Row>
                          <Col>
                          <div className="mb-3">
    <Form.Label htmlFor="adresse_conge">
      <h4 className="card-title mb-0"> Jour utilisés  <span className="text-danger">*</span></h4>
    </Form.Label>
    <Form.Control
      type="text"
      id="daysUsed"
      placeholder="Entrez le nombre"
      value={formData.daysUsed || ""} 
      onChange={onChange} 

    />
  </div>
                          </Col>

                          <Col lg={6}>
    <div className="mb-3">
      <Form.Label htmlFor="remainingDays">
        <h4 className="card-title mb-0">Jours restants</h4>
      </Form.Label>
      <Form.Control
        type="number"
        id="remainingDays"
        placeholder="Jours restants"
        value={formData.remainingDays || ""}
        readOnly
      />
    </div>
  </Col>
  <Col lg={4} md={6}>
                            <div className="mb-3">
                              <Form.Label htmlFor="year">
                                <h4 className="card-title mb-0">Année  <span className="text-danger">*</span></h4>
                              </Form.Label>
                              <Select
                                options={years.map((year) => ({
                                  value: year,
                                  label: year.toString(),
                                }))}
                                onChange={handleYearChange}
                                placeholder="Sélectionner l'année"
                                defaultValue={{
                                  value: currentYear,
                                  label: currentYear.toString(),
                                }}
                              />
                            </div>
                          </Col>

                        </Row>
                     
                        <Col lg={12}>
                          <div className="hstack gap-2 justify-content-end">
                            <Button
                              variant="primary"
                              id="add-btn"
                              type="submit"
                            >
                              Ajouter Solde de congé
                            </Button>
                          </div>
                        </Col>
                      </Row>
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

export default AjouterSoldeConge;


