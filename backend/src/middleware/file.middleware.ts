import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

// Crear directorio de uploads si no existe
const uploadDir = path.join(__dirname, '../../uploads/cv');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `cv-${uniqueSuffix}${extension}`);
  },
});

// Filtro de archivos
const fileFilter = (req: any, file: any, cb: any) => {
  // Verificar tipo de archivo
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos PDF o DOCX'), false);
  }
};

// Configuración de multer
export const uploadCV = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
});

// Middleware para manejar errores de multer
export const handleFileError = (error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande. Máximo 5MB',
      });
    }
  }

  if (error.message === 'Solo se permiten archivos PDF o DOCX') {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
};
