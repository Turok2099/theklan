import { useState, useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface VideoBannerProps {
    onClose: () => void;
}

export const VideoBanner = ({ onClose }: VideoBannerProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoUrl =
        "https://res.cloudinary.com/dxbtafe9u/video/upload/v1771031240/WhatsApp_Video_2026-02-13_at_7.05.08_PM_onnoqy.mp4";

    const handleClose = () => {
        setIsVisible(false);
        // Wait for animation to finish before calling onClose
        setTimeout(onClose, 500);
    };

    useEffect(() => {
        // Intentar reproducir automáticamente
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log("Autoplay prevented:", error);
                // Si el autoplay falla (browsers policies), al menos mostramos el video pausado con controles o muteado
            });
        }
    }, []);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            <div className="relative w-full max-w-4xl mx-4 aspect-video bg-black rounded-lg shadow-2xl overflow-hidden border border-white/10">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-primary transition-colors hover:scale-110"
                    aria-label="Cerrar video"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    muted
                    playsInline
                    onEnded={handleClose}
                >
                    Tu navegador no soporta la etiqueta de video.
                </video>
            </div>
        </div>
    );
};
