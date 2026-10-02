import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const basePath = "/---CONCESSIONARIA--";
const staticRoutes = {
  veiculos: "veiculos.html",
  "privacy-policy": "privacidade.html",
  "terms-of-service": "termos.html",
};
const temporaryRoot = await mkdtemp(path.join(projectRoot, ".github-pages-source-"));
const outputDirectory = path.join(projectRoot, ".github-pages");

async function replaceOnce(filePath, before, after) {
  const file = path.join(temporaryRoot, filePath);
  const source = await readFile(file, "utf8");
  if (!source.includes(before)) throw new Error(`Expected content was not found in ${filePath}`);
  await writeFile(file, source.replace(before, after));
}

try {
  for (const entry of ["src", "public", "package.json", "package-lock.json", "tsconfig.json", "postcss.config.js", "tailwind.config.ts", "next-env.d.ts"]) {
    await cp(path.join(projectRoot, entry), path.join(temporaryRoot, entry), { recursive: true });
  }

  await symlink(path.join(projectRoot, "node_modules"), path.join(temporaryRoot, "node_modules"), process.platform === "win32" ? "junction" : "dir");
  await writeFile(path.join(temporaryRoot, "next.config.mjs"), `const nextConfig = {
  output: "export",
  basePath: "${basePath}",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: { root: ${JSON.stringify(projectRoot)} },
};

export default nextConfig;
`);

  for (const route of [
    "src/app/api",
    "src/app/admin",
    "src/app/get-started",
    "src/app/resources",
    "src/app/services",
    "src/app/solutions",
    "src/app/veiculos/[slug]",
    "src/app/sitemap.ts",
    "src/app/robots.ts",
  ]) {
    await rm(path.join(temporaryRoot, route), { recursive: true, force: true });
  }

  await writeFile(path.join(temporaryRoot, "src/app/page.tsx"), `import DealershipHome from "@/components/DealershipHome";

export default function Home() {
  return <DealershipHome />;
}
`);

  await writeFile(path.join(temporaryRoot, "src/app/veiculos/page.tsx"), `import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { dealershipWhatsAppLink } from "@/lib/dealership-whatsapp";

export default function VehiclesPage() {
  const contact = dealershipWhatsAppLink("Olá! Gostaria de consultar os veículos disponíveis.");

  return (
    <main className="min-h-screen bg-[#12130f] px-5 py-12 text-[#f8f8f4] md:px-10 md:py-20">
      <div className="mx-auto max-w-[900px]">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white"><ArrowLeft size={15} />Voltar ao início</Link>
        <p className="mt-16 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c9f169]">Estoque MOTORA</p>
        <h1 className="mt-3 text-4xl font-semibold md:text-6xl">Consulte os veículos disponíveis.</h1>
        <p className="mt-5 max-w-[600px] text-sm leading-7 text-white/60">A vitrine do GitHub é uma versão estática. Para confirmar modelos, valores e disponibilidade atualizados, fale diretamente com a concessionária.</p>
        {contact && <a href={contact} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-12 items-center gap-2 bg-[#c9f169] px-5 text-xs font-bold text-[#171914]"><MessageCircle size={16} />Consultar pelo WhatsApp</a>}
      </div>
    </main>
  );
}
`);

  const heroPath = path.join(temporaryRoot, "src/components/DealershipHero.tsx");
  const hero = await readFile(heroPath, "utf8");
  await writeFile(heroPath, hero.replaceAll('href="/veiculos"', 'href="/veiculos.html"'));

  const infoPagePath = path.join(temporaryRoot, "src/components/DealershipInfoPage.tsx");
  const infoPage = await readFile(infoPagePath, "utf8");
  await writeFile(infoPagePath, infoPage.replace('href="/veiculos"', 'href="/veiculos.html"'));

  const homePath = path.join(temporaryRoot, "src/components/DealershipHome.tsx");
  let home = await readFile(homePath, "utf8");
  home = home.replace('import TradeInForm from "@/components/TradeInForm";\n', "");
  home = home.replace(
    '<section className="px-5 py-16 md:px-10 md:py-20"><div className="mx-auto max-w-[1360px]"><TradeInForm /></div></section>',
    '<section id="troca" className="scroll-mt-5 px-5 py-16 md:px-10 md:py-20"><div className="mx-auto flex max-w-[1360px] flex-col justify-between gap-5 border-y border-white/10 py-8 sm:flex-row sm:items-center"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c9f169]">Avaliação de troca</p><h2 className="mt-2 text-2xl font-semibold">Converse com a equipe MOTORA.</h2></div><a href={whatsappLink ?? "#inicio"} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/25 px-5 text-xs font-semibold hover:border-[#c9f169]">Consultar pelo WhatsApp <ArrowUpRight size={14} /></a></div></section>',
  );
  home = home.replace(/<a href="\/(veiculos|privacy-policy|terms-of-service)(?=[?\"])/g, (_, route) => `<a href="${basePath}/${staticRoutes[route]}`);
  home = home.replace('<a href="/admin" className="hover:text-white">Área do administrador</a>', "");
  home = home.replace("Os destaques serão definidos pela concessionária.", "Consulte as novidades diretamente com a equipe MOTORA.");
  home = home.replace("Quando a concessionária cadastrar e destacar um veículo no painel, ele aparecerá aqui automaticamente.", "Fale com a equipe MOTORA para consultar a seleção atual de veículos.");
  await writeFile(homePath, home);

  await replaceOnce(
    "src/components/HeroVehicleCanvas.tsx",
    'const MODEL_URL = "/models/institutional-car.glb";',
    'const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";\nconst MODEL_URL = `${BASE_PATH}/models/institutional-car.glb`;',
  );
  await replaceOnce(
    "src/components/HeroVehicleCanvas.tsx",
    'ktx2Loader.setTranscoderPath("/basis/");',
    'ktx2Loader.setTranscoderPath(`${BASE_PATH}/basis/`);',
  );

  await rm(outputDirectory, { recursive: true, force: true });
  const nextCli = path.join(temporaryRoot, "node_modules/next/dist/bin/next");
  execFileSync(process.execPath, [nextCli, "build"], {
    cwd: temporaryRoot,
    stdio: "inherit",
    env: { ...process.env, NEXT_PUBLIC_BASE_PATH: basePath },
  });
  await mkdir(outputDirectory, { recursive: true });
  await cp(path.join(temporaryRoot, "out"), outputDirectory, { recursive: true });
  for (const [route, filename] of Object.entries(staticRoutes)) {
    await cp(path.join(outputDirectory, route, "index.html"), path.join(outputDirectory, filename));
  }
  console.log(`GitHub Pages artifact created at ${outputDirectory}`);
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}