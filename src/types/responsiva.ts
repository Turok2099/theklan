// Tipos para el formulario de responsiva basado en el formulario físico
export interface ResponsivaFormData {
  // Datos personales obligatorios
  nombre: string;
  fechaNacimiento: string; // Fecha de nacimiento en formato YYYY-MM-DD
  celular: string;
  email: string;
  instagram?: string;
  escuelaEmpresa?: string;
  comoSeEntero: string;

  // Información de emergencia
  contactoEmergencia: string;
  telefonoEmergencia: string;
  tieneSeguroMedico: boolean;
  lugarAtencionMedica?: string;

  // Información médica importante
  lesionesRestriccionesMedicamentos?: string;

  // Frecuencia de ejercicio
  frecuenciaEjercicio: "1dia" | "2dias" | "3omas";

  // Términos y condiciones
  aceptaTerminos: boolean;
  aceptaAvisoPrivacidad: boolean;

  // Firma digital (opcional)
  firmaDigital?: string;
  fechaFirma?: string;

  // Metadatos generales
  ipAddress?: string;
  userAgent?: string;
  timestamp?: string;
}

// Opciones para el campo "¿Cómo te enteraste de nosotros?"
export const COMO_SE_ENTERO_OPTIONS = [
  "Redes sociales (Instagram/Facebook)",
  "Google/Búsqueda en internet",
  "Recomendación de amigo/familiar",
  "Publicidad en la calle",
  "Otro gimnasio/escuela",
  "Evento/competencia",
  "YouTube",
  "Otro",
] as const;

// Opciones para frecuencia de ejercicio
export const FRECUENCIA_EJERCICIO_OPTIONS = [
  { value: "1dia", label: "1 día a la semana" },
  { value: "2dias", label: "2 días a la semana" },
  { value: "3omas", label: "3 días o más a la semana" },
] as const;
