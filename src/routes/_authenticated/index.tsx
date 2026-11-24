import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, ChefHat, ArrowLeft, X, Cake, CakeSlice, Cookie, Croissant, CupSoda, Wheat } from "lucide-react";

const ICONS = { "Bolos Fofos": Cake, "Bolos Ligados": CakeSlice, Biscoitos: Cookie, Rocamboles: Croissant, Recheios: CupSoda, Diversos: Wheat };
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CATEGORIES, filterRecipes, formatYield } from "@/lib/recipes";
import { useRecipes } from "@/lib/use-recipes";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({ meta: [
    { title: "Fichas Técnicas · Casa do Sertão" },
    { name: "description", content: "Gestão de fichas técnicas de produção da panificação Casa do Sertão." },
    { property: "og:title", content: "Fichas Técnicas · Casa do Sertão" },
    { property: "og:description", content: "Gestão de fichas técnicas de produção da panificação Casa do Sertão." },
  ] }),
  component: Index,
});

function Index() {
  const list = useRecipes();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");
  const showCats = cat === "Todas" && !q.trim();
  const items = list ? filterRecipes(list, q, cat) : [];
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><h1 className="font-display text-3xl font-bold text-primary">Fichas Técnicas</h1>
            <p className="text-muted-foreground">{list?.length ?? 0} receitas cadastradas</p></div>
          <Button asChild><Link to="/receitas/nova"><Plus /> Nova Ficha</Link></Button>
        </div>
        <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="h-11 bg-card pl-9" placeholder="Buscar por produto ou ingrediente..." value={q} onChange={(e) => setQ(e.target.value)} />
          {q && <button onClick={() => setQ("")} aria-label="Limpar busca" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>}</div>
        <div className="flex flex-wrap gap-2">
          {["Todas", ...CATEGORIES].map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-accent"}`}>
              {c} {list && <span className="opacity-70">({c === "Todas" ? list.length : list.filter((r) => r.category === c).length})</span>}
            </button>))}
        </div>
        {showCats ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c) => { const Icon = ICONS[c]; const n = list?.filter((r) => r.category === c).length ?? 0; return (
              <button key={c} onClick={() => setCat(c)} className="group flex items-center gap-4 rounded-xl border bg-card p-6 text-left shadow-warm transition hover:-translate-y-1 hover:border-primary">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-primary transition group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="h-7 w-7" /></span>
                <span><span className="block font-display text-xl font-semibold">{c}</span><span className="text-sm text-muted-foreground">{n} {n === 1 ? "receita" : "receitas"}</span></span>
              </button>); })}
          </div>
        ) : (<>
        <Button variant="ghost" onClick={() => { setCat("Todas"); setQ(""); }}><ArrowLeft /> Voltar para Categorias</Button>
        {list && items.length === 0 && <p className="py-16 text-center text-muted-foreground">Nenhuma ficha encontrada.</p>}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r) => (
            <Link key={r.id} to="/receitas/$id" params={{ id: r.id }} className="group overflow-hidden rounded-xl border bg-card shadow-warm transition hover:-translate-y-1">
              <div className="aspect-[4/3] bg-muted">{r.image ? <img src={r.image} alt={r.name} loading="lazy" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-muted-foreground"><ChefHat className="h-12 w-12" /></div>}</div>
              <div className="space-y-1 p-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">{r.category}</span>
                <h3 className="font-display text-lg font-semibold group-hover:text-primary">{r.name}</h3>
                <p className="text-sm text-muted-foreground">Rendimento: {formatYield(r)} · {r.ingredients.length} ingredientes</p>
              </div>
            </Link>))}
        </div></>)}
      </div>
    </AppShell>
  );
}
