import { Router } from 'express';
import { ApplicantController } from '../controllers/applicant.controller';
import {
  validateCreateApplicant,
  validateUploadCV,
  handleValidationErrors,
} from '../middleware/validation.middleware';
import { uploadCV, handleFileError } from '../middleware/file.middleware';

const router = Router();

/**
 * @route   POST /api/applicants
 * @desc    Crear un nuevo candidato
 * @access  Public
 */
router.post(
  '/',
  validateCreateApplicant,
  handleValidationErrors,
  ApplicantController.createApplicant,
);

/**
 * @route   GET /api/applicants
 * @desc    Obtener todos los candidatos
 * @access  Public
 */
router.get('/', ApplicantController.getAllApplicants);

/**
 * @route   GET /api/applicants/:id
 * @desc    Obtener un candidato por ID
 * @access  Public
 */
router.get('/:id', ApplicantController.getApplicantById);

/**
 * @route   POST /api/applicants/:id/cv
 * @desc    Subir CV de un candidato
 * @access  Public
 */
router.post(
  '/:id/cv',
  validateUploadCV,
  handleValidationErrors,
  uploadCV.single('file'),
  handleFileError,
  ApplicantController.uploadCV,
);

export default router;
