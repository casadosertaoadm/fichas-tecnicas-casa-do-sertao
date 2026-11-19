import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, FileDown, Pencil, Printer, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { deleteRecipe, formatYield, yieldTotal } from "@/lib/recipes";
import { useRecipes } from "@/lib/use-recipes";
import logoAsset from "@/assets/logo_casa_sertao.png.asset.json";
const logo = logoAsset.url;

export const Route = createFileRoute("/receitas/$id")({
  head: () => ({ meta: [{ title: "Ficha Técnica · Casa do Sertão" }, { name: "description", content: "Ficha técnica de produção para impressão e PDF." },
    { property: "og:title", content: "Ficha Técnica · Casa do Sertão" }, { property: "og:description", content: "Ficha técnica de produção para impressão e PDF." }] }),
  component: View,
});

const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);

function View() {
  const { id } = Route.useParams();
  const list = useRecipes();
  const nav = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const r = list?.find((x) => x.id === id);
  if (!list) return <AppShell>{null}</AppShell>;
  if (!r) return <AppShell><p>Ficha não encontrada. <Link to="/" className="text-primary underline">Voltar</Link></p></AppShell>;

  const pdf = async () => {
    setBusy(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas-pro"), import("jspdf")]);
      const canvas = await html2canvas(ref.current!, { scale: 2, backgroundColor: "#ffffff" });
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const w = 190, pageH = 277, h = (canvas.height * w) / canvas.width;
      const img = canvas.toDataURL("image/jpeg", 0.95);
      let y = 0;
      while (y < h) { if (y > 0) doc.addPage(); doc.addImage(img, "JPEG", 10, 10 - y, w, h); y += pageH; }
      doc.save(`Ficha - ${r.name}.pdf`);
    } finally {
      setBusy(false);
    }
  };
  const th = "border border-sheet-line bg-sheet-head px-3 py-2 text-left text-xs font-bold uppercase";
  const td = "border border-sheet-line px-3 py-1.5";
  return (
    <AppShell>
      <div className="no-print mx-auto mb-4 flex max-w-[210mm] flex-wrap items-center gap-2">
        <Button variant="ghost" asChild><Link to="/"><ArrowLeft /> Voltar</Link></Button>
        <div className="flex-1" />
        <Button variant="outline" asChild><Link to="/receitas/$id/editar" params={{ id }}><Pencil /> Editar</Link></Button>
        <Button variant="outline" onClick={() => { if (confirm("Excluir esta ficha?")) { deleteRecipe(id); nav({ to: "/" }); } }}><Trash2 /> Excluir</Button>
        <Button variant="secondary" size="lg" onClick={() => window.print()}><Printer /> Imprimir Ficha</Button>
        <Button size="lg" onClick={pdf} disabled={busy}><FileDown /> {busy ? "Gerando..." : "Gerar PDF"}</Button>
      </div>
      <div ref={ref} className="print-sheet mx-auto max-w-[210mm] bg-sheet p-8 text-sheet-ink shadow-warm">
        <header className="flex items-center gap-4 border-b-4 border-double border-primary pb-4">
          <img src={logo} alt="Casa do Sertão" className="h-20 w-20 object-contain" />
          <div className="flex-1"><p className="text-xs font-bold uppercase tracking-widest text-primary">Casa do Sertão · Ficha Técnica de Produção</p>
            <h1 className="font-display text-3xl font-bold">{r.name}</h1></div>
          <div className="text-right text-xs"><p>Código: {r.id.slice(0, 8).toUpperCase()}</p><p>Revisão: {new Date(r.updatedAt).toLocaleDateString("pt-BR")}</p></div>
        </header>
        <div className="mt-5 grid grid-cols-[1fr_200px] gap-5">
          <table className="h-fit w-full border-collapse text-sm"><tbody>
            <tr><th className={th}>Categoria</th><td className={td}>{r.category}</td></tr>
            <tr><th className={th}>Rendimento</th><td className={td}>{formatYield(r)}</td></tr>
            {yieldTotal(r) && <tr><th className={th}>Total estimado</th><td className={td}>{yieldTotal(r)}</td></tr>}
            <tr><th className={th}>Nº de matérias-primas</th><td className={td}>{r.ingredients.length}</td></tr>
          </tbody></table>
          {r.image && <img src={r.image} alt={r.name} className="aspect-[4/3] w-full rounded border border-sheet-line object-cover" />}
        </div>
        <h2 className="mt-6 mb-2 font-display text-lg font-bold text-primary">Matérias-Primas</h2>
        <table className="w-full border-collapse text-sm"><thead><tr><th className={th + " w-10"}>#</th><th className={th}>Ingrediente</th><th className={th + " w-24 text-right"}>Qtd</th><th className={th + " w-24"}>Unid.</th></tr></thead>
          <tbody>{r.ingredients.map((i, n) => <tr key={i.id}><td className={td}>{n + 1}</td><td className={td}>{i.name}</td><td className={td + " text-right font-semibold"}>{i.qty}</td><td className={td}>{i.unit}</td></tr>)}</tbody></table>
        <h2 className="mt-6 mb-2 font-display text-lg font-bold text-primary">Utensílios e Equipamentos</h2>
        <ul className="list-disc space-y-1 pl-6 text-sm">{lines(r.equipment).map((l, i) => <li key={i}>{l}</li>)}</ul>
        <h2 className="mt-6 mb-2 font-display text-lg font-bold text-primary">Modo de Preparo</h2>
        <ol className="list-decimal space-y-1.5 pl-6 text-sm">{lines(r.preparation).map((l, i) => <li key={i}>{l}</li>)}</ol>
        <footer className="mt-10 grid grid-cols-2 gap-10 text-center text-xs">
          <div className="border-t border-sheet-ink pt-1">Responsável Técnico</div><div className="border-t border-sheet-ink pt-1">Supervisor de Produção</div>
        </footer>
      </div>
    </AppShell>
  );
}
