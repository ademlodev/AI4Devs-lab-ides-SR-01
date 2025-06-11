import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  ContactMail as ContactIcon,
} from '@mui/icons-material';
import { CreateApplicantRequest, Education, WorkExperience } from '../types/applicant.types';
import { ApiService } from '../services/api.service';

interface AddApplicantFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

const steps = ['Información Personal', 'Educación', 'Experiencia Laboral', 'Revisión'];

export const AddApplicantForm: React.FC<AddApplicantFormProps> = ({ onBack, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Formulario
  const [formData, setFormData] = useState<CreateApplicantRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    education: [],
    workExperience: [],
  });

  // Validaciones
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validar teléfono español
  const validateSpanishPhone = (phone: string): boolean => {
    const spanishPhoneRegex = /^(\+34|0034|34)?[6789]\d{8}$/;
    return spanishPhoneRegex.test(phone);
  };

  // Validar email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validar paso actual
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      // Información personal
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'El nombre es obligatorio';
      } else if (formData.firstName.length < 2) {
        newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = 'El apellido es obligatorio';
      } else if (formData.lastName.length < 2) {
        newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'El email es obligatorio';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'El email debe tener un formato válido';
      }

      if (!formData.phone.trim()) {
        newErrors.phone = 'El teléfono es obligatorio';
      } else if (!validateSpanishPhone(formData.phone)) {
        newErrors.phone = 'El teléfono debe ser un número español válido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleInputChange = (field: keyof CreateApplicantRequest, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Siguiente paso
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  // Paso anterior
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Añadir educación
  const addEducation = () => {
    const newEducation: Education = {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  };

  // Actualizar educación
  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)),
    }));
  };

  // Eliminar educación
  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Añadir experiencia laboral
  const addWorkExperience = () => {
    const newExperience: WorkExperience = {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      responsibilities: [],
    };
    setFormData((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, newExperience],
    }));
  };

  // Actualizar experiencia laboral
  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: any) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)),
    }));
  };

  // Eliminar experiencia laboral
  const removeWorkExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index),
    }));
  };

  // Enviar formulario
  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setLoading(true);
    setError(null);

    try {
      await ApiService.createApplicant(formData);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el candidato');
    } finally {
      setLoading(false);
    }
  };

  // Renderizar paso actual
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Información Personal
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Nombre"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
              />
              <TextField
                fullWidth
                label="Apellido"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone || 'Formato: +34612345678'}
                required
              />
            </Box>
            <TextField
              fullWidth
              label="Dirección"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              multiline
              rows={2}
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Educación
              </Typography>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={addEducation}>
                Añadir Educación
              </Button>
            </Box>

            {formData.education.length === 0 ? (
              <Alert severity="info">No hay educación registrada. Haz clic en "Añadir Educación" para comenzar.</Alert>
            ) : (
              formData.education.map((edu, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">Educación {index + 1}</Typography>
                    <IconButton color="error" onClick={() => removeEducation(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Institución"
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Título"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Campo de estudio"
                      value={edu.field}
                      onChange={(e) => updateEducation(index, 'field', e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Fecha de inicio"
                      type="date"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Fecha de fin"
                      type="date"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    label="Descripción"
                    value={edu.description}
                    onChange={(e) => updateEducation(index, 'description', e.target.value)}
                    multiline
                    rows={2}
                  />
                </Paper>
              ))
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Experiencia Laboral
              </Typography>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={addWorkExperience}>
                Añadir Experiencia
              </Button>
            </Box>

            {formData.workExperience.length === 0 ? (
              <Alert severity="info">
                No hay experiencia laboral registrada. Haz clic en "Añadir Experiencia" para comenzar.
              </Alert>
            ) : (
              formData.workExperience.map((exp, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">Experiencia {index + 1}</Typography>
                    <IconButton color="error" onClick={() => removeWorkExperience(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Empresa"
                      value={exp.company}
                      onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Cargo"
                      value={exp.position}
                      onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Fecha de inicio"
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      fullWidth
                      label="Fecha de fin"
                      type="date"
                      value={exp.endDate}
                      onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    label="Descripción"
                    value={exp.description}
                    onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                    multiline
                    rows={2}
                    sx={{ mb: 2 }}
                  />
                </Paper>
              ))
            )}
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              <ContactIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Revisión Final
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Información Personal
              </Typography>
              <Typography>
                <strong>Nombre:</strong> {formData.firstName} {formData.lastName}
              </Typography>
              <Typography>
                <strong>Email:</strong> {formData.email}
              </Typography>
              <Typography>
                <strong>Teléfono:</strong> {formData.phone}
              </Typography>
              {formData.address && (
                <Typography>
                  <strong>Dirección:</strong> {formData.address}
                </Typography>
              )}
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Educación ({formData.education.length} registros)
              </Typography>
              {formData.education.map((edu, index) => (
                <Box key={index} sx={{ mb: 2, pl: 2, borderLeft: '2px solid #1976d2' }}>
                  <Typography variant="subtitle2">{edu.institution}</Typography>
                  <Typography>
                    {edu.degree} - {edu.field}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {edu.startDate} - {edu.endDate || 'Actual'}
                  </Typography>
                </Box>
              ))}
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Experiencia Laboral ({formData.workExperience.length} registros)
              </Typography>
              {formData.workExperience.map((exp, index) => (
                <Box key={index} sx={{ mb: 2, pl: 2, borderLeft: '2px solid #2e7d32' }}>
                  <Typography variant="subtitle2">{exp.company}</Typography>
                  <Typography>{exp.position}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exp.startDate} - {exp.endDate || 'Actual'}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={onBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Añadir Nuevo Candidato
        </Typography>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Mensajes */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          ¡Candidato añadido exitosamente! Redirigiendo al dashboard...
        </Alert>
      )}

      {/* Contenido del paso */}
      <Paper sx={{ p: 3, mb: 3 }}>{renderStepContent(activeStep)}</Paper>

      {/* Botones de navegación */}
      <Box display="flex" justifyContent="space-between">
        <Button disabled={activeStep === 0} onClick={handleBack} startIcon={<ArrowBackIcon />}>
          Anterior
        </Button>

        <Box>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Creando...' : 'Crear Candidato'}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              Siguiente
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};
