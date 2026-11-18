import rocamboleImg from "@/assets/rocambole.jpg";
import macaxeiraImg from "@/assets/bolo-macaxeira.jpg";

export const CATEGORIES = ["Bolos Fofos", "Bolos Ligados", "Biscoitos", "Rocamboles", "Recheios", "Diversos"] as const;
export type Category = (typeof CATEGORIES)[number];
export const YIELD_UNITS = ["Unidades", "Kg", "Gramas", "Formas", "Assadeiras", "Litros"];
export const ING_UNITS = ["Kg", "g", "L", "ml", "Unidades", "Colheres", "Xícaras"];

export type Ingredient = { id: string; name: string; qty: string; unit: string };
export type Recipe = {
  id: string; name: string; category: Category; image?: string;
  yieldQty: string; yieldUnit: string; ingredients: Ingredient[];
  equipment: string; preparation: string; updatedAt: number;
};

const KEY = "cds-fichas-v1";
export const uid = () => Math.random().toString(36).slice(2, 10);

function seed(): Recipe[] {
  const now = Date.now();
  const ing = (l: [string, string, string][]) => l.map(([name, qty, unit]) => ({ id: uid(), name, qty, unit }));
  return [
    { id: "rocambole-chocolate", name: "Rocambole de Chocolate", category: "Rocamboles", image: rocamboleImg, yieldQty: "4", yieldUnit: "Unidades",
      ingredients: ing([["Ovos", "12", "Unidades"], ["Açúcar refinado", "360", "g"], ["Farinha de trigo", "240", "g"], ["Chocolate em pó 50%", "80", "g"], ["Fermento químico", "10", "g"], ["Recheio de brigadeiro", "1.2", "Kg"]]),
      equipment: "Batedeira planetária (globo)\nAssadeira 40x60 cm com papel manteiga\nForno turbo a 180 °C por 12 minutos\nPano limpo para enrolar",
      preparation: "Bater os ovos com o açúcar em velocidade alta até triplicar o volume.\nPeneirar a farinha, o chocolate e o fermento e incorporar delicadamente.\nEspalhar na assadeira e assar a 180 °C por 12 minutos.\nDesenformar sobre pano úmido, rechear e enrolar ainda morno.\nResfriar por 2 horas antes de embalar.", updatedAt: now },
    { id: "bolo-macaxeira", name: "Bolo de Macaxeira", category: "Bolos Ligados", image: macaxeiraImg, yieldQty: "3", yieldUnit: "Formas",
      ingredients: ing([["Macaxeira ralada crua", "2", "Kg"], ["Leite de coco", "400", "ml"], ["Leite condensado", "790", "g"], ["Coco ralado", "200", "g"], ["Ovos", "6", "Unidades"], ["Manteiga", "100", "g"], ["Açúcar", "300", "g"]]),
      equipment: "Liquidificador industrial\nFormas retangulares 30x20 cm untadas\nForno a 200 °C por 50 minutos",
      preparation: "Espremer a macaxeira ralada para retirar o excesso de líquido.\nBater no liquidificador os ovos, leites, manteiga e açúcar.\nMisturar à macaxeira e ao coco ralado.\nDistribuir nas formas e assar a 200 °C por 50 minutos até dourar.", updatedAt: now - 1 },
    { id: "biscoito-nata", name: "Biscoito de Nata", category: "Biscoitos", yieldQty: "2.5", yieldUnit: "Kg",
      ingredients: ing([["Nata", "500", "g"], ["Açúcar", "400", "g"], ["Farinha de trigo", "1.5", "Kg"], ["Ovos", "4", "Unidades"], ["Fermento químico", "2", "Colheres"]]),
      equipment: "Masseira semi-rápida\nBicos de confeitar\nAssadeiras perfuradas\nForno a 170 °C por 18 minutos",
      preparation: "Misturar nata, açúcar e ovos até homogeneizar.\nAdicionar a farinha e o fermento aos poucos.\nModelar os biscoitos e dispor nas assadeiras.\nAssar a 170 °C por 18 minutos.", updatedAt: now - 2 },
  ];
}

export function loadRecipes(): Recipe[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  if (!raw) { const s = seed(); localStorage.setItem(KEY, JSON.stringify(s)); return s; }
  try { return JSON.parse(raw); } catch { return []; }
}
export function saveRecipes(list: Recipe[]) { localStorage.setItem(KEY, JSON.stringify(list)); window.dispatchEvent(new Event("cds-change")); }
export function upsertRecipe(r: Recipe) { const l = loadRecipes(); const i = l.findIndex((x) => x.id === r.id); if (i >= 0) l[i] = r; else l.unshift(r); saveRecipes(l); }
export function deleteRecipe(id: string) { saveRecipes(loadRecipes().filter((r) => r.id !== id)); }

export function filterRecipes(list: Recipe[], q: string, cat: string) {
  const s = q.trim().toLowerCase();
  return list.filter((r) => (cat === "Todas" || r.category === cat) &&
    (!s || r.name.toLowerCase().includes(s) || r.ingredients.some((i) => i.name.toLowerCase().includes(s))));
}
