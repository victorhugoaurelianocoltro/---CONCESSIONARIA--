import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const policies = {
  privacy: {
    title: "Privacidade",
    description: "Como os dados enviados nas conversas e solicitações deste site são tratados.",
    sections: [
      ["Dados informados por você", "Este site permite preparar mensagens de interesse, agendamento de test drive e avaliação de troca. Os campos são usados no seu navegador para montar uma mensagem. A página não envia esses dados a uma API de cadastro da concessionária."],
      ["WhatsApp", "Nenhuma conversa é aberta automaticamente. Ao clicar em um botão de contato, você escolhe abrir o WhatsApp e compartilhar a mensagem preparada com o número configurado pela concessionária. O tratamento feito pelo WhatsApp segue os termos e a política do próprio serviço."],
      ["Estoque e arquivos", "Os dados e fotos dos veículos são administrados pela concessionária neste site. A base de veículos e os arquivos enviados são mantidos no servidor que hospeda a aplicação."],
      ["Chatbot", "O site mantém um chatbot já existente, separado das funções de estoque e atendimento implementadas aqui. Antes da publicação, a concessionária deve informar ao cliente quais dados o chatbot processa, quem fornece esse serviço e por quanto tempo as informações são mantidas."],
      ["Seus direitos", "A concessionária responsável deve ser identificada antes da publicação deste site e atender solicitações sobre acesso, correção ou exclusão de dados pessoais nos termos da legislação aplicável, inclusive a LGPD. Para exercer esses direitos, contate a concessionária pelo canal oficial informado no atendimento."],
      ["Identificação do controlador", "O nome empresarial, CNPJ, endereço e canal de privacidade da concessionária ainda precisam ser preenchidos pelo responsável antes da publicação. Este texto não substitui a revisão jurídica específica do negócio."],
    ] as const,
  },
  terms: {
    title: "Termos de uso",
    description: "Informações importantes sobre o estoque, estimativas e contato com a concessionária.",
    sections: [
      ["Estoque e anúncios", "Os anúncios e informações de veículos são cadastrados pela concessionária. Preço, fotos, especificações e disponibilidade devem ser confirmados com um vendedor antes de qualquer decisão ou contratação."],
      ["Status dos veículos", "Veículos disponíveis podem receber propostas; veículos reservados dependem de confirmação de disponibilidade; veículos marcados como vendidos não são oferecidos para compra. O status exibido pode mudar quando a concessionária atualiza o estoque."],
      ["Simulador de financiamento", "Uma simulação é uma estimativa matemática feita com os valores, taxa e prazos informados para cada veículo. Não é proposta de crédito, não consulta instituições financeiras e não representa aprovação ou promessa de parcela. A concessão de crédito, taxas finais e condições dependem da instituição financeira e de análise própria."],
      ["Test drive e avaliação de troca", "As solicitações iniciadas pelo formulário são encaminhadas ao WhatsApp para contato. O envio não confirma automaticamente um agendamento, avaliação, preço de troca ou disponibilidade; a equipe precisa confirmar as condições."],
      ["Contato e contratação", "Ao abrir o WhatsApp, você decide se envia a mensagem ao vendedor. Negociações e eventual compra dependem de confirmação direta com a concessionária e dos documentos contratuais aplicáveis."],
      ["Identificação da concessionária", "O responsável pelo site deve completar nome empresarial, CNPJ, endereço, jurisdição e canais de contato antes da publicação. Procure orientação jurídica para adequar estes termos ao negócio e à legislação aplicável."],
    ] as const,
  },
};

export default function DealershipInfoPage({ kind }: { kind: keyof typeof policies }) {
  const policy = policies[kind];
  return (
    <main className="min-h-screen bg-[#12130f] text-[#f6f6f1]">
      <header className="border-b border-white/10"><div className="mx-auto flex h-[68px] max-w-[960px] items-center justify-between px-5"><Link href="/" className="text-sm font-black tracking-[0.12em]">MOTORA<span className="text-[#c9f169]">.</span></Link><Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white"><ArrowLeft size={15} />Início</Link></div></header>
      <article className="mx-auto max-w-[960px] px-5 py-14 md:py-20">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c9f169]">Informação para clientes</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">{policy.title}</h1>
        <p className="mt-4 max-w-[660px] text-sm leading-6 text-white/55">{policy.description}</p>
        <p className="mt-3 text-[10px] text-white/35">Atualizado em outubro de 2026</p>
        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">{policy.sections.map(([title, body], index) => <section key={title} className="py-6"><h2 className="text-lg font-semibold"><span className="mr-3 text-xs text-[#c9f169]">{String(index + 1).padStart(2, "0")}</span>{title}</h2><p className="mt-3 max-w-[760px] text-sm leading-7 text-white/60">{body}</p></section>)}</div>
        <Link href="/veiculos" className="mt-8 inline-flex items-center gap-2 text-xs font-semibold text-[#d5f78b] hover:text-white">Voltar ao estoque<ArrowUpRight size={14} /></Link>
      </article>
    </main>
  );
}