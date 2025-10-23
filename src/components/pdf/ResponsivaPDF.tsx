import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { ResponsivaFormData } from "@/types/responsiva";

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 15,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  header: {
    marginBottom: 15,
    textAlign: "center",
    borderBottom: "1 solid #dc2626",
    paddingBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#dc2626",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: "#374151",
    marginBottom: 2,
  },
  date: {
    fontSize: 8,
    color: "#6b7280",
  },
  section: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#f9fafb",
    border: "1 solid #e5e7eb",
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#dc2626",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  field: {
    flexDirection: "row",
    marginBottom: 3,
    alignItems: "flex-start",
    minHeight: 12,
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#374151",
    width: 80,
    marginRight: 6,
    flexShrink: 0,
  },
  fieldValue: {
    fontSize: 9,
    color: "#1f2937",
    flex: 1,
    lineHeight: 1.2,
  },
  signatureSection: {
    marginTop: 10,
    padding: 8,
    border: "1 solid #e5e7eb",
    backgroundColor: "#ffffff",
  },
  signatureTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#dc2626",
    marginBottom: 4,
  },
  signatureImage: {
    width: 120,
    height: 40,
    marginBottom: 4,
    border: "1 solid #d1d5db",
  },
  signatureDate: {
    fontSize: 8,
    color: "#6b7280",
  },
  footer: {
    marginTop: 15,
    paddingTop: 8,
    borderTop: "1 solid #e5e7eb",
    textAlign: "center",
  },
  footerText: {
    fontSize: 7,
    color: "#6b7280",
    marginBottom: 1,
  },
  checkbox: {
    fontSize: 8,
    color: "#1f2937",
    marginBottom: 2,
    lineHeight: 1.1,
  },
  checkboxChecked: {
    fontSize: 8,
    color: "#059669",
    fontWeight: "bold",
    marginBottom: 2,
    lineHeight: 1.1,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 4,
  },
});

interface ResponsivaPDFProps {
  data: ResponsivaFormData;
}

export const ResponsivaPDF: React.FC<ResponsivaPDFProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "No especificado";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "No especificado";
    const date = new Date(dateString);
    return date.toLocaleString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>RESPONSIVA DE INSCRIPCIÓN</Text>
          <Text style={styles.subtitle}>THE KLAN BJJ</Text>
          <Text style={styles.subtitle}>Jiu Jitsu Brasileño en CDMX</Text>
          <Text style={styles.date}>
            Generado el: {new Date().toLocaleDateString("es-MX")}
          </Text>
        </View>

        {/* Datos Personales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATOS PERSONALES</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Nombre:</Text>
            <Text style={styles.fieldValue}>
              {data.nombre || "No especificado"}
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Fecha de Nacimiento:</Text>
            <Text style={styles.fieldValue}>
              {formatDate(data.fechaNacimiento)}
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Celular:</Text>
            <Text style={styles.fieldValue}>
              {data.celular || "No especificado"}
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Email:</Text>
            <Text style={styles.fieldValue}>
              {data.email || "No especificado"}
            </Text>
          </View>

          {data.instagram && (
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Instagram:</Text>
              <Text style={styles.fieldValue}>{data.instagram}</Text>
            </View>
          )}

          {data.escuelaEmpresa && (
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Escuela/Empresa:</Text>
              <Text style={styles.fieldValue}>{data.escuelaEmpresa}</Text>
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>¿Cómo se enteró?</Text>
            <Text style={styles.fieldValue}>
              {data.comoSeEntero || "No especificado"}
            </Text>
          </View>
        </View>

        {/* Información de Emergencia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTACTO DE EMERGENCIA</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Nombre:</Text>
            <Text style={styles.fieldValue}>
              {data.contactoEmergencia || "No especificado"}
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Teléfono:</Text>
            <Text style={styles.fieldValue}>
              {data.telefonoEmergencia || "No especificado"}
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Tiene Seguro Médico:</Text>
            <Text style={styles.fieldValue}>
              {data.tieneSeguroMedico ? "Sí" : "No"}
            </Text>
          </View>

          {data.tieneSeguroMedico && data.lugarAtencionMedica && (
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Lugar de Atención:</Text>
              <Text style={styles.fieldValue}>{data.lugarAtencionMedica}</Text>
            </View>
          )}
        </View>

        {/* Información Médica */}
        {data.lesionesRestriccionesMedicamentos && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>INFORMACIÓN MÉDICA</Text>
            <Text style={styles.fieldValue}>
              {data.lesionesRestriccionesMedicamentos}
            </Text>
          </View>
        )}

        {/* Información del Curso */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMACIÓN DEL CURSO</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Frecuencia de Ejercicio:</Text>
            <Text style={styles.fieldValue}>
              {data.frecuenciaEjercicio === "1dia" && "1 día a la semana"}
              {data.frecuenciaEjercicio === "2dias" && "2 días a la semana"}
              {data.frecuenciaEjercicio === "3omas" &&
                "3 días o más a la semana"}
            </Text>
          </View>
        </View>

        {/* Términos y Condiciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TÉRMINOS Y CONDICIONES</Text>

          <Text
            style={
              data.aceptaTerminos ? styles.checkboxChecked : styles.checkbox
            }
          >
            {data.aceptaTerminos ? "✓" : "✗"} Acepta términos y condiciones
          </Text>

          <Text
            style={
              data.aceptaAvisoPrivacidad
                ? styles.checkboxChecked
                : styles.checkbox
            }
          >
            {data.aceptaAvisoPrivacidad ? "✓" : "✗"} Acepta aviso de privacidad
          </Text>
        </View>

        {/* Firma Digital */}
        {data.firmaDigital && (
          <View style={styles.signatureSection}>
            <Text style={styles.signatureTitle}>FIRMA DIGITAL</Text>
            <Image style={styles.signatureImage} src={data.firmaDigital} />
            <Text style={styles.signatureDate}>
              Fecha de firma: {formatDateTime(data.fechaFirma || "")}
            </Text>
          </View>
        )}

        {/* Metadatos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMACIÓN TÉCNICA</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Fecha de Registro:</Text>
            <Text style={styles.fieldValue}>
              {formatDateTime(data.timestamp || "")}
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Estado:</Text>
            <Text style={styles.fieldValue}>Pendiente</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Este documento fue generado digitalmente por The Klan BJJ
          </Text>
          <Text style={styles.footerText}>
            Para consultas: contacto@theklanbjj.com.mx | Tel: +52-56-1370-1366
          </Text>
        </View>
      </Page>
    </Document>
  );
};
