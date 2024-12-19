import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import {
  ClassePeriod,
  useAddClassePeriodMutation,
  useFetchClassePeriodsByClassIdQuery,
  useUpdateClassePeriodMutation,
} from "features/classPeriod/classPeriod";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import BreadCrumb from "Common/BreadCrumb";
import TableContainer from "Common/TableContainer";
import { format } from "date-fns";
import Flatpickr from "react-flatpickr";
import { useFetchTimeTableParamsQuery } from "features/timeTableParams/timeTableParams";
import { options } from "@fullcalendar/core/preact";

const ListClassPeriods = () => {
  document.title = "Liste périodes des emplois classes | Smart University";
  const navigate = useNavigate();
  const location = useLocation();
  const classeDetails = location.state;
  console.log("classeDetails", classeDetails);
  const [modal_AddParametreModals, setmodal_AddParametreModals] =
    useState<boolean>(false);
  const { data: timeTableParams = [], isLoading: isParamsLoading } =
    useFetchTimeTableParamsQuery();
  console.log("timeTableParams", timeTableParams);

  console.log("isParamsLoading", isParamsLoading);
  function tog_AddParametreModals() {
    setmodal_AddParametreModals(!modal_AddParametreModals);
  }
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const { data: classTimeTables = [] } = useFetchClassePeriodsByClassIdQuery(
    classeDetails?.classe?._id!
  );
  console.log("data", classTimeTables);

  const schedules = classTimeTables.filter(
    (tt: any) => tt.semestre === classeDetails.semestre
  );

  const [createPeriodicSchedule] = useAddClassePeriodMutation();
  const [updatePrevPeriodicSchedule] = useUpdateClassePeriodMutation();

  const [formData, setFormData] = useState({
    _id: "",
    date_debut: "",
    date_fin: "",
    semestre: classeDetails?.semestre!,
    id_classe: classeDetails?.classe?._id!,
    etat: "En élaboration",
  });
  const [createClassPeriod] = useAddClassePeriodMutation();

  const handleAddClick = async () => {
    if (schedules.length > 0) {
      const currentDate = new Date();
      const dateStr = formatDate(currentDate);
      const { nextSunday, nextMonday } = getNextSundayAndMonday(
        convertStringToDate(
          /* "10-11-2024"  currentDate*/ dateStr
        ) /* currentDate */
      );
      console.log("Next Saturday:", nextSunday);
      console.log("Next Monday:", nextMonday);

      const date_debut_next_period = nextMonday;
      const date_fin_next_period =
        classeDetails.semestre === "1"
          ? timeTableParams[0]?.semestre1_end!
          : timeTableParams[0]?.semestre2_end!;
      const date_fin_prev_period = nextSunday;

      showNewTimeTableAlert(
        date_debut_next_period,
        date_fin_next_period,
        date_fin_prev_period
      );
    } else {
      await createPeriodicSchedule({
        date_debut:
          classeDetails.semestre === "1"
            ? timeTableParams[0]?.semestre1_start!
            : timeTableParams[0]?.semestre2_start!,
        date_fin:
          classeDetails.semestre === "1"
            ? timeTableParams[0]?.semestre1_end!
            : timeTableParams[0]?.semestre2_end!,
        semestre: classeDetails.semestre,
        id_classe: classeDetails.classe._id,
        etat: "En élaboration",
      }).unwrap();
    }

    // setAddModalOpen(true);
  };

  const convertStringToDate = (dateStr: any) => {
    const [day, month, year] = dateStr.split("-").map(Number);
    // Months are 0-indexed in JavaScript Date (0 = January, 1 = February, etc.)
    return new Date(year, month - 1, day);
  };

  const formatDate = (date: any) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getNextSunday = (date: any) => {
    const dayOfWeek = date.getDay();
    const daysUntilSunday = (7 - dayOfWeek) % 7; // 0 is Sunday
    const nextSunday = new Date(date);
    nextSunday.setDate(nextSunday.getDate() + daysUntilSunday);
    return nextSunday;
  };

  const getNextMonday = (fromDate: any) => {
    const dayOfWeek = fromDate.getDay();
    const daysUntilMonday = (1 - dayOfWeek + 7) % 7 || 7; // 1 is Monday
    const nextMonday = new Date(fromDate);
    nextMonday.setDate(fromDate.getDate() + daysUntilMonday);
    return nextMonday;
  };

  const getNextSundayAndMonday = (date: any) => {
    const nextSunday = getNextSunday(date);
    const nextMonday = getNextMonday(nextSunday); // Use getNextMonday from the next Sunday

    return {
      nextSunday: formatDate(nextSunday),
      nextMonday: formatDate(nextMonday),
    };
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Type Séance a été crée avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const showNewTimeTableAlert = async (
    date_debut_next_period: any,
    date_fin_next_period: any,
    date_fin_prev_period: any
  ) => {
    swalWithBootstrapButtons
      .fire({
        title: "Êtes-vous sûr?",
        text: "Le tableau précédent sera cloturé, et un nouveau emploi sera crée!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, confirmer!",
        cancelButtonText: "Non, annuler!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          console.log("formData", formData);
          await createPeriodicSchedule({
            date_debut: date_debut_next_period,
            date_fin: date_fin_next_period,
            semestre: classeDetails.semestre,
            id_classe: classeDetails.classe._id,
            etat: "En élaboration",
          }).unwrap();

          swalWithBootstrapButtons
            .fire("", "Un nouveau emploi a été crée.", "success")
            .then(async () => {
              await updatePrevPeriodicSchedule({
                _id: schedules[schedules.length - 1]._id,
                date_debut: schedules[schedules.length - 1].date_debut,
                date_fin: date_fin_prev_period,
                semestre: schedules[schedules.length - 1].semestre,
                id_classe: classeDetails.classe._id,
                etat: "Cloturé",
              }).unwrap();
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire("Annulé", "", "error");
        }
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
  const onSubmitClassPeriod = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createClassPeriod(formData).unwrap();
      setAddModalOpen(false);
      notify();
    } catch (error: any) {
      if (error.status === 400) {
        errorAlert("La valeur doit être unique.");
      } else {
        errorAlert("La valeur doit être unique. Veuillez réessayer.");
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Date Début",
        accessor: "date_debut",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Date Fin",
        accessor: "date_fin",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Semestre",
        accessor: "semestre",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Etat Emploi",
        accessor: "etat",
        disableFilters: true,
        filterable: true,
        Cell: ({ value }: any) =>
          value === "En élaboration" ? (
            <span className="badge text-bg-info fs-12">{value}</span>
          ) : (
            <span className="badge text-bg-danger fs-12">{value}</span>
          ),
      },
      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (classEmploi: ClassePeriod) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                {classEmploi.etat === "En élaboration" ? (
                  <Link
                    to="/gestion-emplois/emploi-classe/single-emplois"
                    state={classEmploi}
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
                ) : (
                  <Link
                    to="/gestion-emplois/emploi-classe/single-emplois"
                    state={classEmploi}
                    className="badge bg-warning-subtle text-warning edit-item-btn"
                  >
                    <i
                      className="ph ph-eye"
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
                )}
              </li>
            </ul>
          );
        },
      },
    ],
    []
  );
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [modal_AddOrderModals, setmodal_AddOrderModals] =
    useState<boolean>(false);
  function tog_AddOrderModals() {
    setmodal_AddOrderModals(!modal_AddOrderModals);
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const [selectedDateDebut, setSelectedDateDebut] = useState<Date | null>(null);
  const [selectedDateFin, setSelectedDateFin] = useState<Date | null>(null);
  // change date debut
  const handleDateChangeDebut = (selectedDates: Date[]) => {
    const selectedDate = selectedDates[0];
    setSelectedDateDebut(selectedDate);
    if (selectedDate) {
      const formattedDate = format(selectedDate, "dd-MM-yyyy");
      setFormData((prevState) => ({
        ...prevState,
        date_debut: formattedDate,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        date_debut: "",
      }));
    }
  };
  // change date Fin
  const handleDateChangeFin = (selectedDates: Date[]) => {
    const selectedDate = selectedDates[0];
    setSelectedDateFin(selectedDate);
    if (selectedDate) {
      const formattedDate = format(selectedDate, "dd-MM-yyyy");
      setFormData((prevState) => ({
        ...prevState,
        date_fin: formattedDate,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        date_fin: "",
      }));
    }
  };

  const reverseDate = (dateString: string) => {
    // Split the input date (yyyy-mm-dd) into an array
    const [year, month, day] = dateString?.split("-");

    // Return the date in the dd-mm-yyyy format
    return `${day}-${month}-${year}`;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb
            title="Paramètres des emplois"
            pageTitle="Liste periodes de classe"
          />

          <Row id="sellersList">
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Row className="g-3">
                    <Col lg={2}>
                      <Form.Label className="mt-3 bg-text-info">
                        {classeDetails?.classe?.nom_classe_fr!} / Semestre{" "}
                        {classeDetails?.semestre!}
                      </Form.Label>
                    </Col>

                    <Col className="col-lg-auto ms-auto d-flex justify-content-around">
                      <div className="hstack gap-2">
                        <Button
                          variant="primary"
                          className="add-btn"
                          onClick={handleAddClick}
                        >
                          Ajouter emploi periodique
                        </Button>
                      </div>
                      <div className="search-box m-2">
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
                      columns={columns || []}
                      data={schedules || []}
                      // isGlobalFilter={false}
                      iscustomPageSize={false}
                      isBordered={false}
                      customPageSize={10}
                      className="custom-header-css table align-middle table-nowrap"
                      tableClass="table-centered align-middle table-nowrap mb-0"
                      theadClass="text-muted table-light"
                      SearchPlaceholder="Search Products..."
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
          <Modal
            show={isAddModalOpen}
            onHide={() => setAddModalOpen(false)}
            centered
          >
            <Modal.Header className="px-4 pt-4" closeButton>
              <h5 className="modal-title" id="exampleModalLabel">
                Ajouter emploi periodique
              </h5>
            </Modal.Header>
            <Form className="tablelist-form" onSubmit={onSubmitClassPeriod}>
              <Modal.Body className="p-4">
                <Row>
                  <Col lg={6}>
                    <div>
                      <Form.Label htmlFor="date_debut">Date Début</Form.Label>
                      {classeDetails?.semestre! === "1" ? (
                        <Flatpickr
                          value={formData.date_debut!}
                          onChange={handleDateChangeDebut}
                          className="form-control flatpickr-input"
                          placeholder="Sélectionner date"
                          options={{
                            dateFormat: "d M, Y",
                            // minDate: new Date(
                            //   reverseDate(timeTableParams[0]?.semestre1_start!)
                            // ),
                          }}
                          id="date_debut"
                        />
                      ) : (
                        <Flatpickr
                          value={formData.date_debut!}
                          onChange={handleDateChangeDebut}
                          className="form-control flatpickr-input"
                          placeholder="Sélectionner date"
                          options={{
                            dateFormat: "d M, Y",
                            // minDate: new Date(
                            //   reverseDate(timeTableParams[0]?.semestre2_start!)
                            // ),
                          }}
                          id="date_debut"
                        />
                      )}
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div>
                      <Form.Label htmlFor="date_fin">Date Fin</Form.Label>
                      <Flatpickr
                        value={formData.date_fin!}
                        onChange={handleDateChangeFin}
                        className="form-control flatpickr-input"
                        placeholder="Sélectionner date"
                        options={{
                          dateFormat: "d M, Y",
                        }}
                        id="date_fin"
                      />
                    </div>
                  </Col>
                </Row>
              </Modal.Body>
              <div className="modal-footer">
                <div className="hstack gap-2 justify-content-end">
                  <Button
                    className="btn-ghost-danger"
                    onClick={() => setAddModalOpen(false)}
                  >
                    Fermer
                  </Button>
                  <Button
                    variant="success"
                    id="add-btn"
                    type="submit"
                    onClick={tog_AddOrderModals}
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

export default ListClassPeriods;