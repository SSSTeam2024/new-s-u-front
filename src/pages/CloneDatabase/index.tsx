import React, { useRef, useState, useEffect } from "react";
import { Card, Container, Nav, Row, Tab, Col } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import {
  useAddCloneMutation,
  useFetchMigrateValueQuery,
  usePromoteDatabaseMutation,
} from "features/cloneDb/cloneDb";
import Swal from "sweetalert2";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import cloneAnimation from "../../assets/images/Animation - 1744792608588.json";
import OperationsMigration from "./OperationsMigration";
import { RootState } from "../../app/store";
import { selectCurrentUser } from "features/account/authSlice";
import { useSelector } from "react-redux";
import { useVerifyPasswordMutation } from "features/account/accountSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const CloneDatabase = () => {
  document.title = "Passage | ENIGA";

  const [createClone, { isLoading, isSuccess }] = useAddCloneMutation();
  const { data: migrationValue, isSuccess: successMigrationValue } =
    useFetchMigrateValueQuery();
  const [verifypwd] = useVerifyPasswordMutation();
  const [updateNameOfActualDatabase] = usePromoteDatabaseMutation();

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le sauvegarde a été terminé avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const notifyError = (err: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Sothing Wrong, ${err}`,
      showConfirmButton: false,
      timer: 2500,
    });
  };
  const [completed, setCompleted] = useState<number>(0);
  const handleChildValue = (value: any) => {
    setCompleted(value);
  };

  const [isChecked, setIsChecked] = useState(false);
  const [activeKey, setActiveKey] = useState("");

  useEffect(() => {
    if (successMigrationValue) {
      if (migrationValue) {
        setActiveKey("arrow-overview");
      }
      if (!migrationValue && completed < 100) {
        console.log("second if");
        setActiveKey("arrow-profile");
      }

      if (!migrationValue && completed === 100) {
        console.log("third if");
        setActiveKey("arrow-contact");
      }
    }
  }, [completed, activeKey, migrationValue, successMigrationValue]);

  const submitClone = async () => {
    try {
      const result = await createClone().unwrap();
      // setActiveKey("arrow-profile");
      notifySuccess();
      window.location.reload();
    } catch (error) {
      notifyError(error);
    }
  };

  const AlertConfirm = async () => {
    Swal.fire({
      title: "Confirme Migration",
      input: "text",
      html: `
        <p class="text-muted">Pour confimer la migration, saisissez le nom <b class="text-danger">${user?.login!}</b></p>
      `,
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Envoyer",
      cancelButtonText: "Annuler",
      showLoaderOnConfirm: true,
      customClass: {
        confirmButton: "btn btn-secondary",
        cancelButton: "btn btn-danger",
      },
      preConfirm: async (text) => {
        try {
          const validLogin = user?.login!;

          if (text !== validLogin) {
            throw new Error("Nom d'utilisateur Incorrect");
          }
          handleSubmitCompleteMigration();
          return {};
        } catch (error: any) {
          Swal.showValidationMessage(`Erreur: ${error.message}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  const AlertPassword = async () => {
    Swal.fire({
      title: "Soumettre votre mot de passe",
      input: "password",
      html: `
        <p class="text-muted">Pour enregistrer cette base de données sous forme d'archive, vous devez d'abord saisir votre mot de passe</p>
      `,
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Envoyer",
      cancelButtonText: "Annuler",
      showLoaderOnConfirm: true,
      customClass: {
        confirmButton: "btn btn-secondary",
        cancelButton: "btn btn-danger",
      },
      preConfirm: async (password) => {
        try {
          const validPassword = user?.password!;
          const result = await verifypwd({
            plainPassword: password,
            hashedPassword: validPassword,
          }).unwrap();
          if (result.isMatch === false) {
            throw new Error("Mot de passe invalide");
          }
          submitClone();
          return {};
        } catch (error: any) {
          Swal.showValidationMessage(`Erreur : ${error.message}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  const navigate = useNavigate();

  const logout = async () => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/user/logout-user/${user?._id!}`,
        {}
      )
      .then((res: any) => {
        Cookies.remove("astk");
        localStorage.setItem("canReload", "true");
        navigate("/login");
      });
  };

  const handleSubmitCompleteMigration = async () => {
    await updateNameOfActualDatabase().unwrap();
    await logout();
  };
  console.log("completed", completed, activeKey, migrationValue);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Passage" pageTitle="Migration" />
          <Card>
            <Card.Body>
              {activeKey !== "" && (
                <Tab.Container defaultActiveKey={activeKey}>
                  <Nav
                    as="ul"
                    variant="pills"
                    className="arrow-navtabs nav-success bg-light mb-3"
                  >
                    <Nav.Item as="li">
                      <Nav.Link
                        eventKey="arrow-overview"
                        disabled={migrationValue === false}
                      >
                        <span className="d-block d-sm-none">
                          <i className="mdi mdi-home-variant"></i>
                        </span>
                        <span className="d-none d-sm-block">
                          Sauvegarde Archive
                        </span>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link
                        eventKey="arrow-profile"
                        disabled={migrationValue === true}
                      >
                        <span className="d-block d-sm-none">
                          <i className="mdi mdi-account"></i>
                        </span>
                        <span className="d-none d-sm-block">
                          Opérations de Migration
                        </span>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link
                        eventKey="arrow-contact"
                        disabled={completed !== 100}
                      >
                        <span className="d-block d-sm-none">
                          <i className="mdi mdi-email"></i>
                        </span>
                        <span className="d-none d-sm-block">Terminer</span>
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content className="text-muted">
                    <Tab.Pane eventKey="arrow-overview">
                      {isLoading ? (
                        <div className="d-flex justify-content-center">
                          <Lottie
                            lottieRef={lottieRef}
                            onComplete={() => {
                              lottieRef.current?.goToAndPlay(5, true);
                            }}
                            animationData={cloneAnimation}
                            loop={false}
                            style={{ width: 800 }}
                          />
                        </div>
                      ) : (
                        <>
                          <div>
                            <h3>Some Texte</h3>
                          </div>
                          <div>
                            <div className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="formCheck1"
                                checked={isChecked}
                                onChange={(e) => setIsChecked(e.target.checked)}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="formCheck1"
                              >
                                I read the terms conditions
                              </label>
                            </div>
                          </div>
                          {isChecked && (
                            <div className="text-center mt-4">
                              <button
                                type="button"
                                className="btn btn-info btn-label left ms-auto nexttab nexttab"
                                onClick={AlertPassword}
                              >
                                <i className="ri-file-copy-2-fill label-icon align-middle fs-20 ms-2"></i>
                                Sauvegarder
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </Tab.Pane>
                    <Tab.Pane eventKey="arrow-profile">
                      {migrationValue === false ? (
                        <OperationsMigration onValueChange={handleChildValue} />
                      ) : (
                        ""
                      )}
                    </Tab.Pane>
                    <Tab.Pane eventKey="arrow-contact">
                      <div className="text-center">
                        <div className="avatar-md mt-4 mb-4 mx-auto">
                          <div className="avatar-title bg-light text-success display-4 rounded-circle">
                            <i className="ri-checkbox-circle-fill"></i>
                          </div>
                        </div>
                        <Row>
                          <Col>
                            <span className="text-muted">
                              Le nettoyage des données a été effectué avec
                              succès. Pour finaliser le processus, veuillez
                              noter que cliquer sur le bouton ci-dessous{" "}
                              <span className="fw-bold text-danger">
                                vous déconnectera du système
                              </span>
                              . Pour continuer, vous devrez vous reconnecter.
                              Assurez-vous d'avoir sauvegardé vos modifications
                              importantes avant de continuer.
                            </span>
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col>
                            <span
                              className="badge bg-danger fs-20"
                              style={{ cursor: "pointer" }}
                              onClick={AlertConfirm}
                            >
                              Confirmer
                            </span>
                          </Col>
                        </Row>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              )}
            </Card.Body>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CloneDatabase;
