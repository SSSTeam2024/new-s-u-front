import React, { useState, useMemo, useCallback } from 'react';
import { Button, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import Breadcrumb from 'Common/BreadCrumb';
import CountUp from 'react-countup';
import TableContainer from "Common/TableContainer";
import { userList } from "Common/data";
import Flatpickr from "react-flatpickr";
import dummyImg from "../../assets/images/users/user-dummy-img.jpg"
import { Link } from 'react-router-dom';
import { RootState } from 'app/store';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from 'features/account/authSlice'; 
import { actionAuthorization } from 'utils/pathVerification';
import { useFetchAvisEtudiantQuery, Avis } from "features/avisEtudiant/avisEtudiantSlice";


const ListeAvisEtudiant = () => {
    document.title = "Avis Etudiant | Smart Institute";

    const user = useSelector((state: RootState) => selectCurrentUser(state));

    const { data: avisEtudiant, error, isLoading } = useFetchAvisEtudiantQuery();


    const [modal_AddUserModals, setmodal_AddUserModals] = useState<boolean>(false);
    const [isMultiDeleteButton, setIsMultiDeleteButton] = useState<boolean>(false)
 // State for PDF modal
 const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
 const [pdfUrl, setPdfUrl] = useState<string>("");


    function tog_AddUserModals() {
        setmodal_AddUserModals(!modal_AddUserModals);
    }

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
        ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    }

    const handleShowPdfModal = (fileName: string) => {
      let link= `${process.env.REACT_APP_API_URL}/files/avisEtudiantFiles/pdf/`+fileName
    
        setPdfUrl(link);
        setShowPdfModal(true);
    }

    const handleClosePdfModal = () => {
        setShowPdfModal(false);
        setPdfUrl("");}

    const columns = useMemo(
        () => [
        
            {
                Header: "Titre",
                accessor: "title",
                disableFilters: true,
                filterable: true,
            },
          
         
            {
                Header: "Auteur",
                accessor: (row: any) => row.auteurId?.name || "",
                disableFilters: true,
                filterable: true,
            },
            {
                Header: "PDF",
                accessor: "pdf",
                disableFilters: true,
                filterable: true,
                Cell: ({ row }: any) => (
                    <Button
                        variant="link"
                        onClick={() => handleShowPdfModal(row.original.pdf)}
                    >
                        Ouvrir PDF
                    </Button>
                )
            },
            {
                Header: "Lien",
                accessor: "lien",
                disableFilters: true,
                filterable: true,
                Cell: ({ cell: { value } }: any) => (
                    <Button
                        variant="link"
                        onClick={() => window.open(value, "_blank")}
                    >
                        Aller au lien
                    </Button>
                )
            },
      
            {
                Header: "Action",
                disableFilters: true,
                filterable: true,
                accessor: (cellProps: any) => {
                    return (
                        <ul className="hstack gap-2 list-unstyled mb-0">
              {actionAuthorization("/avis-etudiant/single-avis-etudiant",user?.permissions!)?
              <li>
                <Link
                  to="/avis-etudiant/single-avis-etudiant"
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
              </li> : <></>
                } 
                  {actionAuthorization("/avis-etudiant/edit-avis-etudiant",user?.permissions!)?
             <li>
                <Link
                  to="/avis-etudiant/edit-avis-etudiant"
                  className="badge bg-success-subtle text-success edit-item-btn"
                  state={cellProps}
                >
                  <i
                    className="ph ph-pencil-line"
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
              :<></> }
              {actionAuthorization("/avis-etudiant/supprimer-avis-etudiant",user?.permissions!)?
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
                      (e.currentTarget.style.transform = "scale(1.4)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                </Link>
              </li> :<></> }
            </ul>
                    )
                },
            },
        ],
        [checkedAll]
    );

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumb title="Liste des Avis" pageTitle="More" />

                  

                    <Row id="usersList">
                        <Col lg={12}>
                            <Card>
                                <Card.Body>
                                    <Row className="g-lg-2 g-4">
                                        <Col lg={3}>
                                            <div className="search-box">
                                                <input type="text" className="form-control search" placeholder="Chercher un avis..." />
                                                <i className="ri-search-line search-icon"></i>
                                            </div>
                                        </Col>

                                        {isMultiDeleteButton && <Button variant="danger" className="btn-icon"><i className="ri-delete-bin-2-line"></i></Button>}

                                     
                                    </Row>
                                </Card.Body>
                            </Card>
                            <Card>
                                <Card.Body className='p-0'>
                                    
                                        <TableContainer
                                            columns={(columns || [])}
                                            data={(avisEtudiant || [])}
                                            isGlobalFilter={false}
                                            iscustomPageSize={false}
                                            isBordered={false}
                                            customPageSize={10}
                                            className="custom-header-css table align-middle table-nowrap"
                                            tableClass="table-centered align-middle table-nowrap mb-0"
                                            theadClass="text-muted table-light"
                                            SearchPlaceholder='Search Products...'
                                        />
                                        <div className="noresult" style={{ display: "none" }}>
                                            <div className="text-center">
                                                <h5 className="mt-2">Sorry! No Result Found</h5>
                                                <p className="text-muted mb-0">We've searched more than 150+ Orders We did not find any orders for you search.</p>
                                            </div>
                                        </div>
                                    
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                  
                </Container >
                
            </div >

            {/* PDF Modal */}
            <Modal show={showPdfModal} onHide={handleClosePdfModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>PDF Viewer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <iframe
                        src={pdfUrl}
                        width="100%"
                        height="600px"
                        style={{ border: 'none' }}
                        title="PDF Viewer"
                    ></iframe>
                </Modal.Body>
            </Modal>
        </React.Fragment >
    );
};

export default ListeAvisEtudiant;


// import React, { useState, useMemo, useCallback } from 'react';
// import { Button, Card, Col, Container, Modal, Row } from 'react-bootstrap';
// import Breadcrumb from 'Common/BreadCrumb';
// import TableContainer from 'Common/TableContainer';
// import { useSelector } from 'react-redux';
// import { RootState } from 'app/store';
// import { selectCurrentUser } from 'features/account/authSlice';
// import { actionAuthorization } from 'utils/pathVerification';
// import { Avis, useFetchAvisEtudiantQuery } from 'features/avisEtudiant/avisEtudiantSlice';
// import { Link } from 'react-router-dom';

// const ListeAvisEtudiant = () => {
//     document.title = 'Avis Etudiant | Smart Institute';

//     // Redux state
//     const user = useSelector((state: RootState) => selectCurrentUser(state));

//     // RTK Query
//     const { data: avisEtudiant = [], isLoading } = useFetchAvisEtudiantQuery();

//     // Component state
//     const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
//     const [pdfUrl, setPdfUrl] = useState<string>('');
//     const [globalFilter, setGlobalFilter] = useState<string>("");
//     const [isMultiDeleteButton, setIsMultiDeleteButton] = useState<boolean>(false);

//     // Modal handlers
//     const handleShowPdfModal = (fileName: string) => {
//         setPdfUrl(`${process.env.REACT_APP_API_URL}/files/avisEtudiantFiles/pdf/${fileName}`);
//         setShowPdfModal(true);
//     };

//     const handleClosePdfModal = () => {
//         setPdfUrl('');
//         setShowPdfModal(false);
//     };

//     // Filtered data based on search
    
//     const filteredData = useMemo(() => {
//       return (avisEtudiant as Avis[]).filter((item) =>
//         item.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
//         item.auteurId.toLowerCase().includes(globalFilter.toLowerCase())
//       );
//     }, [avisEtudiant]); 

//   if (isLoading) return <div>Loading...</div>;


//     // Checkbox state and handlers

//     // const checkedAll = useCallback(() => {
//     //     const checkAll = document.getElementById('checkAll') as HTMLInputElement;
//     //     const checkboxes = document.querySelectorAll('.userCheckBox') as NodeListOf<HTMLInputElement>;

//     //     checkboxes.forEach((checkbox) => (checkbox.checked = checkAll.checked));
//     //     setIsMultiDeleteButton(checkboxes.length > 0 && checkAll.checked);
//     // }, []);

//     // Table columns
//     const columns = useMemo(() => [
//         {
//             Header: 'Titre',
//             accessor: 'title',
//         },
//         {
//             Header: 'Auteur',
//             accessor: (row: any) => row.auteurId?.name || '',
//         },
//         {
//             Header: 'PDF',
//             accessor: 'pdf',
//             Cell: ({ row }: any) => (
//                 <Button variant="link" onClick={() => handleShowPdfModal(row.original.pdf)}>
//                     Ouvrir PDF
//                 </Button>
//             ),
//         },
//         {
//             Header: 'Lien',
//             accessor: 'lien',
//             Cell: ({ cell: { value } }: any) => (
//                 <Button variant="link" onClick={() => window.open(value, '_blank')}>
//                     Aller au lien
//                 </Button>
//             ),
//         },
//         {
//             Header: 'Action',
//             Cell: ({ row }: any) => (
//                 <ul className="hstack gap-2 list-unstyled mb-0">
//                     {actionAuthorization('/avis-etudiant/single-avis-etudiant', user?.permissions!) && (
//                         <li>
//                             <Link
//                                 to="/avis-etudiant/single-avis-etudiant"
//                                 state={row.original}
//                                 className="badge bg-info-subtle text-info view-item-btn"
//                             >
//                                 <i className="ph ph-eye"></i>
//                             </Link>
//                         </li>
//                     )}
//                     {actionAuthorization('/avis-etudiant/edit-avis-etudiant', user?.permissions!) && (
//                         <li>
//                             <Link
//                                 to="/avis-etudiant/edit-avis-etudiant"
//                                 state={row.original}
//                                 className="badge bg-success-subtle text-success edit-item-btn"
//                             >
//                                 <i className="ph ph-pencil-line"></i>
//                             </Link>
//                         </li>
//                     )}
//                     {actionAuthorization('/avis-etudiant/supprimer-avis-etudiant', user?.permissions!) && (
//                         <li>
//                             <Button variant="danger" className="badge bg-danger-subtle text-danger remove-item-btn">
//                                 <i className="ph ph-trash"></i>
//                             </Button>
//                         </li>
//                     )}
//                 </ul>
//             ),
//         },
//     ], [user?.permissions]);

//     return (
//         <React.Fragment>
//             <div className="page-content">
//                 <Container fluid>
//                     <Breadcrumb title="Liste des Avis" pageTitle="More" />
//                     <Row>
//                         <Col lg={12}>
//                             <Card>
//                                 <Card.Body>
//                                     <Row className="g-3">
//                                         <Col lg={3}>
//                                         <div className="search-box">
//                                                 <input
//                                                     type="text"
//                                                     placeholder="Search..."
//                                                     value={globalFilter}
//                                                     onChange={(e) => setGlobalFilter(e.target.value)}
//                                                 />
//                                             </div>
//                                         </Col>
//                                         {isMultiDeleteButton && (
//                                             <Button variant="danger" className="btn-icon">
//                                                 <i className="ri-delete-bin-2-line"></i>
//                                             </Button>
//                                         )}
//                                     </Row>
//                                 </Card.Body>
//                             </Card>
//                             <Card>
//                                 <Card.Body className="p-0">
//                                     <TableContainer
//                                         columns={columns}
//                                         data={filteredData}
//                                         isGlobalFilter={false}
//                                         iscustomPageSize={false}
//                                         isBordered={false}
//                                         customPageSize={10}
//                                         className="custom-header-css table align-middle table-nowrap"
//                                         tableClass="table-centered align-middle table-nowrap mb-0"
//                                         theadClass="text-muted table-light"
//                                         SearchPlaceholder="Rechercher..."
//                                     />
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                     </Row>
//                 </Container>
//             </div>
//             {/* PDF Modal */}
//             <Modal show={showPdfModal} onHide={handleClosePdfModal} size="lg">
//                 <Modal.Header closeButton>
//                     <Modal.Title>PDF Viewer</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <iframe
//                         src={pdfUrl}
//                         width="100%"
//                         height="600px"
//                         style={{ border: 'none' }}
//                         title="PDF Viewer"
//                     ></iframe>
//                 </Modal.Body>
//             </Modal>
//         </React.Fragment>
//     );
// };

// export default ListeAvisEtudiant;