export const replaceShortCodes = (demandData: any, globalData: any) => {
  let piece_demande = demandData?.piece_demande;
  let studentId = demandData?.studentId;
  let enseignantId = demandData?.enseignantId;
  let personnelId = demandData?.personnelId;
  let raison = demandData?.raison;
  let formattedDate = new Date(demandData?.createdAt).toLocaleDateString(
    "fr-FR"
  );
  let departement = demandData.studentId.groupe_classe.departement;
  let allVariables = globalData[2];

  let anneeScolaire = "";
  let newUpdateBody = piece_demande?.body ?? "";

  let newBody = piece_demande?.body ?? "";

  if (newBody?.includes("اسم-الطالب")) {
    newBody = newBody?.replace(
      "اسم-الطالب",
      studentId.prenom_ar + " " + studentId.nom_ar
    );
  }
  if (newBody?.includes("تاريخ-ولادة-الطالب")) {
    newBody = newBody?.replace("تاريخ-ولادة-الطالب", studentId.date_naissance);
  }
  if (newBody?.includes("جنسية-الطالب")) {
    newBody = newBody?.replace("جنسية-الطالب", studentId.nationalite);
  }
  if (newBody?.includes("جنس-الطالب")) {
    newBody = newBody?.replace("جنس-الطالب", studentId.sexe);
  }
  if (newBody?.includes("حالة-حساب-الطالب")) {
    newBody = newBody?.replace(
      "حالة-حساب-الطالب",
      studentId.etat_compte.etat_ar
    );
  }
  if (newBody?.includes("مجموعة-الطالب")) {
    newBody = newBody?.replace(
      "مجموعة-الطالب",
      studentId.groupe_classe.nom_classe_ar
    );
  }
  if (newBody?.includes("عنوان-الطالب")) {
    newBody = newBody?.replace("عنوان-الطالب", studentId.adress_ar);
  }
  if (newBody?.includes("هاتف-الطالب")) {
    newBody = newBody?.replace("هاتف-الطالب", studentId.num_phone);
  }
  if (newBody?.includes("رقم-بطاقة-الطالب")) {
    newBody = newBody?.replace("رقم-بطاقة-الطالب", studentId.num_CIN);
  }
  if (newBody?.includes("ايميل-الطالب")) {
    newBody = newBody?.replace("ايميل-الطالب", studentId.email);
  }
  if (newBody?.includes("وظيفة-اب-الطالب")) {
    newBody = newBody?.replace("وظيفة-اب-الطالب", studentId.job_pere);
  }
  if (newBody?.includes("اسم-اب-الطالب")) {
    newBody = newBody?.replace("اسم-اب-الطالب", studentId.nom_pere);
  }
  if (newBody?.includes("اسم-ام-الطالب")) {
    newBody = newBody?.replace("اسم-ام-الطالب", studentId.nom_mere);
  }
  if (newBody?.includes("نوع-التسجيل")) {
    newBody = newBody?.replace(
      "نوع-التسجيل",
      studentId.type_inscription.type_ar
    );
  }

  // STUDENT fr
  if (newBody?.includes("nom_etudiant")) {
    newBody = newBody?.replace(
      "nom_etudiant",
      studentId.prenom_fr + " " + studentId.nom_fr
    );
  }
  if (newBody?.includes("date_naissance_etudiant")) {
    newBody = newBody?.replace(
      "date_naissance_etudiant",
      studentId.date_naissance
    );
  }
  if (newBody?.includes("adresse_etudiant")) {
    newBody = newBody?.replace("adresse_etudiant", studentId.adress_fr);
  }
  if (newBody?.includes("lieu_naissance-etudiant")) {
    newBody = newBody?.replace(
      "lieu_naissance-etudiant",
      studentId.lieu_naissance_fr
    );
  }
  if (newBody?.includes("nationalité-etudiant")) {
    newBody = newBody?.replace("nationalité-etudiant", studentId.nationalite);
  }
  if (newBody?.includes("cin_etudiant")) {
    newBody = newBody?.replace("cin_etudiant", studentId.num_CIN);
  }
  if (newBody?.includes("etat-compte-etudiant")) {
    newBody = newBody?.replace(
      "etat-compte-etudiant",
      studentId.etat_compte.etat_fr
    );
  }
  if (newBody?.includes("classe_etudiant")) {
    newBody = newBody?.replace(
      "classe_etudiant",
      studentId.groupe_classe.nom_classe_fr
    );
  }
  if (newBody?.includes("classe_etudiant")) {
    newBody = newBody?.replace(
      "classe_etudiant",
      studentId.groupe_classe.nom_classe_fr
    );
  }
  if (newBody?.includes("type_inscription")) {
    newBody = newBody?.replace(
      "type_inscription",
      studentId.type_inscription.type_fr
    );
  }
  if (newBody?.includes("telephone_etudiant")) {
    newBody = newBody?.replace("telephone_etudiant", studentId.num_phone);
  }
  if (newBody?.includes("email_etudiant")) {
    newBody = newBody?.replace("email_etudiant", studentId.email);
  }
  if (newBody?.includes("profession_pere_etudiant")) {
    newBody = newBody?.replace("profession_pere_etudiant", studentId.job_pere);
  }
  if (newBody?.includes("nom_pere_etudiant")) {
    newBody = newBody?.replace("nom_pere_etudiant", studentId.nom_pere);
  }
  if (newBody?.includes("nom_mere_etudiant")) {
    newBody = newBody?.replace("nom_mere_etudiant", studentId.nom_mere);
  }

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

  // personnel FR
  if (newBody?.includes("nom_personnel_fr")) {
    newBody = newBody?.replace(
      /nom_personnel_fr/g,
      personnelId.nom_fr + " " + personnelId.prenom_fr
    );
  }

  if (newBody?.includes("poste_personnel")) {
    newBody = newBody.replace(/poste_personnel/g, personnelId?.poste.poste_fr!);
  }
  if (newBody?.includes("date_affectation_personnel")) {
    newBody = newBody.replace(
      /date_affectation_personnel/g,
      personnelId?.date_affectation!
    );
  }
  if (newBody?.includes("date_naissance_personnel")) {
    newBody = newBody.replace(
      /date_naissance_personnel/g,
      personnelId?.date_naissance!
    );
  }
  if (newBody?.includes("etat_civil_personnel")) {
    newBody = newBody.replace(
      /etat_civil_personnel/g,
      personnelId?.etat_civil!
    );
  }
  if (newBody?.includes("etat_compte_personnel")) {
    newBody = newBody.replace(
      /etat_compte_personnel/g,
      personnelId?.etat_compte?.etat_fr!
    );
  }
  if (newBody?.includes("service_personnel")) {
    newBody = newBody.replace(
      /service_personnel/g,
      personnelId?.service?.service_fr!
    );
  }
  if (newBody?.includes("grade_personnel")) {
    newBody = newBody.replace(
      /grade_personnel/g,
      personnelId?.grade?.grade_fr!
    );
  }
  if (newBody?.includes("compte_courant_personnel")) {
    newBody = newBody.replace(
      /compte_courant_personnel/g,
      personnelId?.compte_courant!
    );
  }
  if (newBody?.includes("identifiant_unique_personnel")) {
    newBody = newBody.replace(
      /identifiant_unique_personnel/g,
      personnelId?.identifinat_unique!
    );
  }
  if (newBody?.includes("email_personnel")) {
    newBody = newBody.replace(/email_personnel/g, personnelId?.email!);
  }
  if (newBody?.includes("CIN_personnel")) {
    newBody = newBody.replace(/CIN_personnel/g, personnelId?.num_cin!);
  }
  if (newBody?.includes("adresse_personnel")) {
    newBody = newBody.replace(/adresse_personnel/g, personnelId?.adress_fr!);
  }
  if (newBody?.includes("nom_conjoint_personnel")) {
    newBody = newBody.replace(
      /nom_conjoint_personnel/g,
      personnelId?.nom_conjoint!
    );
  }
  if (newBody?.includes("profession_conjoint_personnel")) {
    newBody = newBody.replace(
      /profession_conjoint_personnel/g,
      personnelId?.job_conjoint!
    );
  }
  if (newBody?.includes("nombre_fls_personnel")) {
    newBody = newBody.replace(
      /nombre_fls_personnel/g,
      personnelId?.job_conjoint!
    );
  }

  //Personnel AR
  if (newBody?.includes("اسم-الموظف")) {
    newBody = newBody.replace(
      /اسم-الموظف/g,
      personnelId.nom_ar + " " + personnelId.prenom_ar
    );
  }

  if (newBody?.includes("تاريخ-ولادة-الموظف")) {
    newBody = newBody.replace(
      /تاريخ-ولادة-الموظف/g,
      personnelId.date_naissance
    );
  }

  if (newBody?.includes("عنوان-الموظف")) {
    newBody = newBody.replace(/عنوان-الموظف/g, personnelId.adress_ar);
  }

  if (newBody?.includes("مكان-ولادة-الموظف")) {
    newBody = newBody.replace(
      /مكان-ولادة-الموظف/g,
      personnelId.lieu_naissance_ar
    );
  }

  if (newBody?.includes("تاريخ-الحاق-الموظف")) {
    newBody = newBody.replace(
      /تاريخ-الحاق-الموظف/g,
      personnelId.date_affectation
    );
  }

  if (newBody?.includes("مكان-ولادة-الموظف")) {
    newBody = newBody.replace(
      /مكان-ولادة-الموظف/g,
      personnelId.lieu_naissance_ar
    );
  }

  if (newBody?.includes("الحالة-المدنية-للموظف")) {
    newBody = newBody.replace(/الحالة-المدنية-للموظف/g, personnelId.etat_civil);
  }

  if (newBody?.includes("جنس-الموظف")) {
    newBody = newBody.replace(/جنس-الموظف/g, personnelId.sexe);
  }

  if (newBody?.includes("رقم-هاتف-الموظف")) {
    newBody = newBody.replace(/رقم-هاتف-الموظف/g, personnelId.num_phone1);
  }

  if (newBody?.includes("حالة-حساب-الموظف")) {
    newBody = newBody.replace(
      /حالة-حساب-الموظف/g,
      personnelId.etat_compte.etat_ar
    );
  }

  if (newBody?.includes("الخطة-الوظيفية-للموظف")) {
    newBody = newBody.replace(
      /الخطة-الوظيفية-للموظف/g,
      personnelId.poste.poste_ar
    );
  }

  if (newBody?.includes("رتبة-الموظف")) {
    newBody = newBody.replace(/رتبة-الموظف/g, personnelId.grade.grade_ar);
  }

  if (newBody?.includes("صنف-الموظف")) {
    newBody = newBody.replace(
      /صنف-الموظف/g,
      personnelId.categorie.categorie_ar
    );
  }

  if (newBody?.includes("خدمة-الموظف")) {
    newBody = newBody.replace(/خدمة-الموظف/g, personnelId.service.service_ar);
  }

  if (newBody?.includes("الحساب-الجاري-للموظف")) {
    newBody = newBody.replace(
      /الحساب-الجاري-للموظف/g,
      personnelId.compte_courant
    );
  }

  if (newBody?.includes("تاريخ-اصدار-بطاقة-الموظف")) {
    newBody = newBody.replace(
      /تاريخ-اصدار-بطاقة-الموظف/g,
      personnelId.date_delivrance
    );
  }

  if (newBody?.includes("ايميل-الموظف")) {
    newBody = newBody.replace(/ايميل-الموظف/g, personnelId.email);
  }

  if (newBody?.includes("اسم-زوج-الموظف")) {
    newBody = newBody.replace(/اسم-زوج-الموظف/g, personnelId.nom_conjoint);
  }

  if (newBody?.includes("عدد-ابناء-الموظف")) {
    newBody = newBody.replace(/عدد-ابناء-الموظف/g, personnelId.nombre_fils);
  }

  if (newBody?.includes("وظيفة-زوج-الموظف")) {
    newBody = newBody.replace(/وظيفة-زوج-الموظف/g, personnelId.job_conjoint);
  }

  // enseignant FR
  if (newBody?.includes("nom_enseignant")) {
    newBody = newBody.replace(
      /nom_enseignant/g,
      enseignantId.nom_fr + " " + enseignantId.prenom_fr
    );
  }

  if (newBody?.includes("date_affectation_enseignant")) {
    newBody = newBody.replace(
      /date_affectation_enseignant/g,
      enseignantId.date_affectation
    );
  }

  if (newBody?.includes("date_naissance_enseignant")) {
    newBody = newBody.replace(
      /date_naissance_enseignant/g,
      enseignantId.date_naissance
    );
  }

  if (newBody?.includes("etat_civil_enseignant")) {
    newBody = newBody.replace(
      /etat_civil_enseignant/g,
      enseignantId.etat_civil
    );
  }

  if (newBody?.includes("etat_compte_enseignant")) {
    newBody = newBody.replace(
      /etat_compte_enseignant/g,
      enseignantId.etat_compte.etat_fr
    );
  }

  if (newBody?.includes("poste_enseignant")) {
    newBody = newBody.replace(/poste_enseignant/g, enseignantId.poste.poste_fr);
  }

  if (newBody?.includes("specialité_enseignant")) {
    newBody = newBody.replace(
      /specialité_enseignant/g,
      enseignantId.specilaite.specialite_fr
    );
  }

  if (newBody?.includes("departement_enseignant")) {
    newBody = newBody.replace(
      /departement_enseignant/g,
      enseignantId.departements.name_fr
    );
  }

  if (newBody?.includes("grade_enseignant")) {
    newBody = newBody.replace(/grade_enseignant/g, enseignantId.grade.grade_fr);
  }

  if (newBody?.includes("compte_courant_enseignant")) {
    newBody = newBody.replace(
      /compte_courant_enseignant/g,
      enseignantId.compte_courant
    );
  }

  if (newBody?.includes("identifiant_unique_enseignant")) {
    newBody = newBody.replace(
      /identifiant_unique_enseignant/g,
      enseignantId.identifinat_unique
    );
  }

  if (newBody?.includes("CIN_enseignant")) {
    newBody = newBody.replace(/CIN_enseignant/g, enseignantId.num_cin);
  }

  if (newBody?.includes("email_enseignant")) {
    newBody = newBody.replace(/email_enseignant/g, enseignantId.email);
  }

  if (newBody?.includes("adresse_enseignant")) {
    newBody = newBody.replace(/adresse_enseignant/g, enseignantId.adress_fr);
  }

  if (newBody?.includes("nom_conjoint_enseignant")) {
    newBody = newBody.replace(
      /nom_conjoint_enseignant/g,
      enseignantId.nom_conjoint
    );
  }

  if (newBody?.includes("profession_conjoint_enseignant")) {
    newBody = newBody.replace(
      /profession_conjoint_enseignant/g,
      enseignantId.job_conjoint
    );
  }

  if (newBody?.includes("nombre_fils_enseignant")) {
    newBody = newBody.replace(
      /nombre_fils_enseignant/g,
      enseignantId.nombre_fils
    );
  }

  // enseignant AR

  if (newBody?.includes("مكان-ولادة-الأستاذ")) {
    newBody = newBody.replace(
      /مكان-ولادة-الأستاذ/g,
      enseignantId.lieu_naissance_ar
    );
  }

  if (newBody?.includes("تاريخ-الحاق-الأستاذ")) {
    newBody = newBody.replace(
      /تاريخ-الحاق-الأستاذ/g,
      enseignantId.date_affectation
    );
  }

  if (newBody?.includes("الحالة-المدنية-للأستاذ")) {
    newBody = newBody.replace(
      /الحالة-المدنية-للأستاذ/g,
      enseignantId.etat_civil
    );
  }

  if (newBody?.includes("جنس-الأستاذ")) {
    newBody = newBody.replace(/جنس-الأستاذ/g, enseignantId.sexe);
  }

  if (newBody?.includes("رقم-هاتف-الأستاذ")) {
    newBody = newBody.replace(/رقم-هاتف-الأستاذ/g, enseignantId.num_phone1);
  }

  if (newBody?.includes("حالة-حساب-الأستاذ")) {
    newBody = newBody.replace(
      /حالة-حساب-الأستاذ/g,
      enseignantId.etat_compte.etat_ar
    );
  }

  if (newBody?.includes("الخطة-الوظيفية-للأستاذ")) {
    newBody = newBody.replace(
      /الخطة-الوظيفية-للأستاذ/g,
      enseignantId.grade.grade_ar
    );
  }

  if (newBody?.includes("رتبة-الأستاذ")) {
    newBody = newBody.replace(/رتبة-الأستاذ/g, enseignantId.poste.poste_ar);
  }

  if (newBody?.includes("الحساب-الجاري-للأستاذ")) {
    newBody = newBody.replace(
      /الحساب-الجاري-للأستاذ/g,
      enseignantId.compte_courant
    );
  }

  if (newBody?.includes("تاريخ-اصدار-بطاقة-الأستاذ")) {
    newBody = newBody.replace(
      /تاريخ-اصدار-بطاقة-الأستاذ/g,
      enseignantId.date_delivrance
    );
  }

  if (newBody?.includes("ايميل-الأستاذ")) {
    newBody = newBody.replace(/ايميل-الأستاذ/g, enseignantId.email);
  }

  if (newBody?.includes("اسم-زوج-الأستاذ")) {
    newBody = newBody.replace(/اسم-زوج-الأستاذ/g, enseignantId.nom_conjoint);
  }

  if (newBody?.includes("عدد-ابناء-الأستاذ")) {
    newBody = newBody.replace(/عدد-ابناء-الأستاذ/g, enseignantId.nombre_fils);
  }

  if (newBody?.includes("وظيفة-زوج-الأستاذ")) {
    newBody = newBody.replace(/وظيفة-زوج-الأستاذ/g, enseignantId.job_conjoint);
  }

  if (newBody?.includes("اسم-الأستاذ")) {
    newBody = newBody.replace(/اسم-الأستاذ/g, enseignantId.nom_ar);
  }

  if (newBody?.includes("تاريخ-ولادة-الأستاذ")) {
    newBody = newBody.replace(
      /تاريخ-ولادة-الأستاذ/g,
      enseignantId.date_naissance
    );
  }

  if (newBody?.includes("الجنسية-الأستاذ")) {
    newBody = newBody.replace(/الجنسية-الأستاذ/g, enseignantId.nationalite);
  }

  if (newBody?.includes("الاختصاص-الأستاذ")) {
    newBody = newBody.replace(
      /الاختصاص-الأستاذ/g,
      enseignantId.specilaite.specialite_ar
    );
  }
  console.log(newBody);
  newUpdateBody = JSON.parse(newBody);

  return newUpdateBody;
};
