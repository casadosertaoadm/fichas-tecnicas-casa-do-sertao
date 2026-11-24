import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BookOpen, LogOut, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";


export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const nav = "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent";
  const sair = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };
  return (
    <div className="min-h-screen md:flex">
      <aside className="no-print border-b border-sidebar-border bg-sidebar md:sticky md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="flex items-center gap-3 p-4 md:flex-col md:items-stretch md:gap-6 md:p-6">
          <Link to="/"><img src="/fichas-tecnicas-casa-do-sertao/logo_casa_sertao.png" alt="Casa do Sertão" width={200} height={200} className="h-14 w-14 object-contain md:mx-auto md:h-36 md:w-36" /></Link>
          <nav className="flex flex-1 gap-1 md:flex-col">
            <Link to="/" className={nav} activeOptions={{ exact: true }} activeProps={{ className: "bg-sidebar-accent" }}><BookOpen className="h-4 w-4" /> Fichas Técnicas</Link>
            <Link to="/receitas/nova" className={nav} activeProps={{ className: "bg-sidebar-accent" }}><Plus className="h-4 w-4" /> Nova Ficha</Link>
            <button type="button" onClick={sair} className={`${nav} md:mt-4 text-left text-muted-foreground`}><LogOut className="h-4 w-4" /> Sair</button>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
