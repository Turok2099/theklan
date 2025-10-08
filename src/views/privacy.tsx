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
            Política de Privacidad
          </h1>
          <p className="text-sm text-gray-500">Última actualización: {fecha}</p>
        </header>

        <section className="space-y-10 text-gray-800">
          <article>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              1. Introducción
            </h2>
            <p className="leading-relaxed">
              En <strong>The Klan BJJ</strong>, nos comprometemos a proteger la
              privacidad de nuestros usuarios. Esta política describe cómo
              recopilamos, usamos y protegemos la información personal
              proporcionada a través de nuestro sitio web.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              2. Información que Recopilamos
            </h2>
            <ul className="list-disc list-inside space-y-2 leading-relaxed">
              <li>
                <strong>Datos de contacto</strong> (por ejemplo, nombre y correo
                electrónico) cuando nos escribes mediante formularios o enlaces
                de contacto.
              </li>
              <li>
                <strong>Información técnica de navegación</strong> (como IP
                aproximada, tipo de dispositivo, páginas visitadas) recogida a
                través de cookies técnicas necesarias para el correcto
                funcionamiento y rendimiento del sitio.
              </li>
            </ul>
            <p className="mt-3 text-sm text-gray-600">
              Nota: No utilizamos plugins de WordPress. Este sitio está
              desarrollado con Next.js. No instalamos cookies de marketing de
              terceros sin tu consentimiento.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              3. Uso de la Información
            </h2>
            <ul className="list-disc list-inside space-y-2 leading-relaxed">
              <li>Responder consultas y solicitudes que nos envías.</li>
              <li>Mejorar la experiencia y accesibilidad del sitio.</li>
              <li>Analizar desempeño técnico y prevenir abusos.</li>
            </ul>
          </article>

          <article>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              4. Protección de Datos
            </h2>
            <p className="leading-relaxed">
              Implementamos medidas de seguridad razonables para proteger tu
              información contra accesos no autorizados, pérdidas o
              alteraciones. Aun así, ningún método de transmisión o
              almacenamiento es 100% infalible.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              5. Cookies y Tecnologías de Seguimiento
            </h2>
            <p className="leading-relaxed">
              Este sitio utiliza cookies esenciales para su funcionamiento y, en
              su caso, cookies analíticas agregadas y anónimas. Puedes gestionar
              las cookies desde la configuración de tu navegador.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              6. Compartición de Datos
            </h2>
            <p className="leading-relaxed">
              No vendemos tu información personal. Solo la compartimos cuando es
              necesario para cumplir obligaciones legales, responder
              requerimientos de autoridad competente o mantener la operación del
              sitio con proveedores que actúan como encargados de tratamiento.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              7. Derechos del Usuario (ARCO)
            </h2>
            <p className="leading-relaxed">
              En términos de la legislación mexicana aplicable, puedes ejercer
              tus derechos de Acceso, Rectificación, Cancelación u Oposición
              (ARCO), así como limitar el uso o divulgación de tus datos y
              revocar el consentimiento, escribiéndonos a nuestro correo de
              contacto.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              8. Contacto
            </h2>
            <p className="leading-relaxed">
              Si tienes dudas sobre esta Política de Privacidad o deseas ejercer
              tus derechos, contáctanos en:
            </p>
            <p className="mt-2">
              <strong>Correo:</strong>{" "}
              <span className="text-gray-700">info@theklanbjj.com.mx</span>
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              9. Actualizaciones a esta Política
            </h2>
            <p className="leading-relaxed">
              Podemos actualizar esta política para reflejar cambios legales o
              operativos. Publicaremos la versión vigente en este mismo
              apartado, indicando la fecha de última actualización.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
};
