import axios, { AxiosResponse } from 'axios';
import { CreateApplicantRequest, ApplicantResponse, ApiResponse, UploadCVResponse } from '../types/applicant.types';

const API_BASE_URL = 'http://localhost:3010';

// Configuración de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({
      success: false,
      message: 'Error de conexión con el servidor',
    });
  }
);

export class ApiService {
  /**
   * Crear un nuevo candidato
   */
  static async createApplicant(data: CreateApplicantRequest): Promise<ApplicantResponse> {
    const response: AxiosResponse<ApiResponse<ApplicantResponse>> = await apiClient.post('/api/applicants', data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data!;
  }

  /**
   * Obtener todos los candidatos
   */
  static async getAllApplicants(): Promise<ApplicantResponse[]> {
    const response: AxiosResponse<ApiResponse<ApplicantResponse[]>> = await apiClient.get('/api/applicants');

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data || [];
  }

  /**
   * Obtener un candidato por ID
   */
  static async getApplicantById(id: number): Promise<ApplicantResponse> {
    const response: AxiosResponse<ApiResponse<ApplicantResponse>> = await apiClient.get(`/api/applicants/${id}`);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data!;
  }

  /**
   * Subir CV de un candidato
   */
  static async uploadCV(applicantId: number, file: File): Promise<UploadCVResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response: AxiosResponse<ApiResponse<UploadCVResponse>> = await apiClient.post(
      `/api/applicants/${applicantId}/cv`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data!;
  }

  /**
   * Verificar si el servidor está disponible
   */
  static async checkServerHealth(): Promise<boolean> {
    try {
      const response = await apiClient.get('/');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}
