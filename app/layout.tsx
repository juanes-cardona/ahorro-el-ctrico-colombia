import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Calculadora Beneficios Vehículos Eléctricos Colombia",
  description: "Calcula cuánto podrías ahorrar en impuestos con un vehículo eléctrico en Colombia. Descubre beneficios tributarios de la Ley 1715 y 2099.",
  authors: [{ name: "Movilidad Eléctrica Colombia" }],
  openGraph: {
    title: "Calculadora de Beneficios Tributarios - Vehículos Eléctricos Colombia",
    description: "Estima tu ahorro tributario al invertir en un vehículo eléctrico. IVA reducido, deducciones fiscales y más beneficios.",
    type: "website",
    images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Lovable",
    images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
