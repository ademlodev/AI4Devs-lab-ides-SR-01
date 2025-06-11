import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { ApplicantResponse } from '../types/applicant.types';
import { ApiService } from '../services/api.service';

interface DashboardProps {
  onAddApplicant: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onAddApplicant }) => {
  const [applicants, setApplicants] = useState<ApplicantResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<boolean | null>(null);

  useEffect(() => {
    checkServerAndLoadData();
  }, []);

  const checkServerAndLoadData = async () => {
    try {
      // Verificar estado del servidor
      const isServerUp = await ApiService.checkServerHealth();
      setServerStatus(isServerUp);

      if (isServerUp) {
        // Cargar candidatos
        const data = await ApiService.getAllApplicants();
        setApplicants(data);
      } else {
        setError('El servidor no está disponible. Verifica que el backend esté ejecutándose.');
      }
    } catch (err) {
      setError('Error al cargar los datos: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const getRecentApplicants = () => {
    return applicants.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Sistema de Seguimiento de Talento
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gestiona candidatos y procesos de selección
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={onAddApplicant}
          sx={{
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#1565c0' },
          }}
        >
          Añadir Candidato
        </Button>
      </Box>

      {/* Estado del servidor */}
      {serverStatus === false && (
        <Alert severity="error" sx={{ mb: 3 }}>
          El servidor no está disponible. Verifica que el backend esté ejecutándose en http://localhost:3010
        </Alert>
      )}

      {/* Error general */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {applicants.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Candidatos Totales
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AssignmentIcon sx={{ fontSize: 40, color: '#2e7d32', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {applicants.filter((a) => a.cvUrl).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    CVs Subidos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon sx={{ fontSize: 40, color: '#ed6c02', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {
                      applicants.filter((a) => {
                        const createdDate = new Date(a.createdAt);
                        const lastWeek = new Date();
                        lastWeek.setDate(lastWeek.getDate() - 7);
                        return createdDate > lastWeek;
                      }).length
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nuevos (7 días)
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Candidatos recientes */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Candidatos Recientes
        </Typography>

        {applicants.length === 0 ? (
          <Box textAlign="center" py={4}>
            <PeopleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay candidatos registrados
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Comienza añadiendo tu primer candidato
            </Typography>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={onAddApplicant} sx={{ mt: 2 }}>
              Añadir Primer Candidato
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {getRecentApplicants().map((applicant) => (
              <Grid item xs={12} sm={6} md={4} key={applicant.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {applicant.firstName} {applicant.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {applicant.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {applicant.phone}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                      <Chip
                        label={applicant.cvUrl ? 'CV Subido' : 'Sin CV'}
                        color={applicant.cvUrl ? 'success' : 'default'}
                        size="small"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(applicant.createdAt.toString())}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};
