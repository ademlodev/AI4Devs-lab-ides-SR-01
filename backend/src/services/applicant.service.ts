import { PrismaClient } from '@prisma/client';
import {
  CreateApplicantRequest,
  ApplicantResponse,
} from '../types/applicant.types';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

export class ApplicantService {
  /**
   * Crear un nuevo candidato
   */
  static async createApplicant(
    data: CreateApplicantRequest,
  ): Promise<ApplicantResponse> {
    try {
      const applicant = await prisma.applicant.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          education: data.education as any,
          workExperience: data.workExperience as any,
          recruiterId: data.recruiterId,
        },
        include: {
          recruiter: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return {
        id: applicant.id,
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        email: applicant.email,
        phone: applicant.phone,
        address: applicant.address || undefined,
        education: applicant.education as any[],
        workExperience: applicant.workExperience as any[],
        cvUrl: applicant.cvUrl || undefined,
        createdAt: applicant.createdAt,
        updatedAt: applicant.updatedAt,
        recruiterId: applicant.recruiterId,
      };
    } catch (error) {
      throw new Error(
        `Error al crear candidato: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Obtener todos los candidatos
   */
  static async getAllApplicants(): Promise<ApplicantResponse[]> {
    try {
      const applicants = await prisma.applicant.findMany({
        include: {
          recruiter: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return applicants.map((applicant) => ({
        id: applicant.id,
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        email: applicant.email,
        phone: applicant.phone,
        address: applicant.address || undefined,
        education: applicant.education as any[],
        workExperience: applicant.workExperience as any[],
        cvUrl: applicant.cvUrl || undefined,
        createdAt: applicant.createdAt,
        updatedAt: applicant.updatedAt,
        recruiterId: applicant.recruiterId,
      }));
    } catch (error) {
      throw new Error(
        `Error al obtener candidatos: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Obtener un candidato por ID
   */
  static async getApplicantById(id: number): Promise<ApplicantResponse | null> {
    try {
      const applicant = await prisma.applicant.findUnique({
        where: { id },
        include: {
          recruiter: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!applicant) {
        return null;
      }

      return {
        id: applicant.id,
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        email: applicant.email,
        phone: applicant.phone,
        address: applicant.address || undefined,
        education: applicant.education as any[],
        workExperience: applicant.workExperience as any[],
        cvUrl: applicant.cvUrl || undefined,
        createdAt: applicant.createdAt,
        updatedAt: applicant.updatedAt,
        recruiterId: applicant.recruiterId,
      };
    } catch (error) {
      throw new Error(
        `Error al obtener candidato: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Actualizar la URL del CV de un candidato
   */
  static async updateCVUrl(applicantId: number, cvUrl: string): Promise<void> {
    try {
      await prisma.applicant.update({
        where: { id: applicantId },
        data: { cvUrl },
      });
    } catch (error) {
      throw new Error(
        `Error al actualizar CV: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Verificar si un candidato existe
   */
  static async applicantExists(id: number): Promise<boolean> {
    try {
      const applicant = await prisma.applicant.findUnique({
        where: { id },
        select: { id: true },
      });
      return !!applicant;
    } catch (error) {
      return false;
    }
  }
}
