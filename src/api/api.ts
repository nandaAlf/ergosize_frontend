import axios, { AxiosResponse, AxiosError } from "axios";
import dayjs, { Dayjs } from "dayjs";
import { Dimension, StudyData } from "../types";

// Configuración de Axios
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // URL base de tu API de Django
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Función para realizar solicitudes GET a la API.
 * @param endpoint - El endpoint de la API (por ejemplo, 'persons/').
 * @param params - Parámetros opcionales para la solicitud GET.
 * @returns Una promesa con los datos de la respuesta.
 */
export const getData = async <T>(
  endpoint: string,
  params: Record<string, any> = {}
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.get(endpoint, { params });
    // console.log(response.data)
    return response.data; // Devuelve solo los datos de la respuesta
  } catch (error) {
    const axiosError = error as AxiosError;
    // console.error(`Error fetching data from ${endpoint}:`, axiosError.message);
    throw axiosError; // Relanza el error para manejarlo en el componente
  }
};

// Insertar una persona
export const insertPerson = async (person: {
  name: string;
  gender: string | null;
  date_of_birth: string | null;
  country: string;
  state: string;
  province: string;
}) => {
  try {
    const response = await api.post("persons/", person); // Endpoint para insertar una persona
    console.log("Pesron");
    console.log(response.data);
    return response.data; // Devuelve la respuesta de la API (incluyendo el ID de la persona creada)
  } catch (error) {
    console.error("Error al insertar la persona:", error);
    throw error; // Relanza el error para manejarlo en el componente
  }
};

// Insertar mediciones
export const insertMeasurements = async (
  measurements: {
    value: number | null;
    position: string | null;
    study: number | null;
    person: number | null; // ID de la persona
    dimension: number;
  }[]
) => {
  try {
    console.log(measurements);
    measurements.forEach(async (m) => {
      const response = await api.post("measurements/", m); // Endpoint para insertar mediciones
      console.log("Medida");
      console.log(response.data);
    });
    //   const response = await api.post("measurements/", measurements); // Endpoint para insertar mediciones
    //   console.log("Medida")
    //   console.log(response.data)
    //   return response.data; // Devuelve la respuesta de la API
  } catch (error) {
    console.error("Error al insertar las mediciones:", error);
    throw error; // Relanza el error para manejarlo en el componente
  }
};

export const deleteMeasurements = async (studyId: number, personId: number) => {
  try {
    const response = await api.delete(`/measurements/${studyId}/`, {
      data: {
        // Usar 'data' en lugar de 'body' para enviar el cuerpo en solicitudes DELETE
        person_id: personId,
      },
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem("token")}`, // Si usas autenticación JWT
      //   "Content-Type": "application/json",
      // },
    });

    return response.data; // Retornar la respuesta del servidor
  } catch (error) {
    console.error("Error al eliminar las mediciones:", error);
    throw error; // Relanzar el error para manejarlo en el componente que llama a esta función
  }
};
// export interface CreateStudyPayload {
//   name: string;
//   classification: string;
//   gender: string;
//   country: string;
//   location: string;
//   description: string;
//   size: number |null;
//   age_min: number;
//   age_max: number;
//   start_date:  null |Dayjs;
//   end_date:  null|Dayjs;
//   dimensions: { id_dimension: number }[];
// }

// export const createStudy = async (studyData: StudyData) => {
//   try {
//     // const payload = {
//     //   ...studyData,
//     //   start_date: studyData.start_date?.format("YYYY-MM-DD") || null,
//     //   end_date: studyData.end_date?.format("YYYY-MM-DD") || null,
//     //   // dimensions: formData.dimensions.map((id) => ({ id_dimension: id })),
//     //   dimensions:  studyData.dimensions.map(d => ({ id_dimension: d.id_dimension })),
//     // };
//     const response = await api.post('studies/', studyData);
//     return response.data;
//   } catch (error) {
//     console.error('Error creating study:', error);
//     throw error;
//   }
// };
// export const updateStudy = async (studyData: StudyData) => {
//   try {
//     // const payload = {
//     //   ...studyData,
//     //   start_date: studyData.start_date?.format("YYYY-MM-DD") || null,
//     //   end_date: studyData.end_date?.format("YYYY-MM-DD") || null,
//     //   // dimensions: formData.dimensions.map((id) => ({ id_dimension: id })),
//     //   dimensions:  studyData.dimensions.map(d => ({ id_dimension: d.id_dimension })),
//     // };
//     const response = await api.put(`studies/${studyData.id}/`, studyData);
//     return response.data;
//   } catch (error) {
//     console.error('Error creating study:', error);
//     throw error;
//   }
// };
export const getDimension = async () => {
  try {
    
    const response = await api.get('dimension/');
    return response.data; // Asegúrate de que la respuesta sea del tipo esperado
  
  } catch (error) {
    console.error('Error creating study:', error);
    throw error;
  }
};
export default api;
