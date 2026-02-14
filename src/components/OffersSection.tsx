"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface OffersSectionProps {
    startTimer: boolean;
}

export const OffersSection = ({ startTimer }: OffersSectionProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!startTimer) return;

        const mountTimer = setTimeout(() => {
            setIsMounted(true);
            // Pequeño delay para permitir que el navegador renderice antes de iniciar la transición
            setTimeout(() => setIsVisible(true), 100);
        }, 6000);

        return () => clearTimeout(mountTimer);
    }, [startTimer]);

    if (!isMounted) return null;

    return (
        <div className={`fixed z-40 transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'} top-1/2 -translate-y-1/2 right-0 lg:right-4`}>
            {/* Desktop Version */}
            <div className="hidden lg:block relative w-64 group">
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(() => setIsMounted(false), 500);
                    }}
                    className="absolute -top-2 -right-2 z-50 bg-black border border-white/20 text-white rounded-full p-1 hover:bg-primary transition-colors"
                >
                    <XMarkIcon className="w-4 h-4" />
                </button>

                <div className="relative bg-black/95 backdrop-blur-sm border border-primary/40 rounded-xl p-6 flex flex-col items-center overflow-hidden gritty-border shadow-2xl">
                    <div className="absolute inset-0 reflective-gradient pointer-events-none"></div>
                    <div className="absolute -top-12 -left-12 w-24 h-24 bg-primary/20 rounded-full blur-[40px] pointer-events-none"></div>

                    <div className="z-10 mb-4">
                        <span className="bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-lg shadow-primary/20">
                            Oferta Flash
                        </span>
                    </div>

                    <div className="z-10 text-center mb-4 w-full">
                        <div className="border-b border-white/10 pb-4 mb-4">
                            <h2 className="text-5xl font-black italic tracking-tighter leading-none uppercase text-primary text-shadow-red">
                                2x1
                            </h2>
                            <span className="block text-white font-bold tracking-[0.1em] uppercase text-xs mt-1">
                                En Inscripción
                            </span>
                        </div>

                        <div className="flex flex-col items-center">
                            <span className="text-primary font-black text-xl leading-none">+</span>
                            <h3 className="text-xl font-black italic tracking-tighter text-white leading-none uppercase">
                                3 Pases <br />Gratis
                            </h3>
                        </div>
                    </div>

                    <Link href="https://api.whatsapp.com/send?phone=5215613701366&text=Hola%20The%20Klan%2C%20quiero%20aprovechar%20la%20oferta%202x1" target="_blank" className="z-10 w-full bg-primary hover:bg-red-700 text-white font-black text-sm py-3 rounded-lg shadow-[0_5px_15px_rgba(242,13,13,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2 group/btn">
                        ¡LO QUIERO!
                    </Link>

                    <div className="z-10 mt-3 text-center">
                        <p className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">Solo por hoy</p>
                    </div>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 bg-primary/5 blur-xl -z-10 rounded-xl transition-opacity duration-500 group-hover:bg-primary/10"></div>
            </div>

            {/* Mobile Version */}
            <div className="lg:hidden relative">
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(() => setIsMounted(false), 500);
                    }}
                    className="absolute -top-3 -left-3 z-50 bg-black border border-white/20 text-white rounded-full p-1 shadow-lg"
                >
                    <XMarkIcon className="w-3 h-3" />
                </button>

                <Link href="https://api.whatsapp.com/send?phone=5215613701366&text=Hola%20The%20Klan%2C%20quiero%20aprovechar%20la%20oferta%202x1" target="_blank" className="block bg-primary border-y border-l border-white/20 rounded-l-xl p-3 shadow-2xl relative overflow-hidden group">
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>

                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black italic tracking-tighter text-white leading-none">2x1</span>
                            <span className="text-xs font-black text-black uppercase tracking-tighter">+ 3 Pases</span>
                        </div>
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-black/20 px-2 rounded-full mt-1">
                            ¡Gratis!
                        </span>
                    </div>
                </Link>
            </div>
        </div>
    );
};
