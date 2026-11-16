#!/usr/bin/env node
// Importa/atualiza produtos em public/produtos.json a partir de um ficheiro JSON
// no mesmo esquema (id, titulo, categoria, imagem, link, loja, destaque, e
// opcionais preco, precoAntes, precoData, dia).
//
// Regras:
//  - Chave única = ASIN (campo "id"). Nunca cria duplicados: se o ASIN já existe,
//    atualiza os campos enviados (upsert) e mantém a posição original.
//  - Recusa qualquer link que não seja amazon.es com tag=portaldeofert-21
//    (ou link.amazon / amzn.to curto, que só é aceite com --permitir-curtos e
//    depois de verificado manualmente).
//  - Não aceita preços nem imagens de origem não autorizada: por omissão remove
//    "preco", "precoAntes", "precoData" e "imagem" a não ser que se passe
//    --fonte=creators-api (preço/imagem obtidos pela Creators API, com precoData).
//  - --dry-run mostra o que mudaria sem escrever.
//
// Uso:
//   node scripts/importar-produtos.mjs novos.json [--dry-run] [--permitir-curtos] [--fonte=creators-api]

import fs from "node:fs";
import path from "node:path";

const TAG = "portaldeofert-21";
const ALVO = path.resolve(process.cwd(), "public/produtos.json");
const CATEGORIAS = [
  "Impressoras 3D", "Tecnologia", "Casa e cozinha", "Beleza", "Moda", "Joias",
  "Ferramentas", "Brinquedos e jogos", "Desporto", "Animais", "Promoções especiais",
];
const ASIN_RE = /^[A-Z0-9]{10}$/;

const args = process.argv.slice(2);
const ficheiro = args.find(a => !a.startsWith("--"));
const dryRun = args.includes("--dry-run");
const permitirCurtos = args.includes("--permitir-curtos");
const fonteApi = args.includes("--fonte=creators-api");
if (!ficheiro) {
  console.error("Uso: node scripts/importar-produtos.mjs novos.json [--dry-run] [--permitir-curtos] [--fonte=creators-api]");
  process.exit(2);
}

function validarLink(p) {
  let u;
  try { u = new URL(p.link); } catch { return "link inválido"; }
  if (u.protocol !== "https:") return "link não é https";
  if (u.hostname === "link.amazon" || u.hostname === "amzn.to") {
    return permitirCurtos ? null : "link curto: verificar a tag manualmente e usar --permitir-curtos";
  }
  if (u.hostname !== "www.amazon.es") return `domínio não permitido (${u.hostname})`;
  const tags = u.searchParams.getAll("tag");
  if (tags.length !== 1 || tags[0] !== TAG) return `tag diferente de ${TAG} (${tags.join(",") || "sem tag"})`;
  const m = u.pathname.match(/\/dp\/([A-Z0-9]{10})/);
  if (!m) return "link sem /dp/ASIN";
  if (m[1] !== p.id) return `ASIN do link (${m[1]}) ≠ id (${p.id})`;
  return null;
}

function limpar(p) {
  const out = {
    id: String(p.id).trim().toUpperCase(),
    titulo: String(p.titulo || "").trim(),
    categoria: p.categoria,
    imagem: fonteApi ? (p.imagem || "") : "",
    link: p.link,
    loja: p.loja || "Amazon",
    destaque: Boolean(p.destaque),
  };
  if (p.dia) out.dia = p.dia;
  if (fonteApi && p.preco > 0) {
    if (!p.precoData) throw new Error(`${out.id}: preço da API sem precoData (obrigatório pela Licença)`);
    out.preco = p.preco;
    if (p.precoAntes > p.preco) out.precoAntes = p.precoAntes;
    out.precoData = p.precoData;
  }
  return out;
}

const atuais = JSON.parse(fs.readFileSync(ALVO, "utf8"));
const novos = JSON.parse(fs.readFileSync(path.resolve(ficheiro), "utf8"));
if (!Array.isArray(atuais) || !Array.isArray(novos)) throw new Error("Os dois ficheiros têm de ser listas JSON");

const porId = new Map(atuais.map((p, i) => [p.id, i]));
const vistosNoLote = new Set();
const rel = { adicionados: [], atualizados: [], removidos: [], recusados: [] };

for (const bruto of novos) {
  const id = String(bruto.id || "").trim().toUpperCase();
  if (bruto.remover === true) {
    if (porId.has(id)) { rel.removidos.push(id); porId.delete(id); }
    else rel.recusados.push(`${id || "?"}: remover pedido mas o ASIN não existe`);
    continue;
  }
  const motivo =
    !ASIN_RE.test(id) ? "ASIN inválido" :
    vistosNoLote.has(id) ? "duplicado no próprio lote" :
    !bruto.titulo ? "sem título" :
    !CATEGORIAS.includes(bruto.categoria) ? `categoria desconhecida (${bruto.categoria})` :
    validarLink({ ...bruto, id });
  if (motivo) { rel.recusados.push(`${id || "?"}: ${motivo}`); continue; }
  vistosNoLote.add(id);
  const p = limpar({ ...bruto, id });
  if (porId.has(id)) {
    const i = porId.get(id);
    // Sem fonte autorizada não mexe na imagem já existente (nem a apaga nem a substitui).
    if (!fonteApi) delete p.imagem;
    if (bruto.destaque === undefined) delete p.destaque;
    atuais[i] = { ...atuais[i], ...p };
    rel.atualizados.push(id);
  } else {
    porId.set(id, atuais.length);
    atuais.push(p);
    rel.adicionados.push(id);
  }
}

console.log(`Adicionados: ${rel.adicionados.length}  Atualizados: ${rel.atualizados.length}  Removidos: ${rel.removidos.length}  Recusados: ${rel.recusados.length}`);
rel.recusados.forEach(r => console.log("  ✗ " + r));
if (rel.recusados.length && !args.includes("--ignorar-recusados")) {
  console.error("Há produtos recusados. Corrige-os ou usa --ignorar-recusados. Nada foi escrito.");
  process.exit(1);
}
if (dryRun) { console.log("(dry-run: nada foi escrito)"); process.exit(0); }
const finais = atuais.filter(p => !rel.removidos.includes(p.id));
fs.writeFileSync(ALVO, JSON.stringify(finais, null, 2) + "\n");
console.log(`Escrito ${ALVO} (${finais.length} produtos)`);
