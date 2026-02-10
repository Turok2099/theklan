import { Rules } from "@/views/rules";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Reglamento 2026 - The Klan BJJ",
    description:
        "Normas y reglamento oficial de The Klan Martial Arts para el año 2026. Disciplina, respeto y valores.",
};

export default function ReglamentoPage() {
    return <Rules />;
}
