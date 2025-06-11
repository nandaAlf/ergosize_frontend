/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/AnthropometricTablePage.tsx
import React from "react";
import { useSearchParams, useParams } from "react-router-dom";

import ExcelUploade from "../components/ExcelUploade";
import AnthropometricTable from "./AnthropometricTable";
import { useLocation } from "react-router-dom";
const Tables = () => {
  //   const { studyId } = useParams();

  const [searchParams] = useSearchParams();
  const location = useLocation();
  // const study = location.state; // Recibir directamente el estado
  const state = location.state || {}; // Desestructurar el objeto
  // console.log("Estudio:", study); // Ahora debería funcionar
  const { study, filters } = state || {};
  console.log("Datos del estudio:", study);
  console.log("Filtros:", filters);

  // const studyId = searchParams.get("studyId") || "";
  // const gender = searchParams.get("gender") || "";
  // // const ageMin = searchParams.get("age_min") || "";
  // // const ageMax = searchParams.get("age_max") || "";
  // const age_ranges = searchParams.get("age_ranges") || "";
  // const size = searchParams.get("size") || "";
  // // const location = searchParams.get("location") || "";
  // const name = searchParams.get("name") || "";
  // const dimensions = (searchParams.get("dimensions") || "")
  //   .split(",")
  //   .map(Number)
  //   .filter((v) => !isNaN(v));
  // const percentiles = (searchParams.get("percentiles") || "")
  //   .split(",")
  //   .map(Number)
  //   .filter((v) => !isNaN(v));

  return (
    <div style={{}}>
      <AnthropometricTable
        studyId={study.id}
        gender={filters?.gender || ""}
        dimensions={filters?.dimensions || []}
        percentilesList={filters?.percentiles || []}
        age_ranges={(filters?.ageRanges || []).join(",")}
        size={study.size}
        location={`${study.country} / ${study.location}`}
        tableTitle={study.name}
        description={study.description}
        start_date={study.start_date}
        end_date={study.end_date}
      />
      {/* <AnthropometricTable
        studyId={parseInt(studyId!)}
        gender={gender as "" | "M" | "F" | "mixto"}
        // ageMin={ageMin}
        // ageMax={ageMax}
        dimensions={dimensions}
        percentilesList={percentiles}
        age_ranges={age_ranges}
        size={parseInt(size)}
        location={""}
        tableTitle={name} description={""}       /> */}
    </div>
  );
};

export default Tables;
