import React, { useState, useMemo, useCallback } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import CountUp from "react-countup";
import TableContainer from "Common/TableContainer";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
import { actionAuthorization } from "utils/pathVerification";
import {
  useFetchAvisEnseignantQuery,
  AvisEnseignant,
  useDeleteAvisEnseignantMutation,
} from "features/avisEnseignant/avisEnseignantSlice";
import Swal from "sweetalert2";
import { useFetchDeplacementQuery } from "features/deplacement/deplacementSlice";
import { useFetchVaribaleGlobaleQuery, VaribaleGlobale } from "features/variableGlobale/variableGlobaleSlice";



interface DataItem {
  [key: string]: any; // Dynamic object structure
}
type ImageField = "logo_etablissement" | "logo_universite" | "logo_republique" | "signature_secretaire" | "signature_directeur";


const ListeVariablesGlobales = () => {
  document.title = "Liste des variables globales| ENIGA";

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const { data: deplacements } = useFetchDeplacementQuery();
  const { data: Variables = []  } = useFetchVaribaleGlobaleQuery();
  console.log("variables",Variables)

  const { refetch } = useFetchAvisEnseignantQuery();
  const [deleteAvisEnseignant] = useDeleteAvisEnseignantMutation();
  const [modal_AddUserModals, setmodal_AddUserModals] =
    useState<boolean>(false);
  const [isMultiDeleteButton, setIsMultiDeleteButton] =
    useState<boolean>(false);
  
  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkAll") as HTMLInputElement;
    const ele = document.querySelectorAll(".userCheckBox");

    if (checkall.checked) {
      ele.forEach((ele: any) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele: any) => {
        ele.checked = false;
      });
    }
    checkedbox();
  }, []);
  const checkedbox = () => {
    const ele = document.querySelectorAll(".userCheckBox:checked");
    ele.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
  };

  const handleDeleteAvisEnseignant = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Vous ne pourrez pas revenir en arrière !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, supprimer !",
      });

      if (result.isConfirmed) {
        await deleteAvisEnseignant({ _id: id }).unwrap();
        Swal.fire("Supprimé !", "L'avis personnel a été supprimée.", "success");
        refetch(); // Recharger les données ou mettre à jour l'UI
      }
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'avis personnel :",
        error
      );
      Swal.fire(
        "Erreur !",
        "Un problème est survenu lors de la suppression de l'avis personnel.",
        "error"
      );
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<VaribaleGlobale | null>(null);

  const tog_standardd = (rowData:any) => {
    setSelectedRow(rowData);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);


  const columns = useMemo(
    () => [

      {
        Header: "Etablissement",
        accessor: "etablissement_fr",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Université",
        accessor: "universite_fr",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Directeur",
        accessor: "directeur_fr",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Secretaire",
        accessor: "secretaire_fr",
        disableFilters: true,
        filterable: true,
      },
  
     
      {
        Header: "Adresse",
        accessor: "address_fr",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "telephone",
        accessor: "phone",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Fax",
        accessor: "fax",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Site web",
        accessor: "website",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
           
                <li>
                  <Link
                    to="/#"
                    onClick={() => tog_standardd(cellProps)}
                    state={cellProps}
                    className="badge bg-info-subtle text-info view-item-btn"
                    data-bs-toggle="offcanvas"
                  >
                    <i
                      className="ph ph-eye"
                      style={{
                        transition: "transform 0.3s ease-in-out",
                        cursor: "pointer",
                        fontSize: "1.5em",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.4)")
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
    ],
    [checkedAll]
  );

  function tog_standard(): void {
    throw new Error("Function not implemented.");
  }
const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/variable/ajouter-variables-globales");
  };



  const imagePaths: Record<ImageField, string> = {
    logo_etablissement: "logoEtablissementFiles",
    logo_universite: "logoUniversiteFiles",
    logo_republique: "logoRepubliqueFiles",
    signature_secretaire: "signatureSecretaireFiles",
    signature_directeur: "signatureDirecteurFiles",
  };


  const modifications = useMemo(() => {
    return Variables.reduce<{ index: number; changes: Record<string, unknown> }[]>(
      (acc, current:any, index) => {
        if (index === 0) return acc; // Skip first entry
  
        const previous:any = Variables[index - 1];
        if (!previous || !current) return acc; // Safety check
  
        const changes: Record<string, unknown> = {};
  
        Object.keys(current).forEach((key) => {
          const previousValue = (previous as Record<string, unknown>)[key]; // Safely access previous value
          if (current[key] !== previousValue) {
            changes[key] = current[key]; // Store only changed values
          }
        });
  
        if (Object.keys(changes).length > 0) {
          acc.push({ index, changes }); // Ensure valid structure
        }
  
        return acc;
      },
      []
    );
  }, [Variables]);



  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Liste des variables globales" pageTitle="Variables globales" />
           

          <Row id="usersList">
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Row className="g-lg-2 g-4">
                    <Col lg={3}>
                      <div className="search-box">
                        <input
                          type="text"
                          className="form-control search"
                          placeholder="Chercher un avis..."
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>

                    {isMultiDeleteButton && (
                      <Button variant="danger" className="btn-icon">
                        <i className="ri-delete-bin-2-line"></i>
                      </Button>
                    )}
                     <Col sm={3} className="col-lg-auto ms-auto">
                                <Button
                                  onClick={handleNavigate}
                                  variant="primary"
                                  type="button"
                                  className="w-100 add-btn"
                                >
                                  Modifier
                                </Button>
                              </Col>
                  </Row>
                </Card.Body>
              </Card>
            
            </Col>
          </Row>
        </Container>
      </div>




{/* <div className="d-flex flex-column gap-3">
  {modifications.slice().reverse().map(({ index, changes }) => (
    <div key={index} className="card shadow-sm p-3 border border-warning">
      <h5 className="text-primary">🔄 Modification #{index}</h5>
      <table className="table table-bordered mt-2 table-hover">
        <thead className="table-light">
          <tr>
            <th>Champ</th>
            <th>Valeur précédente</th>
            <th>Nouvelle valeur</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(changes) .filter(([key]) => key !== "_id").map(([key, newValue]) => {
            const previousValue = (Variables[index - 1] as unknown as Record<string, unknown>)[key] ?? "N/A"; // Get previous value
            let previousImage = String(previousValue);
            let newImage = String(newValue);

            // Define the image fields and their paths
            const imagePaths: Record<string, string> = {
              logo_etablissement: "logoEtablissementFiles",
              logo_universite: "logoUniversiteFiles",
              logo_republique: "logoRepubliqueFiles",
              signature_secretaire: "signatureSecretaireFiles",
              signature_directeur: "signatureDirecteurFiles"
            };

            // Check if the field is an image field
            const isImageField = imagePaths.hasOwnProperty(key);

            return (
              <tr key={key}>
                <td className="fw-bold">{key}</td>
                <td className="text-muted">
                  {isImageField ? (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/${imagePaths[key]}/${previousImage}`}
                      alt={key}
                      style={{ width: '100px', height: 'auto' }}
                    />
                  ) : (
                    previousImage
                  )}
                </td>
                <td className="text-danger fw-bold">
                  {isImageField ? (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/${imagePaths[key]}/${newImage}`}
                      alt={key}
                      style={{ width: '100px', height: 'auto' }}
                    />
                  ) : (
                    newImage
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ))}
</div> */}

<div className="d-flex flex-column gap-3">
  {modifications.slice().reverse().map(({ index, changes }, i) => {
    // Get creation dates of the current and previous version
    const currentCreatedAt = Variables[index]?.createdAt
    ? new Date(Variables[index]?.createdAt || "").toLocaleString()
    : "N/A";
  
  const previousCreatedAt = Variables[index - 1]?.createdAt
    ? new Date(Variables[index - 1]?.createdAt || "").toLocaleString()
    : "N/A";
  

    return (
      <div key={index} className="card shadow-sm p-3 border border-warning">
        <h5 className="text-primary">
          {i === 0 ? "🆕 Dernière modification" : `🔄 Modification #${index}`}
          <span className="text-secondary ms-2">
            ({previousCreatedAt} ➝ {currentCreatedAt})
          </span>
        </h5>
        <table className="table table-bordered mt-2 table-hover">
          <thead className="table-light">
            <tr>
              <th>Champ</th>
              <th>Valeur précédente</th>
              <th>Nouvelle valeur</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(changes)
              .filter(([key]) => key !== "_id"&& key !== "createdAt" && key !== "updatedAt") // Exclude createdAt and updatedAt
              .map(([key, newValue]) => {
                const previousValue = (Variables[index - 1] as Record<string, unknown>)?.[key] ?? "N/A";
                let previousImage = String(previousValue);
                let newImage = String(newValue);

                // Define the image fields and their paths
                const imagePaths: Record<string, string> = {
                  logo_etablissement: "logoEtablissementFiles",
                  logo_universite: "logoUniversiteFiles",
                  logo_republique: "logoRepubliqueFiles",
                  signature_secretaire: "signatureSecretaireFiles",
                  signature_directeur: "signatureDirecteurFiles"
                };

                // Check if the field is an image field
                const isImageField = imagePaths.hasOwnProperty(key);

                return (
                  <tr key={key}>
                    <td className="fw-bold">{key}</td>
                    <td className="text-muted">
                      {isImageField ? (
                        <img
                          src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/${imagePaths[key]}/${previousImage}`}
                          alt={key}
                          style={{ width: "100px", height: "auto" }}
                        />
                      ) : (
                        previousImage
                      )}
                    </td>
                    <td className="text-danger fw-bold">
                      {isImageField ? (
                        <img
                          src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/${imagePaths[key]}/${newImage}`}
                          alt={key}
                          style={{ width: "100px", height: "auto" }}
                        />
                      ) : (
                        newImage
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  })}
</div>


{/* // otther display */}

{/* <table className="table table-bordered table-hover">
  <thead className="table-primary">
    <tr>
      <th>Champ</th>
      {Variables.map((_, index) => (
        <th key={index}>Version {index + 1}

        
        </th>
      ))}
    </tr>
  </thead>
  <tbody>
    {Object.keys(Variables[Variables.length - 1] || {})

    .filter((key) => !["_id", "createdAt", "updatedAt"].includes(key))
    .map((key:any) => (
      <tr key={key}>
        <td className="fw-bold text-uppercase">{key.replace(/_/g, " ")}</td>

        {Variables.map((current:any, index:any) => {
          const previous = Variables[index - 1];
          const isFirstRow = index === 0;
          const isLastRow = index === Variables.length - 1;

          let displayValue;

          if (isFirstRow || isLastRow) {
            
            displayValue = current[key] ?? "N/A";
          } else {
        
            const previousValue = previous?.[key] ?? "N/A";
            displayValue = current[key] !== previousValue ? current[key] : "";
          }

       
          const isImageField = ["logo_etablissement", "logo_universite", "logo_republique", "signature_secretaire", "signature_directeur"].includes(key);
          const imagePaths = {
            logo_etablissement: "logoEtablissementFiles",
            logo_universite: "logoUniversiteFiles",
            logo_republique: "logoRepubliqueFiles",
            signature_secretaire: "signatureSecretaireFiles",
            signature_directeur: "signatureDirecteurFiles",
          };

          return (
            <td key={index} className={index > 0 && displayValue ? "text-danger fw-bold" : "text-muted"}>
              {isImageField && displayValue ? (
                <img
                src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/${imagePaths[key as ImageField]}/${displayValue}`}
                alt={key}
                  style={{ width: "80px", height: "auto" }}
                />
              ) : (
                displayValue || "-"
              )}
            </td>
          );
        })}
      </tr>
    ))}
  </tbody>
</table> */}

    
      {/* Modal for Viewing Row Details */}
      <Modal  size="xl" show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Variable Globale</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRow && (
            <div>
             <div className="container">
      <div className="row">
        {/* French Column */}
        <div className="col-md-6">
          <h5 className="text-primary mb-3">Informations en Français</h5>
          <table className="table table-bordered">
            <tbody>
              <tr><td><strong>Établissement</strong></td><td>{selectedRow.etablissement_fr}</td></tr>
              <tr><td><strong>Université</strong></td><td>{selectedRow.universite_fr}</td></tr>
              <tr><td><strong>Directeur</strong></td><td>{selectedRow.directeur_fr}</td></tr>
              <tr><td><strong>Secrétaire général</strong></td><td>{selectedRow.secretaire_fr}</td></tr>
              <tr><td><strong>Gouvernorat</strong></td><td>{selectedRow.gouvernorat_fr}</td></tr>
              <tr><td><strong>Adresse</strong></td><td>{selectedRow.address_fr}</td></tr>
              <tr><td><strong>Code Postal</strong></td><td>{selectedRow.code_postal}</td></tr>
              <tr><td><strong>Téléphone</strong></td><td>{selectedRow.phone}</td></tr>
              <tr><td><strong>Fax</strong></td><td>{selectedRow.fax}</td></tr>
              <tr><td><strong>Site Web</strong></td><td><a href={selectedRow.website} target="_blank" rel="noopener noreferrer">{selectedRow.website}</a></td></tr>
            </tbody>
          </table>
        </div>

        {/* Arabic Column */}
        <div className="col-md-6 text-end">
          <h5 className="text-success mb-3">المعلومات بالعربية</h5>
          <table className="table table-bordered">
            <tbody>
              <tr><td>{selectedRow.etablissement_ar}</td><td><strong>المؤسسة</strong></td></tr>
              <tr><td>{selectedRow.universite_ar}</td><td><strong>الجامعة</strong></td></tr>
              <tr><td>{selectedRow.directeur_ar}</td><td><strong>المدير</strong></td></tr>
              <tr><td>{selectedRow.secretaire_ar}</td><td><strong>الكاتب العام</strong></td></tr>
              <tr><td>{selectedRow.gouvernorat_ar}</td><td><strong>الولاية</strong></td></tr>
              <tr><td>{selectedRow.address_ar}</td><td><strong>العنوان</strong></td></tr>
              <tr><td>{selectedRow.code_postal}</td><td><strong>الرمز البريدي</strong></td></tr>
              <tr><td>{selectedRow.phone}</td><td><strong>الهاتف</strong></td></tr>
              <tr><td>{selectedRow.fax}</td><td><strong>الفاكس</strong></td></tr>
              <tr><td><a href={selectedRow.website} target="_blank" rel="noopener noreferrer">{selectedRow.website}</a></td><td><strong>الموقع الإلكتروني</strong></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

<div className="d-flex justify-content-around align-items-center text-center">
  {/* Logo Etablissement */}
  <div>
    <img
      src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoEtablissementFiles/${selectedRow.logo_etablissement}`}
      alt="logo_etablissement-img"
      id="logo_etablissement"
      className="avatar-lg d-block mx-auto"
    />
    <p className="mt-2 fw-bold">Logo Établissement</p>
  </div>

  {/* Logo Université */}
  <div>
    <img
      src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoUniversiteFiles/${selectedRow.logo_universite}`}
      alt="logo_universite-img"
      id="logo_universite"
      className="avatar-lg d-block mx-auto"
    />
    <p className="mt-2 fw-bold">Logo Université</p>
  </div>

  {/* Logo République */}
  <div>
    <img
      src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoRepubliqueFiles/${selectedRow.logo_republique}`}
      alt="logo_republique-img"
      id="logo_republique"
      className="avatar-lg d-block mx-auto"
    />
    <p className="mt-2 fw-bold">Logo République</p>
  </div>
</div>



            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    
    </React.Fragment>
  );
};

export default ListeVariablesGlobales;
