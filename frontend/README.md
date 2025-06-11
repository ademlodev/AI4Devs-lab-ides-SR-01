# Frontend - Sistema de Seguimiento de Talento (ATS)

## Descripción

Interfaz de usuario moderna y responsive para el Sistema de Seguimiento de Talento, desarrollada con React, TypeScript y Material-UI.

## Características

### 🎨 **Dashboard Principal**

- Vista general de estadísticas (candidatos totales, CVs subidos, nuevos en 7 días)
- Lista de candidatos recientes con información básica
- Botón prominente para añadir nuevos candidatos
- Indicador de estado del servidor
- Diseño responsive para diferentes dispositivos

### 📝 **Formulario de Añadir Candidato**

- **Paso 1: Información Personal**

  - Nombre y apellido (validación de longitud)
  - Email (validación de formato)
  - Teléfono español (validación de formato: +34, 0034, 34 + 9 dígitos)
  - Dirección (opcional)

- **Paso 2: Educación**

  - Múltiples registros de educación
  - Campos: institución, título, campo de estudio, fechas, descripción
  - Añadir/eliminar registros dinámicamente

- **Paso 3: Experiencia Laboral**

  - Múltiples registros de experiencia
  - Campos: empresa, cargo, fechas, descripción
  - Añadir/eliminar registros dinámicamente

- **Paso 4: Revisión Final**
  - Resumen completo de toda la información
  - Confirmación antes de enviar

### 📁 **Carga de Archivos CV**

- Soporte para arrastrar y soltar archivos
- Validación de tipos (PDF, DOCX)
- Límite de tamaño (5MB)
- Barra de progreso durante la subida
- Indicadores visuales de estado

### ✅ **Validaciones**

- **Frontend**: Validaciones en tiempo real
- **Backend**: Validaciones de seguridad
- Mensajes de error contextuales
- Prevención de envío con datos inválidos

### 🎯 **UX/UI**

- Diseño Material Design con Material-UI
- Navegación intuitiva con stepper
- Mensajes de confirmación y error
- Estados de carga y progreso
- Diseño responsive (móvil, tablet, desktop)

## Tecnologías Utilizadas

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Material-UI (MUI)** - Componentes de UI
- **Axios** - Cliente HTTP
- **React Router** - Navegación (preparado para futuras expansiones)

## Estructura del Proyecto

```
src/
├── components/
│   ├── Dashboard.tsx           # Dashboard principal
│   ├── AddApplicantForm.tsx    # Formulario de candidatos
│   └── FileUpload.tsx          # Componente de carga de archivos
├── services/
│   └── api.service.ts          # Servicio de comunicación con API
├── types/
│   └── applicant.types.ts      # Tipos TypeScript
├── App.tsx                     # Componente principal
└── index.tsx                   # Punto de entrada
```

## Instalación y Uso

### 1. Instalar dependencias

```bash
npm install
```

### 2. Verificar que el backend esté ejecutándose

El frontend requiere que el backend esté disponible en `http://localhost:3010`

### 3. Ejecutar en modo desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

### 4. Construir para producción

```bash
npm run build
```

## Flujo de Usuario

1. **Dashboard**: El usuario ve estadísticas y candidatos existentes
2. **Añadir Candidato**: Hace clic en "Añadir Candidato"
3. **Formulario**: Completa la información paso a paso
4. **Validación**: El sistema valida los datos en cada paso
5. **Confirmación**: Revisa toda la información antes de enviar
6. **Éxito**: Recibe confirmación y regresa al dashboard
7. **CV Opcional**: Puede subir un CV después de crear el candidato

## Validaciones Implementadas

### Teléfono Español

- Formato: `+34612345678`, `612345678`, `0034612345678`
- Debe comenzar con 6, 7, 8 o 9
- Longitud total: 9 dígitos (sin prefijo) o 11-13 (con prefijo)

### Email

- Formato válido con arroba y dominio
- Ejemplo: `usuario@dominio.com`

### Archivos CV

- Tipos permitidos: PDF, DOCX
- Tamaño máximo: 5MB
- Validación de tipo MIME

## Responsive Design

- **Desktop**: Layout completo con todas las funcionalidades
- **Tablet**: Adaptación de columnas y espaciado
- **Móvil**: Navegación optimizada, formularios apilados

## Próximas Mejoras

- [ ] Subida de CV durante la creación del candidato
- [ ] Edición de candidatos existentes
- [ ] Filtros y búsqueda en el dashboard
- [ ] Exportación de datos
- [ ] Notificaciones en tiempo real
- [ ] Modo oscuro
- [ ] Internacionalización (i18n)

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
