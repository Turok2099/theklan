import { z } from "zod";

// Esquema de validación para el formulario de responsiva
export const responsivaSchema = z.object({
  // Datos personales obligatorios
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "El nombre solo puede contener letras y espacios"
    ),

  fechaNacimiento: z
    .string()
    .min(1, "La fecha de nacimiento es requerida")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      // Ajustar edad si aún no ha cumplido años este año
      const actualAge =
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ? age - 1
          : age;

      return actualAge >= 16 && actualAge <= 80;
    }, "Debes tener entre 16 y 80 años"),

  celular: z
    .string()
    .min(10, "El número de celular debe tener al menos 10 dígitos")
    .max(15, "El número de celular no puede exceder 15 dígitos")
    .regex(/^[0-9+\-\s()]+$/, "Formato de celular inválido"),

  email: z
    .string()
    .email("Formato de email inválido")
    .max(255, "El email no puede exceder 255 caracteres"),

  instagram: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length <= 50,
      "Instagram no puede exceder 50 caracteres"
    ),

  escuelaEmpresa: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length <= 100,
      "Escuela/Empresa no puede exceder 100 caracteres"
    ),

  comoSeEntero: z
    .string()
    .min(1, "Debes seleccionar cómo te enteraste de nosotros"),

  // Información de emergencia
  contactoEmergencia: z
    .string()
    .min(
      2,
      "El nombre del contacto de emergencia debe tener al menos 2 caracteres"
    )
    .max(100, "El nombre no puede exceder 100 caracteres"),

  telefonoEmergencia: z
    .string()
    .min(10, "El teléfono de emergencia debe tener al menos 10 dígitos")
    .max(15, "El teléfono no puede exceder 15 dígitos")
    .regex(/^[0-9+\-\s()]+$/, "Formato de teléfono inválido"),

  tieneSeguroMedico: z.boolean(),

  lugarAtencionMedica: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length <= 200,
      "El lugar de atención médica no puede exceder 200 caracteres"
    ),

  // Información médica
  lesionesRestriccionesMedicamentos: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length <= 500,
      "La información médica no puede exceder 500 caracteres"
    ),

  // Frecuencia de ejercicio
  frecuenciaEjercicio: z
    .enum(["1dia", "2dias", "3omas"])
    .refine((val) => ["1dia", "2dias", "3omas"].includes(val), {
      message: "Debes seleccionar tu frecuencia de ejercicio",
    }),

  // Términos y condiciones
  aceptaTerminos: z
    .boolean()
    .refine((val) => val === true, "Debes aceptar los términos y condiciones"),

  aceptaAvisoPrivacidad: z
    .boolean()
    .refine((val) => val === true, "Debes aceptar el aviso de privacidad"),

  // Firma digital (completamente opcional)
  firmaDigital: z.string().optional(),
  fechaFirma: z.string().optional(),
});

// Tipo inferido del esquema
export type ResponsivaFormType = z.infer<typeof responsivaSchema>;

// Función para calcular edad a partir de fecha de nacimiento
export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

// Función para formatear fecha de nacimiento
export const formatBirthDate = (date: string): string => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Función para validar que la edad sea correcta
export const validateAge = (age: number): boolean => {
  return age >= 16 && age <= 80;
};
