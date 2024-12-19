import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import TableContainer from "Common/TableContainer";
import Swal from "sweetalert2";
import { TypeInscriptionEtudiant,  useDeleteTypeInscriptionEtudiantMutation, useFetchTypeInscriptionsEtudiantQuery } from "features/typeInscriptionEtudiant/typeInscriptionEtudiant";
import { PapierAdministratif, useDeletePapierAdministratifMutation, useFetchPapierAdministratifQuery } from "features/papierAdministratif/papierAdministratif";


const ListePapierAdministratifs = () => {
  document.title =
    "Liste papier administratifs | Smart University";

  const navigate = useNavigate();

  const [modal_AddParametreModals, setmodal_AddParametreModals] =
    useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value.toLowerCase());
    };
  function tog_AddParametreModals() {
    setmodal_AddParametreModals(!modal_AddParametreModals);
  }

  function tog_AddPapierAdministratif() {
    navigate("/ajoutPapierAdministratif");
  }
  const { data = [] } = useFetchPapierAdministratifQuery();
  console.log(data)
  const [deletePapierAdministratif] = useDeletePapierAdministratifMutation();

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  const AlertDelete = async (_id: string) => {
    const result = await swalWithBootstrapButtons.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimez-le!",
      cancelButtonText: "Non, annuler!",
      reverseButtons: true,
    });
  
    if (result.isConfirmed) {
      try {
        await deletePapierAdministratif(_id).unwrap();
        swalWithBootstrapButtons.fire(
          "Supprimé!",
          "Papier Administratif a été supprimé.",
          "success"
        );
      } catch (error) {
        console.error("Failed to delete Papier Administratif:", error);
        swalWithBootstrapButtons.fire(
          "Erreur",
          "Une erreur est survenue lors de la suppression.",
          "error"
        );
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire(
        "Annulé",
        "Papier Administratif est en sécurité :)",
        "error"
      );
    }
  };
  

  // const flattenData = (data: any[]) => {
  //   return data.flatMap(item =>
  //     item.files_papier_administratif.map((file: any) => ({
  //       nom_ar: file.nom_ar,
  //       nom_fr: file.nom_fr,
  //       category: file.category
  //     }))
  //   );
  // };
  
  // // Assuming `data` is the initial array
  // const flattenedData = flattenData(data);
  
  

  const columns = useMemo(
    () => [
      {
        Header: "Nom (AR)",
        accessor: "nom_ar",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Nom (FR)",
        accessor: "nom_fr",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Category",
        accessor: (row: any) => {
          console.log("Row Data:", row);
          if (row.category) {
            return row.category.join(", ");
          } else {
            return "No category data";
          }
        },
        disableFilters: true,
        filterable: true,
      },
    
      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (papierAdministratif: PapierAdministratif) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to="/editPapierAdministratif"
                  state={papierAdministratif}
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
                    onClick={() => AlertDelete(papierAdministratif?._id!)}
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
  
  // Use `flattenedData` as the data source for your table
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Papier Administratifs" pageTitle="Liste des papiers administratifs" />
         
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
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col> 
                    <Col className="col-lg-auto ms-auto">
                      <div className="hstack gap-2">
                        <Button
                          variant="primary"
                          className="add-btn"
                          onClick={() => tog_AddPapierAdministratif()}
                        >
                          Ajouter papier administratif
                        </Button>
                      
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="p-0">
                  {/* <div className="table-responsive table-card mb-1"> */}
                  <table
                    className="table align-middle table-nowrap"
                    id="customerTable"
                  >
                     <TableContainer
                columns={(columns || [])}
                data={(data || [])}
                // isGlobalFilter={false}
                iscustomPageSize={false}
                isBordered={false}
                customPageSize={10}
                className="custom-header-css table align-middle table-nowrap"
                tableClass="table-centered align-middle table-nowrap mb-0"
                theadClass="text-muted table-light"
                SearchPlaceholder='Search Products...'
            />
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
                  {/* </div> */}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ListePapierAdministratifs;