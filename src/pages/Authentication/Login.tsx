import React from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import logo from "assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
//redux
import { useDispatch } from "react-redux";
import withRouter from "Common/withRouter";
import { LoginRequest, useLoginMutation } from "features/account/accountSlice";
import { setCredentials } from "features/account/authSlice";
import Cookies from "js-cookie";
import { useFetchMigrateValueQuery } from "features/cloneDb/cloneDb";

const Login = () => {
  document.title = "Login | ENIGA";
  const [login, { isLoading }] = useLoginMutation();
  const { data: migrationValue } = useFetchMigrateValueQuery();
  const [formState, setFormState] = React.useState<LoginRequest>({
    login: "",
    password: "",
  });

  if (localStorage.getItem("canReload") === "true") {
    localStorage.clear();
    window.location.reload();
  }

  const notify = () => {
    Swal.fire({
      icon: "success",
      title: `Bienvenue`,
      showConfirmButton: false,
      timer: 2200,
    });
    navigate("/dashboard");
  };

  const msgError: string = "Wrong Credentials !";
  const Errornotify = (msg: string) => {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: `${msg}`,
      showConfirmButton: false,
      timer: 2500,
    });
    navigate("/login");
  };
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    setFormState((prev) => ({ ...prev, [name]: value }));
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const handleLogin = async () => {
    try {
      const user: any = await login(formState).unwrap();
      if (user) {
        if (user.user.status === "Active") {
          dispatch(setCredentials(user));

          Cookies.set("astk", user.user.api_token, {
            expires: 1 / 4,
          });
          notify();
        }
        if (user.user.status !== "Active") {
          Errornotify("Your Account is Inactive!");
        }
      } else {
        Errornotify(msgError);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <React.Fragment>
      <section className="auth-page-wrapper position-relative bg-light min-vh-100 d-flex align-items-center justify-content-between">
        <div className="w-100">
          <Container>
            <Row className="justify-content-center">
              <Col lg={6}>
                <div className="auth-card mx-lg-3">
                  <Card className="border-0 mb-0">
                    <Card.Header className="bg-dark bg-opacity-10 border-0 ">
                      <Row>
                        <Col lg={4} className="col-3">
                          <img src={logo} alt="" className="img-fluid" />
                        </Col>
                      </Row>
                    </Card.Header>
                    <Form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        handleLogin();
                      }}
                    >
                      <Card.Body>
                        <p className="text-muted fs-15">Se connecter</p>
                        <div className="p-2">
                          <div className="mb-3">
                            <Form.Label htmlFor="username">Login</Form.Label>
                            <Form.Control
                              type="text"
                              className="form-control"
                              placeholder="Entrez nom d'utilisateur"
                              onChange={handleChange}
                              name="login"
                            />
                          </div>
                          <div className="mb-3">
                            <Form.Label htmlFor="password-input">
                              Mot de passe
                            </Form.Label>
                            <div className="position-relative auth-pass-inputgroup mb-3">
                              <Form.Control
                                className="form-control pe-5 password-input"
                                placeholder="Entrez mot de passe"
                                id="password-input"
                                name="password"
                                onChange={handleChange}
                                type={show ? "text" : "password"}
                              />
                              <Button
                                variant="link"
                                className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                type="button"
                                id="password-addon"
                                onClick={handleClick}
                              >
                                <i className="ri-eye-fill align-middle"></i>
                              </Button>
                            </div>
                          </div>

                          <div>
                            {isLoading ? (
                              <button className="btn btn-outline-warning btn-load w-100">
                                <span className="d-flex align-items-center">
                                  <span
                                    className="spinner-border flex-shrink-0"
                                    role="status"
                                  >
                                    <span className="visually-hidden">
                                      Loading...
                                    </span>
                                  </span>
                                  <span className="flex-grow-1 ms-2">
                                    Loading...
                                  </span>
                                </span>
                              </button>
                            ) : (
                              <Button
                                variant="soft-warning"
                                className="w-100"
                                type="submit"
                              >
                                Se connecter
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card.Body>
                    </Form>
                  </Card>
                </div>
              </Col>
            </Row>
          </Container>

          <footer className="footer">
            <Container>
              <Row>
                <Col lg={12}>
                  <div className="text-center">
                    <p className="mb-0 text-muted">
                      ©{new Date().getFullYear()} ENIGA. Réalisé avec{" "}
                      <i className="mdi mdi-heart text-danger"></i> par l'équipe 3S
                    </p>
                  </div>
                </Col>
              </Row>
            </Container>
          </footer>
        </div>
      </section>
    </React.Fragment>
  );
};

export default withRouter(Login);
