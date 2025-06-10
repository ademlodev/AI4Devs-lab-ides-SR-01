import { Request, Response } from 'express';
import { ApplicantService } from '../services/applicant.service';
import { CreateApplicantRequest } from '../types/applicant.types';

// Extender Request para incluir el archivo
interface RequestWithFile extends Request {
  file?: any; // Will be properly typed when multer is installed
}

export class ApplicantController {
  /**
   * Crear un nuevo candidato
   */
  static async createApplicant(req: Request, res: Response): Promise<void> {
    try {
      const applicantData: CreateApplicantRequest = req.body;

      const applicant = await ApplicantService.createApplicant(applicantData);

      res.status(201).json({
        success: true,
        message: 'Candidato añadido exitosamente',
        data: applicant,
      });
    } catch (error) {
      console.error('Error al crear candidato:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  /**
   * Obtener todos los candidatos
   */
  static async getAllApplicants(req: Request, res: Response): Promise<void> {
    try {
      const applicants = await ApplicantService.getAllApplicants();

      res.status(200).json({
        success: true,
        message: 'Candidatos obtenidos exitosamente',
        data: applicants,
        count: applicants.length,
      });
    } catch (error) {
      console.error('Error al obtener candidatos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  /**
   * Obtener un candidato por ID
   */
  static async getApplicantById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID de candidato inválido',
        });
        return;
      }

      const applicant = await ApplicantService.getApplicantById(id);

      if (!applicant) {
        res.status(404).json({
          success: false,
          message: 'Candidato no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Candidato obtenido exitosamente',
        data: applicant,
      });
    } catch (error) {
      console.error('Error al obtener candidato:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  /**
   * Subir CV de un candidato
   */
  static async uploadCV(req: Request, res: Response): Promise<void> {
    try {
      const applicantId = parseInt(req.params.id);

      if (isNaN(applicantId)) {
        res.status(400).json({
          success: false,
          message: 'ID de candidato inválido',
        });
        return;
      }

      // Verificar si el candidato existe
      const applicantExists =
        await ApplicantService.applicantExists(applicantId);
      if (!applicantExists) {
        res.status(404).json({
          success: false,
          message: 'Candidato no encontrado',
        });
        return;
      }

      // Verificar si se subió un archivo
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No se ha subido ningún archivo',
        });
        return;
      }

      // Verificar tipo de archivo
      const allowedMimeTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        res.status(400).json({
          success: false,
          message: 'Solo se permiten archivos PDF o DOCX',
        });
        return;
      }

      // Generar URL del archivo
      const cvUrl = `/uploads/cv/${req.file.filename}`;

      // Actualizar la URL del CV en la base de datos
      await ApplicantService.updateCVUrl(applicantId, cvUrl);

      res.status(200).json({
        success: true,
        message: 'CV subido exitosamente',
        data: {
          applicantId,
          cvUrl,
          originalName: req.file.originalname,
          size: req.file.size,
        },
      });
    } catch (error) {
      console.error('Error al subir CV:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
}
