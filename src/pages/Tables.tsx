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
  const ageMin = searchParams.get("age_min") || "";
  const ageMax = searchParams.get("age_max") || "";
  const age_ranges=searchParams.get("age_ranges"||"")
  console.log("AAAA",age_ranges);
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
        gender={gender}
        ageMin={ageMin}
        ageMax={ageMax}
        dimensions={dimensions}
        percentilesList={percentiles}
        age_ranges={age_ranges}
      />
    </div>
  );
};

export default Tables;
