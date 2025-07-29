import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import Flatpickr from "react-flatpickr";
import Dropzone from "react-dropzone";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";
import "flatpickr/dist/flatpickr.min.css";
import Select from "react-select";
import {
  useAddDemandePersonnelMutation,
  Demande,
} from "features/demandePersonnel/demandePersonnelSlice";
import {
  useFetchPersonnelsQuery,
  Personnel,
} from "features/personnel/personnelSlice";
import {
  useFetchTemplateBodyQuery,
  TemplateBody,
  useFetchTemplateBodyByAdminIdQuery,
} from "features/templateBody/templateBodySlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
import { useGetDiversDocExtraByModelIdMutation } from "features/diversDocExtra/diversDocSlice";

const AjouterDemandePersonnel = () => {
  document.title = "Ajouter Demande Personnel | ENIGA";
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const [addDemandePersonnel] = useAddDemandePersonnelMutation();
  const [getDiversDocExtra] = useGetDiversDocExtraByModelIdMutation();
  const { data: personnels } = useFetchPersonnelsQuery();
  const personnel: Personnel[] = Array.isArray(personnels) ? personnels : [];

  const adminId = user?._id;
  //Use the query that fetches templates by admin ID
  const { data: templateBodies } = useFetchTemplateBodyByAdminIdQuery(adminId!, {
    skip: !adminId,
  });
  const templateBody: TemplateBody[] = Array.isArray(templateBodies)
    ? templateBodies
    : [];

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const getCurrentHhMmTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState<any>({
    personnelId: "",
    title: "",
    description: "",
    piece_demande: "",
    langue: "",
    nombre_copie: 1,
    added_by: user?._id!,
    response: "",
    current_status: "En attente",
    status_history: [{
      value: "En attente",
      date: formatDate(new Date()),
      time: getCurrentHhMmTime(new Date()),
      handled_by: adminId!
    }],
    createdAt: undefined,
    updatedAt: undefined,
    extra_data: [
      {
        name: "",
        value: "",
        body: "",
        FileBase64: "",
        FileExtension: ""
      }
    ],
  });

  const [selectedLangue, setSelectedLangue] = useState<string>("");
  const [diversExtraData, setDiversExtraData] = useState<any>(null);
  const [diversExtraDataExceptional, setDiversExtraDataExceptional] = useState<any>(null);
  const [selectedExceptional, setSelectedExceptional] = useState<any>([
    {
      dates_etats: "",
      status_fils: "",
      dates_naiss: "",
      noms_enfants: ""
    }
  ]);
  const [docLabel, setDocLabel] = useState<string>("");

  const handleLangueChange = (langue: string) => {
    setSelectedLangue(langue);
    setFormData((prevState: any) => ({
      ...prevState,
      langue: langue,
      extra_data: [],
      piece_demande: "",
      nombre_copie: 1
    }));

    setDiversExtraData(null);
    setDiversExtraDataExceptional(null);
    setDocLabel("");
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevState: any) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSelectChange = (selectedOption: any) => {
    setFormData((prevState: any) => ({
      ...prevState,
      personnelId: selectedOption.value,
    }));
  };

  const onChangeExtra = (index: any, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let extraDataRef = [...formData.extra_data];

    extraDataRef[index].value = e.target.value;
    setFormData((prevState: any) => ({
      ...prevState,
      extra_data: extraDataRef
    }));
  };
  const onChangeExtraExcept = (index: any, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: string) => {
    let dataRef = [...selectedExceptional];

    dataRef[index][type] = e.target.value;
    setSelectedExceptional(dataRef);
  };

  const onChangeExtraV2 = (index: number, selectedOption: any) => {
    let extraDataRef = [...formData.extra_data];

    extraDataRef[index].value = selectedOption.value;
    setFormData((prevState: any) => ({
      ...prevState,
      extra_data: extraDataRef
    }));
  }

  const addLine = () => {
    let dataRef = [...selectedExceptional];

    dataRef.push(
      {
        dates_etats: "",
        status_fils: "",
        dates_naiss: "",
        noms_enfants: ""
      }
    )
    setSelectedExceptional(dataRef);
  }

  const removeLine = (index: number) => {
    let dataRef = [...selectedExceptional];
    dataRef.splice(index, 1);
    setSelectedExceptional(dataRef)
  };

  const handleDateChange = (index: number, selectedDates: Date[]) => {
    let date = selectedDates[0];
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let extraDataRef = [...formData.extra_data];
    extraDataRef[index].value = day + "-" + month + "-" + year;

    setFormData((prevState: any) => ({
      ...prevState,
      extra_data: extraDataRef
    }));
  };

  const handleDateChangeV2 = (index: number, selectedDates: Date[]) => {
    let date = selectedDates[0];
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    console.log(day)
    console.log(month)
    console.log(year)
    let dataRef = [...selectedExceptional];
    dataRef[index].dates_naiss = day + "-" + month + "-" + year;
    console.log(dataRef)
    setSelectedExceptional(dataRef);
  };




  const onSelectChangeTemplate = async (selectedOption: any) => {
    const extraData = await getDiversDocExtra(selectedOption.value).unwrap();
    console.log(extraData);
    if (extraData.length > 0) {
      const normalExtraData = extraData[0].extra_data.filter(e => e.fieldBody !== 'noms_enfants' && e.fieldBody !== 'dates_naiss' && e.fieldBody !== 'status_fils' && e.fieldBody !== 'dates_etats');
      const exceptionalExtraData = extraData[0].extra_data.filter(e => e.fieldBody === 'noms_enfants' || e.fieldBody === 'dates_naiss' || e.fieldBody === 'status_fils' || e.fieldBody === 'dates_etats');
      setDiversExtraData(normalExtraData);
      setDiversExtraDataExceptional(exceptionalExtraData)
      setFormData((prevState: any) => ({
        ...prevState,
        piece_demande: selectedOption.value,
        // extra_data: normalExtraData.map(d => { return { name: d.fieldName, body: d.fieldBody } })
        extra_data: normalExtraData.map(d => ({
          name: d.fieldName,
          body: d.fieldBody,
          value: d.data_type === 'file' ? null : '' // prepare file slots
        }))

      }));
    } else {
      setDiversExtraData(null);
      setDiversExtraDataExceptional(null);
      setFormData((prevState: any) => ({
        ...prevState,
        piece_demande: selectedOption.value,
        extra_data: []
      }));
    }

    const filteredDoc = filteredTemplates.filter(t => t._id === selectedOption.value)[0];
    setDocLabel(filteredDoc.title);
  };


  const onDescriptionChange = (event: any, editor: any) => {
    const data = editor.getData();
    setFormData((prevState: any) => ({
      ...prevState,
      description: data,
    }));
  };

  const onSubmitDemandePersonnel = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    console.log(formData.extra_data)
    e.preventDefault();
    try {
      let extraDataRef = [...formData.extra_data];

      let dates_etats = {
        name: "dates_etats",
        value: "",
        body: "dates_etats"
      }
      let status_fils = {
        name: "status_fils",
        value: "",
        body: "status_fils"
      }
      let dates_naiss = {
        name: "dates_naiss",
        value: "",
        body: "dates_naiss"
      }
      let noms_enfants = {
        name: "noms_enfants",
        value: "",
        body: "noms_enfants"
      }
      for (const element of selectedExceptional) {
        dates_etats.value += element.dates_etats + '#'
        status_fils.value += element.status_fils + '#'
        dates_naiss.value += element.dates_naiss + '#'
        noms_enfants.value += element.noms_enfants + '#'

      }

      extraDataRef.push(dates_etats)
      extraDataRef.push(status_fils)
      extraDataRef.push(dates_naiss)
      extraDataRef.push(noms_enfants)

      console.log(selectedExceptional)

      let refForm = { ...formData };
      refForm.extra_data = extraDataRef
      console.log(refForm);

      await addDemandePersonnel(refForm).unwrap();
      notify();
      navigate("/demandes-personnel/liste-demande-personnel");
    } catch (error: any) {
      console.error("Failed to create demande:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: error?.data?.message || "Une erreur est survenue lors de la création de la demande.",
      });
    }

  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "La demande a été créée avec succès",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  // Filter templates based on selected language
  const filteredTemplates = templateBody.filter(
    (template) =>
      selectedLangue && // Make sure selectedLangue is not empty
      template.langue === selectedLangue &&
      template.intended_for === "personnel"
  );

  function convertToBase64(
    file: File
  ): Promise<{ base64Data: string; extension: string }> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const base64String = fileReader.result as string;
        const [, base64Data] = base64String.split(",");
        const extension = file.name.split(".").pop() ?? "";
        resolve({ base64Data, extension });
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
      fileReader.readAsDataURL(file);
    });
  }

  // const handleFileChange = async (index: number, e: any) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const { base64Data, extension } = await convertToBase64(file);

  //     const updated = [...formData.extra_data];
  //     updated[index] = {
  //       ...updated[index],
  //       value: file.name,
  //       FileBase64: base64Data,
  //       FileExtension: extension
  //     };

  //     setFormData((prev: any) => ({
  //       ...prev,
  //       extra_data: updated,
  //     }));
  //   }
  // };

  const handleFileChange = async (index: number, e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);

      const updated = [...formData.extra_data];
      updated[index] = {
        ...updated[index],
        value: file.name,
        FileBase64: base64Data,
        FileExtension: extension,
      };

      setFormData((prev: any) => ({
        ...prev,
        extra_data: updated,
      }));
    }
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
                        <h5 className="card-title">
                          Nouvelle demande personnel
                        </h5>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body></Card.Body>
                  <div className="mb-3">
                    <Form
                      className="tablelist-form"
                      onSubmit={onSubmitDemandePersonnel}
                    >
                      <Row>
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Personnel</Form.Label>
                            <Select
                              options={personnel.map((c) => ({
                                value: c._id,
                                label: `${c.prenom_fr} ${c.nom_fr}`,
                              }))}
                              onChange={onSelectChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Langue</Form.Label>
                            <div>
                              <Button
                                variant={
                                  selectedLangue === "arabic"
                                    ? "primary"
                                    : "light"
                                }
                                onClick={() => handleLangueChange("arabic")}
                              >
                                Arabe
                              </Button>
                              <Button
                                variant={
                                  selectedLangue === "french"
                                    ? "primary"
                                    : "light"
                                }
                                onClick={() => handleLangueChange("french")}
                                className="ms-2"
                              >
                                Français
                              </Button>
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>

                      {selectedLangue && (
                        <>
                          <Row>
                            <Col lg={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Piece demandée</Form.Label>
                                <Select
                                  options={filteredTemplates.map(
                                    (template: any) => ({
                                      value: template._id,
                                      label: template.title,
                                    })
                                  )}
                                  value={{ value: formData.piece_demande, label: docLabel }}
                                  onChange={onSelectChangeTemplate}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          {(diversExtraData?.length > 0 || diversExtraDataExceptional?.length > 0) && selectedLangue === "french" && (
                            <Row style={{ fontSize: '1rem', fontWeight: '600', fontFamily: 'system-ui', paddingLeft: '10px' }}>
                              Données supplémentaires
                            </Row>
                          )}

                          {(diversExtraData?.length > 0 || diversExtraDataExceptional?.length > 0) && selectedLangue === "arabic" && (
                            <Row className="d-flex justify-content-end" style={{ fontSize: '1rem', fontWeight: '600', fontFamily: 'system-ui', color: 'violet' }}>
                              معلومات اضافية
                            </Row>
                          )}
                          {diversExtraData?.map((d: any, index: number) => (
                            <>
                              <Row key={index}>
                                {selectedLangue === "french" ? (
                                  <Col lg={5}>
                                    <Form.Group className="mb-3">
                                      {d.options.length === 0 && d.data_type === 'regular' && (
                                        <>
                                          <Form.Label style={{ fontSize: '1rem', fontWeight: '600', fontFamily: 'system-ui' }}>
                                            {d.fieldName}
                                          </Form.Label>
                                          <Form.Control
                                            type="text"
                                            id="description"
                                            value={formData?.extra_data[index]?.value ?? ""}
                                            onChange={(e) => { onChangeExtra(index, e) }}
                                            required
                                          />
                                        </>
                                      )}
                                      {d.options.length > 0 && (
                                        <>
                                          <Form.Label style={{ fontSize: '1rem', fontWeight: '600', fontFamily: 'system-ui' }}>
                                            {d.fieldName}
                                          </Form.Label>
                                          <Select
                                            options={d.options.map(
                                              (option: any) => ({
                                                value: option,
                                                label: option,
                                              })
                                            )}
                                            onChange={(e) => { onChangeExtraV2(index, e) }}
                                            required
                                          />
                                        </>
                                      )}
                                      {d.options.length === 0 && d.data_type === 'date' && (
                                        <>
                                          <Form.Label style={{ fontSize: '1rem', fontWeight: '600', fontFamily: 'system-ui' }}>
                                            {d.fieldName}
                                          </Form.Label>
                                          <Flatpickr
                                            onChange={(e) => { handleDateChange(index, e) }}
                                            className="form-control flatpickr-input"
                                            placeholder="Sélectionner Date"
                                            options={{
                                              dateFormat: "d M, Y",
                                            }}
                                            required
                                          />
                                        </>
                                      )}
                                      {d.data_type === "file" && (
                                        <>
                                          <Form.Label style={{ fontSize: '1rem', fontWeight: '600', fontFamily: 'system-ui' }}>
                                            {d.fieldName}
                                          </Form.Label>
                                          <Form.Control
                                            type="file"
                                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                            onChange={(e) => handleFileChange(index, e)}
                                            required
                                          />

                                        </>
                                      )}


                                    </Form.Group>
                                  </Col>
                                ) : <>
                                  <Col lg={7}></Col>
                                  <Col lg={5}>
                                    <Form.Group className="mb-3">
                                      {d.options.length === 0 && d.data_type === 'regular' && (
                                        <>
                                          <Form.Label style={{ fontSize: '1rem', fontWeight: '600', fontFamily: 'system-ui', float: 'right' }}>
                                            {d.fieldName}
                                          </Form.Label>
                                          <Form.Control
                                            type="text"
                                            id="description"
                                            value={formData?.extra_data[index]?.value ?? ""}
                                            onChange={(e) => { onChangeExtra(index, e) }}
                                            required
                                          />
                                        </>
                                      )}
                                      {d.options.length > 0 && (
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                          <Form.Label style={{ fontSize: '1rem', fontWeight: '600', fontFamily: 'system-ui', float: 'right', textAlign: 'end' }}>
                                            {d.fieldName}
                                          </Form.Label>

                                          <Select
                                            options={d.options.map(
                                              (option: any) => ({
                                                value: option,
                                                label: option,
                                              })
                                            )}
                                            onChange={(e) => { onChangeExtraV2(index, e) }}
                                            required
                                          />
                                        </div>
                                      )}
                                      {d.options.length === 0 && d.data_type === 'date' && (
                                        <>
                                          <Form.Label style={{ fontSize: '1rem', fontWeight: '600', fontFamily: 'system-ui', float: 'right' }}>
                                            {d.fieldName}
                                          </Form.Label>
                                          <Flatpickr
                                            onChange={(e) => { handleDateChange(index, e) }}
                                            className="form-control flatpickr-input"
                                            placeholder="Sélectionner Date"
                                            options={{
                                              dateFormat: "d M, Y",
                                            }}
                                            required
                                          />
                                        </>
                                      )}
                                      {d.data_type === "file" && (
                                        <>
                                          <Form.Label style={{ fontSize: '1rem', fontWeight: '600', fontFamily: 'system-ui', float: 'right', textAlign: 'end' }}>
                                            {d.fieldName}
                                          </Form.Label>
                                          <Form.Control
                                            type="file"
                                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                            onChange={(e) => handleFileChange(index, e)}
                                            required
                                          />
                                          {/* {formData.extra_data[index]?.value && (
                                            <div className="mt-1 text-success">
                                              Fichier sélectionné : {formData.extra_data[index].value}
                                            </div>
                                          )} */}

                                        </>
                                      )}
                                    </Form.Group>
                                  </Col>
                                </>
                                }

                              </Row>
                            </>
                          ))
                          }
                          {diversExtraDataExceptional?.length > 0 && selectedLangue === "arabic" && (
                            <>
                              <Row className="mt-2">
                                <Col lg={1}></Col>
                                <Col lg={3} style={{ fontSize: '1rem', fontWeight: '600', fontFamily: 'system-ui', textAlign: 'end' }}>تاريخ التحويرات الطارئة على الحالة العائلية و أسبابها</Col>
                                <Col lg={3} style={{ fontSize: '1rem', fontWeight: '600', fontFamily: 'system-ui', textAlign: 'end' }}>صفة من تجاوزت سنه 16 سنة</Col>
                                <Col lg={3} style={{ fontSize: '1rem', fontWeight: '600', fontFamily: 'system-ui', textAlign: 'end' }}>تواريخ الولادة</Col>
                                <Col lg={2} style={{ fontSize: '1rem', fontWeight: '600', fontFamily: 'system-ui', textAlign: 'end' }}>أسماء الأبناء</Col>
                              </Row>
                              {
                                selectedExceptional?.map((e: any, index: number) => (
                                  <>
                                    <Row className="mt-2">
                                      <Col lg={1} >
                                        <Button
                                          variant="danger"
                                          onClick={() => removeLine(index)}
                                        >
                                          <i className="bi bi-trash-fill"></i>
                                        </Button>
                                      </Col>
                                      <Col lg={3} style={{ fontSize: '1rem', fontWeight: '600', fontFamily: 'system-ui', textAlign: 'end' }}>
                                        <Form.Control
                                          type="text"
                                          value={e.dates_etats}
                                          onChange={(e) => { onChangeExtraExcept(index, e, 'dates_etats') }}

                                        />
                                      </Col>
                                      <Col lg={3} style={{ fontSize: '1rem', fontWeight: '600', fontFamily: 'system-ui', textAlign: 'end' }}>
                                        <Form.Control
                                          type="text"
                                          value={e.status_fils}
                                          onChange={(e) => { onChangeExtraExcept(index, e, 'status_fils') }}

                                        />
                                      </Col>
                                      <Col lg={3} style={{ fontSize: '1rem', fontWeight: '600', fontFamily: 'system-ui', textAlign: 'end' }}>

                                        <Flatpickr
                                          onChange={(e) => { handleDateChangeV2(index, e) }}
                                          className="form-control flatpickr-input"
                                          placeholder="Sélectionner Date"
                                          options={{
                                            dateFormat: "d M, Y",
                                          }}
                                          required
                                        />
                                      </Col>
                                      <Col lg={2} style={{ fontSize: '1rem', fontWeight: '600', fontFamily: 'system-ui', textAlign: 'end' }}>
                                        <Form.Control
                                          type="text"
                                          value={e.noms_enfants}
                                          onChange={(e) => { onChangeExtraExcept(index, e, 'noms_enfants') }}
                                          required
                                        />
                                      </Col>
                                    </Row>

                                  </>
                                ))
                              }
                              <Row>
                                <Col lg={1}></Col>
                                <Col lg={3}></Col>
                                <Col lg={3}></Col>
                                <Col lg={3}></Col>
                                <Col lg={2} style={{ textAlign: 'end' }}>
                                  <Button
                                    className="mt-4"
                                    variant="info"
                                    onClick={() => addLine()}
                                    disabled={selectedExceptional.length > 4}
                                  >
                                    <i className="bi bi-plus-lg"></i>
                                  </Button>
                                </Col>
                              </Row>
                            </>
                          )}
                        </>
                      )}
                      <Col lg={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nombre de copie</Form.Label>
                          <div className="d-flex flex-wrap align-items-start gap-2">
                            <div className="input-step step-primary">
                              <Button
                                className="minus"
                                onClick={() => {
                                  setFormData((prevState: any) => ({
                                    ...prevState,
                                    nombre_copie: Math.max(
                                      (prevState.nombre_copie ?? 1) - 1,
                                      1
                                    ),
                                  }));
                                }}
                              >
                                –
                              </Button>
                              <Form.Control
                                type="number"
                                className="product-quantity"
                                value={formData.nombre_copie ?? 1}
                                min="1"
                                max="100"
                                readOnly
                              />
                              <Button
                                className="plus"
                                onClick={() => {
                                  setFormData((prevState: any) => ({
                                    ...prevState,
                                    nombre_copie:
                                      (prevState.nombre_copie ?? 1) + 1,
                                  }));
                                }}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </Form.Group>
                      </Col>

                      <Row>
                        <Col lg={5}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              Ajouter une note ( facultatif)
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="description"
                              value={formData.description ?? ""}
                              onChange={onChange}
                            // required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <div className="text-end">
                        <Button
                          variant="secondary"
                          onClick={() =>
                            navigate(
                              "/demande-enseignant/liste-demande-enseignant"
                            )
                          }
                        >
                          Annuler
                        </Button>
                        <Button variant="primary" type="submit" className="m-2">
                          Envoyer
                        </Button>
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

export default AjouterDemandePersonnel;
