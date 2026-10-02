"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Bike, CarFront, Check, ImagePlus, LogOut, Pencil, Plus, Search, Star, Trash2, X } from "lucide-react";
import type { Vehicle, VehicleStatus } from "@/lib/dealership-db";

type VehicleDraft = Omit<Vehicle, "id" | "slug" | "createdAt" | "updatedAt">;

const emptyVehicle: VehicleDraft = {
  type: "carro", condition: "seminovo", make: "", model: "", version: "", year: null, mileage: null,
  color: "", price: 0, promotionalPrice: null, status: "disponivel", showSoldPublic: false, featured: false,
  engine: "", power: "", transmission: "", fuel: "", displacement: "", doors: "", traction: "",
  specifications: {}, equipment: [], description: "", images: [], financingEnabled: false,
  suggestedDownPayment: null, monthlyRate: 0, minimumTerm: 12, maximumTerm: 60,
};

const statusLabels: Record<VehicleStatus, string> = { disponivel: "Disponível", reservado: "Reservado", vendido: "Vendido" };
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function asDraft(vehicle: Vehicle): VehicleDraft {
  return Object.fromEntries(Object.entries(vehicle).filter(([key]) => !["id", "slug", "createdAt", "updatedAt"].includes(key))) as VehicleDraft;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState("");

  async function loadVehicles() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("search", query.trim());
      if (typeFilter) params.set("type", typeFilter);
      if (statusFilter) params.set("status", statusFilter);
      const response = await fetch(`/api/admin/vehicles?${params.toString()}`, { cache: "no-store" });
      const data = await response.json();
      if (response.status === 401) { router.replace("/admin/login"); return; }
      if (!response.ok) throw new Error(data.error || "Não foi possível carregar o estoque.");
      setVehicles(data.vehicles);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível carregar o estoque.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (typeFilter) params.set("type", typeFilter);
    if (statusFilter) params.set("status", statusFilter);

    fetch(`/api/admin/vehicles?${params.toString()}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 401) { router.replace("/admin/login"); return null; }
        if (!response.ok) throw new Error(data.error || "Não foi possível carregar o estoque.");
        return data.vehicles as Vehicle[];
      })
      .then((data) => { if (data) setVehicles(data); })
      .catch((reason: unknown) => {
        if (reason instanceof Error && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Não foi possível carregar o estoque.");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });

    return () => controller.abort();
  }, [query, router, statusFilter, typeFilter]);

  async function updateStatus(vehicle: Vehicle, status: VehicleStatus) {
    setBusyId(vehicle.id);
    setNotice("");
    try {
      const response = await fetch(`/api/admin/vehicles/${vehicle.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...asDraft(vehicle), status }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível atualizar o status.");
      setNotice(`${vehicle.make} ${vehicle.model}: ${statusLabels[status].toLowerCase()}.`);
      await loadVehicles();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível atualizar o status.");
    } finally {
      setBusyId("");
    }
  }

  async function removeVehicle(vehicle: Vehicle) {
    if (!window.confirm(`Excluir ${vehicle.make} ${vehicle.model}? Esta ação também remove as fotos enviadas deste veículo.`)) return;
    setBusyId(vehicle.id);
    try {
      const response = await fetch(`/api/admin/vehicles/${vehicle.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível excluir o veículo.");
      setNotice("Veículo excluído.");
      await loadVehicles();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível excluir o veículo.");
    } finally {
      setBusyId("");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function saveVehicle(draft: VehicleDraft, id?: string) {
    const response = await fetch(id ? `/api/admin/vehicles/${id}` : "/api/admin/vehicles", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Não foi possível salvar o veículo.");
    setNotice(id ? "Alterações salvas." : "Veículo cadastrado.");
    setEditing(null);
    setCreating(false);
    await loadVehicles();
  }

  const counts = useMemo(() => ({
    all: vehicles.length,
    available: vehicles.filter((vehicle) => vehicle.status === "disponivel").length,
    reserved: vehicles.filter((vehicle) => vehicle.status === "reservado").length,
    sold: vehicles.filter((vehicle) => vehicle.status === "vendido").length,
  }), [vehicles]);

  return (
    <main className="min-h-screen bg-[#f3f2ed] text-[#191a16]">
      <header className="border-b border-[#dedfd7] bg-white">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 md:px-10">
          <Link href="/" className="flex items-center gap-2 text-sm font-black tracking-[0.12em]"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#c9f169]"><CarFront size={18} /></span>MOTORA<span className="text-[#7f9e3c]">.</span><span className="ml-1 hidden border-l border-[#d8d9d0] pl-3 text-xs font-medium tracking-normal text-[#7c8076] sm:inline">Administração</span></Link>
          <div className="flex items-center gap-3"><Link href="/" className="hidden text-xs font-semibold text-[#70736a] hover:text-black sm:inline">Ver site público</Link><button type="button" onClick={logout} className="inline-flex h-10 items-center gap-2 border border-[#dedfd7] px-3 text-xs font-semibold text-[#51544b] transition hover:border-[#191a16] hover:text-[#191a16]"><LogOut size={15} /> Sair</button></div>
        </div>
      </header>
      <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-12">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#81847a]">Controle de veículos</p><h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Estoque</h1></div>
          <button type="button" onClick={() => setCreating(true)} className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#191a16] px-5 text-sm font-semibold text-white transition hover:bg-[#3c4033]"><Plus size={17} /> Cadastrar veículo</button>
        </div>

        <div className="mt-8 grid grid-cols-2 border-y border-[#dedfd7] sm:grid-cols-4">
          {[["Veículos filtrados", counts.all], ["Disponíveis", counts.available], ["Reservados", counts.reserved], ["Vendidos", counts.sold]].map(([label, value], index) => <div key={label} className={`py-5 ${index % 2 ? "border-l border-[#dedfd7] pl-4 sm:pl-6" : ""} ${index > 1 ? "border-t border-[#dedfd7] sm:border-t-0" : ""}`}><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#85887d]">{label}</p><p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p></div>)}
        </div>

        <div className="mt-8 flex flex-col gap-3 md:flex-row">
          <label className="relative min-w-0 flex-1"><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#84877d]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por marca, modelo ou versão" className="h-12 w-full border border-[#dedfd7] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#717e53]" /></label>
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} aria-label="Filtrar por tipo" className="h-12 border border-[#dedfd7] bg-white px-4 text-sm outline-none focus:border-[#717e53]"><option value="">Todos os tipos</option><option value="carro">Carros</option><option value="moto">Motos</option></select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filtrar por status" className="h-12 border border-[#dedfd7] bg-white px-4 text-sm outline-none focus:border-[#717e53]"><option value="">Todos os status</option><option value="disponivel">Disponíveis</option><option value="reservado">Reservados</option><option value="vendido">Vendidos</option></select>
        </div>
        {notice && <p role="status" className="mt-5 flex items-center gap-2 border border-[#b8ca90] bg-[#edf4dc] px-4 py-3 text-sm text-[#394820]"><Check size={16} />{notice}<button onClick={() => setNotice("")} aria-label="Fechar aviso" className="ml-auto"><X size={15} /></button></p>}
        {error && <p role="alert" className="mt-5 border border-[#d6a598] bg-[#fae9e3] px-4 py-3 text-sm text-[#782d1d]">{error}</p>}

        <div className="mt-5 overflow-hidden border border-[#dedfd7] bg-white">
          <div className="hidden grid-cols-[minmax(230px,1.5fr)_0.8fr_0.75fr_0.75fr_150px] gap-4 border-b border-[#dedfd7] bg-[#fafaf7] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#85887d] md:grid"><span>Veículo</span><span>Categoria</span><span>Preço</span><span>Status</span><span className="text-right">Ações</span></div>
          {loading ? <div className="px-5 py-12 text-center text-sm text-[#7c8076]">Carregando estoque…</div> : vehicles.length === 0 ? <div className="px-5 py-16 text-center"><p className="text-lg font-semibold">{query || typeFilter || statusFilter ? "Nenhum veículo encontrado." : "Seu estoque começa aqui."}</p><p className="mt-2 text-sm text-[#777a70]">{query || typeFilter || statusFilter ? "Ajuste a busca ou os filtros." : "Cadastre o primeiro veículo para exibi-lo no site público."}</p>{!query && !typeFilter && !statusFilter && <button onClick={() => setCreating(true)} className="mt-5 border border-[#191a16] px-4 py-2 text-sm font-semibold hover:bg-[#191a16] hover:text-white">Adicionar veículo</button>}</div> : vehicles.map((vehicle) => <article key={vehicle.id} className="grid gap-4 border-b border-[#ecece7] px-4 py-4 last:border-b-0 md:grid-cols-[minmax(230px,1.5fr)_0.8fr_0.75fr_0.75fr_150px] md:items-center md:gap-4 md:px-5">
            <div className="flex min-w-0 items-center gap-3">{vehicle.images[0] ? <Image src={vehicle.images[0]} alt="" width={80} height={56} className="h-14 w-20 shrink-0 object-cover" /> : <span className="grid h-14 w-20 shrink-0 place-items-center bg-[#ecece7] text-[#85887d]">{vehicle.type === "moto" ? <Bike size={22} /> : <CarFront size={22} />}</span>}<div className="min-w-0"><h2 className="truncate text-sm font-semibold">{vehicle.make} {vehicle.model}</h2><p className="mt-1 truncate text-xs text-[#7c8076]">{[vehicle.version, vehicle.year].filter(Boolean).join(" · ") || "Sem versão/ano"}</p>{vehicle.featured && <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-[#77723c]"><Star size={11} /> Destaque</span>}</div></div>
            <div className="flex items-center justify-between text-sm md:block"><span className="text-xs text-[#85887d] md:hidden">Categoria</span><span>{vehicle.type === "carro" ? "Carro" : "Moto"} · {vehicle.condition === "novo" ? "Novo" : "Seminovo"}</span></div>
            <div className="flex items-center justify-between text-sm md:block"><span className="text-xs text-[#85887d] md:hidden">Preço</span><span className="font-semibold">{money.format(vehicle.promotionalPrice ?? vehicle.price)}{vehicle.promotionalPrice && <span className="ml-1 text-[10px] font-medium text-[#79806c]">promo</span>}</span></div>
            <div className="flex items-center justify-between gap-3 text-sm md:block"><span className="text-xs text-[#85887d] md:hidden">Status</span><select aria-label={`Status de ${vehicle.make} ${vehicle.model}`} disabled={busyId === vehicle.id} value={vehicle.status} onChange={(event) => void updateStatus(vehicle, event.target.value as VehicleStatus)} className="h-9 max-w-[150px] border border-[#dedfd7] bg-white px-2 text-xs outline-none"><option value="disponivel">Disponível</option><option value="reservado">Reservado</option><option value="vendido">Vendido</option></select></div>
            <div className="flex justify-end gap-1 border-t border-[#ecece7] pt-3 md:border-0 md:pt-0"><button type="button" onClick={() => setEditing(vehicle)} aria-label={`Editar ${vehicle.make} ${vehicle.model}`} title="Editar" className="grid h-9 w-9 place-items-center border border-[#dedfd7] text-[#575b51] transition hover:border-[#191a16] hover:text-[#191a16]"><Pencil size={15} /></button><button type="button" onClick={() => void removeVehicle(vehicle)} disabled={busyId === vehicle.id} aria-label={`Excluir ${vehicle.make} ${vehicle.model}`} title="Excluir" className="grid h-9 w-9 place-items-center border border-[#dedfd7] text-[#9a4e3e] transition hover:border-[#9a4e3e] disabled:opacity-40"><Trash2 size={15} /></button></div>
          </article>)}
        </div>
      </div>
      {(creating || editing) && <VehicleEditor vehicle={editing} onClose={() => { setCreating(false); setEditing(null); }} onSave={saveVehicle} />}
    </main>
  );
}

function VehicleEditor({ vehicle, onClose, onSave }: { vehicle: Vehicle | null; onClose: () => void; onSave: (vehicle: VehicleDraft, id?: string) => Promise<void> }) {
  const [draft, setDraft] = useState<VehicleDraft>(vehicle ? asDraft(vehicle) : { ...emptyVehicle });
  const [specificationText, setSpecificationText] = useState(Object.entries(vehicle?.specifications ?? {}).map(([key, value]) => `${key}: ${value}`).join("\n"));
  const [equipmentText, setEquipmentText] = useState((vehicle?.equipment ?? []).join("\n"));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const persistedImages = new Set(vehicle?.images ?? []);

  function change<K extends keyof VehicleDraft>(key: K, value: VehicleDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    if (draft.images.length + files.length > 30) { setError("Um veículo pode ter até 30 fotos."); return; }
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível enviar as imagens.");
      change("images", [...draft.images, ...data.images]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível enviar as imagens.");
    } finally {
      setUploading(false);
    }
  }

  function movePhoto(index: number, direction: -1 | 1) {
    const destination = index + direction;
    if (destination < 0 || destination >= draft.images.length) return;
    const images = [...draft.images];
    [images[index], images[destination]] = [images[destination], images[index]];
    change("images", images);
  }

  async function removePhoto(image: string) {
    change("images", draft.images.filter((item) => item !== image));
    if (persistedImages.has(image)) return;
    await fetch(`/api/admin/upload?path=${encodeURIComponent(image)}`, { method: "DELETE" });
  }

  async function cancelEditing() {
    setUploading(true);
    const temporaryImages = draft.images.filter((image) => !persistedImages.has(image));
    await Promise.all(temporaryImages.map((image) => fetch(`/api/admin/upload?path=${encodeURIComponent(image)}`, { method: "DELETE" }).catch(() => undefined)));
    setUploading(false);
    onClose();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const specifications = Object.fromEntries(specificationText.split("\n").map((line) => {
      const separator = line.indexOf(":");
      return separator < 0 ? ["", ""] : [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
    }).filter(([key, value]) => key && value));
    try {
      await onSave({ ...draft, specifications, equipment: equipmentText.split("\n").map((item) => item.trim()).filter(Boolean) }, vehicle?.id);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "mt-2 h-11 w-full border border-[#dedfd7] bg-white px-3 text-sm text-[#191a16] outline-none focus:border-[#748054]";
  const labelClass = "block min-w-0 text-xs font-semibold text-[#60645a]";

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-[#11120f]/65 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving && !uploading) void cancelEditing(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="vehicle-editor-title" className="flex max-h-[95dvh] w-full max-w-[900px] flex-col bg-[#f3f2ed] shadow-2xl sm:max-h-[90vh]">
        <header className="flex items-center justify-between border-b border-[#dedfd7] bg-white px-5 py-4 sm:px-8"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#85887d]">Cadastro de estoque</p><h2 id="vehicle-editor-title" className="mt-1 text-xl font-semibold">{vehicle ? "Editar veículo" : "Novo veículo"}</h2></div><button type="button" onClick={() => void cancelEditing()} disabled={saving || uploading} aria-label="Fechar formulário" className="grid h-10 w-10 place-items-center border border-[#dedfd7] text-[#55594f]"><X size={18} /></button></header>
        <form onSubmit={submit} className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">
          <fieldset className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><legend className="mb-4 text-sm font-semibold">Dados básicos</legend>
            <label className={labelClass}>Tipo<select className={inputClass} value={draft.type} onChange={(event) => change("type", event.target.value as VehicleDraft["type"])}><option value="carro">Carro</option><option value="moto">Moto</option></select></label>
            <label className={labelClass}>Condição<select className={inputClass} value={draft.condition} onChange={(event) => change("condition", event.target.value as VehicleDraft["condition"])}><option value="seminovo">Seminovo</option><option value="novo">Novo</option></select></label>
            <label className={labelClass}>Status<select className={inputClass} value={draft.status} onChange={(event) => change("status", event.target.value as VehicleStatus)}><option value="disponivel">Disponível</option><option value="reservado">Reservado</option><option value="vendido">Vendido</option></select></label>
            <label className={labelClass}>Marca<input required maxLength={100} className={inputClass} value={draft.make} onChange={(event) => change("make", event.target.value)} /></label>
            <label className={labelClass}>Modelo<input required maxLength={120} className={inputClass} value={draft.model} onChange={(event) => change("model", event.target.value)} /></label>
            <label className={labelClass}>Versão<input className={inputClass} value={draft.version} onChange={(event) => change("version", event.target.value)} /></label>
            <label className={labelClass}>Ano<input type="number" min="1886" max="2100" className={inputClass} value={draft.year ?? ""} onChange={(event) => change("year", event.target.value ? Number(event.target.value) : null)} /></label>
            <label className={labelClass}>Quilometragem<input type="number" min="0" className={inputClass} value={draft.mileage ?? ""} onChange={(event) => change("mileage", event.target.value ? Number(event.target.value) : null)} /></label>
            <label className={labelClass}>Cor<input className={inputClass} value={draft.color} onChange={(event) => change("color", event.target.value)} /></label>
            <label className={labelClass}>Preço (R$)<input required type="number" min="0" step="0.01" className={inputClass} value={draft.price || ""} onChange={(event) => change("price", Number(event.target.value))} /></label>
            <label className={labelClass}>Preço promocional (opcional)<input type="number" min="0" step="0.01" className={inputClass} value={draft.promotionalPrice ?? ""} onChange={(event) => change("promotionalPrice", event.target.value ? Number(event.target.value) : null)} /></label>
          </fieldset>

          <fieldset className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><legend className="mb-4 text-sm font-semibold">Especificações</legend>
            {([["engine", "Motor"], ["power", "Potência"], ["transmission", "Câmbio"], ["fuel", "Combustível"], ["displacement", "Cilindrada (motos)"], ["doors", "Número de portas (carros)"], ["traction", "Tração"]] as const).map(([key, label]) => <label key={key} className={labelClass}>{label}<input className={inputClass} value={draft[key]} onChange={(event) => change(key, event.target.value)} /></label>)}
            <label className={`${labelClass} sm:col-span-2 lg:col-span-3`}>Outras especificações (uma por linha, no formato: Nome: valor)<textarea rows={4} value={specificationText} onChange={(event) => setSpecificationText(event.target.value)} placeholder={"Ex.:\nDireção: Elétrica\nFreios: ABS"} className="mt-2 w-full border border-[#dedfd7] bg-white px-3 py-3 text-sm outline-none focus:border-[#748054]" /></label>
            <label className={`${labelClass} sm:col-span-2 lg:col-span-3`}>Equipamentos e opcionais (um por linha)<textarea rows={4} value={equipmentText} onChange={(event) => setEquipmentText(event.target.value)} placeholder={"Ex.:\nAr-condicionado\nCâmera de ré"} className="mt-2 w-full border border-[#dedfd7] bg-white px-3 py-3 text-sm outline-none focus:border-[#748054]" /></label>
          </fieldset>

          <fieldset className="mt-8"><legend className="mb-3 text-sm font-semibold">Fotos <span className="font-normal text-[#83867c]">· a primeira imagem será a capa</span></legend>
            <label className="flex min-h-12 w-fit cursor-pointer items-center gap-2 border border-[#aeb0a4] bg-white px-4 text-sm font-semibold text-[#44473f] transition hover:border-[#191a16]"><ImagePlus size={17} />{uploading ? "Enviando fotos…" : "Adicionar fotos"}<input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={uploading || draft.images.length >= 30} onChange={(event) => void addPhotos(event)} className="sr-only" /></label>
            <p className="mt-2 text-[11px] text-[#84877d]">JPG, PNG ou WebP. Máximo de 8 MB por foto e 30 por veículo.</p>
            {draft.images.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{draft.images.map((image, index) => <figure key={image} className={`relative border-2 ${index === 0 ? "border-[#84995b]" : "border-transparent"}`}><Image src={image} alt={`Foto ${index + 1} do veículo`} width={500} height={370} className="aspect-[1.35] w-full object-cover" /><figcaption className="bg-white px-2 py-1 text-[10px] font-semibold text-[#62665d]">{index === 0 ? "Foto principal" : `Foto ${index + 1}`}</figcaption><div className="absolute right-1 top-1 flex gap-1"><button type="button" onClick={() => movePhoto(index, -1)} disabled={index === 0} aria-label="Mover foto para a esquerda" className="grid h-7 w-7 place-items-center bg-white/95 disabled:opacity-40"><ArrowLeft size={14} /></button><button type="button" onClick={() => movePhoto(index, 1)} disabled={index === draft.images.length - 1} aria-label="Mover foto para a direita" className="grid h-7 w-7 place-items-center bg-white/95 disabled:opacity-40"><ArrowRight size={14} /></button><button type="button" onClick={() => void removePhoto(image)} aria-label="Remover foto" className="grid h-7 w-7 place-items-center bg-[#8b3628] text-white"><X size={14} /></button></div></figure>)}</div>}
          </fieldset>

          <fieldset className="mt-8"><legend className="mb-3 text-sm font-semibold">Descrição</legend><textarea rows={6} maxLength={10000} value={draft.description} onChange={(event) => change("description", event.target.value)} className="w-full border border-[#dedfd7] bg-white px-3 py-3 text-sm leading-6 outline-none focus:border-[#748054]" /></fieldset>

          <fieldset className="mt-8 border-t border-[#dedfd7] pt-6"><legend className="mb-4 text-sm font-semibold">Financiamento</legend>
            <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={draft.financingEnabled} onChange={(event) => change("financingEnabled", event.target.checked)} className="h-4 w-4 accent-[#748a47]" />Exibir simulador neste veículo</label>
            {draft.financingEnabled && <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><label className={labelClass}>Entrada sugerida (R$)<input type="number" min="0" className={inputClass} value={draft.suggestedDownPayment ?? ""} onChange={(event) => change("suggestedDownPayment", event.target.value ? Number(event.target.value) : null)} /></label><label className={labelClass}>Taxa mensal estimada (%)<input required type="number" min="0" max="20" step="0.01" className={inputClass} value={(draft.monthlyRate * 100).toFixed(2)} onChange={(event) => change("monthlyRate", Number(event.target.value) / 100)} /></label><label className={labelClass}>Prazo mínimo (meses)<input required type="number" min="1" max="120" className={inputClass} value={draft.minimumTerm} onChange={(event) => change("minimumTerm", Number(event.target.value))} /></label><label className={labelClass}>Prazo máximo (meses)<input required type="number" min={draft.minimumTerm} max="120" className={inputClass} value={draft.maximumTerm} onChange={(event) => change("maximumTerm", Number(event.target.value))} /></label></div>}
            <p className="mt-3 text-xs leading-5 text-[#85887d]">A taxa cadastrada gera uma estimativa, não uma proposta de banco nem garantia de aprovação.</p>
          </fieldset>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#dedfd7] pt-5"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.featured} onChange={(event) => change("featured", event.target.checked)} className="h-4 w-4 accent-[#748a47]" />Destacar na home</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.showSoldPublic} onChange={(event) => change("showSoldPublic", event.target.checked)} className="h-4 w-4 accent-[#748a47]" />Mostrar veículo vendido no site</label></div>
          {error && <p role="alert" className="mt-5 border border-[#d6a598] bg-[#fae9e3] px-4 py-3 text-sm text-[#782d1d]">{error}</p>}
          <div className="sticky bottom-0 -mx-5 mt-8 flex justify-end gap-3 border-t border-[#dedfd7] bg-[#f3f2ed] px-5 py-4 sm:-mx-8 sm:px-8"><button type="button" disabled={saving || uploading} onClick={() => void cancelEditing()} className="h-11 border border-[#cfd0c8] px-5 text-sm font-semibold disabled:opacity-50">Cancelar</button><button type="submit" disabled={saving || uploading} className="h-11 bg-[#191a16] px-6 text-sm font-semibold text-white transition hover:bg-[#3c4033] disabled:opacity-50">{saving ? "Salvando…" : vehicle ? "Salvar alterações" : "Cadastrar veículo"}</button></div>
        </form>
      </section>
    </div>
  );
}