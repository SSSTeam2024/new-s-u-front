import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  ListGroup,
  InputGroup,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import TableContainer from "Common/TableContainer";
import {
  Classe,
  useAssignParcoursToClasseMutation,
  useDeleteClasseMutation,
  useFetchClassesQuery,
} from "features/classe/classe";
import {
  useFetchEtudiantsQuery,
  useUpdateGroupeClasseMutation,
} from "features/etudiant/etudiantSlice";
import { useFetchAllCycleQuery } from "features/cycle/cycle";
import {
  useFetchParcoursQuery,
  useGetSemestreByIdParcoursMutation,
} from "features/parcours/parcours";

const ListClasses = () => {
  document.title = "Liste des groupes | ENIGA";
  const navigate = useNavigate();
  const [modal_AffecterEtudiant, setModal_AffecterEtudiant] =
    useState<boolean>(false);
  const [modal_AddParametreModals, setmodal_AddParametreModals] =
    useState<boolean>(false);
  function tog_AddParametreModals() {
    setmodal_AddParametreModals(!modal_AddParametreModals);
  }
  function tog_AddClasse() {
    navigate("/departement/gestion-classes/ajouter-classe");
  }
  const tog_AffecterEtudiant = () => {
    setModal_AffecterEtudiant(!modal_AffecterEtudiant);
  };
  const { data = [] } = useFetchClassesQuery();
  console.log("data classe", data);
  const { data: AllEtudiants = [] } = useFetchEtudiantsQuery();

  const [updateGroupeClasse, { isLoading, isSuccess }] =
    useUpdateGroupeClasseMutation();

  const [cinList, setCinList] = useState<string[]>([]);
  const [textareaValue, setTextareaValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const cinInputs = textareaValue
        .split(/[\s,]+/)
        .map((cin) => cin.trim())
        .filter((cin) => cin);

      const invalidCINs = cinInputs.filter((cin) => !/^\d{8}$/.test(cin));
      const validCINs = cinInputs.filter((cin) => /^\d{8}$/.test(cin));

      if (invalidCINs.length > 0) {
        setError(
          `Les CINs suivants sont invalides : ${invalidCINs.join(", ")}`
        );
        setTextareaValue("");

        // Automatically remove the error message after 6 seconds
        setTimeout(() => {
          setError(null);
        }, 6000); // 6000ms = 6 seconds
      } else {
        setError(null);
        setCinList((prev) => [...prev, ...validCINs]);
        setTextareaValue("");
      }
    }
  };

  const location = useLocation();
  const affectState = location.state;

  const handleAffecter = async () => {
    const studentIds = cinList
      .map((cin) => {
        const student = AllEtudiants.find(
          (etudiant) => etudiant.num_CIN === cin
        );
        return student ? student._id : null;
      })
      .filter((id): id is string => id !== null && id !== undefined);

    if (studentIds.length === 0) {
      alert("Aucun étudiant correspondant trouvé pour les CINs fournis !");
      return;
    }

    try {
      const response = await updateGroupeClasse({
        studentIds,
        groupeClasseId: affectState?._id! as string,
      }).unwrap();

      if (response.message) {
        alert("Les étudiants ont été affectés avec succès !");
        setCinList([]);
      }
    } catch (error) {
      console.error("Erreur lors de l'affectation :", error);
      alert("Une erreur est survenue lors de l'affectation.");
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("Par Nom");

  const handleRadioChange = (event: any) => {
    setSelectedOption(event.target.value);
  };
  const [selectedEtudiants, setSelectedEtudiants] = useState<string[]>([]);

  const filteredEtudiants = AllEtudiants.filter(
    (etudiant: any) =>
      (etudiant.nom_fr?.toLowerCase() ?? "").includes(
        searchTerm.toLowerCase()
      ) ||
      (etudiant.prenom_fr?.toLowerCase() ?? "").includes(
        searchTerm.toLowerCase()
      ) ||
      (etudiant.nom_ar ?? "").includes(searchTerm) ||
      (etudiant.prenom_ar ?? "").includes(searchTerm) ||
      (etudiant.num_CIN ?? "").includes(searchTerm) ||
      (etudiant.email ?? "").includes(searchTerm)
  );

  const handleCheckboxToggle = (id: string) => {
    setSelectedEtudiants((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((etudiantId) => etudiantId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await updateGroupeClasse({
        studentIds: selectedEtudiants,
        groupeClasseId: affectState?._id!,
      }).unwrap();
    } catch (err) {
      console.error("Error updating groupe_classe:", err);
    }
  };

  const [deleteClasse] = useDeleteClasseMutation();
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  const AlertDelete = async (_id: string) => {
    swalWithBootstrapButtons
      .fire({
        title: "Êtes-vous sûr?",
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimez-le!",
        cancelButtonText: "Non, annuler!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteClasse(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Classe a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Classe est en sécurité :)",
            "error"
          );
        }
      });
  };
  const [selectedParcours, setSelectedParcours] = useState<string | null>(null);
  const [selectedSemesters, setSelectedSemesters] = useState<string[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);
  const [selectedClasse, setSelectedClasse] = useState<Classe>();
  const { data: AllParcours = [] } = useFetchParcoursQuery();
  const [assignParcours] = useAssignParcoursToClasseMutation();
  const [getSemestreByIdParcours] = useGetSemestreByIdParcoursMutation();
  const [modal_AddOrderModals, setmodal_AddOrderModals] =
    useState<boolean>(false);
  function tog_AddOrderModals() {
    setmodal_AddOrderModals(!modal_AddOrderModals);
  }
  const [isAssignParcoursModalOpen, setIsAssignParccoursModalOpen] =
    useState(false);

  const handleGetSemestreByParcoursId = async (
    id: string
  ): Promise<string[]> => {
    try {
      const data = await getSemestreByIdParcours(id).unwrap();
      return data; // ✅ Return the fetched data (string[])
    } catch (error) {
      console.error("Error fetching semestres:", error);
      return []; // ✅ Return an empty array in case of error
    }
  };

  // const handleParcoursChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedParcours(e.target.value);
  //   setSemesters(handleGetSemestreByParcoursId(e.target.value));
  // };

  // const handleParcoursChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selectedId = e.target.value;
  //   setSelectedParcours(selectedId);

  //   handleGetSemestreByParcoursId(selectedId)
  //     .then((semestersData) => setSemesters(semestersData)) // ✅ Now this works
  //     .catch((error) => console.error("Error fetching semestres:", error));
  // };
  const handleParcoursChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedParcours(selectedId);

    handleGetSemestreByParcoursId(selectedId)
      .then((semestersData) => {
        console.log("Fetched semesters:", semestersData); // Debugging log

        if (!Array.isArray(semestersData)) {
          console.error("Invalid data format:", semestersData);
          return;
        }

        // Ensure each semester has an `_id`
        const uniqueSemesters = Array.from(
          new Map(
            semestersData.map((s: any) => [
              s && typeof s === "object" ? s._id : s,
              s,
            ])
          ).values()
        );

        setSemesters(uniqueSemesters);
      })
      .catch((error) => console.error("Error fetching semestres:", error));
  };

  console.log(semesters);
  const handleSemesterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedSemesters((prev) =>
      checked ? [...prev, value] : prev.filter((s) => s !== value)
    );
  };

  const classeId = selectedClasse?._id;

  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [offcanvasTitle, setOffcanvasTitle] = useState("");
  const [offcanvasData, setOffcanvasData] = useState<string[]>([]);

  const handleShowOffcanvas = (title: string, data: any[]) => {
    setOffcanvasTitle(title);
    setOffcanvasData(
      data.map((item) => item.parcours.modules[0].matiere[0].matiere)
    );
    setShowOffcanvas(true);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Nom Classe (FR)",
        accessor: "nom_classe_fr",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Niveau",
        accessor: (row: any) => row.niveau_classe?.abreviation || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Spécialité",
        accessor: (row: any) =>
          row.niveau_classe?.abreviation ||
          row.sections
            ?.map((section: any) => section.abreviation)
            .filter(Boolean)
            .join(", ") ||
          "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Groupe",
        accessor: (row: any) => (row.groupe_number ? row.groupe_number : "-"),
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Cycle",
        accessor: (row: any) => row.niveau_classe?.cycles[0]?.cycle_fr! || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Département",
        accessor: (row: any) => row.departement?.name_fr || "",
        disableFilters: true,
        filterable: true,

      },

      {
        Header: "Parcours",
        accessor: (row: any) =>
          row.parcours?.nom_parcours
            ? row.parcours.nom_parcours
            : "Aucun parcours assigné",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Semestres",
        accessor: (row: any) =>
          row?.semestres && row.semestres.length > 0
            ? row.semestres.join(", ")
            : "Aucun semestre assigné",
        disableFilters: true,
        filterable: true,
      },

      // {
      //   Header: "Matieres",
      //   accessor: (row: any) =>
      //     row?.parcours?.modules[0]?.matiere[0]?.matiere?.length!,
      //   disableFilters: true,
      //   filterable: true,
      // },
      {
        Header: "Affecter Parcours",
        disableFilters: true,
        filterable: true,
        accessor: (classe: Classe) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to=""
                  className="badge bg-success-subtle text-success remove-item-btn"
                  state={classe}
                  onClick={() => {
                    setSelectedClasse(classe); // Store selected class
                    tog_AddOrderModals(); // Open modal
                  }}
                >
                  <i
                    className="ph ph-file-plus"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
      {
        Header: "Affecter Etudiants",
        disableFilters: true,
        filterable: true,
        accessor: (classe: Classe) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  //to="/gestion-departement/classes/affecter-etudiants"
                  to="#"
                  className="badge bg-info-subtle text-primary remove-item-btn"
                  state={classe}
                  onClick={tog_AffecterEtudiant}
                >
                  <i
                    className="ph ph-users-four"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (classe: Classe) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to="/departement/gestion-departements/classes/edit-classe"
                  state={classe}
                  className="badge bg-primary-subtle text-primary edit-item-btn"
                >
                  <i
                    className="ph ph-pencil-line"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="badge bg-danger-subtle text-danger remove-item-btn"
                >
                  <i
                    className="ph ph-trash"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    onClick={() => AlertDelete(classe?._id!)}
                  ></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    []
  );
  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Parcours a été assigné avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const onSubmitParcours = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedParcours || selectedSemesters.length === 0) {
      alert("Veuillez sélectionner un parcours et au moins un semestre.");
      return;
    }

    if (!classeId) {
      alert("Classe ID not found!");
      return;
    }
    try {
      await assignParcours({
        _id: classeId,
        parcoursIds: [selectedParcours],
        semestres: selectedSemesters,
      }).unwrap();
      setSelectedParcours("");
      setSelectedSemesters([]);
      setSemesters([]);
      notify();
      setIsAssignParccoursModalOpen(false);
    } catch (error: any) {
      console.error("API Error:", error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Gestion des groupes"
            pageTitle="Liste des groupes"
          />

          <Row id="sellersList">
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Row className="g-3">
                    <Col lg={3}>
                      <div className="search-box">
                        <input
                          type="text"
                          className="form-control search"
                          placeholder="Chercher..."
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>
                    <Col className="col-lg-auto">
                      <select
                        className="form-select"
                        id="idStatus"
                        name="choices-single-default"
                      >
                        <option defaultValue="All">Status</option>
                        <option value="All">tous</option>
                        <option value="Active">Activé</option>
                        <option value="Inactive">Desactivé</option>
                      </select>
                    </Col>

                    <Col className="col-lg-auto ms-auto">
                      <div className="hstack gap-2">
                        <Button
                          variant="primary"
                          className="add-btn"
                          onClick={() => tog_AddClasse()}
                        >
                          Ajouter classe
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Modal
                className="fade modal-fullscreen"
                show={modal_AddParametreModals}
                onHide={() => {
                  tog_AddParametreModals();
                }}
                centered
              >
                <Modal.Header className="px-4 pt-4" closeButton>
                  <h5 className="modal-title" id="exampleModalLabel">
                    Ajouter une classe
                  </h5>
                </Modal.Header>
                <Form className="tablelist-form">
                  <Modal.Body className="p-4">
                    <div
                      id="alert-error-msg"
                      className="d-none alert alert-danger py-2"
                    ></div>
                    <input type="hidden" id="id-field" />

                    <div className="mb-3">
                      <Form.Label htmlFor="item-stock-field">
                        Nom Classe (AR)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="item-stock-field"
                        placeholder=""
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <Form.Label htmlFor="item-stock-field">
                        Nom Classe (FR)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="item-stock-field"
                        placeholder=""
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <Form.Label htmlFor="item-stock-field">
                        Abréviation
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="item-stock-field"
                        placeholder=""
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <Form.Label htmlFor="civilStatus">Niveau</Form.Label>
                      <select
                        className="form-select text-muted"
                        name="civilStatus"
                        id="civilStatus"
                      >
                        <option value="">Saisir niveau</option>
                        <option value="Etudiant">
                          1ere Licence Informatique
                        </option>
                        <option value="Enseignant">
                          2éme Licence Informatique
                        </option>
                        <option value="Personnel">
                          3éme Licence Informatique
                        </option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <Form.Label htmlFor="civilStatus">Section</Form.Label>
                      <select
                        className="form-select text-muted"
                        name="civilStatus"
                        id="civilStatus"
                      >
                        <option value="">Saisir section</option>
                        <option value="Etudiant">Informqtiaue</option>
                        <option value="Enseignant">Mathématiaue</option>
                        <option value="Personnel">Mécanique</option>
                      </select>
                    </div>
                  </Modal.Body>
                  <div className="modal-footer">
                    <div className="hstack gap-2 justify-content-end">
                      <Button
                        className="btn-ghost-danger"
                        onClick={() => {
                          tog_AddParametreModals();
                        }}
                      >
                        Fermer
                      </Button>
                      <Button variant="success" id="add-btn">
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </Form>
              </Modal>
              <Card>
                <Card.Body className="p-0">
                  <table
                    className="table align-middle table-nowrap"
                    id="customerTable"
                  >
                    <React.Fragment>
                      <TableContainer
                        columns={columns || []}
                        data={data || []}
                        iscustomPageSize={false}
                        isBordered={false}
                        isPagination={true}
                        customPageSize={10}
                        className="custom-header-css table align-middle table-nowrap"
                        tableClass="table-centered align-middle table-nowrap mb-0"
                        theadClass="text-muted table-light"
                        SearchPlaceholder="Search Products..."
                      />
                    </React.Fragment>
                  </table>
                  <div className="noresult" style={{ display: "none" }}>
                    <div className="text-center py-4">
                      <div className="avatar-md mx-auto mb-4">
                        <div className="avatar-title bg-primary-subtle text-primary rounded-circle fs-24">
                          <i className="bi bi-search"></i>
                        </div>
                      </div>
                      <h5 className="mt-2">Sorry! No Result Found</h5>
                      <p className="text-muted mb-0">
                        We've searched more than 150+ seller We did not find any
                        seller for you search.
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Modal
            className="fade modal-fullscreen"
            show={modal_AffecterEtudiant}
            onHide={() => {
              tog_AffecterEtudiant();
            }}
            centered
          >
            <Modal.Header className="px-4 pt-4" closeButton>
              <h5 className="modal-title" id="exampleModalLabel">
                Affecter des etudiants
              </h5>
            </Modal.Header>

            <Modal.Body className="p-4">
              <div className="d-flex justify-content-center hstack gap-5 mb-2">
                <div className="form-check justify-content-center">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                    value="Par Nom"
                    checked={selectedOption === "Par Nom"}
                    onChange={handleRadioChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexRadioDefault1"
                  >
                    Par Nom
                  </label>
                </div>
                <div className="form-check justify-content-center">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault2"
                    value="Par C.I.N"
                    checked={selectedOption === "Par C.I.N"}
                    onChange={handleRadioChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexRadioDefault2"
                  >
                    Par C.I.N
                  </label>
                </div>
              </div>
              {selectedOption === "Par Nom" && (
                <Form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <Form.Label htmlFor="etudiant-search">Étudiant</Form.Label>
                    <Form.Control
                      type="text"
                      id="etudiant-search"
                      placeholder="Rechercher un étudiant..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {searchTerm && (
                    <ListGroup className="mt-2">
                      {filteredEtudiants.map((etudiant: any) => (
                        <ListGroup.Item key={etudiant._id}>
                          <div className="hstack gap-3">
                            <InputGroup.Checkbox
                              checked={selectedEtudiants.includes(etudiant._id)}
                              onChange={() =>
                                handleCheckboxToggle(etudiant._id)
                              }
                            />
                            <span>
                              {etudiant.nom_fr} {etudiant.prenom_fr}
                            </span>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                  <div className="modal-footer mt-3">
                    <div className="hstack gap-2 justify-content-end">
                      <Button
                        className="btn-ghost-danger"
                        onClick={() => {
                          tog_AffecterEtudiant();
                        }}
                      >
                        Fermer
                      </Button>
                      {selectedEtudiants.length !== 0 ? (
                        <Button variant="success" id="add-btn" type="submit">
                          Affecter
                        </Button>
                      ) : (
                        <Button
                          variant="dark"
                          id="add-btn"
                          type="submit"
                          disabled
                        >
                          Affecter
                        </Button>
                      )}
                    </div>
                  </div>
                </Form>
              )}
              {selectedOption === "Par C.I.N" && (
                <Form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <div>
                      <label
                        htmlFor="exampleFormControlTextarea5"
                        className="form-label"
                      >
                        C.I.N
                      </label>
                      <textarea
                        value={textareaValue}
                        className="form-control"
                        onChange={(e) => setTextareaValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{
                          borderColor: error ? "red" : "initial",
                          outline: error ? "red solid 1px" : "initial",
                        }}
                        placeholder="Entrez les CINs séparés par des espaces, des tabulations, des nouvelles lignes ou des virgules"
                      ></textarea>
                      {error && <p style={{ color: "red" }}>{error}</p>}
                    </div>
                    <div className="mt-2">
                      <strong>CINs ajoutés :</strong>
                      <ul>
                        {cinList.map((cin, index) => (
                          <li key={index}>{cin}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="modal-footer mt-3">
                    <div className="hstack gap-2 justify-content-end">
                      <Button
                        className="btn-ghost-danger"
                        onClick={() => {
                          tog_AffecterEtudiant();
                          setTextareaValue("");
                          setCinList([]);
                        }}
                      >
                        Fermer
                      </Button>
                      {cinList.length !== 0 ? (
                        <Button
                          variant="success"
                          id="add-btn"
                          type="button"
                          onClick={handleAffecter}
                          disabled={isLoading}
                        >
                          {isLoading ? "Affectation en cours..." : "Affecter"}
                        </Button>
                      ) : (
                        <Button
                          variant="dark"
                          id="add-btn"
                          type="button"
                          disabled
                        >
                          Affecter
                        </Button>
                      )}
                    </div>
                  </div>
                </Form>
              )}
            </Modal.Body>
          </Modal>

          <Modal
            show={modal_AddOrderModals}
            onHide={() => setmodal_AddOrderModals(false)}
            centered
          >
            <Modal.Header className="px-4 pt-4" closeButton>
              <h5 className="modal-title" id="exampleModalLabel">
                Affecter Parcours Pour Groupe {selectedClasse?.nom_classe_fr!}
              </h5>
            </Modal.Header>
            <Form className="tablelist-form" onSubmit={onSubmitParcours}>
              <Modal.Body className="p-4">
                {/* Select Parcours */}
                <Form.Group className="mb-3">
                  <Form.Label>Sélectionnez un Parcours</Form.Label>
                  <Form.Select
                    value={selectedParcours || ""}
                    onChange={handleParcoursChange}
                  >
                    <option value="">-- Choisir un Parcours --</option>
                    {AllParcours.map((parcours) => (
                      <option key={parcours._id} value={parcours._id}>
                        {parcours.nom_parcours}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Select Semesters */}
                <Form.Group className="mb-3">
                  <Form.Label>Sélectionnez les Semestres</Form.Label>
                  <div>
                    {semesters.map((semestre) => (
                      <Form.Check
                        key={semestre}
                        type="checkbox"
                        label={semestre}
                        value={semestre}
                        checked={selectedSemesters.includes(semestre)}
                        onChange={handleSemesterChange}
                      />
                    ))}
                  </div>
                </Form.Group>
              </Modal.Body>

              <div className="modal-footer">
                <div className="hstack gap-2 justify-content-end">
                  <Button
                    className="btn-ghost-danger"
                    onClick={() => setmodal_AddOrderModals(false)}
                  >
                    Fermer
                  </Button>
                  <Button
                    variant="success"
                    id="add-btn"
                    type="submit"
                    onClick={tog_AddOrderModals}
                    disabled={
                      !selectedParcours || selectedSemesters.length === 0
                    }
                  >
                    Ajouter
                  </Button>
                </div>
              </div>
            </Form>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ListClasses;
