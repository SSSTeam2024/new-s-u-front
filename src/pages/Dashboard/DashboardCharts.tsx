import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "Common/ChartsDynamicColor";
import { useFetchEtudiantsQuery } from "features/etudiant/etudiantSlice";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import { useFetchPersonnelsQuery } from "features/personnel/personnelSlice";
import { useFetchAbsencePersonnelsQuery } from "features/absencePersonnel/absencePersonnel";
import {
  Resultat,
  useFetchResultatsQuery,
} from "features/resultats/resultatsSlice";

const RevenueCharts = ({ dataColors, chartData }: any) => {
  var revenueChartColors = getChartColorsArray(dataColors);

  const series = chartData;

  var options: any = {
    chart: {
      height: 405,
      zoom: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    colors: revenueChartColors,
    markers: {
      size: 0,
      colors: "#ffffff",
      strokeColors: revenueChartColors,
      strokeWidth: 1,
      strokeOpacity: 0.9,
      fillOpacity: 1,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [2, 2, 2],
      curve: "smooth",
    },
    fill: {
      type: ["solid", "gradient", "solid"],
      gradient: {
        shadeIntensity: 1,
        type: "vertical",
        inverseColors: false,
        opacityFrom: 0.3,
        opacityTo: 0.0,
        stops: [20, 80, 100, 100],
      },
    },
    grid: {
      row: {
        colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.2,
      },
      borderColor: "#f1f1f1",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            toolbar: {
              show: false,
            },
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  };
  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series}
        type="line"
        height="405"
        className="apex-charts"
      />
    </React.Fragment>
  );
};

const SatisfactionChart = ({ dataColors }: any) => {
  const satisfactionChartsColors = getChartColorsArray(dataColors);
  const series = [
    {
      name: "This Month",
      data: [49, 54, 48, 54, 67, 88, 96],
    },
    {
      name: "Last Month",
      data: [57, 66, 74, 63, 55, 70, 85],
    },
  ];
  var options: any = {
    chart: {
      height: 250,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    fill: {
      type: ["gradient", "gradient"],
      gradient: {
        shadeIntensity: 1,
        type: "vertical",
        inverseColors: false,
        opacityFrom: 0.3,
        opacityTo: 0.0,
        stops: [50, 70, 100, 100],
      },
    },
    markers: {
      size: 4,
      colors: "#ffffff",
      strokeColors: satisfactionChartsColors,
      strokeWidth: 1,
      strokeOpacity: 0.9,
      fillOpacity: 1,
      hover: {
        size: 6,
      },
    },
    grid: {
      show: false,
      padding: {
        top: -35,
        right: 0,
        bottom: 0,
        left: -6,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [2, 2],
      curve: "smooth",
    },
    colors: satisfactionChartsColors,
    xaxis: {
      labels: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
  };
  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height="240"
        className="apex-charts"
      />
    </React.Fragment>
  );
};

const TopCategoriesChart = ({ dataColors }: any) => {
  const topCategoriesChartsColors = getChartColorsArray(dataColors);
  const series = [85, 69, 45, 78];
  var options = {
    chart: {
      height: 300,
      type: "radialBar",
    },
    sparkline: {
      enabled: true,
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
          },
          total: {
            show: true,
            label: "Sales",
            formatter: function (w: any) {
              return 2922;
            },
          },
        },
      },
    },
    labels: ["Fashion", "Electronics", "Groceries", "Others"],
    colors: topCategoriesChartsColors,
    legend: {
      show: false,
      fontSize: "16px",
      position: "bottom",
      labels: {
        useSeriesColors: true,
      },
      markers: {
        size: 0,
      },
    },
  };
  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height="300"
        className="apex-charts"
      />
    </React.Fragment>
  );
};

const Groupes = ({ dataColors }: any) => {
  var chartGroupbarColors = getChartColorsArray(dataColors);
  const result = useFetchEtudiantsQuery();
  const data: any[] = result.data ?? [];

  const etudiantsFeminin = data.filter(
    (etudiant) => etudiant.sexe === "Femme/أنثى" || etudiant.sexe === "Feminin "
  );

  const etudiantsMasculin = data.filter(
    (etudiant) => etudiant.sexe === "Masculin "
  );

  const uniqueYears = Array.from(
    new Set(data.map((etudiant) => new Date(etudiant.createdAt).getFullYear()))
  );

  const series = [
    {
      name: "Total",
      data: [data.length],
    },
    {
      name: "Feminin",
      data: [etudiantsFeminin.length],
    },
    {
      name: "Masculin",
      data: [etudiantsMasculin.length],
    },
  ];

  var options: any = {
    chart: {
      type: "bar",
      height: 410,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: "12px",
        colors: ["#fff"],
      },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["#fff"],
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    xaxis: {
      categories: [uniqueYears],
    },
    colors: chartGroupbarColors,
  };
  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        className="apex-charts"
        options={options}
        series={series}
        type="bar"
        height={410}
      />
    </React.Fragment>
  );
};

