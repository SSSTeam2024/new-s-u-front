import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";
import { useUpdateGradeEnseignantMutation } from "features/gradeEnseignant/gradeEnseignant";

const EditGradeEnseignant = () => {
  document.title = " Modifier Grade Enseignant | Application Smart Institute";
  const navigate = useNavigate();
  const { state: gradeEnseignant } = useLocation();
  const [editGradeEnseignant] = useUpdateGradeEnseignantMutation();

  const [formData, setFormData] = useState({
    _id: "",
    //value_grade_enseignant: "",
    grade_ar: "",
    grade_fr: "",
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

  useEffect(() => {
    if (gradeEnseignant) {
      setFormData({
        _id: gradeEnseignant._id,
        //value_grade_enseignant: gradeEnseignant.value_grade_enseignant,
        grade_ar: gradeEnseignant.grade_ar,
        grade_fr: gradeEnseignant.grade_fr,
        charge_horaire: {
          annualMinHE: gradeEnseignant.charge_horaire?.annualMinHE || "",
          annualMaxHE: gradeEnseignant.charge_horaire?.annualMaxHE || "",
          s1MinHE: gradeEnseignant.charge_horaire?.s1MinHE || "",
          s1MaxHE: gradeEnseignant.charge_horaire?.s1MaxHE || "",
          s2MinHE: gradeEnseignant.charge_horaire?.s2MinHE || "",
          s2MaxHE: gradeEnseignant.charge_horaire?.s2MaxHE || "",
          annualMinHS: gradeEnseignant.charge_horaire?.annualMinHS || "",
          annualMaxHS: gradeEnseignant.charge_horaire?.annualMaxHS || "",
          s1MinHS: gradeEnseignant.charge_horaire?.s1MinHS || "",
          s1MaxHS: gradeEnseignant.charge_horaire?.s1MaxHS || "",
          s2MinHS: gradeEnseignant.charge_horaire?.s2MinHS || "",
          s2MaxHS: gradeEnseignant.charge_horaire?.s2MaxHS || "",
          annualMinHX: gradeEnseignant.charge_horaire?.annualMinHX || "",
          annualMaxHX: gradeEnseignant.charge_horaire?.annualMaxHX || "",
          s1MinHX: gradeEnseignant.charge_horaire?.s1MinHX || "",
          s1MaxHX: gradeEnseignant.charge_horaire?.s1MaxHX || "",
          s2MinHX: gradeEnseignant.charge_horaire?.s2MinHX || "",
          s2MaxHX: gradeEnseignant.charge_horaire?.s2MaxHX || "",
          totalAnnualMin: gradeEnseignant.charge_horaire?.totalAnnualMin || "",
          totalAnnualMax: gradeEnseignant.charge_horaire?.totalAnnualMax || "",
          totalS1Min: gradeEnseignant.charge_horaire?.totalS1Min || "",
          totalS1Max: gradeEnseignant.charge_horaire?.totalS1Max || "",
          totalS2Min: gradeEnseignant.charge_horaire?.totalS2Min || "",
          totalS2Max: gradeEnseignant.charge_horaire?.totalS2Max || "",
        },
      });
    }
  }, [gradeEnseignant]);

  const onDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevState) => {
      const updatedChargeHoraire = {
        ...prevState.charge_horaire,
        [name]: value,
      };

      return {
        ...prevState,
        charge_horaire: updatedChargeHoraire,
      };
    });
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
      await editGradeEnseignant(formData).unwrap();
      notify();
      navigate("/parametre/grade-enseignants");
    } catch (error: any) {
      if (error.status === 400) {
        errorAlert("La valeur doit être unique.");
      } else {
        errorAlert("La valeur doit être unique. Veuillez réessayer.");
      }
    }
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Grade a été modifié avec succès",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const errorNotification = (error: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Modification grade personnel échouée ${error}`,
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
                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="grade_fr">
                        Grade Enseignant
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

                  <Col lg={4}>
                    <div
                      className="mb-3"
                      style={{
                        direction: "rtl",
                        textAlign: "right",
                      }}
                    >
                      <Form.Label htmlFor="grade_ar">رتبة الأستاذ</Form.Label>
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
                          // disabled
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="totalAnnualMax"
                          onChange={onChange}
                          // disabled
                          value={formData.charge_horaire.totalAnnualMax}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="totalS1Min"
                          onChange={onChange}
                          // disabled
                          value={formData.charge_horaire.totalS1Min}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="totalS1Max"
                          onChange={onChange}
                          // disabled
                          value={formData.charge_horaire.totalS1Max}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="totalS2Min"
                          onChange={onChange}
                          // disabled
                          value={formData.charge_horaire.totalS2Min}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="totalS2Max"
                          onChange={onChange}
                          // disabled
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
                        navigate("/parametre/grade-enseignants");
                      }}
                    >
                      Retour
                    </Button>
                    <Button variant="success" id="add-btn" type="submit">
                      Modifier
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

export default EditGradeEnseignant;