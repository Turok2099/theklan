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
            <div className="relative w-full max-w-[90vw] md:max-w-[360px] aspect-[9/16]">
                <button
                    onClick={handleClose}
                    className="absolute -top-12 -right-2 z-50 text-white hover:text-primary transition-colors hover:scale-110 flex items-center gap-2 group"
                    aria-label="Cerrar video"
                >
                    <span className="text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Cerrar</span>
                    <div className="bg-white/10 p-2 rounded-full border border-white/20 group-hover:border-primary group-hover:bg-primary/20">
                        <XMarkIcon className="w-6 h-6" />
                    </div>
                </button>

                <div className="w-full h-full bg-black rounded-2xl shadow-2xl overflow-hidden border border-white/10 relative">
                    {/* Marco de celular opcional o borde brillante */}
                    <div className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none z-10"></div>

                    <video
                        ref={videoRef}
                        src={videoUrl}
                        className="w-full h-full object-cover"
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
        </div>
    );
};
