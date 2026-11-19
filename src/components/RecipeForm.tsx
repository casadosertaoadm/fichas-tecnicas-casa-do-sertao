import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, ING_UNITS, YIELD_UNITS, uid, upsertRecipe, type Category, type Recipe } from "@/lib/recipes";

const empty = (): Recipe => ({ id: uid(), name: "", category: "Bolos Fofos", yieldQty: "", yieldUnit: "Unidades",
  ingredients: [{ id: uid(), name: "", qty: "", unit: "g" }], equipment: "", preparation: "", updatedAt: Date.now() });
const sel = "h-10 w-full rounded-md border border-input bg-card px-3 text-sm";

function resize(file: File): Promise<string> {
  return new Promise((res) => { const img = new Image(); img.onload = () => { const s = Math.min(1, 900 / img.width);
    const c = document.createElement("canvas"); c.width = img.width * s; c.height = img.height * s; c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    res(c.toDataURL("image/jpeg", 0.8)); }; img.src = URL.createObjectURL(file); });
}

export function RecipeForm({ initial }: { initial?: Recipe }) {
  const [r, setR] = useState<Recipe>(initial ?? empty());
  const nav = useNavigate();
  const set = <K extends keyof Recipe>(k: K, v: Recipe[K]) => setR((p) => ({ ...p, [k]: v }));
  const setIng = (i: number, k: "name" | "qty" | "unit", v: string) => set("ingredients", r.ingredients.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const move = (i: number, d: number) => { const l = [...r.ingredients]; const j = i + d; if (j < 0 || j >= l.length) return; const t = l[i]!; l[i] = l[j]!; l[j] = t; set("ingredients", l); };
  const submit = (e: React.FormEvent) => { e.preventDefault(); const rec = { ...r, ingredients: r.ingredients.filter((i) => i.name.trim()), updatedAt: Date.now() };
    upsertRecipe(rec); nav({ to: "/receitas/$id", params: { id: rec.id } }); };
  const section = "space-y-4 rounded-xl border bg-card p-5 shadow-warm";
  return (
    <form onSubmit={submit} className="mx-auto max-w-4xl space-y-6">
      <section className={section}><h2 className="font-display text-xl font-semibold text-primary">Informações Básicas</h2>
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div className="space-y-4">
            <div className="space-y-1.5"><Label>Nome do Produto / Receita</Label><Input required value={r.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex: Bolo de Milho" /></div>
            <div className="space-y-1.5"><Label>Categoria</Label><select className={sel} value={r.category} onChange={(e) => set("category", e.target.value as Category)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
          </div>
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-muted text-sm text-muted-foreground hover:border-primary">
            {r.image ? <img src={r.image} alt="Foto do produto" className="h-full w-full object-cover" /> : <><ImagePlus className="mb-2 h-8 w-8" />Foto do produto</>}
            <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) set("image", await resize(f)); }} />
          </label>
        </div>
        {r.image && <Button type="button" variant="ghost" size="sm" onClick={() => set("image", undefined)}>Remover foto</Button>}
      </section>
      <section className={section}><h2 className="font-display text-xl font-semibold text-primary">Rendimento</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Quantidade</Label><Input required type="number" step="any" min="0" value={r.yieldQty} onChange={(e) => set("yieldQty", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Unidade</Label><select className={sel} value={r.yieldUnit} onChange={(e) => set("yieldUnit", e.target.value)}>{YIELD_UNITS.map((u) => <option key={u}>{u}</option>)}</select></div>
        </div>
      </section>
      <section className={section}><h2 className="font-display text-xl font-semibold text-primary">Matérias-Primas</h2>
        {r.ingredients.map((ing, i) => (
          <div key={ing.id} className="grid grid-cols-[1fr_90px_110px_auto] items-center gap-2">
            <Input placeholder="Ingrediente" value={ing.name} onChange={(e) => setIng(i, "name", e.target.value)} />
            <Input placeholder="Qtd" type="number" step="any" value={ing.qty} onChange={(e) => setIng(i, "qty", e.target.value)} />
            <select className={sel} value={ing.unit} onChange={(e) => setIng(i, "unit", e.target.value)}>{ING_UNITS.map((u) => <option key={u}>{u}</option>)}</select>
            <div className="flex">
              <Button type="button" variant="ghost" size="icon" onClick={() => move(i, -1)} aria-label="Subir"><ArrowUp /></Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => move(i, 1)} aria-label="Descer"><ArrowDown /></Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => set("ingredients", r.ingredients.filter((_, j) => j !== i))} aria-label="Remover"><Trash2 className="text-destructive" /></Button>
            </div>
          </div>))}
        <Button type="button" variant="outline" onClick={() => set("ingredients", [...r.ingredients, { id: uid(), name: "", qty: "", unit: "g" }])}><Plus /> Adicionar Matéria-Prima</Button>
      </section>
      <section className={section}><h2 className="font-display text-xl font-semibold text-primary">Preparo</h2>
        <div className="space-y-1.5"><Label>Utensílios e Equipamentos (um por linha)</Label><Textarea rows={4} value={r.equipment} onChange={(e) => set("equipment", e.target.value)} placeholder={"Batedeira planetária\nForno a 180 °C por 40 min"} /></div>
        <div className="space-y-1.5"><Label>Forma de Preparo (cada linha vira um passo numerado)</Label><Textarea rows={8} value={r.preparation} onChange={(e) => set("preparation", e.target.value)} /></div>
      </section>
      <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => history.back()}>Cancelar</Button><Button type="submit" size="lg">Salvar Ficha</Button></div>
    </form>
  );
}
