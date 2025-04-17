// pages/AnthropometricTablePage.tsx
import React from "react";
import { useSearchParams, useParams } from "react-router-dom";
import TableDetail from "./TableDetail";
import ExcelUploade from "../components/ExcelUploade";

const Tables = () => {
//   const { studyId } = useParams();
  const [searchParams] = useSearchParams();
  const studyId = searchParams.get("studyId") || "";
  const gender = searchParams.get("gender") || "";
  const ageMin = searchParams.get("age_min") || "";
  const ageMax = searchParams.get("age_max") || "";
  const dimensions = (searchParams.get("dimensions") || "")
    .split(",")
    .map(Number)
    .filter((v) => !isNaN(v));
  const percentiles = (searchParams.get("percentiles") || "")
    .split(",")
    .map(Number)
    .filter((v) => !isNaN(v));



  return (
    <div style={{ padding: "2rem" }}>
    

      <TableDetail
        studyId={parseInt(studyId!)}
        gender={gender}
        ageMin={ageMin}
        ageMax={ageMax}
        dimensions={dimensions}
        percentilesList={percentiles}
      />
    </div>
  );
};

export default Tables;