const MonochromePie = ({ dataColors }: any) => {
  const { data = [] } = useFetchEnseignantsQuery();

  const counts: Record<string, number> = data.reduce(
    (acc: any, enseignant: any) => {
      const situation = enseignant.situation_fr || "Inconnu";
      acc[situation] = (acc[situation] || 0) + 1;
      return acc;
    },
    {}
  );

  const series = Object.values(counts);
  var options: any = {
    chart: {
      height: 300,
      type: "pie",
    },
    labels: Object.keys(counts),
    theme: {
      monochrome: {
        enabled: true,
        color: "#405189",
        shadeTo: "light",
        shadeIntensity: 0.6,
      },
    },

    plotOptions: {
      pie: {
        dataLabels: {
          offset: -5,
        },
      },
    },

    dataLabels: {
      formatter: function (val: any, opts: any) {
        var name = opts.w.globals.labels[opts.seriesIndex];
        return [name, val.toFixed(1) + "%"];
      },
      dropShadow: {
        enabled: false,
      },
    },
    legend: {
      show: false,
    },
  };
  return (
    <ReactApexChart
      dir="ltr"
      className="apex-charts"
      series={series}
      options={options}
      type="pie"
      height={300}
    />
  );
};

const ColorRangeTreemap = ({ dataColors }: any) => {
  const { data = [] } = useFetchPersonnelsQuery();
  var chartTreemapRangeColors = getChartColorsArray(dataColors);

  const counts: Record<string, number> = data.reduce(
    (acc: any, personnel: any) => {
      const grade = personnel.grade?.grade_fr! || "Inconnu";
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    },
    {}
  );

  const series = [
    {
      data: Object.entries(counts).map(([grade, count]) => ({
        x: grade,
        y: count,
      })),
    },
  ];

  var options: any = {
    legend: {
      show: false,
    },
    chart: {
      height: 350,
      type: "treemap",
      toolbar: {
        show: false,
      },
    },

    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
      },
      formatter: function (text: any, op: any) {
        return [text, op.value];
      },
      offsetY: -4,
    },
    plotOptions: {
      treemap: {
        enableShades: true,
        shadeIntensity: 0.5,
        reverseNegativeShade: true,
        colorScale: {
          ranges: [
            {
              from: -6,
              to: 0,
              color: chartTreemapRangeColors[0],
            },
            {
              from: 0.001,
              to: 6,
              color: chartTreemapRangeColors[1],
            },
          ],
        },
      },
    },
  };
  return (
    <ReactApexChart
      dir="ltr"
      className="apex-charts"
      series={series}
      options={options}
      type="treemap"
      height={365}
    />
  );
};

