// src/services/StudyService.ts

import axios from "axios";
import ApiService from "../api/ApiService";
import {
  Dimension,
  Person,
  PersonMeasurement,
  StudyData,
  StudyPayload,
} from "../types";

export const getAllStudies = async (mine = false): Promise<StudyData[]> => {
  try {
    const response = await ApiService.get(
      "/studies/",
      mine ? { mine: "true" } : {}
    );
    return response.data;
  } catch (error) {
    console.error("Error en getAllStudies:", error);
    throw error;
  }
};
export const getAllDimensions = async (): Promise<Dimension[]> => {
  try {
    const response = await ApiService.get("dimension/");
    return response.data;
  } catch (error) {
    console.error("Error en getAllStudies:", error);
    throw error;
  }
};
export const getPersonStudyData = async (
  id: string
): Promise<PersonMeasurement> => {
  try {
    const response = await ApiService.get(`/studies/${id}/members`);
    return response.data;
  } catch (error) {
    console.error("Error en fetchStudyData:", error);
    throw error;
  }
};
export const deleteData = async (id: number) => {
  try {
    const response = await ApiService.delete(`/studies/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error en fetchStudyData:", error);
    throw error;
  }
};

// export const getFile = async (action: string, id: number, params: string) => {
//   alert("adios");
//   const url = `http://127.0.0.1:8000/api/export/${action}/${id}/?${params}`;

//   // try {
//   //   // const response = await ApiService.get(endpoint, params, {
//   //   //   responseType: "blob" // 👈 Añade responseType como opción adicional
//   //   // });
//   //   const response = await ApiService.get(url, {
//   //     responseType: "blob",
//   //   });

//   //   // Crear un blob y un enlace para forzar la descarga
//   //   const fileType = action.includes("excel")
//   //     ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//   //     : "application/pdf";

//   //   const extension = action.includes("excel") ? "xlsx" : "pdf";

//   //   const blob = new Blob([response.data], { type: fileType });
//   //   const downloadUrl = window.URL.createObjectURL(blob);

//   //   const a = document.createElement("a");
//   //   a.href = downloadUrl;
//   //   a.download = `percentiles_study_${id}.${extension}`;
//   //   document.body.appendChild(a);
//   //   a.click();
//   //   a.remove();

//   //   window.URL.revokeObjectURL(downloadUrl); // Limpieza
//   // } catch (err) {
//   //   console.error(`Error al descargar archivo ${action}:`, err);
//   // }
//   try {
//     const response = await axios.get(url, {

//       responseType: "blob", // <–– y aquí indicas blob
//       headers: {
//         Accept:
//           action === "excel"
//             ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//             : "application/pdf",
//       },
//     });

//     // Blob con el type correcto:
//     const fileType =
//       action === "excel"
//         ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         : "application/pdf";
//     const extension = action === "excel" ? "xlsx" : "pdf";

//     const blob = new Blob([response.data], { type: fileType });
//     const downloadUrl = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = downloadUrl;
//     a.download = `percentiles_study_${id}.${extension}`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     window.URL.revokeObjectURL(downloadUrl);
//   } catch (err) {
//     console.error(`Error al descargar archivo ${action}:`, err);
//   }
// };

export const getFile = async (action:string,studyId: string,params: URLSearchParams) => {
  const endpoint = `/export/${action}/${studyId}`;
 
  try {
    const response = await ApiService.get(endpoint, params, {
      responseType: "blob", // 👈 Añade responseType como opción adicional
    });

    // Crear un blob y un enlace para forzar la descarga
    const fileType =
      action === "excel"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "application/pdf";
    const extension = action === "excel" ? "xlsx" : "pdf";

    const blob = new Blob([response.data], { type: fileType });
    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `tabla.${extension}`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(downloadUrl); // Limpieza
  } catch (err) {
    console.error(`Error al descargar archivo :`, err);
  }
};

export const getFilePerson = async (params: URLSearchParams) => {
  const endpoint = `/report/`;
  alert(params);
  try {
    const response = await ApiService.get(endpoint, params, {
      responseType: "blob", // 👈 Añade responseType como opción adicional
    });

    // Crear un blob y un enlace para forzar la descarga
    const fileType = "application/pdf";

    const extension = "pdf";

    const blob = new Blob([response.data], { type: fileType });
    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `person.${extension}`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(downloadUrl); // Limpieza
  } catch (err) {
    console.error(`Error al descargar archivo :`, err);
  }
};

export const createStudy = async (
  data: StudyPayload
): Promise<PersonMeasurement> => {
  try {
    const response = await ApiService.post("studies/", data);
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Error en fetchStudyData:", error);
    throw error;
  }
};
export const updateStudy = async (
  data: StudyPayload,
  id: number
): Promise<PersonMeasurement> => {
  try {
    const response = await ApiService.patch(`studies/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error en fetchStudyData:", error);
    throw error;
  }
};

export const updatePerson = async (
  data: Person,
  id: number
): Promise<Person> => {
  try {
    const response = await ApiService.patch(`persons/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error en fetchStudyData:", error);
    throw error;
  }
};
export const createPerson = async (data: Person): Promise<Person> => {
  try {
    const response = await ApiService.post(`persons/`, data);
    return response.data;
  } catch (error) {
    console.error("Error en fetchStudyData:", error);
    throw error;
  }
};
export const getPerson = async (
  personId: number,
  studyId: number
): Promise<Person> => {
  try {
    // const response = await ApiService.get(`persons/${id}/`);
    const response = await ApiService.get(
      `persons/${personId}/studies/${studyId}/measurements`
    );
    return response.data;
  } catch (error) {
    console.error("Error en fetchStudyData:", error);
    throw error;
  }
};
export const deleteMeasurements = async (studyId: number, personId: number) => {
  try {
    const response = await ApiService.delete(`/measurements/${studyId}/`, {
      params: { person_id: personId },
    });

    return response.data; // Retornar la respuesta del servidor
  } catch (error) {
    console.error("Error al eliminar las mediciones:", error);
    throw error; // Relanzar el error para manejarlo en el componente que llama a esta función
  }
};
