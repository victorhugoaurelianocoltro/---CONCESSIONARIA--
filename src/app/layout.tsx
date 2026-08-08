import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google"; // Vercel rebuild v4 - force deploy
import "./globals.css";
import dynamic from "next/dynamic";
import Script from "next/script";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const AIChatbot = dynamic(() => import("@/components/AIChatbot"), { ssr: false });
const Preloader = dynamic(() => import("@/components/Preloader"), { ssr: false });
const InteractiveBackground = dynamic(() => import("@/components/InteractiveBackground"), { ssr: false });
const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), { ssr: false });

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
  metadataBase: new URL("https://www.parvinfosoft.com"),
  title: "ParvInfoSoft | High-Performance B2B AI Automation & Voice AI Agency",
  description: "ParvInfoSoft is a premier B2B AI Agency based in Surat, Gujarat & serving global clients. We engineer autonomous AI voice receptionists, sub-800ms lead qualification agents, custom CRM integrations, and enterprise automation infrastructure for real estate, healthcare, and high-volume businesses.",
  keywords: [
    "AI automation agency","AI voice agents development","Retell AI voice receptionist",
    "Real estate AI automation","Sub-800ms voice AI latency","AI lead qualification system",
    "Headless n8n workflow automation","Custom CRM development","AI chatbot for business",
    "Custom AI solutions Surat","AI development company Surat","Website development company Surat",
    "App development agency Surat","B2B AI agency India","Enterprise AI solutions India",
    "WhatsApp API automation","Custom LLM integration","Automated sales pipelines"
  ],
  alternates: {
    canonical: "https://www.parvinfosoft.com",
  },
  icons: {
    icon: '/parv-logo-icon.png',
  },
  openGraph: {
    title: "ParvInfoSoft | High-Performance B2B AI Automation & Voice AI Agency",
    description: "ParvInfoSoft is a premier B2B AI Agency based in Surat, Gujarat & serving global clients. We engineer autonomous AI voice receptionists, sub-800ms lead qualification agents, custom CRM integrations, and enterprise automation infrastructure for real estate, healthcare, and high-volume businesses.",
    url: "https://www.parvinfosoft.com",
    siteName: "ParvInfoSoft",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "ParvInfoSoft - B2B AI Systems & Automation Agency",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ParvInfoSoft | High-Performance B2B AI Agency",
    description: "Engineering autonomous AI voice agents, sub-800ms lead qualification, and enterprise automation infrastructure.",
    images: ["/logo.png"],
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
  // JSON-LD Schema for LocalBusiness & ProfessionalService
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "ProfessionalService"],
        "@id": "https://www.parvinfosoft.com/#organization",
        "name": "ParvInfoSoft",
        "url": "https://www.parvinfosoft.com/",
        "image": "https://www.parvinfosoft.com/logo.png",
        "priceRange": "$$",
        "description": "High-Performance B2B AI Agency and Systems Engineering firm serving Surat, Gujarat, India and enterprise clients worldwide.",
        "telephone": "+91-9081553331",
        "email": "parvinfosoftadmin@gmail.com",
        "founder": {
          "@type": "Person",
          "name": "Kaushal Tiwari",
          "jobTitle": "Founder and CEO",
          "url": "https://www.parvinfosoft.com/"
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "4019 The Palladium Mall, Near Vijaynagar, Chikuwadi, Nana Varachha",
          "addressLocality": "Surat",
          "addressRegion": "Gujarat",
          "postalCode": "395010",
          "addressCountry": "IN"
        },
        "areaServed": {
          "@type": "Country",
          "name": "India"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "ParvInfoSoft B2B AI & IT Services",
          "itemListElement": [
            {
              "@type": "OfferCatalog",
              "name": "AI & Business Automation Systems",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Autonomous AI Voice Receptionists & Sales Agents"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Real Estate Lead Qualification Systems"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Custom CRM & ERP Automation"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Custom Web & Mobile App Development"
                  }
                }
              ]
            }
          ]
        },
        "sameAs": [
          "https://www.instagram.com/parvinfosoftai?igsh=MWVkdzFqb25hMXh2ZQ==",
          "https://www.linkedin.com/company/parvinfosoft/"
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Where is ParvInfoSoft located?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We are located at 4019 The Palladium Mall, near Vijaynagar, Chikuwadi, Nana Varachha, Surat, Gujarat 395010, India. We serve clients globally."
            }
          },
          {
            "@type": "Question",
            "name": "What services does ParvInfoSoft provide?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We are a high-performance B2B AI Agency specializing in autonomous AI voice receptionists, sub-800ms lead qualification engines, custom CRM/ERP integration, and enterprise web/mobile development."
            }
          },
          {
            "@type": "Question",
            "name": "Who is the founder of ParvInfoSoft?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "ParvInfoSoft was founded by Kaushal Tiwari, an AI systems architect and entrepreneur dedicated to building enterprise AI automation systems in Surat and globally."
            }
          }
        ]
      }
    ]
  };

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable} ${plusJakartaSans.variable} font-general antialiased bg-transparent text-white selection:bg-accent-electric selection:text-white`}>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KC8RZHDCFV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KC8RZHDCFV');
          `}
        </Script>
        <div className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-accent-electric/30 via-accent-electric to-accent-electric/30 origin-left scale-x-0 z-[99999] transition-transform duration-75 scroll-progress-bar" />
        <InteractiveBackground />
        <Preloader />
        <CustomCursor />
        <SmoothScroll />
        <div className="fixed inset-0 z-[9999] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] mix-blend-overlay pointer-events-none" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        {children}
        <AIChatbot />
      </body>
    </html>
  );
}