const BasicColumn = ({ dataColors }: any) => {
  const chartColumnColors = getChartColorsArray(dataColors);
  const { data = [] } = useFetchAbsencePersonnelsQuery();

  const monthlyAbsenceStats = useMemo(() => {
    const result: any = {};

    data.forEach((record) => {
      const month = record.jour?.slice(0, 7);
      if (!result[month]) {
        result[month] = { morning: 0, evening: 0 };
      }

      record.personnels?.forEach((p) => {
        if (p.morning === "Absent") {
          result[month].morning += 1;
        }
        if (p.evening === "Absent") {
          result[month].evening += 1;
        }
      });
    });

    return result;
  }, [data]);

  const monthlyCongeStats = useMemo(() => {
    const result: any = {};

    data.forEach((record) => {
      const month = record.jour?.slice(0, 7);
      if (!result[month]) {
        result[month] = { fullDay: 0 };
      }

      record.personnels?.forEach((p) => {
        if (p.en_conge === "yes") {
          result[month].fullDay += 1;
        }
      });
    });

    return result;
  }, [data]);

  const monthLabels = [
    "Jan",
    "Fev",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juil",
    "Aout",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const generateSeriesData = () => {
    const months = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];

    const currentYear = new Date().getFullYear();

    const morningAbsences = months.map((month) => {
      const key = `${currentYear}-${month}`;
      return monthlyAbsenceStats[key]?.morning || 0;
    });

    const eveningAbsences = months.map((month) => {
      const key = `${currentYear}-${month}`;
      return monthlyAbsenceStats[key]?.evening || 0;
    });

    const fullDayConges = months.map((month) => {
      const key = `${currentYear}-${month}`;
      return monthlyCongeStats[key]?.fullDay || 0;
    });

    return [
      { name: "Matin", data: morningAbsences },
      { name: "Après Midi", data: eveningAbsences },
      { name: "En Congé", data: fullDayConges },
    ];
  };

  const series = generateSeriesData();

  const options: any = {
    chart: {
      height: 350,
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        endingShape: "rounded",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    colors: chartColumnColors,
    xaxis: {
      categories: monthLabels,
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return `${val}`;
        },
      },
    },
  };

  return (
    <ReactApexChart
      dir="ltr"
      className="apex-charts"
      series={series}
      options={options}
      type="bar"
      height={350}
    />
  );
};

const NagetiveLable = ({ dataColors }: any) => {
  const { data = [] } = useFetchResultatsQuery();

  const etudiantsAdmis = data.reduce((acc: any[], resultat: Resultat) => {
    const admis = resultat.etudiants.filter((et) => et.avis === "Admis");
    return acc.concat(admis);
  }, []);

  const etudiantsRefuse = data.reduce((acc: any[], resultat: Resultat) => {
    const admis = resultat.etudiants.filter((et) => et.avis === "Refuse");
    return acc.concat(admis);
  }, []);

  const etudiantsFemeninAdmis = data.reduce((acc: any[], resultat: any) => {
    const admis = resultat.etudiants.filter(
      (et: any) =>
        et.avis === "Admis" &&
        (et.etudiant.sexe === "Femme/أنثى" || et.etudiant.sexe === "Feminin ")
    );
    return acc.concat(admis);
  }, []);
  const etudiantsFemeninRefuse = data.reduce((acc: any[], resultat: any) => {
    const admis = resultat.etudiants.filter(
      (et: any) =>
        et.avis === "Refuse" &&
        (et.etudiant.sexe === "Femme/أنثى" || et.etudiant.sexe === "Feminin ")
    );
    return acc.concat(admis);
  }, []);

  const etudiantsMasculinRefuse = data.reduce(
    (acc: any[], resultat: Resultat) => {
      const admis = resultat.etudiants.filter(
        (et: any) => et.avis === "Refuse" && et.etudiant.sexe === "Masculin "
      );
      return acc.concat(admis);
    },
    []
  );

  const etudiantsMasculinAdmis = data.reduce(
    (acc: any[], resultat: Resultat) => {
      const admis = resultat.etudiants.filter(
        (et: any) => et.avis === "Admis" && et.etudiant.sexe === "Masculin "
      );
      return acc.concat(admis);
    },
    []
  );

  const totalAdmis = etudiantsAdmis.length;
  const totalRefuse = etudiantsRefuse.length;
  const femaleAdmis = etudiantsFemeninAdmis.length;
  const femaleRefuse = etudiantsFemeninRefuse.length;
  const maleAdmis = etudiantsMasculinAdmis.length;
  const maleRefuse = etudiantsMasculinRefuse.length;

  const chartColors = getChartColorsArray(dataColors);
  const series = [
    {
      name: "Admis",
      data: [totalAdmis, femaleAdmis, maleAdmis],
    },
    {
      name: "Refusé",
      data: [totalRefuse, femaleRefuse, maleRefuse],
    },
  ];

  const options: any = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    colors: chartColors,
    xaxis: {
      categories: ["Total", "Filles", "Garçons"],
    },
    yaxis: {
      title: {
        text: "Nombre d'étudiants",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return `${val} étudiants`;
        },
      },
    },
  };

  return (
    <ReactApexChart
      dir="ltr"
      className="apex-charts"
      series={series}
      options={options}
      type="bar"
      height={350}
    />
  );
};

export {
  RevenueCharts,
  SatisfactionChart,
  TopCategoriesChart,
  Groupes,
  MonochromePie,
  ColorRangeTreemap,
  BasicColumn,
  NagetiveLable,
};
