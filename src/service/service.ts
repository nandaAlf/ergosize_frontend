// src/services/StudyService.ts

import ApiService from '../api/ApiService';
import { Dimension, Person, PersonMeasurement, StudyData } from '../types';

export const getAllStudies = async (mine = false): Promise<StudyData[]> => {
  try {
    const response=await ApiService.get('/studies/', mine ? { mine: 'true' } : {});
    return response.data;
  } catch (error) {
    console.error('Error en getAllStudies:', error);
    throw error;
  }
};
export const getAllDimensions = async (): Promise<Dimension[]> => {
  try {
    const response = await ApiService.get('dimension/');
    return response.data;
  } catch (error) {
    console.error('Error en getAllStudies:', error);
    throw error;
  }
};
export const getPersonStudyData = async (id: string): Promise<PersonMeasurement> => {
  try {
    const response = await ApiService.get(`/studies/${id}/members`);
    return response.data;
  } catch (error) {
    console.error('Error en fetchStudyData:', error);
    throw error;
  }
};
export const deleteData = async (id: number) => {
  try {
    const response = await ApiService.delete(`/studies/${id}/`);
    return response.data;

  } catch (error) {
    console.error('Error en fetchStudyData:', error);
    throw error;
  }
};

export const getFile = async (action: string , id:number , params:string) => {
  const endpoint = `/export/${action.includes("Excel") ? "excel" : "pdf"}/${id}/`;
  
  try {
    const response = await ApiService.get(endpoint, params, {
      responseType: "blob" // 👈 Añade responseType como opción adicional
    });

    // Crear un blob y un enlace para forzar la descarga
    const fileType = action.includes("Excel")
      ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      : "application/pdf";

    const extension = action.includes("Excel") ? "xlsx" : "pdf";

    const blob = new Blob([response.data], { type: fileType });
    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `percentiles_study_${id}.${extension}`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(downloadUrl); // Limpieza
  } catch (err) {
    console.error(`Error al descargar archivo ${action}:`, err);
  }
};

export const getFilePerson = async (  params:URLSearchParams) => {
  const endpoint = `/report/`;
  alert(params)
  try {
    const response = await ApiService.get(endpoint, params, {
      responseType: "blob" // 👈 Añade responseType como opción adicional
    });

    // Crear un blob y un enlace para forzar la descarga
    const fileType = "application/pdf"
 

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

export const createStudy = async (data:StudyData): Promise<PersonMeasurement> => {
  try {
    const response = await ApiService.post('studies/',data);
    return response.data;
 
  } catch (error) {
    console.error('Error en fetchStudyData:', error);
    throw error;
  }
};
export const updateStudy = async (data:StudyData,id:number): Promise<PersonMeasurement> => {
  try {
    const response = await ApiService.patch(`studies/${id}/`,data);
    return response.data;
  } catch (error) {
    console.error('Error en fetchStudyData:', error);
    throw error;
  }
};

export const updatePerson = async (data:Person,id:number): Promise<Person> => {
  try {
    const response = await ApiService.patch(`persons/${id}/`,data);
    return response.data;
  } catch (error) {
    console.error('Error en fetchStudyData:', error);
    throw error;
  }
};
export const createPerson = async (data:Person): Promise<Person> => {
  try {
    const response = await ApiService.post(`persons/`,data);
    return response.data;
  } catch (error) {
    console.error('Error en fetchStudyData:', error);
    throw error;
  }
};
export const getPerson = async (id:number): Promise<Person> => {
  try {
    const response = await ApiService.get(`persons/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error en fetchStudyData:', error);
    throw error;
  }
};
export const deleteMeasurements = async (studyId: number, personId: number) => {
  try {
    const response = await ApiService.delete(`/measurements/${studyId}/`, {
        params: { person_id: personId }
      }
    );

    return response.data; // Retornar la respuesta del servidor
  } catch (error) {
    console.error("Error al eliminar las mediciones:", error);
    throw error; // Relanzar el error para manejarlo en el componente que llama a esta función
  }
};