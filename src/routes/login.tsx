import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Lock, LogIn } from "lucide-react";
import { ADMIN_CREDENTIALS, ADMIN_TOKEN_KEY } from "@/lib/admin-config";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — GhostLand" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      window.localStorage.setItem(ADMIN_TOKEN_KEY, crypto.randomUUID());
      navigate({ to: "/admin" });
    } else {
      setError("Nieprawidłowe dane logowania.");
    }
  };

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 py-16">
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmit}
        className="glass w-full rounded-2xl p-8"
      >
        <div className="mb-6 flex items-center gap-2 text-ghost">
          <Lock className="h-5 w-5" />
          <h1 className="font-heading text-2xl font-bold">Panel administratora</h1>
        </div>

        <label className="mb-3 block text-xs uppercase tracking-widest text-muted-foreground">
          Login
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
        </label>
        <label className="mb-4 block text-xs uppercase tracking-widest text-muted-foreground">
          Hasło
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
        </label>

        {error && <p className="mb-3 text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground glow-ember transition-transform hover:scale-[1.01]"
        >
          <LogIn className="h-4 w-4" />
          Zaloguj
        </button>

        <p className="mt-4 text-[10px] text-muted-foreground">
          Podpowiedź dev: <code>admin</code> / <code>ghostland8</code>. Mock auth, dane trzymane w localStorage.
        </p>
      </motion.form>
    </main>
  );
}