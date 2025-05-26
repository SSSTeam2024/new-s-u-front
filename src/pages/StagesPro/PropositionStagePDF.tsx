import React from "react";
import {
  StyleSheet,
  Document,
  Image,
  Page,
  View,
  Text,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 16, textAlign: "center", marginBottom: 25 },
  text: { fontSize: 14, marginBottom: 15 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLogoRight: {
    width: 60,
    height: 60,
    marginTop: 5,
    marginRight: 50,
  },
  headerLeft: {
    alignItems: "flex-start",
    flex: 1,
  },
  headerRight: {
    alignItems: "flex-end",
    flex: 1,
  },
  headerCenter: {
    flex: 2,
    alignItems: "center",
  },
  headerText: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 5,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    margin: 20,
  },
  row: {
    flexDirection: "row",
  },
  cellFooter: {
    flex: 1,
    padding: 5,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#000",
    textAlign: "center",
    fontSize: 10,
    height: 100,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

interface PropositionProps {
  stageDetails: any;
  lastVariable: any;
}

const PropositionStagePDF: React.FC<PropositionProps> = ({
  stageDetails,
  lastVariable,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerText}>
                {lastVariable?.universite_fr}
              </Text>
              <Image
                style={styles.headerLogoRight}
                src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoUniversiteFiles/${lastVariable?.logo_universite}`}
              />
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.headerText}>
                {lastVariable?.etablissement_fr}
              </Text>
              <Image
                style={styles.headerLogoRight}
                src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoEtablissementFiles/${lastVariable?.logo_etablissement}`}
              />
            </View>
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>
              Proposition d'un {stageDetails.type_stage}
            </Text>
          </View>
        </View>
        {stageDetails.type_stage === "Stage Technicien" ? (
          <Text style={styles.text}>Stage : Technicien</Text>
        ) : (
          <Text style={styles.text}>Stage : Ouvrier</Text>
        )}
        <Text style={styles.text}>
          Période: {stageDetails.date_debut} au {stageDetails.date_fin}
        </Text>
        {stageDetails.societe === null ? (
          <>
            <Text style={styles.text}>Entreprise : </Text> .....................
          </>
        ) : (
          <Text style={styles.text}>
            Entreprise : {stageDetails.societe.nom}
          </Text>
        )}
        <Text style={styles.text}>
          Nom et Prénom étudiant(e): {stageDetails.etudiant.prenom_fr}{" "}
          {stageDetails.etudiant.nom_fr}
        </Text>
        <Text style={styles.text}>CIN: {stageDetails.etudiant.num_CIN}</Text>
        <Text style={styles.text}>Titre du Stage : {stageDetails.sujet}</Text>
        <View
          style={{
            paddingLeft: 30,
            paddingRight: 30,
          }}
        >
          <View style={styles.row}>
            <View style={styles.cellFooter}>
              <Text style={{ fontSize: 12, marginBottom: 6 }}>
                Enseignant Encadreur
              </Text>
              <Text style={{ fontSize: 12, marginBottom: 6 }}>
                Nom et Prénom :{" "}
              </Text>
              <Text
                style={{ fontSize: 14, marginBottom: 6 }}
              >{`${stageDetails.encadrant_univ.prenom_fr} ${stageDetails.encadrant_univ.nom_fr}`}</Text>
              <Text style={{ fontSize: 12, marginBottom: 10 }}>Signature</Text>
            </View>
            <View style={styles.cellFooter}>
              <Text style={{ fontSize: 12, marginBottom: 6 }}>
                Enseignant Encadreur
              </Text>
              <Text style={{ fontSize: 12, marginBottom: 6 }}>
                Nom et Prénom :{" "}
              </Text>
              <Text
                style={{ fontSize: 14, marginBottom: 6 }}
              >{`${stageDetails.encadrant_societe}`}</Text>
              <Text style={{ fontSize: 12, marginBottom: 10 }}>Signature</Text>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 11 }}>
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>N.B : </Text>
            Les stagiaires sont couverts par une assurance contractée par
            L'ENIGA - Gafsa : 1155478-002
          </Text>
        </View>
        <View
          style={{
            borderTopWidth: 1,
            borderColor: "#000",
            marginTop: 225,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 11, marginTop: 5 }}>
            Adresse : {lastVariable?.address_fr}
          </Text>
          <Text style={{ textAlign: "center", fontSize: 11 }}>
            Tél : {lastVariable?.phone!} | Fax: {lastVariable?.fax!}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PropositionStagePDF;
