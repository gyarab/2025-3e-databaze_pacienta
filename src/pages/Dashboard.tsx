/* The Dashboard.tsx file implements the main dashboard page for the MediCare app. 
It displays a summary of health-related events (such as surgeries, medications, documents, and rehabilitation) using cards and a timeline. 
The page allows users to add new health events via a dialog, and it visually summarizes the number and types of events. The timeline shows all recorded events in chronological order, 
and the UI is built using custom components and icons for a modern, user-friendly experience.*/

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FileText, Pill, Activity, Calendar } from "lucide-react";
import { TimelineEvent } from "@/components/TimelineEvent";
import { AddEventDialog } from "@/components/AddEventDialog";

export type HealthEvent = {
  id: string;
  type: "surgery" | "medication" | "rehabilitation" | "document" | "spa";
  title: string;
  date: string;
  description?: string;
  location?: string;
  doctor?: string;
};

// Mock data pro demonstraci
const mockEvents: HealthEvent[] = [
  {
    id: "1",
    type: "surgery",
    title: "Operace kolene",
    date: "2024-03-15",
    description: "Artroskopie pravého kolene",
    location: "Nemocnice Na Bulovce",
    doctor: "MUDr. Jan Novák"
  },
  {
    id: "2",
    type: "medication",
    title: "Předpis léků",
    date: "2024-03-20",
    description: "Ibuprofen 400mg, Pantoprazol 20mg",
    doctor: "MUDr. Jan Novák"
  },
  {
    id: "3",
    type: "rehabilitation",
    title: "Rehabilitace",
    date: "2024-04-01",
    description: "10 sezení fyzioterapie",
    location: "Rehabilitační centrum Praha"
  },
  {
    id: "4",
    type: "document",
    title: "Lékařská zpráva",
    date: "2024-04-15",
    description: "Kontrolní vyšetření po operaci",
    doctor: "MUDr. Jan Novák"
  }
  
];

const Dashboard = () => {
  const [events, setEvents] = useState<HealthEvent[]>(mockEvents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddEvent = (newEvent: Omit<HealthEvent, "id">) => {
    const event: HealthEvent = {
      ...newEvent,
      id: Date.now().toString()
    };
    setEvents([event, ...events].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
    setIsDialogOpen(false);
  };

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
            <Button onClick={() => setIsDialogOpen(true)} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Přidat záznam
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-medical-blue/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-medical-blue" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Celkem záznamů</p>
                <p className="text-2xl font-bold text-foreground">{events.length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-medical-cyan/10 flex items-center justify-center">
                <Pill className="h-6 w-6 text-medical-cyan" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Léky</p>
                <p className="text-2xl font-bold text-foreground">
                  {events.filter(e => e.type === "medication").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dokumenty</p>
                <p className="text-2xl font-bold text-foreground">
                  {events.filter(e => e.type === "document").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Operace</p>
                <p className="text-2xl font-bold text-foreground">
                  {events.filter(e => e.type === "surgery").length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="p-6 bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-6">Časová osa léčby</h2>
          
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Zatím nemáte žádné záznamy</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Přidat první záznam
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event, index) => (
                <TimelineEvent 
                  key={event.id} 
                  event={event} 
                  isLast={index === events.length - 1}
                />
              ))}
            </div>
          )}
        </Card>
      </main>

      <AddEventDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddEvent={handleAddEvent}
      />
    </div>
  );
};

export default Dashboard;
