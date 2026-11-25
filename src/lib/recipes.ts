import rocamboleImg from "@/assets/rocambole.jpg";
import macaxeiraImg from "@/assets/bolo-macaxeira.jpg";
import { supabase } from "@/integrations/supabase/client";

export const CATEGORIES = ["Bolos Fofos", "Bolos Ligados", "Biscoitos", "Rocamboles", "Recheios", "Brownies", "Dindins", "Diversos"] as const;
export type Category = (typeof CATEGORIES)[number];
export const YIELD_UNITS = ["Unidades", "Kg", "Gramas", "Formas", "Assadeiras", "Litros"];
export const ING_UNITS = ["Kg", "g", "L", "ml", "Unidades", "Colheres", "Xícaras"];

export const ITEM_UNITS = ["unidades", "bolos", "rocamboles", "pacotes", "porções"];
export const EACH_UNITS = ["kg", "g", "ml", "L"];

export type Ingredient = { id: string; name: string; qty: string; unit: string };
export type Recipe = {
  id: string; name: string; category: Category; image?: string;
  yieldQty: string; yieldUnit: string;
  yieldMode?: "simples" | "composto"; yieldItemUnit?: string; yieldEach?: string; yieldEachUnit?: string; ingredients: Ingredient[];
  equipment: string; preparation: string; updatedAt: number;
};

export const uid = () => Math.random().toString(36).slice(2, 10);
export const newId = () => crypto.randomUUID();
const SEED_IMAGES: Record<string, string> = { "11111111-1111-1111-1111-111111111111": rocamboleImg, "22222222-2222-2222-2222-222222222222": macaxeiraImg };
const BUCKET = "produtos-imagens";

type Row = { id: string; nome: string; categoria: string; imagem_url: string | null; rendimento_tipo: string; rendimento_quantidade: string; rendimento_unidade: string;
  rendimento_peso_unitario: string | null; rendimento_unidade_peso: string | null; utensilios: string; modo_preparo: string; updated_at: string;
  ficha_ingredientes: { id: string; nome_ingrediente: string; quantidade: string; unidade: string; ordem: number }[] };

function fromRow(x: Row): Recipe {
  const composto = x.rendimento_tipo === "composto";
  const r: Recipe = { id: x.id, name: x.nome, category: x.categoria as Category,
    yieldMode: composto ? "composto" : "simples", yieldQty: x.rendimento_quantidade, yieldUnit: composto ? "Unidades" : x.rendimento_unidade,
    ingredients: [...x.ficha_ingredientes].sort((a, b) => a.ordem - b.ordem).map((i) => ({ id: i.id, name: i.nome_ingrediente, qty: i.quantidade, unit: i.unidade })),
    equipment: x.utensilios, preparation: x.modo_preparo, updatedAt: new Date(x.updated_at).getTime() };
  const img = x.imagem_url ?? SEED_IMAGES[x.id]; if (img) r.image = img;
  if (composto) { r.yieldItemUnit = x.rendimento_unidade; if (x.rendimento_peso_unitario) r.yieldEach = x.rendimento_peso_unitario; if (x.rendimento_unidade_peso) r.yieldEachUnit = x.rendimento_unidade_peso; }
  return r;
}

export async function loadRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase.from("fichas_tecnicas").select("*, ficha_ingredientes(*)").order("created_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as Row[]).map(fromRow);
}
const changed = () => window.dispatchEvent(new Event("cds-change"));

async function uploadImage(id: string, dataUrl: string): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado.");
  const blob = await (await fetch(dataUrl)).blob();
  const path = `${user.id}/${id}/${Date.now()}.jpg`;
  const up = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg", upsert: true });
  if (up.error) throw up.error;
  const s = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (s.error) throw s.error;
  return s.data.signedUrl;
}

export async function upsertRecipe(r: Recipe) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado.");
  let image = r.image ?? null;
  if (image?.startsWith("data:")) image = await uploadImage(r.id, image);
  if (image && Object.values(SEED_IMAGES).includes(image)) image = null;
  const composto = r.yieldMode === "composto";
  const { error } = await supabase.from("fichas_tecnicas").upsert({ id: r.id, user_id: user.id, nome: r.name, categoria: r.category, imagem_url: image,
    rendimento_tipo: composto ? "composto" : "simples", rendimento_quantidade: r.yieldQty, rendimento_unidade: composto ? (r.yieldItemUnit ?? "unidades") : r.yieldUnit,
    rendimento_peso_unitario: composto ? (r.yieldEach ?? null) : null, rendimento_unidade_peso: composto ? (r.yieldEachUnit ?? null) : null,
    utensilios: r.equipment, modo_preparo: r.preparation, updated_at: new Date().toISOString() });
  if (error) throw error;
  const del = await supabase.from("ficha_ingredientes").delete().eq("ficha_id", r.id);
  if (del.error) throw del.error;
  if (r.ingredients.length) {
    const ins = await supabase.from("ficha_ingredientes").insert(r.ingredients.map((i, n) => ({ ficha_id: r.id, nome_ingrediente: i.name, quantidade: i.qty, unidade: i.unit, ordem: n })));
    if (ins.error) throw ins.error;
  }
  changed();
}
export async function deleteRecipe(id: string) {
  const { error } = await supabase.from("fichas_tecnicas").delete().eq("id", id);
  if (error) throw error;
  changed();
}

export function filterRecipes(list: Recipe[], q: string, cat: string) {
  const s = q.trim().toLowerCase();
  return list.filter((r) => (cat === "Todas" || r.category === cat) &&
    (!s || r.name.toLowerCase().includes(s) || r.ingredients.some((i) => i.name.toLowerCase().includes(s))));
}

const num = (v: string) => Number(String(v).replace(",", "."));
const fmt = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 3 });
export function formatYield(r: Pick<Recipe, "yieldQty" | "yieldUnit" | "yieldMode" | "yieldItemUnit" | "yieldEach" | "yieldEachUnit">) {
  if (r.yieldMode !== "composto") return `${r.yieldQty} ${r.yieldUnit}`;
  return `${r.yieldQty} ${r.yieldItemUnit ?? "unidades"} de ${r.yieldEach} ${r.yieldEachUnit}`;
}
export function yieldTotal(r: Pick<Recipe, "yieldQty" | "yieldMode" | "yieldEach" | "yieldEachUnit">): string | null {
  if (r.yieldMode !== "composto" || !["kg", "g"].includes(r.yieldEachUnit ?? "")) return null;
  const g = num(r.yieldQty) * num(r.yieldEach ?? "") * (r.yieldEachUnit === "kg" ? 1000 : 1);
  if (!isFinite(g) || g <= 0) return null;
  return g >= 1000 ? `${fmt(g / 1000)} kg` : `${fmt(g)} g`;
}
