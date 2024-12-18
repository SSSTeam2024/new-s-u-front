import React, { useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";

import { useAddGradeEnseignantMutation } from "features/gradeEnseignant/gradeEnseignant";

const AddGradeEnseignant = () => {
  document.title = " Ajouter Grade Enseignant | Application Smart Institute";
  const navigate = useNavigate();

  function tog_retourParametres() {
    navigate("/parametre/grade-enseignants");
  }

  const [createGradeEnseignant] = useAddGradeEnseignantMutation();
  const [formData, setFormData] = useState({
    _id: "",
    //value_grade_enseignant: "",
    grade_ar: "",
    grade_fr: "",
    abreviation: "",
    charge_horaire: {
      annualMinHE: "",
      annualMaxHE: "",

      s1MinHE: "",
      s1MaxHE: "",

      s2MinHE: "",
      s2MaxHE: "",

      annualMinHS: "",
      annualMaxHS: "",

      s1MinHS: "",
      s1MaxHS: "",

      s2MinHS: "",
      s2MaxHS: "",

      annualMinHX: "",
      annualMaxHX: "",

      s1MinHX: "",
      s1MaxHX: "",

      s2MinHX: "",
      s2MaxHX: "",

      totalAnnualMin: "",
      totalAnnualMax: "",

      totalS1Min: "",
      totalS1Max: "",

      totalS2Min: "",
      totalS2Max: "",
    },
  });
  const onDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("name", name, "value", typeof value);

    if (
      name === "annualMinHE" ||
      name === "annualMinHS" ||
      name === "annualMinHX"
    ) {
      setFormData((prevState) => {
        const updatedChargeHoraire = {
          ...prevState.charge_horaire,
          [name]: value,
          totalAnnualMin: calculateChargeAnnualMin(value, name), // Pass the new value and name to calculate total
        };

        return {
          ...prevState,
          charge_horaire: updatedChargeHoraire,
        };
      });
    }

    if (
      name === "annualMaxHE" ||
      name === "annualMaxHS" ||
      name === "annualMaxHX"
    ) {
      setFormData((prevState) => {
        const updatedChargeHoraire = {
          ...prevState.charge_horaire,
          [name]: value,
          totalAnnualMax: calculateChargeAnnualMax(value, name), // Pass the new value and name to calculate total
        };

        return {
          ...prevState,
          charge_horaire: updatedChargeHoraire,
        };
      });
    }

    if (name === "s1MinHE" || name === "s1MinHS" || name === "s1MinHX") {
      setFormData((prevState) => {
        const updatedChargeHoraire = {
          ...prevState.charge_horaire,
          [name]: value,
          totalS1Min: calculateChargeS1Min(value, name), // Pass the new value and name to calculate total
        };

        return {
          ...prevState,
          charge_horaire: updatedChargeHoraire,
        };
      });
    }
    if (name === "s1MaxHE" || name === "s1MaxHS" || name === "s1MaxHX") {
      setFormData((prevState) => {
        const updatedChargeHoraire = {
          ...prevState.charge_horaire,
          [name]: value,
          totalS1Max: calculateChargeS1Max(value, name), // Pass the new value and name to calculate total
        };

        return {
          ...prevState,
          charge_horaire: updatedChargeHoraire,
        };
      });
    }

    if (name === "s2MinHE" || name === "s2MinHS" || name === "s2MinHX") {
      setFormData((prevState) => {
        const updatedChargeHoraire = {
          ...prevState.charge_horaire,
          [name]: value,
          totalS2Min: calculateChargeS2Min(value, name), // Pass the new value and name to calculate total
        };

        return {
          ...prevState,
          charge_horaire: updatedChargeHoraire,
        };
      });
    }
    if (name === "s2MaxHE" || name === "s2MaxHS" || name === "s2MaxHX") {
      setFormData((prevState) => {
        const updatedChargeHoraire = {
          ...prevState.charge_horaire,
          [name]: value,
          totalS2Max: calculateChargeS2Max(value, name), // Pass the new value and name to calculate total
        };

        return {
          ...prevState,
          charge_horaire: updatedChargeHoraire,
        };
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

  const onSubmitGradeEnseignant = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    console.log("formData", formData);
    e.preventDefault();
    try {
      await createGradeEnseignant(formData).unwrap();
      notify();
      navigate("/parametre/grade-enseignants");
    } catch (error: any) {
      console.log(error);
    }
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Grade a été crée avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const error = (error: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Creation grade enseignant échoué ${error}`,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const calculateChargeAnnualMin = (updatedValue: any, name: any) => {
    const annualMinHE =
      name === "annualMinHE"
        ? updatedValue
        : formData.charge_horaire.annualMinHE || "0";
    const annualMinHS =
      name === "annualMinHS"
        ? updatedValue
        : formData.charge_horaire.annualMinHS || "0";
    const annualMinHX =
      name === "annualMinHX"
        ? updatedValue
        : formData.charge_horaire.annualMinHX || "0";

    // Calculate total
    const chargeTotalMin =
      Number(annualMinHE) + Number(annualMinHS) + Number(annualMinHX);

    return String(chargeTotalMin);
  };
  const calculateChargeAnnualMax = (updatedValue: any, name: any) => {
    const annualMaxHE =
      name === "annualMaxHE"
        ? updatedValue
        : formData.charge_horaire.annualMaxHE || "0";
    const annualMaxHS =
      name === "annualMaxHS"
        ? updatedValue
        : formData.charge_horaire.annualMaxHS || "0";
    const annualMaxHX =
      name === "annualMaxHX"
        ? updatedValue
        : formData.charge_horaire.annualMaxHX || "0";

    // Calculate total
    const chargeTotalMax =
      Number(annualMaxHE) + Number(annualMaxHS) + Number(annualMaxHX);

    return String(chargeTotalMax);
  };

  const calculateChargeS1Min = (updatedValue: any, name: any) => {
    const s1MinHE =
      name === "s1MinHE"
        ? updatedValue
        : formData.charge_horaire.s1MinHE || "0";
    const s1MinHS =
      name === "s1MinHS"
        ? updatedValue
        : formData.charge_horaire.s1MinHS || "0";
    const s1MinHX =
      name === "s1MinHX"
        ? updatedValue
        : formData.charge_horaire.s1MinHX || "0";

    // Calculate total
    const chargeTotalMin = Number(s1MinHE) + Number(s1MinHS) + Number(s1MinHX);

    return String(chargeTotalMin);
  };
  const calculateChargeS1Max = (updatedValue: any, name: any) => {
    const s1MaxHE =
      name === "s1MaxHE"
        ? updatedValue
        : formData.charge_horaire.s1MaxHE || "0";
    const s1MaxHS =
      name === "s1MaxHS"
        ? updatedValue
        : formData.charge_horaire.s1MaxHS || "0";
    const s1MaxHX =
      name === "s1MaxHX"
        ? updatedValue
        : formData.charge_horaire.s1MaxHX || "0";

    // Calculate total
    const chargeTotalMin = Number(s1MaxHE) + Number(s1MaxHS) + Number(s1MaxHX);

    return String(chargeTotalMin);
  };

  const calculateChargeS2Min = (updatedValue: any, name: any) => {
    const s2MinHE =
      name === "s2MinHE"
        ? updatedValue
        : formData.charge_horaire.s2MinHE || "0";
    const s2MinHS =
      name === "s2MinHS"
        ? updatedValue
        : formData.charge_horaire.s2MinHS || "0";
    const s2MinHX =
      name === "s2MinHX"
        ? updatedValue
        : formData.charge_horaire.s2MinHX || "0";

    // Calculate total
    const chargeTotalMin = Number(s2MinHE) + Number(s2MinHS) + Number(s2MinHX);

    return String(chargeTotalMin);
  };
  const calculateChargeS2Max = (updatedValue: any, name: any) => {
    const s2MaxHE =
      name === "s2MaxHE"
        ? updatedValue
        : formData.charge_horaire.s2MaxHE || "0";
    const s2MaxHS =
      name === "s2MaxHS"
        ? updatedValue
        : formData.charge_horaire.s2MaxHS || "0";
    const s2MaxHX =
      name === "s2MaxHX"
        ? updatedValue
        : formData.charge_horaire.s2MaxHX || "0";

    // Calculate total
    const chargeTotalMin = Number(s2MaxHE) + Number(s2MaxHS) + Number(s2MaxHX);

    return String(chargeTotalMin);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col lg={12}>
              <Form
                className="tablelist-form"
                onSubmit={onSubmitGradeEnseignant}
              >
                <div
                  id="alert-error-msg"
                  className="d-none alert alert-danger py-2"
                ></div>
                <input type="hidden" id="id-field" />
                <Row>
                  <Col lg={3}>
                    <div className="mb-3">
                      <Form.Label htmlFor="grade_fr">
                        Grade Enseignant (FR)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="grade_fr"
                        placeholder=""
                        required
                        onChange={onDataChange}
                        value={formData.grade_fr}
                      />
                    </div>
                  </Col>

                  <Col lg={3}>
                    <div className="mb-3">
                      <Form.Label htmlFor="grade_ar">
                        Grade Enseignant (AR)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="grade_ar"
                        placeholder=""
                        required
                        onChange={onDataChange}
                        value={formData.grade_ar}
                      />
                    </div>
                  </Col>
                  <Col lg={3}>
                    <div className="mb-3">
                      <Form.Label htmlFor="abreviation">Abréviation</Form.Label>
                      <Form.Control
                        type="text"
                        id="abreviation"
                        placeholder=""
                        required
                        onChange={onDataChange}
                        value={formData.abreviation}
                      />
                    </div>
                  </Col>
                </Row>

                {/* Volume Horaires Table */}
                <Table
                  bordered
                  responsive
                  striped
                  hover
                  className="mt-4 text-center"
                >
                  <thead>
                    <tr>
                      <th>Type Volume</th>
                      <th colSpan={2} className="bg-secondary text-white">
                        Charge Annuel
                      </th>
                      <th colSpan={2} className="bg-danger text-white">
                        Charge Semestre 1
                      </th>
                      <th colSpan={2} className="bg-info text-white">
                        Charge Semestre 2
                      </th>
                    </tr>
                    <tr>
                      <th></th>
                      <th>Min</th>
                      <th>Max</th>
                      <th>Min</th>
                      <th>Max</th>
                      <th>Min</th>
                      <th>Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Heures d’enseignement (HE)</td>
                      <td>
                        <Form.Control
                          type="number"
                          name="annualMinHE"
                          onChange={onChange}
                          value={formData.charge_horaire.annualMinHE}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="annualMaxHE"
                          onChange={onChange}
                          value={formData.charge_horaire.annualMaxHE}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="s1MinHE"
                          onChange={onChange}
                          value={formData.charge_horaire.s1MinHE}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="s1MaxHE"
                          onChange={onChange}
                          value={formData.charge_horaire.s1MaxHE}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="s2MinHE"
                          onChange={onChange}
                          value={formData.charge_horaire.s2MinHE}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="s2MaxHE"
                          onChange={onChange}
                          value={formData.charge_horaire.s2MaxHE}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Heures Supplémentaires (HS)</td>
                      <td>
                        <Form.Control
                          type="number"
                          name="annualMinHS"
                          onChange={onChange}
                          value={formData.charge_horaire.annualMinHS}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="annualMaxHS"
                          onChange={onChange}
                          value={formData.charge_horaire.annualMaxHS}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="s1MinHS"
                          onChange={onChange}
                          value={formData.charge_horaire.s1MinHS}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="s1MaxHS"
                          onChange={onChange}
                          value={formData.charge_horaire.s1MaxHS}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="s2MinHS"
                          onChange={onChange}
                          value={formData.charge_horaire.s2MinHS}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="s2MaxHS"
                          onChange={onChange}
                          value={formData.charge_horaire.s2MaxHS}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Heures Extras (HX)</td>
                      <td>
                        <Form.Control
                          type="number"
                          name="annualMinHX"
                          onChange={onChange}
                          value={formData.charge_horaire.annualMinHX}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="annualMaxHX"
                          onChange={onChange}
                          value={formData.charge_horaire.annualMaxHX}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="s1MinHX"
                          onChange={onChange}
                          value={formData.charge_horaire.s1MinHX}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="s1MaxHX"
                          onChange={onChange}
                          value={formData.charge_horaire.s1MaxHX}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="s2MinHX"
                          onChange={onChange}
                          value={formData.charge_horaire.s2MinHX}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="s2MaxHX"
                          onChange={onChange}
                          value={formData.charge_horaire.s2MaxHX}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Total</td>
                      <td>
                        <Form.Control
                          type="number"
                          name="totalAnnualMin"
                          onChange={onChange}
                          value={formData.charge_horaire.totalAnnualMin}
                          disabled
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="totalAnnualMax"
                          onChange={onChange}
                          disabled
                          value={formData.charge_horaire.totalAnnualMax}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="totalS1Min"
                          onChange={onChange}
                          disabled
                          value={formData.charge_horaire.totalS1Min}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="totalS1Max"
                          onChange={onChange}
                          disabled
                          value={formData.charge_horaire.totalS1Max}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="totalS2Min"
                          onChange={onChange}
                          disabled
                          value={formData.charge_horaire.totalS2Min}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="totalS2Max"
                          onChange={onChange}
                          disabled
                          value={formData.charge_horaire.totalS2Max}
                        />
                      </td>
                    </tr>
                  </tbody>
                </Table>

                <div className="modal-footer">
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      className="btn-ghost-danger"
                      onClick={() => {
                        tog_retourParametres();
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

export default AddGradeEnseignant;