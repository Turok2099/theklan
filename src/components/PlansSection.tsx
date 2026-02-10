"use client";

import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export const PlansSection = () => {
    return (
        <section className="py-24 bg-black" id="planes">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-4 italic">
                        Planes de <span className="text-primary">Entrenamiento</span>
                    </h2>
                    <p className="text-gray-400 uppercase font-bold tracking-widest text-sm mb-4">
                        Escoge tu nivel de compromiso
                    </p>
                    <div className="inline-block bg-zinc-900 border border-primary/30 rounded-lg px-6 py-3">
                        <p className="text-white font-bold uppercase tracking-wider text-sm">
                            Inscripción Nuevo Ingreso: <span className="text-primary text-xl ml-2">$650</span>
                        </p>
                    </div>
                </div>

                {/* Planes Mensuales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {/* Plan Básico */}
                    <div className="bg-zinc-900 border border-white/10 p-8 flex flex-col hover:border-primary transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.1)] group relative overflow-hidden">
                        <div className="mb-6 relative z-10">
                            <h3 className="text-2xl font-black text-white uppercase mb-2">
                                Plan Básico
                            </h3>
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest h-10">
                                1 actividad
                            </p>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
                                2 días por semana
                            </p>
                        </div>
                        <div className="mb-8 relative z-10">
                            <span className="text-5xl font-black text-white">$1,500</span>
                            <span className="text-gray-500 font-bold text-sm ml-1">/MES</span>
                        </div>
                        <div className="mt-auto relative z-10">
                            <Link href="https://api.whatsapp.com/send?phone=5215613701366&text=Hola%20The%20Klan%2C%20me%20interesa%20el%20Plan%20B%C3%A1sico" target="_blank" className="block w-full py-4 border-2 border-white text-white text-center font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                                Seleccionar
                            </Link>
                        </div>
                    </div>

                    {/* Plan Full Jiu Jitsu */}
                    <div className="bg-black border-2 border-primary p-8 flex flex-col relative transform md:-translate-y-4 z-10 shadow-2xl shadow-primary/20 transition-all duration-300 hover:-translate-y-6 hover:shadow-[0_0_40px_rgba(242,13,13,0.6)]">
                        <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest">
                            Popular
                        </div>
                        <div className="mb-6">
                            <h3 className="text-2xl font-black text-white uppercase mb-2">
                                Plan Full Jiu Jitsu
                            </h3>
                            <p className="text-primary text-sm font-black uppercase tracking-widest h-10">
                                4 clases a la semana
                            </p>
                        </div>
                        <div className="mb-8">
                            <span className="text-6xl font-black text-white">$1,700</span>
                            <span className="text-gray-500 font-bold text-sm ml-1">/MES</span>
                        </div>
                        <div className="mt-auto">
                            <Link href="https://api.whatsapp.com/send?phone=5215613701366&text=Hola%20The%20Klan%2C%20me%20interesa%20el%20Plan%20Full%20Jiu%20Jitsu" target="_blank" className="block w-full py-4 bg-primary text-white text-center font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(242,13,13,0.4)]">
                                Empezar Ahora
                            </Link>
                        </div>
                    </div>

                    {/* Plan Ilimitado */}
                    <div className="bg-zinc-900 border border-white/10 p-8 flex flex-col hover:border-primary transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.1)] group relative overflow-hidden">
                        <div className="mb-6 relative z-10">
                            <h3 className="text-2xl font-black text-white uppercase mb-2">
                                Plan Ilimitado
                            </h3>
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest h-10">
                                Todos los días
                            </p>
                        </div>
                        <div className="mb-8 relative z-10">
                            <span className="text-5xl font-black text-white">$2,000</span>
                            <span className="text-gray-500 font-bold text-sm ml-1">/MES</span>
                        </div>
                        <div className="mb-8 relative z-10">
                            <p className="text-xs text-gray-400 italic">
                                *Incluye: Box, MMA, Funcional, Jiu Jitsu, Striking, defensa personal y lucha.
                            </p>
                        </div>
                        <div className="mt-auto relative z-10">
                            <Link href="https://api.whatsapp.com/send?phone=5215613701366&text=Hola%20The%20Klan%2C%20me%20interesa%20el%20Plan%20Ilimitado" target="_blank" className="block w-full py-4 border-2 border-white text-white text-center font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                                Seleccionar
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Otros Planes Grid */}
                <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-10 text-center italic">
                        Paquetes <span className="text-primary">Especiales</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { name: "Infantil (5pm)", price: "$1,200", period: "/mes" },
                            { name: "Trimestre Limitado", price: "$4,490", period: "/trimestre" },
                            { name: "Semestre Limitado", price: "$8,930", period: "/semestre" },
                            { name: "Anualidad Ilimitado", price: "$17,810", period: "/año" },
                            { name: "20 Clases Privadas", price: "$8,050", period: "/paquete" },
                            { name: "50 Clases Privadas", price: "$17,550", period: "/paquete" },
                        ].map((plan, idx) => (
                            <div key={idx} className="bg-zinc-900 border border-white/10 p-6 flex justify-between items-center group hover:!bg-[#f20d0d] hover:border-primary transition-all duration-300 shadow-lg hover:shadow-primary/30 rounded-lg hover:-translate-y-1 cursor-pointer">
                                <div>
                                    <h4 className="text-white font-bold uppercase text-lg transition-colors">{plan.name}</h4>
                                </div>
                                <div className="text-right">
                                    <span className="block text-2xl font-black text-white">{plan.price}</span>
                                    {plan.period && <span className="text-xs text-gray-500 group-hover:text-zinc-100 uppercase font-bold transition-colors">{plan.period}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
