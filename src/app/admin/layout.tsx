import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard de Administrador - The Klan BJJ",
  description: "Panel de administración para gestionar usuarios y responsivas.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
