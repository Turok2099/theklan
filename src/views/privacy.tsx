"use client";

export const Privacy = () => {
  const fecha = new Date().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  return (
    <main className="min-h-screen bg-white py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Aviso de Privacidad
          </h1>
          <p className="text-sm text-gray-500">Última actualización: {fecha}</p>
        </header>

        <section className="space-y-8 text-gray-800">
          <article className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              AVISO DE PRIVACIDAD
            </h2>
            <div className="leading-relaxed">
              <p className="mb-4">
                Aviso de privacidad con fundamento en los artículos 15 y 16 de
                la ley federal de protección a datos personales en posesión de
                particulares. Hacemos de su conocimiento que{" "}
                <strong>The Klan</strong> con domicilio en Anaxágoras 944, Col.
                Del Valle CP 03100, CDMX es responsable de recabar sus datos
                personales, del uso que se le dé a los mismos y de su
                protección.
              </p>
              <p className="mb-4">
                Es importante informarle que usted tiene derecho al acceso,
                rectificación y cancelación de sus datos personales o a oponerse
                al tratamiento de los mismos, o a revocar el consentimiento que
                para dicho fin nos haya otorgado.
              </p>
              <p className="mb-4">
                Para ello es necesario que envíe la solicitud en los términos
                que marca la ley en su artículo 29 a{" "}
                <strong>theklanmx@gmail.com</strong>.
              </p>
            </div>
          </article>

          <article>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Información Adicional sobre Protección de Datos
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Datos que Recopilamos
                </h3>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>
                    <strong>Datos personales:</strong> Nombre completo, fecha de
                    nacimiento, dirección, teléfono, correo electrónico
                  </li>
                  <li>
                    <strong>Datos de contacto de emergencia:</strong> Nombre y
                    teléfono de contacto
                  </li>
                  <li>
                    <strong>Información médica:</strong> Condiciones médicas,
                    medicamentos, alergias, lesiones previas
                  </li>
                  <li>
                    <strong>Información de actividad física:</strong> Frecuencia
                    de ejercicio, experiencia en artes marciales
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Finalidad del Tratamiento
                </h3>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>Gestión de membresías y clases</li>
                  <li>Contacto en caso de emergencia</li>
                  <li>Cumplimiento de obligaciones legales y contractuales</li>
                  <li>Mejora de servicios y experiencia del usuario</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Derechos ARCO
                </h3>
                <p className="leading-relaxed mb-2">Usted tiene derecho a:</p>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>
                    <strong>Acceso:</strong> Conocer qué datos personales
                    tenemos de usted
                  </li>
                  <li>
                    <strong>Rectificación:</strong> Corregir datos inexactos o
                    incompletos
                  </li>
                  <li>
                    <strong>Cancelación:</strong> Solicitar la eliminación de
                    sus datos
                  </li>
                  <li>
                    <strong>Oposición:</strong> Oponerse al tratamiento de sus
                    datos
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Medidas de Seguridad
                </h3>
                <p className="leading-relaxed">
                  Implementamos medidas técnicas y administrativas para proteger
                  sus datos personales contra daño, pérdida, alteración,
                  destrucción o el uso, acceso o tratamiento no autorizado.
                </p>
              </div>
            </div>
          </article>

          <article className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Contacto para Ejercicio de Derechos
            </h2>
            <p className="leading-relaxed mb-4">
              Para ejercer cualquiera de sus derechos ARCO o para cualquier
              consulta relacionada con el tratamiento de sus datos personales,
              puede contactarnos:
            </p>
            <div className="space-y-2">
              <p>
                <strong>Correo electrónico:</strong>{" "}
                <a
                  href="mailto:theklanmx@gmail.com"
                  className="text-red-600 font-semibold hover:underline"
                  style={{
                    color: "#dc2626",
                    fontWeight: "600",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = "underline";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = "none";
                  }}
                >
                  theklanmx@gmail.com
                </a>
              </p>
              <p>
                <strong>Dirección:</strong> Anaxágoras 944, Col. Del Valle CP
                03100, CDMX
              </p>
              <p>
                <strong>Teléfono:</strong>{" "}
                <a
                  href="tel:5613701366"
                  className="text-red-600 font-semibold hover:underline"
                  style={{
                    color: "#dc2626",
                    fontWeight: "600",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = "underline";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = "none";
                  }}
                >
                  56-1370-1366
                </a>
              </p>
            </div>
          </article>

          <article>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Actualizaciones
            </h2>
            <p className="leading-relaxed">
              Este aviso de privacidad puede ser actualizado periódicamente.
              Cualquier modificación será publicada en esta página con la fecha
              de última actualización correspondiente.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
};
