"use client";

import { MapPinIcon, PhoneIcon } from "@heroicons/react/24/solid";

export const ContactSection = () => {
    return (
        <section className="py-24 bg-black border-t border-white/5" id="contacto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-6 italic">
                            Inicia tu <span className="text-primary">Legado</span>
                        </h2>
                        <p className="text-xl text-gray-400 mb-10 leading-relaxed font-medium">
                            La excelencia a un paso de ti.
                        </p>
                        <div className="space-y-8">
                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 bg-zinc-900 flex items-center justify-center border border-white/10 group-hover:border-primary transition-colors">
                                    <MapPinIcon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-white font-black uppercase text-xs tracking-widest">
                                        Ubicación Central
                                    </p>
                                    <p className="text-gray-400 font-bold">Colonia Del Valle, Ciudad de México</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 bg-zinc-900 flex items-center justify-center border border-white/10 group-hover:border-primary transition-colors">
                                    <PhoneIcon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-white font-black uppercase text-xs tracking-widest">
                                        Línea Directa
                                    </p>
                                    <p className="text-gray-400 font-bold">+52 56 1370 1366</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/10 p-10">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                                        Tu Nombre
                                    </label>
                                    <input
                                        className="w-full bg-black border border-white/10 focus:ring-primary focus:border-primary text-white p-4 font-bold outline-none transition-colors"
                                        type="text"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                                        WhatsApp
                                    </label>
                                    <input
                                        className="w-full bg-black border border-white/10 focus:ring-primary focus:border-primary text-white p-4 font-bold outline-none transition-colors"
                                        type="tel"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                                    Programa
                                </label>
                                <select className="w-full bg-black border border-white/10 focus:ring-primary focus:border-primary text-white p-4 font-bold outline-none transition-colors appearance-none">
                                    <option>Jiu Jitsu Brasileño</option>
                                    <option>Artes Marciales Mixtas</option>
                                    <option>Entrenamiento Funcional</option>
                                    <option>Defensa Personal</option>
                                    <option>Kick Boxing</option>
                                    <option>Grappling</option>
                                    <option>Lucha Olímpica</option>
                                </select>
                            </div>
                            <button
                                className="w-full bg-primary hover:bg-red-700 text-white font-black uppercase tracking-[0.2em] py-5 transition-all shadow-xl shadow-primary/20"
                                type="submit"
                            >
                                Agendar Clase de Prueba
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};
