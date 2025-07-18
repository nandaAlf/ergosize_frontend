import axios from "axios";
import React, { useEffect, useState } from "react";
import AnthropometricTable from "./AnthropometricTable";
interface LocalDataEntry {
  dimension: string;
  dimension_id: string | number;
  by_gender: {
    [genderKey: string]: {
      [ageRange: string]: {
        mean: number | null;
        sd: number | null;
        percentiles: Record<string, number | null>;
      };
    };
  };
}

interface ApiResponse {
  status?: string;
  study_id?: string;
  results: LocalDataEntry[];
}

interface AnthropometricTableWrapperProps {
  data?: ApiResponse | LocalDataEntry[]; // Puede recibir datos directamente
  studyId?: number; // Opcional si usamos datos locales
  gender?: "M" | "F" | "mixto" | "";
  dimensions?: number[];
  percentilesList: number[];
  age_ranges: string;
  tableTitle: string;
  location: string;
  size: number;
  description: string;
  start_date: string;
  end_date: string;
  classification: string;
}

const AnthropometricTableWrapper: React.FC<AnthropometricTableWrapperProps> = ({
  data: externalData,
  studyId,
  ...props
}) => {
  const [data, setData] = useState<LocalDataEntry[]>([]);
  const [loading, setLoading] = useState(!externalData);
  const [error, setError] = useState<string | null>(null);

  // Helper to convert LocalDataEntry[] to DataEntry[] with no nulls
  function sanitizeData(entries: LocalDataEntry[]): any[] {
    return entries.map((entry) => ({
      ...entry,
      by_gender: Object.fromEntries(
        Object.entries(entry.by_gender).map(([genderKey, ageObj]) => [
          genderKey,
          Object.fromEntries(
            Object.entries(ageObj).map(([ageRange, stats]) => [
              ageRange,
              {
                mean: stats.mean ?? 0,
                sd: stats.sd ?? 0,
                percentiles: Object.fromEntries(
                  Object.entries(stats.percentiles).map(([p, v]) => [p, v ?? 0])
                ),
              },
            ])
          ),
        ])
      ),
    }));
  }

  useEffect(() => {
    if (externalData) {
      // Si nos pasan datos directamente, los usamos
      const formattedData = Array.isArray(externalData)
        ? externalData
        : externalData.results || [];
      setData(sanitizeData(formattedData));
      setLoading(false);
    } else if (studyId) {
      // Si no hay datos pero hay studyId, hacemos fetch a la API
      setLoading(true);
      axios
        .get(`http://127.0.0.1:8000/api/test-percentiles/${studyId}`, {
          params: {
            age_ranges: props.age_ranges,
            gender: props.gender,
            dimensions: props.dimensions?.join(","),
            percentiles: props.percentilesList.join(","),
          },
        })
        .then((res) => setData(sanitizeData(res.data.results || [])))
        .catch(() => setError("Error al cargar datos"))
        .finally(() => setLoading(false));
    }
  }, [externalData, studyId]);

  return (
    <AnthropometricTable
      studyId={studyId || 0} // Puedes poner un valor por defecto
      {...props}
      data={data}
      loading={loading}
      error={error}
    />
  );
};

export default AnthropometricTableWrapper