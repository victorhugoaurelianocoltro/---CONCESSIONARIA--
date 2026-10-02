import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google"; // Vercel rebuild v4 - force deploy
import "./globals.css";
import ClientExperience from "@/components/ClientExperience";

const sora = Sora({ 
  subsets: ["latin"], 
  variable: '--font-sora',
  display: 'swap',
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  title: "MOTORA | Carros, motos e financiamento",
  description: "Encontre carros e motos, simule entrada e parcelas e converse diretamente com um vendedor pelo WhatsApp.",
  keywords: [
    "concessionária de carros", "concessionária de motos", "carros seminovos", "motos seminovas",
    "financiamento de veículos", "simulador de financiamento", "carros usados", "motos usadas"
  ],
  openGraph: {
    title: "MOTORA | Carros, motos e financiamento",
    description: "Encontre seu próximo veículo e simule o financiamento com atendimento direto pelo WhatsApp.",
    siteName: "MOTORA",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MOTORA | Carros, motos e financiamento",
    description: "Estoque de carros e motos, simulação de financiamento e contato direto com vendedores.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable} ${plusJakartaSans.variable} font-general antialiased bg-transparent text-white selection:bg-accent-electric selection:text-white`}>
        <div className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-accent-electric/30 via-accent-electric to-accent-electric/30 origin-left scale-x-0 z-[99999] transition-transform duration-75 scroll-progress-bar" />
        <ClientExperience />
        {children}
      </body>
    </html>
  );
}
