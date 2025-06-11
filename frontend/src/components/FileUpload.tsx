import React, { useState } from 'react';
import { Box, Button, Typography, Alert, LinearProgress, Paper, IconButton, Chip } from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  uploading?: boolean;
  uploadProgress?: number;
  error?: string;
  success?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  selectedFile,
  uploading = false,
  uploadProgress = 0,
  error,
  success,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSelectFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSelectFile(file);
    }
  };

  const validateAndSelectFile = (file: File) => {
    // Validar tipo de archivo
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Solo se permiten archivos PDF o DOCX');
      return;
    }

    // Validar tamaño (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('El archivo es demasiado grande. Máximo 5MB');
      return;
    }

    onFileSelect(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension === 'pdf' ? '📄' : '📝';
  };

  return (
    <Box>
      {!selectedFile ? (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            border: '2px dashed',
            borderColor: dragActive ? 'primary.main' : 'grey.300',
            backgroundColor: dragActive ? 'action.hover' : 'background.paper',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover',
            },
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />

          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />

          <Typography variant="h6" gutterBottom>
            Subir CV
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Arrastra y suelta tu archivo aquí, o haz clic para seleccionar
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Formatos permitidos: PDF, DOCX (máximo 5MB)
          </Typography>

          <Button variant="outlined" startIcon={<CloudUploadIcon />} sx={{ mt: 2 }}>
            Seleccionar Archivo
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <Typography variant="h6" sx={{ mr: 1 }}>
                {getFileIcon(selectedFile.name)}
              </Typography>
              <Box>
                <Typography variant="subtitle1">{selectedFile.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatFileSize(selectedFile.size)}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              {success && <Chip icon={<CheckCircleIcon />} label="Subido" color="success" size="small" />}

              {!uploading && (
                <IconButton color="error" onClick={onFileRemove} size="small">
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </Box>

          {uploading && (
            <Box sx={{ mt: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Subiendo archivo...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {uploadProgress}%
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 8, borderRadius: 4 }} />
            </Box>
          )}
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};
