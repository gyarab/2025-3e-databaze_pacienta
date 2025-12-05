/**
 * Index.tsx — Landing page for the MediCare app.
 * Renders the hero, features grid, use-cases, CTA and footer.
 * Uses shared UI components and lucide-react icons, and navigates to /dashboard.
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, FileText, Clock, Search, Shield, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Clock,
      title: "Časová osa",
      description: "Přehledné zobrazení všech zdravotních událostí v chronologickém pořadí"
    },
    {
      icon: FileText,
      title: "Dokumenty",
      description: "Nahrávejte a organizujte lékařské zprávy na jednom místě"
    },
    {
      icon: Search,
      title: "Vyhledávání",
      description: "Rychle najděte potřebné informace o léčbě nebo lécích"
    },
    {
      icon: Shield,
      title: "Bezpečnost",
      description: "Vaše data jsou chráněna a přístupná pouze vám"
    },
    {
      icon: Activity,
      title: "Komplexní evidence",
      description: "Operace, léky, rehabilitace i lázně na jednom místě"
    },
    {
      icon: Sparkles,
      title: "Budoucnost",
      description: "Brzy s AI asistentem pro automatické třídění a odpovědi"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">MediCare</h1>
            </div>
            <Button onClick={() => navigate("/dashboard")} size="lg">
              Začít
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="inline-block">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Activity className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Mějte svou zdravotní historii
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> pod kontrolou</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Jednoduše organizujte lékařské zprávy, operace, léky a rehabilitace. 
            Vše na jednom místě, přehledně v časové ose.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => navigate("/dashboard")} className="gap-2">
              <Activity className="h-5 w-5" />
              Vyzkoušet zdarma
            </Button>
            <Button size="lg" variant="outline">
              Zjistit více
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Vše, co potřebujete pro správu zdraví
          </h3>
          <p className="text-muted-foreground text-lg">
            Moderní nástroj pro evidenci vaší léčebné historie
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 bg-card hover:shadow-lg transition-all hover:scale-105">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h4>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-card to-secondary border-2">
            <h3 className="text-3xl font-bold text-foreground mb-6">
              Kdy se vám MediCare hodí?
            </h3>
            <div className="space-y-4 text-lg">
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <p className="text-muted-foreground">
                  Při opakovaných návštěvách u různých specialistů, kdy potřebujete rychle dohledat datum operace nebo seznam léků
                </p>
              </div>
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <p className="text-muted-foreground">
                  Pro dlouhodobou léčbu, kde je důležité mít přehled o průběhu terapie
                </p>
              </div>
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <p className="text-muted-foreground">
                  Pro export a sdílení kompletní zdravotní historie s vaším lékařem
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-2xl mx-auto p-12 bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <h3 className="text-3xl font-bold mb-4">
            Začněte organizovat svou zdravotní historii dnes
          </h3>
          <p className="text-lg mb-8 opacity-90">
            Zdarma a bez závazků. Vaše data jsou vždy vaše.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate("/dashboard")}
            className="gap-2"
          >
            <Activity className="h-5 w-5" />
            Začít hned
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Activity className="h-5 w-5 text-primary" />
            <span>© 2024 MediCare. Vaše zdraví, vaše data.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
