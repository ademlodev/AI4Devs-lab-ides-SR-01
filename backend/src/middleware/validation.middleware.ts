import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validación para teléfono español
const validateSpanishPhone = (value: string) => {
  const spanishPhoneRegex = /^(\+34|0034|34)?[6789]\d{8}$/;
  if (!spanishPhoneRegex.test(value)) {
    throw new Error('El teléfono debe ser un número español válido');
  }
  return true;
};

// Validación para email
const validateEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    throw new Error('El email debe tener un formato válido');
  }
  return true;
};

// Validación para arrays de educación y experiencia
const validateArray = (fieldName: string) => {
  return body(fieldName)
    .isArray()
    .withMessage(`${fieldName} debe ser un array`);
};

export const validateCreateApplicant = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('El apellido es obligatorio')
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .custom(validateEmail),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('El teléfono es obligatorio')
    .custom(validateSpanishPhone),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('La dirección no puede exceder 200 caracteres'),

  validateArray('education').withMessage('La educación debe ser un array'),

  validateArray('workExperience').withMessage(
    'La experiencia laboral debe ser un array',
  ),

  body('recruiterId')
    .isInt({ min: 1 })
    .withMessage(
      'El ID del reclutador es obligatorio y debe ser un número válido',
    ),
];

export const validateUploadCV = [
  body('applicantId')
    .isInt({ min: 1 })
    .withMessage(
      'El ID del candidato es obligatorio y debe ser un número válido',
    ),
];

// Middleware para manejar errores de validación
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }
  next();
};
