import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">MediCare</h1>
          <p className="text-muted-foreground">
            Aplikace pro správu zdravotní historie
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Funkce:</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Evidence operací, léků, rehabilitací</li>
            <li>Nahrávání dokumentů</li>
            <li>Časová osa léčby</li>
            <li>Vyhledávání v záznamech</li>
          </ul>
        </div>

        <Button onClick={() => navigate("/dashboard")} size="lg">
          Otevřít aplikaci
        </Button>
      </div>
    </div>
  );
};

export default Index;
