import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Carousel,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import {
  useFetchActualiteQuery,
  Actualite,
  useDeleteActualiteMutation
} from "features/actualite/actualiteSlice";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
import actualite from "assets/images/actualite.jpg";
import DOMPurify from 'dompurify';
import Swal from 'sweetalert2';

const ListeActualite = () => {
  document.title = "Actualité | Smart University";
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const {
    data: actualiteResponse,
    error,
    isLoading,
  } = useFetchActualiteQuery();
  const actualiteData = (actualiteResponse as unknown as Actualite[]) || [];
  const [deleteActualite] = useDeleteActualiteMutation();
  const { refetch } = useFetchActualiteQuery();

  // Pagination
  const [pagination, setPagination] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentpages, setCurrentpages] = useState<Actualite[]>([]);
  const perPageData = 8;

  // State for category filter
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filter data based on selected category
  const filteredData = useMemo(() => {
    if (selectedCategory === "all") {
      return actualiteData;
    } else {
      return actualiteData.filter((data: Actualite) => data.category === selectedCategory);
    }
  }, [actualiteData, selectedCategory]);

  const handleClick = (e: any) => {
    setCurrentPage(Number(e.target.id));
  };

  const indexOfLast = currentPage * perPageData;
  const indexOfFirst = indexOfLast - perPageData;

  const currentdata = useMemo(
    () => filteredData.slice(indexOfFirst, indexOfLast),
    [filteredData, indexOfFirst, indexOfLast]
  );

  useEffect(() => {
    setCurrentpages(currentdata);
  }, [currentPage, currentdata]);

  const searchTeamMember = (ele: any) => {
    let search = ele.target.value;
    if (search && filteredData) {
      search = search.toLowerCase();
      setCurrentpages(
        filteredData.filter(
          (data: Actualite) => data.title.toLowerCase().includes(search)
        )
      );
      setPagination(false);
    } else {
      setCurrentpages(currentdata);
      setPagination(true);
    }
  };

  const pageNumbers: any = [];
  if (filteredData) {
    for (let i = 1; i <= Math.ceil(filteredData.length / perPageData); i++) {
      pageNumbers.push(i);
    }
  }

  const handleprevPage = () => {
    let prevPage = currentPage - 1;
    setCurrentPage(prevPage);
  };

  const handlenextPage = () => {
    let nextPage = currentPage + 1;
    setCurrentPage(nextPage);
  };

  useEffect(() => {
    if (pageNumbers.length && pageNumbers.length < currentPage) {
      setCurrentPage(pageNumbers.length);
    }
  }, [currentPage, pageNumbers.length]);

  const tog_AddSellerModals = () => {
    navigate("/actualite/ajouter-actualite");
  };

  const handleDeleteActualite = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: "Vous ne pourrez pas revenir en arrière !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, supprimer !'
      });

      if (result.isConfirmed) {
        await deleteActualite({ _id: id }).unwrap();
        Swal.fire('Supprimé !', 'L\'actualité a été supprimée.', 'success');
        refetch(); // Recharger les données ou mettre à jour l'UI
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'actualité :", error);
      Swal.fire('Erreur !', 'Un problème est survenu lors de la suppression de l\'actualité.', 'error');
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when changing category
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Liste des actualités" pageTitle="Actualités" />
          <Row className="mb-4">
            <Col xxl={12}>
              <Card className="text-center bg-primary border-0 mb-0">
                <Card.Body className="p-5">
                  <h4 className="text-white">
                    Rechercher les nouvelles actualités
                  </h4>
                </Card.Body>
              </Card>
            </Col>
            <Col xxl={6} md={10} className="mx-auto">
              <form action="#!" className="mt-n4">
                <div className="seller-search-box position-relative">
                  <i className="ri-search-2-line position-absolute my-auto d-flex align-items-center"></i>
                  <input
                    type="text"
                    className="form-control rounded-pill border-0 shadow"
                    id="searchInputList"
                    autoComplete="off"
                    placeholder="..."
                    onChange={(e) => searchTeamMember(e)}
                  />
                  <Button
                    variant="soft-danger"
                    className="fw-normal position-absolute rounded-pill"
                  >
                    <i className="bi bi-search"></i>
                  </Button>
                </div>
              </form>
            </Col>
          </Row>

          <Row className="mb-4 justify-content-between">
            <Col xxl={2} sm={6}>
              <Button
                onClick={() => tog_AddSellerModals()}
                variant="success"
                data-bs-toggle="modal"
                data-bs-target="#createModal"
              >
                Ajouter Actualité
              </Button>
            </Col>
            <Col xxl={2} sm={6}>
              <select
                className="form-select mt-3 mt-sm-0"
                data-choices
                data-choices-search-false
                name="choices-single-default"
                id="idStatus"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="all">Toutes</option>
                <option value="campus">Campus</option>
                <option value="culture">Culture</option>
                <option value="formation">Formation</option>
                <option value="innovation">Innovation</option>
                <option value="international">International</option>
                <option value="recherche">Recherche</option>
                <option value="sport">Sport</option>
                <option value="transitions">Transitions</option>
                <option value="université">Université</option>
              </select>
            </Col>
          </Row>

          <Row id="seller-list">
            {isLoading && <p>Loading...</p>}
            {error && <p>Error loading data.</p>}
            {currentpages && currentpages.length > 0
              ? currentpages.map((item: Actualite, key: number) => (
                  <Col xxl={3} lg={6} key={key}>
                    <Card style={{ height: '500px' }}>
                      <Card.Header>
                        <div className="d-flex align-items-center">
                          <div className="flex-grow-1">
                            <h4
                              className="card-title m-2"
                              style={{
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 1,
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {item.title}
                            </h4>
                            <h6 className="card-subtitle font-14 text-muted">
                              {item.date_actualite ? new Date(item.date_actualite).toLocaleDateString() : "Date non disponible"}
                            </h6>
                          </div>
                          <div className="flex-shrink-0">
                            <ul className="list-inline card-toolbar-menu d-flex align-items-center mb-0">
                              <li className="list-inline-item">
                                <Button
                                  type="button"
                                  className="btn btn-danger btn-icon"
                                  onClick={() => handleDeleteActualite(item?._id!)}
                                >
                                  <i className="ri-delete-bin-6-line"></i>
                                </Button>
                              </li>
                               <li className="list-inline-item">
                                 <Button
                                   type="button"
                                   className="btn btn-success btn-icon"
                                   onClick={() =>
                                     navigate(`/actualite/edit-actualite`,  { state: item })                                   }                                 >
                                <i className="bi bi-pencil-square"></i>
                              </Button>
                             </li>
                            </ul>
                          </div>
                        </div>
                      </Card.Header>
                      <Card.Body>
                      {item.gallery && item.gallery.length > 0 ? (
                          <Carousel>
                            {item.gallery.map((photo, index) => (
                              <Carousel.Item key={index}>
                                <img
                                  className="d-block w-100"
                                  src={`${process.env.REACT_APP_API_URL}/files/actualiteFiles/photo/${photo}`}
                                  alt={`Slide ${index}`}
                                  style={{ height: '200px', objectFit: 'cover' }}
                                />
                              </Carousel.Item>
                            ))}
                          </Carousel>
                        ) : (
                          <img
                          className="d-block w-100"
                          src={actualite}
                          style={{ height: '200px', objectFit: 'cover' }}
                          
                        />
                        )}
                     <p
                    className="card-text mt-auto "
                    style={{
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3,
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {DOMPurify.sanitize(item.description, { ALLOWED_TAGS: [] })}
                  </p>
                      </Card.Body>
                      
                      <div className="card-footer mt-4 hstack gap-2">
                         <Link
                          to="/actualite/details-actualite"
                          state={item}
                          className="card-link link-secondary"
                        >
                          <Button variant="soft-secondary" className="w-100">
                            Voir plus
                            <i className="bi bi-plus-circle-fill ms-1 align-middle lh-1"></i>
                          </Button>{" "}
                        </Link>
                        <Link to={item.lien} className="card-link link-success">
                          <Button variant="soft-primary" className="w-100">
                            Lien
                            <i className="bi bi-arrow-right-circle-fill align-middle ms-1 lh-1"></i>{" "}
                          </Button>
                        </Link>
                      </div>
                      
                    </Card>
                  </Col>
                ))
              : !isLoading && <p>No actualités found.</p>}
          </Row>

          {pagination && (
            <Row className="justify-content-between align-items-center mt-4 pt-2">
              <Col lg={12}>
                <div className="pagination-block">
                  <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center">
                      <li
                        className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                      >
                        <Button
                          variant="link"
                          className="page-link"
                          onClick={handleprevPage}
                        >
                          <i className="mdi mdi-chevron-left"></i>
                        </Button>
                      </li>
                      {pageNumbers.map((number: number) => (
                        <li
                          key={number}
                          className={`page-item ${currentPage === number ? "active" : ""
                            }`}
                        >
                          <Button
                            variant="link"
                            className="page-link"
                            id={`${number}`}
                            onClick={handleClick}
                          >
                            {number}
                          </Button>
                        </li>
                      ))}
                      <li
                        className={`page-item ${currentPage === pageNumbers.length ? "disabled" : ""}`}
                      >
                        <Button
                          variant="link"
                          className="page-link"
                          onClick={handlenextPage}
                        >
                          <i className="mdi mdi-chevron-right"></i>
                        </Button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ListeActualite;
