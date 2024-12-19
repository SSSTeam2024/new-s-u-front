// import React from "react";
// import { Button, Col, Container, Row, Carousel, Image, Card } from "react-bootstrap";
// import { useLocation, useNavigate } from "react-router-dom";
// import Breadcrumb from "Common/BreadCrumb";
// import actualite from "assets/images/actualite.jpg";
// import { formatDistanceToNow } from "date-fns";
// import { fr } from "date-fns/locale";
// import { useFetchActualiteQuery, useFetchActualiteByIdQuery, Actualite } from "features/actualite/actualiteSlice";

// const SingleActualite = () => {
//   document.title = "Avis Etudiant | Smart Institute";

//   const navigate = useNavigate();
//   const location = useLocation();
//   const {
//     title,
//     gallery,
//     description,
//     auteurId,
//     createdAt,
//     lien,
//     _id, // Assuming each article has an ID
//   } = location.state;

//   const { data: actualiteData = [], isLoading, error } = useFetchActualiteQuery();

//   // Type guard to ensure actualiteData is an array
//   const isActualiteArray = Array.isArray(actualiteData);

//   // Filter related articles
//   const relatedArticles = isActualiteArray
//     ? actualiteData.filter((article: Actualite) => article._id !== _id).slice(0, 4) // Exclude current article and limit to 3
//     : [];

//   const formattedDate = formatDistanceToNow(new Date(createdAt), {
//     addSuffix: true,
//     locale: fr,
//   });

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid={true}>
//           <Breadcrumb title="Detail Actualité" pageTitle="Actualité" />

//           <Row className="align-items-start">
//             <Col lg={5} className="mt-2">
//               <div>
//                 <Carousel controls={true} indicators={true}>
//                   {gallery && gallery.length > 0 ? (
//                     gallery.map((photo: string, index: number) => (
//                       <Carousel.Item key={index}>
//                         <Image
//                           className="d-block w-100"
//                           src={`${process.env.REACT_APP_API_URL}/files/actualiteFiles/photo/${photo}`}
//                           alt={`Slide ${index}`}
//                           style={{ height: "500px", objectFit: "cover" }}
//                         />
//                       </Carousel.Item>
//                     ))
//                   ) : (
//                     <Carousel.Item>
//                       <Image
//                         className="d-block w-100"
//                         src={actualite}
//                         alt="Fallback slide"
//                         style={{ height: "500px", objectFit: "cover" }}
//                       />
//                     </Carousel.Item>
//                   )}
//                 </Carousel>
//               </div>
//             </Col>
//             <Col lg={7}>
//               <div className="mt-4 mt-lg-0">
//                 <h2 className="lh-base fw-semibold mb-3">{title}</h2>
//                 <div
//                   className="mb-4"
//                   dangerouslySetInnerHTML={{ __html: description }}
//                 ></div>

//                 <Row className="text-center">
//                   <Col lg={6} className="mt-2 d-flex justify-content-center">
//                     <Button
//                       type="button"
//                       className="btn btn-soft-primary btn-label btn-lg"
//                     >
//                       <i className="bi bi-link-45deg label-icon align-middle fs-24 me-2"></i>{" "}
//                       Lien
//                     </Button>
//                   </Col>
//                   <Col lg={6} className="mt-2 d-flex justify-content-center">
//                     <Button
//                       type="button"
//                       className="btn btn-soft-danger btn-label btn-lg"
//                     >
//                       <i className="bi bi-filetype-pdf label-icon align-middle fs-24 me-2"></i>{" "}
//                       Fichier
//                     </Button>
//                   </Col>
//                 </Row>

//                 <Row className="mt-4">
//                   <Col className="text-center">
//                     <p className="text-muted mb-2">
//                       <span className="fw-bold">Publié</span>{" "}
//                       <span className="text-secondary fw-bold">
//                         {formattedDate}
//                       </span>
//                       <br />
//                       <span className="fw-bold">par</span>{" "}
//                       <span className="fw-semibold text-primary fw-bold">
//                         {auteurId?.name}
//                       </span>
//                     </p>
//                   </Col>
//                 </Row>
//               </div>
//             </Col>
//           </Row>

//           {/* Related Articles Section */}
//           <div className="mt-5">
//             <h3 className="mb-4">Articles Similaires</h3>
//             <Row>
//               {relatedArticles.length > 0 ? (
//                 relatedArticles.map((article: Actualite) => (
//                   <Col lg={3} md={6} key={article._id} className="mb-4">
//                     <Card>
//                       <Card.Img
//                         variant="top"
//                         src={article.gallery && article.gallery.length > 0 ? `${process.env.REACT_APP_API_URL}/files/actualiteFiles/photo/${article.gallery[0]}` : actualite}
//                         alt={article.title}
//                         style={{ height: "200px", objectFit: "cover" }}
//                       />
//                       <Card.Body>
//                         <Card.Title>{article.title}</Card.Title>
//                         <Card.Text>
//                           {article.description.substring(0, 100)}... {/* Shorten description */}
//                         </Card.Text>
//                         <Button
//                 variant="primary"
//                 onClick={() =>
//                   navigate(`/actualite/details-actualite`, {
//                     state: { id: article._id },
//                   })
//                 }
//               >
//                 Lire Plus
//               </Button>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                 ))
//               ) : (
//                 <Col>
//                   <p>Aucun article similaire trouvé.</p>
//                 </Col>
//               )}
//             </Row>
//           </div>
//         </Container>
//       </div>
//     </React.Fragment>
//   );
// };

