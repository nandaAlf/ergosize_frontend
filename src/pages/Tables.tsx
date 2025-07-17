import { useLocation, useParams } from "react-router-dom";
import AnthropometricTable from "./AnthropometricTable";
import { germanyISO } from "../utils/ISO_2008";

// Tipos para los estudios locales
interface LocalStudyMetadata {
  name: string;
  country: string;
  location: string;
  size: number;
  description: string;
  start_date: string;
  end_date: string;
  classification: string;
}

interface LocalStudy {
  metadata: LocalStudyMetadata;
  results: any[]; // Reemplazar 'any' con tu interfaz específica de datos
}

// Mapeo de estudios locales disponibles
const LOCAL_STUDIES: Record<string, LocalStudy> = {
  germanyISO: germanyISO,
  // cuba: cubaData,
  // ... otros estudios
};

type AvailableLocalStudy = keyof typeof LOCAL_STUDIES;

// Tipos para estudios de API
interface ApiStudy {
  id: number;
  name: string;
  country: string;
  location: string;
  size: number;
  description: string;
  start_date: string;
  end_date: string;
  classification: string;
}

interface Filters {
  gender?: "M" | "F" | "mixto" | "";
  dimensions?: number[];
  percentiles?: number[];
  ageRanges?: string[];
}

const Tables = () => {
  const { id: studyIdOrName } = useParams<{ id: string }>();
  const location = useLocation();
  const state =
    (location.state as { study?: ApiStudy; filters?: Filters }) || {};
  const { study: apiStudy, filters: apiFilters } = state;

  // Determinar el tipo de estudio
  const isLocalStudy = studyIdOrName && isNaN(Number(studyIdOrName));
  const localStudyName = isLocalStudy
    ? (studyIdOrName as AvailableLocalStudy)
    : null;
  //   const localStudy = isLocalStudy ? LOCAL_STUDIES[localStudyName] : null;
  const localStudy =
    isLocalStudy && localStudyName ? LOCAL_STUDIES[localStudyName] : null;

  // Configuración por defecto para estudios locales
  const defaultFilters: Filters = {
    gender: "mixto",
    dimensions: [],
    percentiles: [5, 50, 95],
    ageRanges: ["18-65"],
  };

  // Determinar qué datos y filtros usar
  const currentStudy =
    apiStudy ||
    (localStudy
      ? {
          ...localStudy.metadata,
          localData: localStudy.results,
        }
      : null);

  const currentFilters = apiFilters || defaultFilters;

  if (!currentStudy) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h3>Estudio no encontrado</h3>
        <p>
          Por favor especifique un ID de estudio válido o nombre de estudio
          local.
        </p>
        <p>
          Estudios locales disponibles: {Object.keys(LOCAL_STUDIES).join(", ")}
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px" }}>
      <AnthropometricTable
        // Props comunes
        percentilesList={currentFilters.percentiles || []}
        age_ranges={(currentFilters.ageRanges || []).join(",")}
        size={currentStudy.size}
        location={`${currentStudy.country} / ${currentStudy.location}`}
        tableTitle={currentStudy.name}
        description={currentStudy.description}
        start_date={currentStudy.start_date}
        end_date={currentStudy.end_date}
        classification={currentStudy.classification}
        gender={currentFilters.gender || ""}
        dimensions={currentFilters.dimensions || []}
        data={[]}
        loading={false}
        error={null} // Props condicionales
        // {...(apiStudy
        //   ? { studyId: apiStudy.id }
        //   : { localData: currentStudy.localData })}
        {...(apiStudy ? { studyId: apiStudy.id } : {})}
      />
    </div>
  );
};

export default Tables;
