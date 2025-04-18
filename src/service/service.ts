// src/services/StudyService.ts

import ApiService from '../api/ApiService';
import { PersonMeasurement, StudyData } from '../types';

export const getAllStudies = async (): Promise<StudyData[]> => {
  try {
    const response = await ApiService.get('studies/');
    return response.data;
  } catch (error) {
    console.error('Error en getAllStudies:', error);
    throw error;
  }
};
export const getPersonStudyData = async (id: string): Promise<PersonMeasurement> => {
  try {
    const response = await ApiService.get(`/study-data/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error en fetchStudyData:', error);
    throw error;
  }
};