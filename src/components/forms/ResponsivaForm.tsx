"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { responsivaSchema, ResponsivaFormType } from "@/lib/validations";
import {
  COMO_SE_ENTERO_OPTIONS,
  FRECUENCIA_EJERCICIO_OPTIONS,
} from "@/types/responsiva";
import { SignaturePadRef } from "./SignaturePad";
import { HybridAcceptance } from "./HybridAcceptance";

interface ResponsivaFormProps {
  onSubmit: (data: ResponsivaFormType) => Promise<void>;
  defaultEmail?: string;
}

export const ResponsivaForm = ({
  onSubmit,
  defaultEmail,
}: ResponsivaFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const signatureRef = useRef<SignaturePadRef>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ResponsivaFormType>({
    resolver: zodResolver(responsivaSchema),
    defaultValues: {
      email: defaultEmail || "",
      tieneSeguroMedico: false,
      aceptaTerminos: false,
      aceptaAvisoPrivacidad: false,
      firmaDigital: "",
      fechaFirma: "",
    },
  });

  const watchedSeguroMedico = watch("tieneSeguroMedico");

  // Actualizar email cuando defaultEmail cambie
  useEffect(() => {
    if (defaultEmail && defaultEmail !== "") {
      console.log("📧 Actualizando email del formulario:", defaultEmail);
      setValue("email", defaultEmail);
    }
  }, [defaultEmail, setValue]);

  const onFormSubmit = async (data: ResponsivaFormType) => {
    console.log("🚀 Iniciando envío del formulario...");
    console.log("📋 Datos recibidos:", data);

    setIsSubmitting(true);
    setSubmitError("");

    try {
      console.log("✅ Validación de Zod pasó, obteniendo firma...");

      // Obtener la firma actual del canvas (opcional)
      const currentSignature =
        signatureRef.current?.getCurrentSignature() || "";

      console.log("✍️ Firma obtenida:", currentSignature ? "Sí" : "No");

      // Preparar datos con firma opcional
      const dataWithSignature = {
        ...data,
        firmaDigital: currentSignature || undefined,
        fechaFirma: currentSignature ? new Date().toISOString() : undefined,
      };

      console.log("📤 Enviando datos a la API:", dataWithSignature);

      await onSubmit(dataWithSignature);

      console.log("✅ Datos enviados exitosamente");
      setSubmitSuccess(true);

      // Limpiar formulario después del éxito
      reset();
      signatureRef.current?.clear();

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("❌ Error en el formulario:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Error al enviar el formulario"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignatureChange = (signature: string) => {
    setValue("firmaDigital", signature);
    setValue("fechaFirma", new Date().toISOString());
  };

  const handleAceptaTerminosChange = (acepta: boolean) => {
    setValue("aceptaTerminos", acepta);
  };

  const handleAceptaAvisoPrivacidadChange = (acepta: boolean) => {
    setValue("aceptaAvisoPrivacidad", acepta);
  };

  const watchedAceptaTerminos = watch("aceptaTerminos");
  const watchedAceptaAvisoPrivacidad = watch("aceptaAvisoPrivacidad");

  const handleFormSubmit = (e: React.FormEvent) => {
    console.log("🔥 Form submit event triggered!");
    e.preventDefault();

    // Debug: mostrar errores de validación actuales
    console.log("🔍 Errores de validación actuales:", errors);
    console.log("🔍 Valores del formulario:", watch());

    handleSubmit(onFormSubmit)(e);
  };

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-green-600 text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Responsiva Enviada Exitosamente!
        </h2>
        <p className="text-gray-600 mb-4">
          Tu responsiva ha sido enviada correctamente. Te contactaremos pronto
          para confirmar tu inscripción.
        </p>
        <p className="text-sm text-gray-500">
          Recibirás una copia por email con todos los detalles.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">BIENVENIDO/A</h1>
        <p className="text-gray-600">
          Para hacer el uso de las instalaciones, necesitamos algunos datos
          personales
        </p>
        <div className="w-24 h-1 bg-red-600 mx-auto mt-4" />
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold">❌ Error al enviar</p>
          <p className="text-red-800 text-sm font-medium">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-8">
        {/* DATOS OBLIGATORIOS */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="text-gray-900 mr-2">•</span>
            LOS CAMPOS CON TÍTULO EN ROJO SON OBLIGATORIOS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-red-600 mb-2">
                Nombre *
              </label>
              <input
                {...register("nombre")}
                type="text"
                id="nombre"
                name="nombre"
                autoComplete="name"
                className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50 text-gray-900 placeholder-gray-500"
                placeholder="Tu nombre completo"
              />
              {errors.nombre && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-2">
                  <p className="text-red-800 text-sm font-medium">
                    {errors.nombre.message}
                  </p>
                </div>
              )}
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label className="block text-sm font-semibold text-red-600 mb-2">
                Fecha de Nacimiento *
              </label>
              <input
                {...register("fechaNacimiento")}
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                autoComplete="bday"
                max={new Date().toISOString().split("T")[0]} // No permitir fechas futuras
                className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50 text-gray-900 placeholder-gray-500"
                placeholder="dd/mm/aaaa"
              />
              {errors.fechaNacimiento && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-2">
                  <p className="text-red-800 text-sm font-medium">
                    {errors.fechaNacimiento.message}
                  </p>
                </div>
              )}
            </div>

            {/* Celular */}
            <div>
              <label className="block text-sm font-semibold text-red-600 mb-2">
                Celular *
              </label>
              <input
                {...register("celular")}
                type="tel"
                id="celular"
                name="celular"
                autoComplete="tel"
                className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50 text-gray-900 placeholder-gray-500"
                placeholder="55-1234-5678"
              />
              {errors.celular && (
                <p className="text-red-800 text-sm font-medium">
                  {errors.celular.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-red-600 mb-2">
                Email *
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50 text-gray-900 placeholder-gray-500"
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="text-red-800 text-sm font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Instagram
              </label>
              <input
                {...register("instagram")}
                type="text"
                id="instagram"
                name="instagram"
                autoComplete="username"
                className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50 text-gray-900 placeholder-gray-500"
                placeholder="@tuusuario"
              />
              {errors.instagram && (
                <p className="text-red-800 text-sm font-medium">
                  {errors.instagram.message}
                </p>
              )}
            </div>

            {/* Escuela/Empresa */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Escuela/Empresa
              </label>
              <input
                {...register("escuelaEmpresa")}
                type="text"
                id="escuelaEmpresa"
                name="escuelaEmpresa"
                autoComplete="organization"
                className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50 text-gray-900 placeholder-gray-500"
                placeholder="Nombre de tu escuela o empresa"
              />
              {errors.escuelaEmpresa && (
                <p className="text-red-800 text-sm font-medium">
                  {errors.escuelaEmpresa.message}
                </p>
              )}
            </div>

            {/* ¿Cómo te enteraste? */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-red-600 mb-2">
                ¿Cómo te enteraste de nosotros? *
              </label>
              <select
                {...register("comoSeEntero")}
                id="comoSeEntero"
                name="comoSeEntero"
                className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50 text-gray-900 placeholder-gray-500"
              >
                <option value="">Selecciona una opción</option>
                {COMO_SE_ENTERO_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.comoSeEntero && (
                <p className="text-red-800 text-sm font-medium">
                  {errors.comoSeEntero.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* EN CASO DE EMERGENCIA */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            EN CASO DE EMERGENCIA
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contacto de Emergencia */}
            <div>
              <label className="block text-sm font-semibold text-red-600 mb-2">
                Llama *
              </label>
              <input
                {...register("contactoEmergencia")}
                type="text"
                id="contactoEmergencia"
                name="contactoEmergencia"
                autoComplete="name"
                className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50 text-gray-900 placeholder-gray-500"
                placeholder="Nombre del contacto de emergencia"
              />
              {errors.contactoEmergencia && (
                <p className="text-red-800 text-sm font-medium">
                  {errors.contactoEmergencia.message}
                </p>
              )}
            </div>

            {/* Teléfono de Emergencia */}
            <div>
              <label className="block text-sm font-semibold text-red-600 mb-2">
                Tel/Cel *
              </label>
              <input
                {...register("telefonoEmergencia")}
                type="tel"
                id="telefonoEmergencia"
                name="telefonoEmergencia"
                autoComplete="tel"
                className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50 text-gray-900 placeholder-gray-500"
                placeholder="55-1234-5678"
              />
              {errors.telefonoEmergencia && (
                <p className="text-red-800 text-sm font-medium">
                  {errors.telefonoEmergencia.message}
                </p>
              )}
            </div>

            {/* Seguro Médico */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                ¿Cuentas con seguro de gastos médicos?
              </label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    {...register("tieneSeguroMedico")}
                    type="radio"
                    value="true"
                    id="seguro-medico-si"
                    name="tieneSeguroMedico"
                    className="mr-2"
                  />
                  <span>Sí</span>
                </label>
                <label className="flex items-center">
                  <input
                    {...register("tieneSeguroMedico")}
                    type="radio"
                    value="false"
                    id="seguro-medico-no"
                    name="tieneSeguroMedico"
                    className="mr-2"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {/* Lugar de Atención Médica */}
            {watchedSeguroMedico && (
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  ¿A dónde te debemos llevar?
                </label>
                <input
                  {...register("lugarAtencionMedica")}
                  type="text"
                  id="lugarAtencionMedica"
                  name="lugarAtencionMedica"
                  autoComplete="off"
                  className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50 text-gray-900 placeholder-gray-500"
                  placeholder="Hospital, clínica o lugar de atención médica"
                />
                {errors.lugarAtencionMedica && (
                  <p className="text-red-800 text-sm font-medium">
                    {errors.lugarAtencionMedica.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ALGÚN DATO IMPORTANTE */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            ALGÚN DATO IMPORTANTE
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lesiones, restricciones, medicamentos
            </label>
            <textarea
              {...register("lesionesRestriccionesMedicamentos")}
              id="lesionesRestriccionesMedicamentos"
              name="lesionesRestriccionesMedicamentos"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent bg-gray-50"
              placeholder="Describe cualquier lesión, restricción médica o medicamento que estés tomando..."
            />
            {errors.lesionesRestriccionesMedicamentos && (
              <p className="text-red-800 text-sm font-medium">
                {errors.lesionesRestriccionesMedicamentos.message}
              </p>
            )}
          </div>
        </section>

        {/* FRECUENCIA DE EJERCICIO */}
        <section>
          <h2 className="text-xl font-semibold text-red-600 mb-6">
            ACTUALMENTE, ¿CUÁNTO EJERCICIO HACES? *
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FRECUENCIA_EJERCICIO_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center p-4 border border-gray-400 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  {...register("frecuenciaEjercicio")}
                  type="radio"
                  value={option.value}
                  id={`frecuencia-${option.value}`}
                  name="frecuenciaEjercicio"
                  className="mr-3"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.frecuenciaEjercicio && (
            <p className="text-red-600 text-sm mt-2">
              {errors.frecuenciaEjercicio.message}
            </p>
          )}
        </section>

        {/* ACEPTACIÓN LEGAL */}
        <section>
          <HybridAcceptance
            onSignatureChange={handleSignatureChange}
            signatureError={errors.firmaDigital?.message}
            signatureRef={signatureRef}
            aceptaTerminos={watchedAceptaTerminos}
            aceptaAvisoPrivacidad={watchedAceptaAvisoPrivacidad}
            onAceptaTerminosChange={handleAceptaTerminosChange}
            onAceptaAvisoPrivacidadChange={handleAceptaAvisoPrivacidadChange}
            terminosError={errors.aceptaTerminos?.message}
            privacidadError={errors.aceptaAvisoPrivacidad?.message}
          />
        </section>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="font-semibold py-4 px-8 rounded-lg transition-colors disabled:cursor-not-allowed text-base shadow-lg"
            style={{
              color: "#ffffff",
              backgroundColor: isSubmitting ? "#9ca3af" : "#000000",
              padding: "1rem 2rem",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundColor = "#dc2626";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundColor = "#000000";
              }
            }}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                  style={{ color: "#ffffff" }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Enviando...
              </div>
            ) : (
              "ENVIAR RESPONSIVA"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
