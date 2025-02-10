export const replaceShortCodes = (
  templateData: any,
  missionData: any,
  globalData: any
) => {
  let formattedDate = new Date(templateData?.createdAt).toLocaleDateString(
    "fr-FR"
  );

  let allVariables = globalData[2];

  let anneeScolaire = "";
  let newUpdateBody = templateData?.body ?? "";

  let newBody = templateData?.body ?? "";

  // university ar
  if (newBody?.includes("اسم-الجامعة")) {
    newBody = newBody?.replace("اسم-الجامعة", allVariables.universite_ar);
  }
  if (newBody?.includes("اسم-المؤسسة")) {
    newBody = newBody?.replace("اسم-المؤسسة", allVariables.etablissement_ar);
  }
  if (newBody?.includes("اسم-المدير")) {
    newBody = newBody?.replace("اسم-المدير", allVariables.directeur_ar);
  }
  if (newBody?.includes("المدينة")) {
    newBody = newBody?.replace("المدينة", allVariables.gouvernorat_ar);
  }
  if (newBody?.includes("السنة-الدراسية")) {
    newBody = newBody?.replace("السنة-الدراسية", anneeScolaire);
  }
  if (newBody?.includes("موقع-المؤسسة")) {
    newBody = newBody?.replace("موقع-المؤسسة", allVariables.website);
  }
  if (newBody?.includes("فاكس-المؤسسة")) {
    newBody = newBody?.replace("فاكس-المؤسسة", allVariables.fax);
  }
  if (newBody?.includes("هاتف-المؤسسة")) {
    newBody = newBody?.replace("هاتف-المؤسسة", allVariables.phone);
  }
  if (newBody?.includes("عنوان-المؤسسة")) {
    newBody = newBody?.replace("عنوان-المؤسسة", allVariables.address_ar);
  }
  // UNIVERSITY FR
  if (newBody?.includes("nom_directeur")) {
    console.log(allVariables);
    newBody = newBody?.replace("nom_directeur", allVariables.directeur_fr);
  }

  if (newBody?.includes("nom_secretaire_général")) {
    newBody = newBody?.replace(
      "nom_secretaire_général",
      allVariables.secretaire_fr
    );
  }
  if (newBody?.includes("nom-etablissement")) {
    newBody = newBody?.replace(
      "nom-etablissement",
      allVariables.etablissement_fr
    );
  }
  if (newBody?.includes("adresse_etablissement")) {
    newBody = newBody?.replace(
      "adresse_etablissement",
      allVariables.address_fr
    );
  }
  if (newBody?.includes("phone_etablissement")) {
    newBody = newBody?.replace("phone_etablissement", allVariables.phone);
  }
  if (newBody?.includes("fax_etablissement")) {
    newBody = newBody?.replace("fax_etablissement", allVariables.fax);
  }

  if (newBody?.includes("nom_université")) {
    newBody = newBody?.replace("nom_université", allVariables.universite_fr);
  }
  if (newBody?.includes("année_universitaire")) {
    newBody = newBody?.replace("année_universitaire", anneeScolaire);
  }
  if (newBody?.includes("Ville")) {
    newBody = newBody?.replace("Ville", allVariables?.gouvernorat_fr!);
  }
  if (newBody?.includes("Date_d'aujourd'hui")) {
    newBody = newBody?.replace("Date_d'aujourd'hui", formattedDate);
  }
  // tache
  if (newBody?.includes("motif")) {
    newBody = newBody?.replace("motif", missionData.motif);
  }
  if (newBody?.includes("date_affectation")) {
    newBody = newBody?.replace(
      "date_affectation",
      missionData.date_affectation
    );
  }
  if (newBody?.includes("date_fin")) {
    newBody = newBody?.replace("date_fin", missionData.date_fin);
  }
  if (newBody?.includes("objectif")) {
    newBody = newBody?.replace("objectif", missionData.objectif);
  }
  if (newBody?.includes("attribuée_à")) {
    if (missionData.personnel) {
      newBody = newBody.replace(
        "attribuée_à",
        `${missionData.personnel.prenom_fr} ${missionData.personnel.nom_fr}`
      );
    } else if (missionData.enseignant) {
      newBody = newBody.replace(
        "attribuée_à",
        `${missionData.enseignant.prenom_fr} ${missionData.enseignant.nom_fr}`
      );
    }
  }
  if (newBody?.includes("attribué_par")) {
    newBody = newBody?.replace("attribué_par", allVariables.directeur_fr);
  }
  // personnel FR

  console.log(newBody);
  newUpdateBody = JSON.parse(newBody);

  return newUpdateBody;
};
