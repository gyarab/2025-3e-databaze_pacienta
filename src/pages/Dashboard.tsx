import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { cs } from "date-fns/locale";

export type HealthEvent = {
  id: string;
  type: "surgery" | "medication" | "rehabilitation" | "document" | "spa";
  title: string;
  date: string;
  description?: string;
  location?: string;
  doctor?: string;
};

const typeLabels = {
  surgery: "Operace",
  medication: "Léky",
  rehabilitation: "Rehabilitace",
  document: "Dokument",
  spa: "Lázně"
};

const Dashboard = () => {
  const [events, setEvents] = useState<HealthEvent[]>([]);
  const [formData, setFormData] = useState({
    type: "surgery" as HealthEvent["type"],
    title: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    location: "",
    doctor: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: HealthEvent = {
      id: Date.now().toString(),
      ...formData
    };
    setEvents([newEvent, ...events].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
    setFormData({
      type: "surgery",
      title: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
      location: "",
      doctor: ""
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold">MediCare - Evidence léčby</h1>

        {/* Formulář */}
        <div className="border border-border p-4 rounded">
          <h2 className="text-lg font-semibold mb-4">Přidat záznam</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Typ</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({ ...formData, type: value as HealthEvent["type"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="surgery">Operace</SelectItem>
                    <SelectItem value="medication">Léky</SelectItem>
                    <SelectItem value="rehabilitation">Rehabilitace</SelectItem>
                    <SelectItem value="document">Dokument</SelectItem>
                    <SelectItem value="spa">Lázně</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Datum *</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Název *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Např. Operace kolene"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Popis</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Podrobnosti..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Místo</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Nemocnice..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor">Lékař</Label>
                <Input
                  id="doctor"
                  value={formData.doctor}
                  onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                  placeholder="MUDr. ..."
                />
              </div>
            </div>

            <Button type="submit">Přidat záznam</Button>
          </form>
        </div>

        {/* Seznam záznamů */}
        <div className="border border-border p-4 rounded">
          <h2 className="text-lg font-semibold mb-4">
            Časová osa ({events.length} záznamů)
          </h2>
          
          {events.length === 0 ? (
            <p className="text-muted-foreground">Zatím žádné záznamy</p>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="border border-border p-3 rounded">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{event.title}</span>
                        <span className="text-xs px-2 py-1 bg-muted rounded">
                          {typeLabels[event.type]}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.date), "d. MMMM yyyy", { locale: cs })}
                      </p>
                    </div>
                  </div>
                  
                  {event.description && (
                    <p className="text-sm mb-2">{event.description}</p>
                  )}
                  
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {event.location && <span>📍 {event.location}</span>}
                    {event.doctor && <span>👨‍⚕️ {event.doctor}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
