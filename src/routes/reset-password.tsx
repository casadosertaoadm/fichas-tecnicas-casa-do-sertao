import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Redefinir Senha · Casa do Sertão" },
      { name: "description", content: "Defina uma nova senha de acesso ao sistema da Casa do Sertão." },
      { property: "og:title", content: "Redefinir Senha · Casa do Sertão" },
      { property: "og:description", content: "Defina uma nova senha de acesso ao sistema da Casa do Sertão." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const hashHasRecovery = window.location.hash.includes("type=recovery");
    if (hashHasRecovery) setReady(true);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
        setChecking(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session || hashHasRecovery) setReady(true);
      setChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (senha.length < 6) {
      setError("A nova senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (senha !== confirmacao) {
      setError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password: senha });
      if (err) {
        setError("Não foi possível atualizar a senha. Solicite um novo link.");
        return;
      }
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  const input = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-warm">
        <img src="/fichas-tecnicas-casa-do-sertao/logo_casa_sertao.png" alt="Casa do Sertão" width={160} height={160} className="mx-auto h-32 w-32 object-contain" />
        <h1 className="mt-4 text-center font-display text-2xl font-bold text-primary">Nova Senha</h1>
        <p className="text-center text-sm text-muted-foreground">Gestão de Produção</p>

        {done ? (
          <div className="mt-6 space-y-4 text-center">
            <p className="rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground">
              Senha atualizada com sucesso!
            </p>
            <button type="button" onClick={() => navigate({ to: "/" })} className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              Acessar o sistema
            </button>
          </div>
        ) : checking ? (
          <p className="mt-6 text-center text-sm text-muted-foreground">Validando link de redefinição...</p>
        ) : !ready ? (
          <div className="mt-6 space-y-4 text-center">
            <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Link de redefinição inválido ou expirado.
            </p>
            <Link to="/login" className="block w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              Voltar para o login
            </Link>
          </div>
        ) : (
          <>
            {error && <p role="alert" className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">{error}</p>}
            <form onSubmit={submit} className="mt-6 space-y-4">
              <label className="block text-sm font-semibold text-foreground">Nova senha
                <input type="password" required className={`${input} mt-1 font-normal`} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
              </label>
              <label className="block text-sm font-semibold text-foreground">Confirmar nova senha
                <input type="password" required className={`${input} mt-1 font-normal`} value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
              </label>
              <button type="submit" disabled={loading} className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
                {loading ? "Salvando..." : "Salvar nova senha"}
              </button>
            </form>
            <Link to="/login" className="mt-4 block w-full text-center text-sm font-medium text-secondary underline-offset-4 hover:underline">
              Voltar para o login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
