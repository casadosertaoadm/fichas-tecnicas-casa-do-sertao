import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { RecipeForm } from "@/components/RecipeForm";

export const Route = createFileRoute("/_authenticated/receitas/nova")({
  head: () => ({ meta: [{ title: "Nova Ficha Técnica · Casa do Sertão" }, { name: "description", content: "Cadastrar nova ficha técnica de produção." },
    { property: "og:title", content: "Nova Ficha Técnica · Casa do Sertão" }, { property: "og:description", content: "Cadastrar nova ficha técnica de produção." }] }),
  component: () => (<AppShell><h1 className="mx-auto mb-6 max-w-4xl font-display text-3xl font-bold text-primary">Nova Ficha Técnica</h1><RecipeForm /></AppShell>),
});
