"use client";

type Mode = "subscription" | "one-time";

type PlanKey = "ilimitado" | "full" | "basic";

interface Plan {
  key: PlanKey;
  title: string;
  subtitle: string;
  priceLabel: string;
  amountMXN: number;
  features: string[];
  priceId: string;
  productId: string;
  highlight?: boolean;
}

export const PLANS: Plan[] = [
  {
    key: "ilimitado",
    title: "PLAN ILIMITADO",
    subtitle: "TODOS LOS DÍAS, TODAS LAS CLASES",
    priceLabel: "$1,990",
    amountMXN: 1990,
    features: ["Acceso a todas las clases", "Hasta 7 días por semana"],
    productId: "prod_TKNufgn6Dh9JsS",
    priceId: "price_1SNj8VJKc9YqYcySZQ9zYLNw",
    highlight: true,
  },
  {
    key: "full",
    title: "PLAN FULL JIU JITSU",
    subtitle: "4 CLASES A LA SEMANA",
    priceLabel: "$1,650",
    amountMXN: 1650,
    features: ["4 clases a la semana", "Jiu Jitsu"],
    productId: "prod_TKJyvDuocdsgb6",
    priceId: "price_1SNfKqJKc9YqYcyShtdon2Y7",
  },
  {
    key: "basic",
    title: "PLAN BASIC MARTIAL ART",
    subtitle: "1 ACTIVIDAD, 2 DÍAS POR SEMANA",
    priceLabel: "$1,450",
    amountMXN: 1450,
    features: ["1 actividad", "2 días por semana"],
    productId: "prod_TKNuvz8nuZXPS1",
    priceId: "price_1SNj8vJKc9YqYcySP9wryJp8",
  },
];

export interface PlanSelection {
  mode: Mode;
  plan: Plan;
}

export default function PlanCards({
  onSelect,
}: {
  onSelect: (selection: PlanSelection) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {PLANS.map((p) => (
        <div
          key={p.key}
          className={`rounded-xl border ${
            p.highlight ? "border-red-500 shadow-xl" : "border-gray-200 shadow"
          } bg-white p-6 flex flex-col`}
        >
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900">{p.title}</h3>
            <p className="text-sm text-gray-500">{p.subtitle}</p>
          </div>

          <div className="mb-4">
            <div className="text-3xl font-extrabold text-gray-900">
              {p.priceLabel}
              <span className="text-sm font-medium text-gray-500"> MXN/mes</span>
            </div>
          </div>

          <ul className="space-y-2 text-sm text-gray-700 mb-6">
            {p.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-red-600" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-auto grid grid-cols-1 gap-2">
            <button
              onClick={() => onSelect({ mode: "subscription", plan: p })}
              className="w-full px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              Elegir suscripción
            </button>
            <button
              onClick={() => onSelect({ mode: "one-time", plan: p })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 font-semibold hover:bg-gray-50 transition"
              title="Pagar este mes como pago único"
            >
              Pago único ({p.priceLabel})
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}








