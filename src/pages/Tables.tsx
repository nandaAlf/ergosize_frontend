
// pages/AnthropometricTablePage.tsx

import { useLocation } from "react-router-dom";
import AnthropometricTable from "./AnthropometricTable";
const Tables = () => {
  //   const { studyId } = useParams();


  const location = useLocation();
  // const study = location.state; // Recibir directamente el estado
  const state = location.state || {}; // Desestructurar el objeto
  // console.log("Estudio:", study); // Ahora debería funcionar
  const { study, filters } = state || {};
  console.log("Datos del estudio:", study);
  console.log("Filtros:", filters);



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
        classification={study.classification}
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
