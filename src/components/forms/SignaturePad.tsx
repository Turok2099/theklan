"use client";

import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignaturePadProps {
  onSignatureChange: (signature: string) => void;
  error?: string;
}

export interface SignaturePadRef {
  getCurrentSignature: () => string;
  isEmpty: () => boolean;
  clear: () => void;
}

export const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(
  ({ onSignatureChange, error }, ref) => {
    const sigRef = useRef<SignatureCanvas>(null);
    const [hasSignature, setHasSignature] = useState(false);

    const handleSave = () => {
      if (sigRef.current) {
        const signature = sigRef.current.toDataURL();
        const isEmptyNow = sigRef.current.isEmpty();

        // Estado interno para control de UI
        setHasSignature(!isEmptyNow);

        if (!isEmptyNow) {
          onSignatureChange(signature);
        } else {
          onSignatureChange("");
        }
      }
    };

    const handleClear = () => {
      if (sigRef.current) {
        sigRef.current.clear();
        // Limpiar estado interno
        setHasSignature(false);
        onSignatureChange("");
      }
    };

    const handleBegin = () => {
      // Cuando el usuario empieza a firmar
      setHasSignature(true);
    };

    // Función para obtener la firma actual sin guardarla
    const getCurrentSignature = () => {
      if (sigRef.current && !sigRef.current.isEmpty()) {
        return sigRef.current.toDataURL();
      }
      return "";
    };

    // Exponer funciones para que el formulario pueda acceder
    useImperativeHandle(ref, () => ({
      getCurrentSignature,
      isEmpty: () => sigRef.current?.isEmpty() ?? true,
      clear: handleClear,
    }));

    return (
      <div className="space-y-4">
        {/* Canvas de firma con bordes rojos forzados */}
        <div
          className="rounded-lg p-3 bg-gray-50 shadow-sm"
          style={{
            border: "2px solid #dc2626",
            padding: "0.75rem",
          }}
        >
          <SignatureCanvas
            ref={sigRef}
            canvasProps={{
              className: "w-full h-32 rounded cursor-crosshair",
              style: {
                backgroundColor: "#f9fafb",
              },
            }}
            backgroundColor="#f9fafb"
            penColor="#1f2937"
            onBegin={handleBegin}
          />
        </div>

        {/* Botones rediseñados con estilo del sitio */}
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center justify-center font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            style={{
              color: "#ffffff",
              backgroundColor: "#dc2626",
              padding: "1rem 2rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#b91c1c";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#dc2626";
            }}
          >
            Guardar Firma
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center justify-center font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            style={{
              color: "#374151",
              backgroundColor: "#ffffff",
              border: "2px solid #9ca3af",
              padding: "1rem 2rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
            }}
          >
            Borrar Firma
          </button>
        </div>

        {/* Mensajes con mejor contraste */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        )}

        {hasSignature && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm font-medium">
              ✅ Firma guardada correctamente
            </p>
          </div>
        )}
      </div>
    );
  }
);

SignaturePad.displayName = "SignaturePad";
