import React from "react";
import {
  StyleSheet,
  Document,
  Image,
  Page,
  View,
  Text,
  Font,
} from "@react-pdf/renderer";
import Html from "react-pdf-html";

Font.register({
  family: "Cairo-Regular",
  src: "/fonts/Cairo-Regular.ttf",
});

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: {
    fontFamily: "Cairo-Regular",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 25,
  },
  text: { fontFamily: "Cairo-Regular" },
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

const stylesCalenderFilter = StyleSheet.create({
  page: {
    padding: 50,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    margin: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  footerRightText: {
    fontSize: 11,
    textAlign: "right",
    marginBottom: 2,
  },
  footerleftColumn: {
    position: "absolute",
    bottom: 20,
    left: 50,
  },
  footerTextDirecteur: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
  },
  footerText: {
    fontSize: 12,
    marginBottom: 50,
  },
  signatureSpace: {
    height: 40,
    marginTop: 10,
    borderBottom: "1px solid black",
    width: 150,
  },
  rightColumn: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginRight: 20,
  },
  logo: {
    width: 50,
    height: 50,
    objectFit: "contain",
    marginTop: 5,
    marginRight: 50,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
  },
  text: {
    fontSize: 10,
    marginBottom: 2,
  },
  timetable: {
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 30,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  cell: {
    padding: 5,
    borderRightWidth: 1,
    borderColor: "#000",
    textAlign: "center",
    fontSize: 10,
  },
  nameCell: {
    padding: 5,
    borderRightWidth: 1,
    borderColor: "#000",
    textAlign: "left",
    fontSize: 10,
  },
  dayCell: {
    width: 150,
    fontWeight: "bold",
  },
  classeCell: {
    width: 100,
    fontWeight: "bold",
  },
  salleCell: {
    width: 150,
  },
  matiereCell: {
    flex: 1,
  },
  timeCell: {
    width: 120,
  },
  headerRow: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  dateCell: {
    width: 70,
    fontWeight: "bold",
  },
  heureCell: {
    width: 55,
    fontWeight: "bold",
  },
  dureeCell: {
    width: 50,
    fontWeight: "bold",
  },
  groupeCell: {
    width: 80,
    fontWeight: "bold",
  },
  epreuveCell: {
    width: 115,
    fontWeight: "bold",
  },
  salleepreuveCell: {
    width: 40,
    fontWeight: "bold",
  },
  responsableCell: {
    width: 110,
    fontWeight: "bold",
  },
  nombreCopie: {
    width: 30,
    fontWeight: "bold",
  },
  etudiant: {
    width: 120,
    fontWeight: "bold",
  },
  cinEtudiant: {
    width: 60,
    fontWeight: "bold",
  },
  sujet: {
    width: 210,
    fontWeight: "bold",
  },
  avis: {
    width: 50,
    fontWeight: "bold",
  },
  remarques: {
    width: 110,
    fontWeight: "bold",
  },
  nbrePages: {
    width: 70,
    fontWeight: "bold",
  },
  codeZone: {
    padding: 5,
  },
  infoZone: {
    padding: 5,
    textAlign: "center",
    lineHeight: 2,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emergedTableV1: {
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 20,
    marginBottom: 100,
  },
  emergedTableV2: {
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 20,
    marginBottom: 20,
  },
  emergedTableV3: {
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 20,
    marginBottom: 4,
  },

  emergedTableV4: {
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 20,
    marginBottom: 50,
  },

  surTable: {
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 20,
  },
  cellFooter: {
    flex: 1,
    padding: 5,
    borderRightWidth: 1,
    borderColor: "#000",
    textAlign: "center",
    fontSize: 10,
    height: 60,
  },
  block: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: "#000",
  },
  cellQRCode: {
    padding: 5,
    textAlign: "center",
    fontSize: 10,
  },
  headerLeft: {
    flex: 1,
    alignItems: "center",
  },
  headerRight: {
    flex: 1,
    alignItems: "center",
  },
  headerCenter: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  headerText: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
  },
  headerLogo: {
    width: 70,
    height: 70,
    objectFit: "contain",
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 12,
    textAlign: "center",
  },
  centeredRightSection: {
    marginTop: 5,
    alignItems: "center",
  },
  infoText: {
    fontSize: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
});

interface PvProps {
  avisComm: any;
  title: any;
  content: any;
  lastVariable: any;
}

const PdfFile: React.FC<PvProps> = ({
  avisComm,
  title,
  content,
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
            <Text style={styles.title}>{title}</Text>
          </View>
        </View>
        <View style={styles.text}>
          <Html>{content}</Html>
        </View>
        <View style={stylesCalenderFilter.emergedTableV1}>
          <View
            style={[stylesCalenderFilter.row, stylesCalenderFilter.headerRow]}
          >
            <Text
              style={[stylesCalenderFilter.cell, stylesCalenderFilter.etudiant]}
            >
              Etudiant
            </Text>
            <Text
              style={[
                stylesCalenderFilter.cell,
                stylesCalenderFilter.cinEtudiant,
              ]}
            >
              Groupe
            </Text>
            <Text
              style={[stylesCalenderFilter.cell, stylesCalenderFilter.sujet]}
            >
              Sujet
            </Text>
            <Text
              style={[stylesCalenderFilter.cell, stylesCalenderFilter.avis]}
            >
              Avis
            </Text>
            <Text
              style={[
                stylesCalenderFilter.cell,
                stylesCalenderFilter.remarques,
              ]}
            >
              Remarques
            </Text>
          </View>
          {avisComm.liste.map((comm: any, index: number) => {
            return (
              <>
                <View style={stylesCalenderFilter.row} key={index}>
                  <Text
                    style={[
                      stylesCalenderFilter.cell,
                      stylesCalenderFilter.etudiant,
                    ]}
                  >
                    {comm.etudiant}
                  </Text>
                  <Text
                    style={[
                      stylesCalenderFilter.cell,
                      stylesCalenderFilter.cinEtudiant,
                    ]}
                  >
                    {comm?.groupe!}
                  </Text>
                  <Text
                    style={[
                      stylesCalenderFilter.nameCell,
                      stylesCalenderFilter.sujet,
                    ]}
                  >
                    {comm?.sujet!}
                  </Text>
                  <Text
                    style={[
                      stylesCalenderFilter.cell,
                      stylesCalenderFilter.avis,
                    ]}
                  >
                    {comm?.avis!}
                  </Text>
                  <Text
                    style={[
                      stylesCalenderFilter.cell,
                      stylesCalenderFilter.remarques,
                    ]}
                  >
                    {comm?.remarques!}
                  </Text>
                </View>
              </>
            );
          })}
        </View>
        {/* Table */}
        <View style={{ borderWidth: 1, borderColor: "#000" }}>
          {/* Body */}
          <View style={stylesCalenderFilter.row}>
            {avisComm.commission.membres.map((membre: any, index: any) => (
              <View style={stylesCalenderFilter.cellFooter} key={index}>
                <Text>{`${membre.prenom_fr} ${membre.nom_fr}`}</Text>
              </View>
            ))}
          </View>
        </View>
        <Text
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            fontSize: "12px",
            padding: "10px",
          }}
          render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`}
        />
      </Page>
    </Document>
  );
};

export default PdfFile;
