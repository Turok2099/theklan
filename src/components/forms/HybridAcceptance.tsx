"use client";

import { SignaturePad, SignaturePadRef } from "./SignaturePad";

interface HybridAcceptanceProps {
  onSignatureChange: (signature: string) => void;
  signatureError?: string;
  signatureRef: React.RefObject<SignaturePadRef | null>;
  aceptaTerminos: boolean;
  aceptaAvisoPrivacidad: boolean;
  onAceptaTerminosChange: (acepta: boolean) => void;
  onAceptaAvisoPrivacidadChange: (acepta: boolean) => void;
  terminosError?: string;
  privacidadError?: string;
}

export const HybridAcceptance = ({
  onSignatureChange,
  signatureError,
  signatureRef,
  aceptaTerminos,
  aceptaAvisoPrivacidad,
  onAceptaTerminosChange,
  onAceptaAvisoPrivacidadChange,
  terminosError,
  privacidadError,
}: HybridAcceptanceProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        ACEPTACIÓN LEGAL
      </h2>

      {/* Términos y Condiciones */}
      <div className="border border-gray-200 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 text-sm">
          TÉRMINOS Y CONDICIONES
        </h3>
        <div className="text-sm text-gray-800 md:text-gray-700 space-y-2">
          <p>
            • The Klan no se hace responsable por pérdidas dentro de las
            instalaciones.
          </p>
          <p>
            • El mat/piso del salón de arriba no se puede pisar con zapatos.
          </p>
          <p>
            • The Klan, ni los coaches que trabajan en esta empresa, son
            responsables de cubrir los gastos médicos que se generen de
            cualquier accidente que pudiera llegar a ocurrir. Si esta situación
            se presenta, te llevaremos a donde tú nos indiques y se contactará a
            la persona que deberá hacerse cargo de tus gastos y procedimiento
            médico.
          </p>
          <p>
            • Nos autorizas usar las fotografías y/o videos donde salgas para
            publicidad.
          </p>
          <p>
            • Podemos utilizar tus datos únicamente para hacerse llegar nuestras
            promociones, clases especiales y actualizaciones. No se usarán por
            ningún motivo con ninguna otra marca/institución.
          </p>
        </div>

        <label
          htmlFor="acepta-terminos"
          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <input
            type="checkbox"
            id="acepta-terminos"
            name="aceptaTerminos"
            checked={aceptaTerminos}
            onChange={(e) => onAceptaTerminosChange(e.target.checked)}
            className="mt-1 w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
          />
          <span className="text-sm font-medium text-gray-900">
            ENTIENDO Y ACEPTO ESTOS TÉRMINOS Y CONDICIONES
          </span>
        </label>
        {terminosError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">{terminosError}</p>
          </div>
        )}
      </div>

      {/* Aviso de Privacidad */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 text-sm mb-4">
          AVISO DE PRIVACIDAD
        </h3>
        <div className="text-sm text-gray-800 md:text-gray-700 mb-4">
          <p>
            Aviso de privacidad con fundamento en los artículos 15 y 16 de la
            ley federal de protección a datos personales en posesión de
            particulares. Hacemos de su conocimiento que The Klan con domicilio
            en Anaxágoras 944, Col. Del Valle CP 03100, CDMX es responsable de
            recabar sus datos personales, del uso que se le dé a los mismos y de
            su protección. Es importante informarle que usted tiene derecho al
            acceso, rectificación y cancelación de sus datos personales o a
            oponerse al tratamiento de los mismos, o a revocar el consentimiento
            que para dicho fin nos haya otorgado. Para ello es necesario que
            envíe la solicitud en los términos que marca la ley en su artículo
            29 a theklanmx@gmail.com.
          </p>
        </div>

        <label
          htmlFor="acepta-privacidad"
          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <input
            type="checkbox"
            id="acepta-privacidad"
            name="aceptaAvisoPrivacidad"
            checked={aceptaAvisoPrivacidad}
            onChange={(e) => onAceptaAvisoPrivacidadChange(e.target.checked)}
            className="mt-1 w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
          />
          <span className="text-sm font-medium text-gray-900">
            ACEPTO EL AVISO DE PRIVACIDAD
          </span>
        </label>
        {privacidadError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-3">
            <p className="text-red-800 text-sm font-medium">
              {privacidadError}
            </p>
          </div>
        )}
      </div>

      {/* Información legal simplificada */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="text-sm text-gray-800 md:text-gray-700 space-y-1">
          <p>
            <strong>✅ Aceptación Digital:</strong> Legalmente válida en México
            según la Ley Federal de Protección de Datos Personales.
          </p>
          <p>
            <strong>✍️ Firma Digital:</strong> Opcional para mayor seguridad y
            preferencia personal.
          </p>
        </div>
      </div>

      {/* Sección de firma digital (opcional) */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          FIRMA DIGITAL (OPCIONAL)
        </h3>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800">
            💡 La firma digital es completamente opcional. Ya aceptaste
            legalmente con los checkboxes de arriba.
          </p>
        </div>

        <SignaturePad
          ref={signatureRef}
          onSignatureChange={onSignatureChange}
          error={signatureError}
        />
      </div>
    </div>
  );
};
