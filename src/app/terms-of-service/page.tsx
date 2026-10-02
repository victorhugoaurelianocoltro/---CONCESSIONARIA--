import DealershipInfoPage from "@/components/DealershipInfoPage";

export const metadata = {
  title: "Termos de uso | Motora",
  description: "Condições sobre anúncios, disponibilidade e simulações exibidos neste site.",
};

export default function TermsOfServicePage() {
  return <DealershipInfoPage kind="terms" />;
}
