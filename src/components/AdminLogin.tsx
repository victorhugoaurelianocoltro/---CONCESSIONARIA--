"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CarFront, Eye, EyeOff, KeyRound } from "lucide-react";

export default function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível entrar.");
      router.replace("/admin");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível entrar.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#12130f] px-5 py-12 text-[#f8f8f4]">
      <div className="grid w-full max-w-[930px] overflow-hidden border border-white/10 bg-[#1a1b16] md:grid-cols-[0.95fr_1.05fr]">
        <aside className="relative hidden min-h-[540px] flex-col justify-between overflow-hidden bg-[#22241d] p-10 md:flex">
          <div className="absolute inset-0 opacity-35" style={{ backgroundImage: "radial-gradient(ellipse at 65% 20%, rgba(201,241,105,.3), transparent 56%), linear-gradient(145deg, #282a23, #11120f 75%)" }} />
          <Link href="/" className="relative flex items-center gap-2 text-sm font-black tracking-[0.12em]"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#c9f169] text-[#171914]"><CarFront size={19} /></span>MOTORA.</Link>
          <div className="relative"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c9f169]">Área restrita</p><h1 className="mt-4 text-4xl font-semibold leading-tight">Gestão do seu estoque, em um só lugar.</h1><p className="mt-5 max-w-[330px] text-sm leading-6 text-white/55">Acesse com as credenciais privadas configuradas no servidor.</p></div>
          <p className="relative text-[10px] uppercase tracking-[0.16em] text-white/35">Painel administrativo · acesso controlado</p>
        </aside>
        <section className="flex min-h-[540px] flex-col justify-center px-7 py-12 sm:px-12">
          <Link href="/" className="mb-12 inline-flex w-fit items-center gap-2 text-xs font-semibold text-white/50 transition hover:text-white"><ArrowLeft size={15} /> Voltar ao site</Link>
          <div className="mb-8 grid h-12 w-12 place-items-center rounded-full bg-[#c9f169]/12 text-[#c9f169]"><KeyRound size={21} /></div>
          <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#c9f169]">Acesso do administrador</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Entrar no painel</h2>
          <p className="mt-2 text-sm text-white/45">Use suas credenciais de administrador.</p>
          {!configured && <p className="mt-6 border border-[#e8a36d]/30 bg-[#e8a36d]/10 px-4 py-3 text-sm leading-5 text-[#f1bd94]">O acesso ainda não foi configurado. Preencha as três variáveis administrativas no arquivo de ambiente e reinicie o servidor.</p>}
          <form onSubmit={submit} className="mt-7 space-y-5">
            <label className="block"><span className="mb-2 block text-xs font-semibold text-white/65">Usuário</span><input autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} className="h-12 w-full border border-white/15 bg-[#13140f] px-4 text-sm outline-none transition focus:border-[#c9f169]" /></label>
            <label className="block"><span className="mb-2 block text-xs font-semibold text-white/65">Senha</span><span className="flex h-12 border border-white/15 bg-[#13140f] focus-within:border-[#c9f169]"><input autoComplete="current-password" required type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} className="px-4 text-white/45 hover:text-white">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
            {error && <p role="alert" className="text-sm text-[#ff9a83]">{error}</p>}
            <button disabled={pending || !configured} className="h-12 w-full bg-[#c9f169] px-4 text-sm font-bold text-[#171914] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45">{pending ? "Verificando…" : "Entrar com segurança"}</button>
          </form>
        </section>
      </div>
    </main>
  );
}