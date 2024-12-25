import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  useUpdateAvisPersonnelMutation,
  useFetchAvisPersonnelByIdQuery,
} from "features/avisPersonnel/avisPersonnelSlice";
import { Button, Col, Container, Form, Row, Image } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { useParams } from "react-router-dom";

const EditAvisPersonnel = () => {
  document.title = "Edit Avis Personnel | ENIGA";

  //   const { id } = useParams();
  //   const dispatch = useDispatch();

  //   // Fetch current data for the Avis Personnel
  //   const { data, isLoading, error } = useFetchAvisPersonnelByIdQuery(id);

  //   const [updateAvisPersonnel, { isLoading: isUpdating, isSuccess, isError }] = useUpdateAvisPersonnelMutation();

  //   // Form setup
  //   const { register, handleSubmit, setValue } = useForm({
  //     defaultValues: {
  //       title: "",
  //       gallery: [],
  //       description: "",
  //       auteurId: null,
  //       createdAt: "",
  //       lien: ""
  //     }
  //   });

  //   useEffect(() => {
  //     if (data) {
  //       setValue("title", data.title);
  //       setValue("gallery", data.gallery);
  //       setValue("description", data.description);
  //       setValue("auteurId", data.auteurId);
  //       setValue("createdAt", data.createdAt);
  //       setValue("lien", data.lien);
  //     }
  //   }, [data, setValue]);

  //   const onSubmit = async (formData) => {
  //     try {
  //       await updateAvisPersonnel({ id, ...formData }).unwrap();
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Edit Avis Personnel"
            pageTitle="Edit Avis Personnel"
          />

          <Row className="justify-content-center">
            <Col lg={8} className="mt-4">
              {/* <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="text" {...register("title", { required: true })} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Gallery</Form.Label>
                  <Form.Control type="file" multiple {...register("gallery")} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={4} {...register("description")} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Lien</Form.Label>
                  <Form.Control type="text" {...register("lien")} />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Avis Personnel"}
                </Button>
              </Form>

              {isError && <p className="text-danger mt-3">An error occurred while updating. Please try again.</p>}
              {isSuccess && <p className="text-success mt-3">Avis Personnel updated successfully!</p>}
            </Col> */}
              <h2>Edit Avis Personnel</h2>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditAvisPersonnel;
