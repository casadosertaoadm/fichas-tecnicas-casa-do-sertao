import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ShieldCheck } from "lucide-react";
import logoAsset from "@/assets/logo_casa_sertao.png.asset.json";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login · Casa do Sertão" },
      { name: "description", content: "Acesso ao sistema de gestão de fichas técnicas da Casa do Sertão." },
      { property: "og:title", content: "Login · Casa do Sertão" },
      { property: "og:description", content: "Acesso ao sistema de gestão de fichas técnicas da Casa do Sertão." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const entrar = (e: FormEvent) => { e.preventDefault(); navigate({ to: "/" }); };
  const input = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-warm">
        <img src={logoAsset.url} alt="Casa do Sertão" width={160} height={160} className="mx-auto h-32 w-32 object-contain" />
        <h1 className="mt-4 text-center font-display text-2xl font-bold text-primary">Acesso ao Sistema</h1>
        <p className="text-center text-sm text-muted-foreground">Gestão de Produção</p>
        <div className="mx-auto mt-4 flex w-fit items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          <ShieldCheck className="h-3.5 w-3.5" /> Modo de Validação · Acesso livre para testes
        </div>
        <form onSubmit={entrar} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-foreground">E-mail / Usuário
            <input className={`${input} mt-1 font-normal`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" autoComplete="username" />
          </label>
          <label className="block text-sm font-semibold text-foreground">Senha
            <input type="password" className={`${input} mt-1 font-normal`} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          </label>
          <button type="submit" className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Entrar</button>
        </form>
        <Link to="/" className="mt-4 block text-center text-sm font-medium text-secondary underline-offset-4 hover:underline">Acessar diretamente (Modo Validação)</Link>
      </div>
    </div>
  );
}
