import React from 'react';
import { Container } from 'react-bootstrap';
import Breadcrumb from 'Common/BreadCrumb';
import ProfilPersonnel from './ProfilPersonnel';

const AccountPersonnel = () => {

    document.title = "Compte Personnel | Smart University";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumb title="Profil personnel" pageTitle="Profils" />
                    <ProfilPersonnel />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default AccountPersonnel;