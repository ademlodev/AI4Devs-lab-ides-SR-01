# API del Sistema de Seguimiento de Talento (ATS)

## Descripción

API REST para gestionar candidatos en el sistema ATS, permitiendo añadir candidatos, subir CVs y obtener información de los mismos.

## Endpoints

### 1. Crear Candidato

**POST** `/api/applicants`

Crea un nuevo candidato en el sistema.

**Body:**

```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@email.com",
  "phone": "+34612345678",
  "address": "Calle Mayor 123, Madrid",
  "education": [
    {
      "institution": "Universidad Complutense",
      "degree": "Ingeniero Informático",
      "field": "Informática",
      "startDate": "2018-09-01",
      "endDate": "2022-06-30",
      "description": "Grado en Ingeniería Informática"
    }
  ],
  "workExperience": [
    {
      "company": "TechCorp",
      "position": "Desarrollador Full Stack",
      "startDate": "2022-07-01",
      "endDate": "2024-01-31",
      "description": "Desarrollo de aplicaciones web",
      "responsibilities": [
        "Desarrollo frontend",
        "Desarrollo backend",
        "Mantenimiento"
      ]
    }
  ],
  "recruiterId": 1
}
```

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "message": "Candidato añadido exitosamente",
  "data": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@email.com",
    "phone": "+34612345678",
    "address": "Calle Mayor 123, Madrid",
    "education": [...],
    "workExperience": [...],
    "cvUrl": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "recruiterId": 1
  }
}
```

### 2. Obtener Todos los Candidatos

**GET** `/api/applicants`

Obtiene la lista de todos los candidatos.

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Candidatos obtenidos exitosamente",
  "data": [...],
  "count": 5
}
```

### 3. Obtener Candidato por ID

**GET** `/api/applicants/:id`

Obtiene un candidato específico por su ID.

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Candidato obtenido exitosamente",
  "data": {...}
}
```

### 4. Subir CV

**POST** `/api/applicants/:id/cv`

Sube un archivo CV para un candidato específico.

**Form Data:**

- `file`: Archivo PDF o DOCX (máximo 5MB)

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "CV subido exitosamente",
  "data": {
    "applicantId": 1,
    "cvUrl": "/uploads/cv/cv-1234567890.pdf",
    "originalName": "mi-cv.pdf",
    "size": 1024000
  }
}
```

## Validaciones

### Teléfono Español

- Debe seguir el formato español: `+34`, `0034`, `34` seguido de 9 dígitos
- Ejemplos válidos: `+34612345678`, `612345678`, `0034612345678`

### Email

- Debe tener formato válido con arroba y dominio
- Ejemplos válidos: `usuario@dominio.com`, `test@example.org`

### Archivos CV

- Solo se permiten archivos PDF y DOCX
- Tamaño máximo: 5MB
- Se almacenan en el directorio `uploads/cv/`

## Códigos de Error

- **400**: Error de validación o datos incorrectos
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

## Instalación y Uso

1. Instalar dependencias:

```bash
npm install
```

2. Configurar base de datos:

```bash
npx prisma migrate dev
```

3. Ejecutar servidor:

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3010`
