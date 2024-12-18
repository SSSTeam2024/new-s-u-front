import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";

// Import Images
import logoDark from "assets/images/logo-dark.png";
import logoLight from "assets/images/logo-light.png";
import logo from "assets/images/logo-sm.png";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

//redux
import { useSelector, useDispatch } from "react-redux";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { loginUser, socialLogin, resetLoginFlag } from "slices/thunk";
import withRouter from "Common/withRouter";

//Social Media Imports
import { GoogleLogin } from "react-google-login";
// import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

//Import config
import { facebook, google } from "../../config";
import {
  LoginRequest,
  UserResponse,
  useLoginMutation,
} from "features/account/accountSlice";
import { setCredentials } from "features/account/authSlice";

import Cookies from "js-cookie";

const Login = (props: any) => {
  document.title = "Login | Smart University";

  const [login, { isLoading }] = useLoginMutation();

  const [formState, setFormState] = React.useState<LoginRequest>({
    login: "",
    password: "",
  });

  useEffect(() => {
    console.log("hey token");
    if (localStorage.getItem("auth")) {
      console.log("hey token2");
      navigate("/map-tracking");
    }
  }, [localStorage.getItem("auth")]);
  //   const [formResponse, setFormResponse] = React.useState<UserResponse>({
  //     results: {
  //       accessToken: "",
  //       school: {
  //         _id: "",
  //         name: "",
  //         login: "",
  //         password: "",
  //         email: "",
  //         phone: "",
  //         activity: "",
  //         address: "",
  //         status: "",
  //         legal_status: "",
  //         account_name: "",
  //         sort_code: 0,
  //         account_number: 0,
  //         bank_name: "",
  //         id_creation_date: "",
  //         id_file: "",
  //       },
  //     },
  //   });

  const notify = () => {
    Swal.fire({
      icon: "success",
      title: `Welcome`,
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

  return (
    <React.Fragment>
      <section className="auth-page-wrapper position-relative bg-light min-vh-100 d-flex align-items-center justify-content-between">
        <div className="auth-header position-fixed top-0 start-0 end-0 bg-body">
          <Container fluid={true}>
            <Row className="justify-content-between align-items-center">
              <Col className="col-2">
                <Link className="navbar-brand mb-2 mb-sm-0" to="/">
                  <img
                    src={logo}
                    className="card-logo card-logo-dark"
                    alt="logo dark"
                    height="38"
                  />
                  <img
                    src={logo}
                    className="card-logo card-logo-light"
                    alt="logo light"
                    height="38"
                  />
                </Link>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="w-100">
          <Container>
            <Row className="justify-content-center">
              <Col lg={6}>
                <div className="auth-card mx-lg-3">
                  <Card className="border-0 mb-0">
                    <Card.Header className="bg-primary border-0">
                      <Row>
                        <Col lg={4} className="col-3">
                          <img src={logo} alt="" className="img-fluid" />
                        </Col>
                        {/* <Col lg={8} className="col-9">
                          <h1 className="text-white lh-base fw-lighter">
                            Join Our Toner Store
                          </h1>
                        </Col> */}
                      </Row>
                    </Card.Header>
                    <Card.Body>
                      <p className="text-muted fs-15">se connecter</p>
                      <div className="p-2">
                        <div className="mb-3">
                          <Form.Label htmlFor="username">Login</Form.Label>
                          <Form.Control
                            type="email"
                            className="form-control"
                            //   id="username"
                            placeholder="Enter username"
                            onChange={handleChange}
                            name="login"
                          />
                        </div>

                        <div className="mb-3">
                          <div className="float-end">
                            <Link to="/forgot-password" className="text-muted">
                              Forgot password?
                            </Link>
                          </div>
                          <Form.Label htmlFor="password-input">
                            Password
                          </Form.Label>
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <Form.Control
                              className="form-control pe-5 password-input"
                              placeholder="Enter password"
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

                        <div className="form-check">
                          <Form.Check
                            type="checkbox"
                            value=""
                            id="auth-remember-check"
                          />
                          <Form.Label htmlFor="auth-remember-check">
                            Remember me
                          </Form.Label>
                        </div>

                        <div className="mt-4">
                          {/* <Button
                              variant="primary"
                              className="w-100"
                              type="submit"
                              disabled={!error ? loader : false}
                            >
                              {!error
                                ? loader && (
                                    <Spinner
                                      size="sm"
                                      animation="border"
                                      className="me-2"
                                    />
                                  )
                                : ""}
                              Sign In
                            </Button> */}
                        </div>

                        <div>
                          <Button
                            variant="primary"
                            className="w-100"
                            type="submit"
                            onClick={async () => {
                              try {
                                const user: any = await login(
                                  formState
                                ).unwrap();
                                console.log(user);
                                if (user) {
                                  if (user.user.status === "Active") {
                                    dispatch(setCredentials(user));
                                    // localStorage.setItem(
                                    //   "auth",
                                    //   user?.school.api_token
                                    // );
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
                              } catch (err: any) {
                                //Errornotify(err);
                                console.log(err);
                              }
                            }}
                          >
                            Sign In
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
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
                      ©{new Date().getFullYear()} Smart University. Crafted with{" "}
                      <i className="mdi mdi-heart text-danger"></i> by Team 3S
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