// export default SingleActualite;

import React, { useEffect } from "react";
import { Button, Col, Container, Row, Carousel, Image, Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "Common/BreadCrumb";
import actualite from "assets/images/actualite.jpg";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useFetchActualiteQuery, useFetchActualiteByIdQuery, Actualite } from "features/actualite/actualiteSlice";
import DOMPurify from 'dompurify';
const SingleActualite = () => {
  document.title = "Avis Etudiant | Smart Institute";

  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as Actualite | { _id: string } | undefined;
  const passedId = locationState ? (locationState as Actualite)._id : undefined;

  // Fetch the article by ID if passed, otherwise use location state data
  const { data: fetchedArticle, isLoading: isLoadingById } = useFetchActualiteByIdQuery({ _id: passedId || "" }, {
    skip: !passedId,
  });

  const article = passedId ? fetchedArticle : (locationState as Actualite);

  const { data: actualiteData = [], isLoading, error } = useFetchActualiteQuery();

  // Type guard to ensure actualiteData is an array
  const isActualiteArray = Array.isArray(actualiteData);

  // Filter related articles
  const relatedArticles = isActualiteArray
    ? actualiteData.filter((relatedArticle: Actualite) => relatedArticle._id !== article?._id).slice(0, 4)
    : [];

  useEffect(() => {
    if (!passedId && !article) {
      // If no article is passed, navigate back to the actualité list
      navigate('/actualite');
    }
  }, [passedId, article, navigate]);

  if (isLoadingById || isLoading) {
    return <p>Chargement...</p>; // or a loading spinner
  }

  if (!article) {
    return <p>Article non trouvé.</p>;
  }

  const { title, gallery, description, auteurId, createdAt, lien } = article;

  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: fr,
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Detail Actualité" pageTitle="Actualité" />

          <Row className="align-items-start">
            <Col lg={5} className="mt-2">
              <div>
                <Carousel controls={true} indicators={true}>
                  {gallery && gallery.length > 0 ? (
                    gallery.map((photo: string, index: number) => (
                      <Carousel.Item key={index}>
                        <Image
                          className="d-block w-100"
                          src={`${process.env.REACT_APP_API_URL}/files/actualiteFiles/photo/${photo}`}
                          alt={`Slide ${index}`}
                          style={{ height: "500px", objectFit: "cover" }}
                        />
                      </Carousel.Item>
                    ))
                  ) : (
                    <Carousel.Item>
                      <Image
                        className="d-block w-100"
                        src={actualite}
                        alt="Fallback slide"
                        style={{ height: "500px", objectFit: "cover" }}
                      />
                    </Carousel.Item>
                  )}
                </Carousel>
              </div>
            </Col>
            <Col lg={7}>
              <div className="mt-4 mt-lg-0">
                <h2 className="lh-base fw-semibold mb-3">{title}</h2>
                <div
                  className="mb-4"
                  dangerouslySetInnerHTML={{ __html: description }}
                ></div>

                <Row className="text-center">
                  <Col lg={6} className="mt-2 d-flex justify-content-center">
                    <Button
                      type="button"
                      className="btn btn-soft-primary btn-label btn-lg"
                    >
                      <i className="bi bi-link-45deg label-icon align-middle fs-24 me-2"></i>{" "}
                      Lien
                    </Button>
                  </Col>
                  <Col lg={6} className="mt-2 d-flex justify-content-center">
                    <Button
                      type="button"
                      className="btn btn-soft-danger btn-label btn-lg"
                    >
                      <i className="bi bi-filetype-pdf label-icon align-middle fs-24 me-2"></i>{" "}
                      Fichier
                    </Button>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col className="text-center">
                    <p className="text-muted mb-2">
                      <span className="fw-bold">Publié</span>{" "}
                      <span className="text-secondary fw-bold">
                        {formattedDate}
                      </span>
                      <br />
                      <span className="fw-bold">par</span>{" "}
                      <span className="fw-semibold text-primary fw-bold">
                        {/* {auteurId?.name} */}
                      </span>
                    </p>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          {/* Related Articles Section */}
          <div className="mt-5">
            <h3 className="mb-4">Actualités Similaires</h3>
            <Row>
              {relatedArticles.length > 0 ? (
                relatedArticles.map((relatedArticle: Actualite) => (
                  <Col lg={3} md={6} key={relatedArticle._id} className="mb-4">
                    <Card>
                      <Card.Img
                        variant="top"
                        src={
                          relatedArticle.gallery && relatedArticle.gallery.length > 0
                            ? `${process.env.REACT_APP_API_URL}/files/actualiteFiles/photo/${relatedArticle.gallery[0]}`
                            : actualite
                        }
                        alt={relatedArticle.title}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <Card.Body>
                        <Card.Title>{relatedArticle.title}</Card.Title>
                        <Card.Text>
                        
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
                    {DOMPurify.sanitize(relatedArticle.description, { ALLOWED_TAGS: [] })}
                  </p>
                        </Card.Text>
                        <Button
                          variant="primary"
                          onClick={() =>
                            navigate(`/actualite/details-actualite`, {
                              state: { _id: relatedArticle._id },
                            })
                          }
                        >
                          Lire Plus
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col>
                  <p>Aucun article similaire trouvé.</p>
                </Col>
              )}
            </Row>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SingleActualite;


