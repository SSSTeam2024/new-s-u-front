import React from 'react';
import { Container } from 'react-bootstrap';
import Breadcrumb from 'Common/BreadCrumb';

import ProfilEtudiant from './ProfilEtudiant';

const MyAccount = () => {

    document.title = "Compte Etudiant | Smart University";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumb title="Profil étudiant" pageTitle="Profils"  />
                    <ProfilEtudiant />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default MyAccount;