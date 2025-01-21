import { useFetchClassesQuery } from "features/classe/classe";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import React, { useEffect, useState, useMemo } from "react";

import {
  pdf,
  StyleSheet,
  Document,
  Page,
  View,
  Text,
} from "@react-pdf/renderer";
import { useFetchEtudiantsQuery } from "features/etudiant/etudiantSlice";

const ListEmergement = ({ classeId }: { classeId: string }) => {
  const { data: AllEtudiants = [] } = useFetchEtudiantsQuery();
  const etudiants = AllEtudiants.filter(
    (etudiant) => etudiant?.groupe_classe?._id! === classeId
  );

  return (
    <Document>
      <Page orientation="landscape">
        <Text>List of Students for Classe ID: {classeId}</Text>
        {etudiants.map((etudiant, index) => (
          <Text key={etudiant._id}>
            {index + 1}. {etudiant.prenom_fr} {etudiant.nom_fr}
          </Text>
        ))}
      </Page>
    </Document>
  );
};

export default ListEmergement;
