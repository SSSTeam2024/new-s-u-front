import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "Common/BreadCrumb";
import Select from "react-select";
import {
  CourrierEntrant,
  useAddCourrierEntrantMutation,
  useFetchAllCourrierEntrantQuery,
  useFetchLastCourrierEntrantQuery,
} from "features/courrierEntrant/courrierEntrant";
import { useFetchAllIntervenantsQuery } from "features/intervenants/intervenantsSlice";

function convertToBase64(
  file: File
): Promise<{ base64Data: string; extension: string }> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const base64String = fileReader.result as string;

      const [, base64Data] = base64String.split(",");
      const extension = file.name.split(".").pop() ?? "";
      resolve({ base64Data, extension });
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
    fileReader.readAsDataURL(file);
  });
}

const AjouterCourrierEntrant = () => {
  document.title = "Nouveau Courrier Entrant | ENIGA";

  const today = new Date().toISOString().split("T")[0];
  const [dateArrive, setDateArrive] = useState(today);
  const [dateCourrier, setDateCourrier] = useState("");
  const [dateLivraison, setDateLivraison] = useState("");
  const [createCourrierEntrant] = useAddCourrierEntrantMutation();
  const { data: lastCourrier } = useFetchLastCourrierEntrantQuery();
  const { data: existingCourriers = [] } = useFetchAllCourrierEntrantQuery();
  const { data: AllIntervenants = [] } = useFetchAllIntervenantsQuery();
  const [filtredIntervenant, setFiltredIntervenant] = useState<any[]>([]);

  useEffect(() => {
    if (lastCourrier && lastCourrier.num_ordre) {
      setCourrierEntrant((prev) => ({
        ...prev,
        num_ordre: `${(
          parseInt(lastCourrier.num_ordre) + 1
        ).toString()} / ${today.slice(0, 4)}`,
      }));
    }
  }, [lastCourrier, today]);

  const [selectedSource, setSelectedSource] = useState<string>("");

  const [selectedDestinataire, setSelectedDestinataire] = useState<string>("");

  const sourceOptions = AllIntervenants.map((intervenant) => ({
    value: intervenant?._id!,
    label: intervenant.nom_fr,
  }));

  const handleSelectSourceChange = (selectedOption: any) => {
    const source = selectedOption.value;
    setSelectedSource(source);
    const filtreIntervenant = AllIntervenants.filter(
      (intervenant) => intervenant?._id! !== source
    );
    setFiltredIntervenant(filtreIntervenant);
  };

  const destinataireOptions = filtredIntervenant.map((intervenant) => ({
    value: intervenant?._id!,
    label: intervenant.nom_fr,
  }));

  const handleSelectDestinataireChange = (selectedOption: any) => {
    const destinataire = selectedOption.value;
    setSelectedDestinataire(destinataire);
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Courrier Entrant a été créée avec succès",
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

  const navigate = useNavigate();

  function tog_AllCourriersEntrants() {
    navigate("/bureau-ordre/courriers-entrants/lister-courriers-entrants");
  }

  const initialCourrierEntrant: CourrierEntrant = {
    num_ordre: "",
    date_arrive: "",
    num_courrier: "",
    date_courrier: "",
    source: "",
    destinataire: "",
    sujet: "",
    date_livraison: "",
    file_base64_string: "",
    file_extension: "",
    file: "",
  };

  const [courrierEntrant, setCourrierEntrant] = useState(
    initialCourrierEntrant
  );

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "num_ordre") {
      if (existingCourriers?.some((c) => c.num_ordre === value)) {
        alert("Le numéro d'ordre existe déjà !");
        return;
      }
    }

    setCourrierEntrant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = (
      document.getElementById("file_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const insurancefile = base64Data + "." + extension;
      console.log(insurancefile);
      setCourrierEntrant({
        ...courrierEntrant,
        file: insurancefile,
        file_base64_string: base64Data,
        file_extension: extension,
      });
    }
  };

  const onSubmitCourrierEntrant = (e: any) => {
    e.preventDefault();

    try {
      const courrierEntrantData = {
        ...courrierEntrant,
        date_arrive: dateArrive,
        date_courrier: dateCourrier,
        date_livraison: dateLivraison,
        source: selectedSource,
        destinataire: selectedDestinataire,
      };

      createCourrierEntrant(courrierEntrantData)
        .then(() => notifySuccess())
        .then(() => setCourrierEntrant(initialCourrierEntrant));
      tog_AllCourriersEntrants();
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Nouveau Courrier Entrant"
            pageTitle="Bureau Ordre"
          />
          <Card className="shadow p-4">
            <Form onSubmit={onSubmitCourrierEntrant}>
              <Row className="mb-4 p-4">
                <Col>
                  <Row className="d-flex align-items-center">
                    <Col lg={3}>
                      <Form.Label className="fw-bold">N° d’ordre</Form.Label>
                    </Col>
                    <Col lg={4}>
                      <Form.Control
                        type="text"
                        value={courrierEntrant.num_ordre}
                        onChange={onChange}
                        name="num_ordre"
                        id="num_ordre"
                      />
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row className="d-flex align-items-center">
                    <Col lg={4} className="text-end">
                      <Form.Label className="fw-bold">
                        Date d'arrivée
                      </Form.Label>
                    </Col>
                    <Col lg={5}>
                      <Form.Control
                        type="date"
                        value={dateArrive}
                        onChange={(e) => setDateArrive(e.target.value)}
                        className="text-center"
                        max={today}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row className="d-flex align-items-center">
                    <Col className="text-end">
                      <Form.Label className="fw-bold">
                        N° du courrier
                      </Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        value={courrierEntrant.num_courrier}
                        onChange={onChange}
                        name="num_courrier"
                        id="num_courrier"
                      />
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row className="d-flex align-items-center">
                    <Col className="text-end">
                      <Form.Label className="fw-bold">
                        Date de courrier
                      </Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        type="date"
                        value={dateCourrier}
                        onChange={(e) => setDateCourrier(e.target.value)}
                        className="text-center"
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mb-4 p-4">
                <Col>
                  <Row className="d-flex align-items-center">
                    <Col lg={3}>
                      <Form.Label className="fw-bold">Source</Form.Label>
                    </Col>
                    <Col>
                      <Select
                        closeMenuOnSelect={false}
                        isSearchable
                        options={sourceOptions}
                        onChange={handleSelectSourceChange}
                        placeholder="Choisissez un source..."
                      />
                    </Col>
                    <Col lg={1}></Col>
                  </Row>
                </Col>
                <Col>
                  <Row className="d-flex align-items-center">
                    <Col lg={1}></Col>
                    <Col lg={3}>
                      <Form.Label className="fw-bold">Destinataire</Form.Label>
                    </Col>
                    <Col>
                      <Select
                        closeMenuOnSelect={false}
                        isSearchable
                        options={destinataireOptions}
                        onChange={handleSelectDestinataireChange}
                        placeholder="Choisissez un destinataire..."
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mb-4 p-4">
                <Col>
                  <Row className="d-flex align-items-center">
                    <Col lg={3}>
                      <Form.Label className="fw-bold">
                        Date de livraison
                      </Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        type="date"
                        value={dateLivraison}
                        onChange={(e) => setDateLivraison(e.target.value)}
                        className="text-center"
                      />
                    </Col>
                    <Col></Col>
                  </Row>
                </Col>
                <Col>
                  <Row className="d-flex align-items-center">
                    <Col lg={1}></Col>
                    <Col lg={3}>
                      <Form.Label className="fw-bold">Pièce jointe</Form.Label>
                    </Col>
                    <Col>
                      <input
                        className="form-control mb-2"
                        type="file"
                        id="file_base64_string"
                        onChange={(e) => handleFile(e)}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mb-1 p-4">
                <Col>
                  <div className="hstack gap-5">
                    <Form.Label className="fw-bold">Sujet </Form.Label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={courrierEntrant.sujet}
                      onChange={onChange}
                      name="sujet"
                      id="sujet"
                    />
                  </div>
                </Col>
              </Row>
              <Row className="p-4">
                <Col>
                  <div className="text-end">
                    <Button variant="primary" className="mt-3" type="submit">
                      Ajouter
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AjouterCourrierEntrant;
