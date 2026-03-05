import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, register } from "@/lib/api";

const Login = () => {
  const navigate = useNavigate();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isRegisterMode && password.length < 8) {
      setError("Heslo musí mít alespoň 8 znaků.");
      return;
    }

    try {
      if (isRegisterMode) {
        await register(username, email, password);
      }
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Přihlášení/registrace selhala. Zkontrolujte údaje."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary">
      <Card className="w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold">{isRegisterMode ? "Registrace" : "Přihlášení"}</h1>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="username">Uživatelské jméno</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          {isRegisterMode && (
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          )}
          <div>
            <Label htmlFor="password">Heslo</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={isRegisterMode ? 8 : 1} />
          </div>
          {isRegisterMode && <p className="text-xs text-muted-foreground">Pro registraci je potřeba heslo min. 8 znaků.</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">{isRegisterMode ? "Registrovat a přihlásit" : "Přihlásit"}</Button>
        </form>

        <Button variant="outline" className="w-full" onClick={() => setIsRegisterMode((v) => !v)}>
          {isRegisterMode ? "Mám účet" : "Nemám účet"}
        </Button>
      </Card>
    </div>
  );
};

export default Login;
