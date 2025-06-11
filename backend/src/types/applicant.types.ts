export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
  responsibilities?: string[];
}

export interface CreateApplicantRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  education: Education[];
  workExperience: WorkExperience[];
  recruiterId?: number;
}

export interface ApplicantResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  education: Education[];
  workExperience: WorkExperience[];
  cvUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  recruiterId?: number;
}

export interface UploadCVRequest {
  applicantId: number;
  file: Express.Multer.File;
}
