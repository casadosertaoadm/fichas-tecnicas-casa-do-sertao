import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { RecipeForm } from "@/components/RecipeForm";
import { useRecipes } from "@/lib/use-recipes";

export const Route = createFileRoute("/_authenticated/receitas/$id_/editar")({
  head: () => ({ meta: [{ title: "Editar Ficha · Casa do Sertão" }, { name: "description", content: "Editar ficha técnica de produção." },
    { property: "og:title", content: "Editar Ficha · Casa do Sertão" }, { property: "og:description", content: "Editar ficha técnica de produção." }] }),
  component: Edit,
});
function Edit() {
  const { id } = Route.useParams();
  const list = useRecipes();
  const r = list?.find((x) => x.id === id);
  return (<AppShell><h1 className="mx-auto mb-6 max-w-4xl font-display text-3xl font-bold text-primary">Editar Ficha Técnica</h1>
    {list && (r ? <RecipeForm initial={r} /> : <p>Ficha não encontrada.</p>)}</AppShell>);
}
