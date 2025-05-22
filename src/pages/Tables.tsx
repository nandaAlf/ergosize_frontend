/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/AnthropometricTablePage.tsx
import React from "react";
import { useSearchParams, useParams } from "react-router-dom";

import ExcelUploade from "../components/ExcelUploade";
import AnthropometricTable from "./AnthropometricTable";

const Tables = () => {
  //   const { studyId } = useParams();
  const [searchParams] = useSearchParams();
  const studyId = searchParams.get("studyId") || "";
  const gender = searchParams.get("gender") || "";
  // const ageMin = searchParams.get("age_min") || "";
  // const ageMax = searchParams.get("age_max") || "";
  const age_ranges = searchParams.get("age_ranges") || "";
  const size = searchParams.get("size") || "";
  const location = searchParams.get("location") || "";
  const name = searchParams.get("name") || "";
  const dimensions = (searchParams.get("dimensions") || "")
    .split(",")
    .map(Number)
    .filter((v) => !isNaN(v));
  const percentiles = (searchParams.get("percentiles") || "")
    .split(",")
    .map(Number)
    .filter((v) => !isNaN(v));

  return (
    <div style={{ padding: "1rem" }}>
      <AnthropometricTable
        studyId={parseInt(studyId!)}
        gender={gender as "" | "M" | "F" | "mixto"}
        // ageMin={ageMin}
        // ageMax={ageMax}
        dimensions={dimensions}
        percentilesList={percentiles}
        age_ranges={age_ranges}
        size={parseInt(size)}
        location={location}
        tableTitle={name}
      />
    </div>
  );
};

export default Tables;
