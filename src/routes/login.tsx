import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import logoAsset from "@/assets/logo_casa_sertao.png.asset.json";
import { supabase } from "@/integrations/supabase/client";

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
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) navigate({ to: "/" });
    });
  }, [navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const cleanEmail = email.trim();
    if (!cleanEmail || !senha) {
      setError("Informe e-mail e senha.");
      return;
    }
    if (mode === "signup" && senha.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        const { error: err } = await supabase.auth.signInWithPassword({ email: cleanEmail, password: senha });
        if (err) {
          setError("E-mail ou senha inválidos.");
          return;
        }
        navigate({ to: "/" });
      } else {
        const { data, error: err } = await supabase.auth.signUp({
          email: cleanEmail,
          password: senha,
          options: { emailRedirectTo: window.location.origin },
        });
        if (err) {
          setError(err.message);
          return;
        }
        if (data.session) {
          navigate({ to: "/" });
        } else {
          setInfo("Conta criada! Verifique seu e-mail para confirmar o acesso.");
          setMode("login");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const input = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-warm">
        <img src={logoAsset.url} alt="Casa do Sertão" width={160} height={160} className="mx-auto h-32 w-32 object-contain" />
        <h1 className="mt-4 text-center font-display text-2xl font-bold text-primary">
          {mode === "login" ? "Acesso ao Sistema" : "Criar Conta"}
        </h1>
        <p className="text-center text-sm text-muted-foreground">Gestão de Produção</p>
        {error && <p role="alert" className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">{error}</p>}
        {info && <p className="mt-4 rounded-md bg-accent px-3 py-2 text-center text-sm text-accent-foreground">{info}</p>}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-foreground">E-mail
            <input type="email" required className={`${input} mt-1 font-normal`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" autoComplete="email" />
          </label>
          <label className="block text-sm font-semibold text-foreground">Senha
            <input type="password" required className={`${input} mt-1 font-normal`} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" autoComplete={mode === "login" ? "current-password" : "new-password"} />
          </label>
          <button type="submit" disabled={loading} className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>
        <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setInfo(null); }} className="mt-4 block w-full text-center text-sm font-medium text-secondary underline-offset-4 hover:underline">
          {mode === "login" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
        </button>
      </div>
    </div>
  );
}
