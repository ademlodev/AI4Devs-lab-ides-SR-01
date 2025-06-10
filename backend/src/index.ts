import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';
import applicantRoutes from './routes/applicant.routes';
import { handleFileError } from './middleware/file.middleware';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos para CVs
app.use('/uploads', express.static('uploads'));

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: 'API del Sistema de Seguimiento de Talento (ATS)',
    version: '1.0.0',
    endpoints: {
      applicants: '/api/applicants',
    },
  });
});

// Rutas de candidatos
app.use('/api/applicants', applicantRoutes);

// Middleware de manejo de errores
app.use(handleFileError);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error:
      process.env.NODE_ENV === 'development' ? err.message : 'Error interno',
  });
});

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(
    `📋 API de candidatos disponible en http://localhost:${port}/api/applicants`,
  );
});
