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
  useDeleteClasseMutation,
  useFetchClassesQuery,
} from "features/classe/classe";
import {
  useFetchEtudiantsQuery,
  useUpdateGroupeClasseMutation,
} from "features/etudiant/etudiantSlice";

const ListClasses = () => {
  document.title = "Liste des classes | Smart University";
  const navigate = useNavigate();
  const [modal_AffecterEtudiant, setModal_AffecterEtudiant] =
    useState<boolean>(false);
  const [modal_AddParametreModals, setmodal_AddParametreModals] =
    useState<boolean>(false);
  function tog_AddParametreModals() {
    setmodal_AddParametreModals(!modal_AddParametreModals);
  }
  function tog_AddClasse() {
    navigate("/departement/gestion-classes/add-classe");
  }
  const tog_AffecterEtudiant = () => {
    setModal_AffecterEtudiant(!modal_AffecterEtudiant);
  };
  const { data = [] } = useFetchClassesQuery();
  const { data: AllEtudiants = [] } = useFetchEtudiantsQuery();
  const [updateGroupeClasse, { isLoading, isSuccess, error }] =
    useUpdateGroupeClasseMutation();

  const [cinList, setCinList] = useState<string[]>([]);
  const [textareaValue, setTextareaValue] = useState("");

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // Validate CIN input (must be 8 digits)
      const cin = textareaValue.trim();
      if (/^\d{8}$/.test(cin)) {
        setCinList((prev) => [...prev, cin]);
        setTextareaValue(""); // Clear textarea after valid input
      } else {
        alert("Le CIN doit contenir exactement 8 chiffres !");
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

  const columns = useMemo(
    () => [
      {
        Header: (
          <div className="form-check">
            {" "}
            <input
              className="form-check-input"
              type="checkbox"
              id="checkAll"
              value="option"
            />{" "}
          </div>
        ),
        Cell: (cellProps: any) => {
          return (
            <div className="form-check">
              {" "}
              <input
                className="form-check-input"
                type="checkbox"
                name="chk_child"
                defaultValue="option1"
              />{" "}
            </div>
          );
        },
        id: "#",
      },
      {
        Header: "Nom Classe (FR)",
        accessor: "nom_classe_fr",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Departement",
        accessor: (row: any) => row.departement?.name_fr || "",
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
        Header: "Section",
        accessor: (row: any) =>
          row.niveau_classe?.sections[0]?.abreviation! || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Affectater Matières",
        disableFilters: true,
        filterable: true,
        accessor: (classe: Classe) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to="/gestion-departement/classes/affecter-matiere"
                  className="badge bg-success-subtle text-success remove-item-btn"
                  state={classe}
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
        Header: "Affectater Etudiants",
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
                    className="ri-reply-all-line"
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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Gestion des départements"
            pageTitle="Liste des classes"
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
                      <Button variant="success" id="add-btn" type="submit">
                        Affecter
                      </Button>
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
                        className="form-control"
                        id="exampleFormControlTextarea5"
                        rows={3}
                        value={textareaValue}
                        onChange={(e) => setTextareaValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                      ></textarea>
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
                      <Button
                        variant="success"
                        id="add-btn"
                        type="button"
                        onClick={handleAffecter}
                        disabled={isLoading}
                      >
                        {isLoading ? "Affectation en cours..." : "Affecter"}
                      </Button>
                    </div>
                  </div>
                </Form>
              )}
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ListClasses;
