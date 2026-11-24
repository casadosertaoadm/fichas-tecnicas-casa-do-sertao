import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login · Casa do Sertão" },
      { name: "description", content: "Acesso ao sistema de gestão de fichas técnicas da Casa do Sertão." },
      { property: "og:title", content: "Login · Casa do Sertão" },
      { property: "og:description", content: "Acesso ao sistema de gestão de fichas técnicas da Casa do Sertão." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "forgot">("login");
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
    if (!cleanEmail) {
      setError("Informe seu e-mail.");
      return;
    }
    if (mode === "login" && !senha) {
      setError("Informe e-mail e senha.");
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
        const basePath = import.meta.env.BASE_URL.replace(/\/+$/, "");
        const { error: err } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}${basePath}/reset-password`,
        });
        if (err) {
          setError("Não foi possível enviar o e-mail de redefinição. Tente novamente.");
          return;
        }
        setInfo("Se o e-mail estiver cadastrado, enviamos um link para redefinir sua senha.");
      }
    } finally {
      setLoading(false);
    }
  };

  const input = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-warm">
        <img src="/fichas-tecnicas-casa-do-sertao/logo_casa_sertao.png" alt="Casa do Sertão" width={160} height={160} className="mx-auto h-32 w-32 object-contain" />
        <h1 className="mt-4 text-center font-display text-2xl font-bold text-primary">
          {mode === "login" ? "Acesso ao Sistema" : "Redefinir Senha"}
        </h1>
        <p className="text-center text-sm text-muted-foreground">
          {mode === "login" ? "Gestão de Produção" : "Informe seu e-mail para receber o link de redefinição."}
        </p>
        {error && <p role="alert" className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">{error}</p>}
        {info && <p className="mt-4 rounded-md bg-accent px-3 py-2 text-center text-sm text-accent-foreground">{info}</p>}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-foreground">E-mail
            <input type="email" required className={`${input} mt-1 font-normal`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" autoComplete="email" />
          </label>
          {mode === "login" && (
            <label className="block text-sm font-semibold text-foreground">Senha
              <input type="password" required className={`${input} mt-1 font-normal`} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
            </label>
          )}
          <button type="submit" disabled={loading} className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Enviar link de redefinição"}
          </button>
        </form>
        <button type="button" onClick={() => { setMode(mode === "login" ? "forgot" : "login"); setError(null); setInfo(null); }} className="mt-4 block w-full text-center text-sm font-medium text-secondary underline-offset-4 hover:underline">
          {mode === "login" ? "Esqueci minha senha" : "Voltar para o login"}
        </button>
      </div>
    </div>
  );
}
