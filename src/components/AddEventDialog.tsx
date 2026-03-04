import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { HealthEvent } from "@/types/health";

type EventFormData = Omit<HealthEvent, "id">;

type AddEventDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEvent: (event: EventFormData, file: File | null) => Promise<void>;
  initialEvent?: HealthEvent | null;
};

const defaultFormData = (): EventFormData => ({
  type: "surgery",
  title: "",
  date: new Date().toISOString().split("T")[0],
  description: "",
  location: "",
  doctor: "",
});

export const AddEventDialog = ({ open, onOpenChange, onAddEvent, initialEvent }: AddEventDialogProps) => {
  const [formData, setFormData] = useState<EventFormData>(defaultFormData());
  const [attachment, setAttachment] = useState<File | null>(null);

  useEffect(() => {
    if (initialEvent) {
      setFormData({
        type: initialEvent.type,
        title: initialEvent.title,
        date: initialEvent.date,
        description: initialEvent.description ?? "",
        location: initialEvent.location ?? "",
        doctor: initialEvent.doctor ?? "",
      });
      return;
    }
    setFormData(defaultFormData());
  }, [initialEvent, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddEvent(formData, attachment);
    setAttachment(null);
    if (!initialEvent) {
      setFormData(defaultFormData());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialEvent ? "Upravit záznam" : "Přidat nový záznam"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Typ záznamu</Label>
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
            <Label htmlFor="title">Název *</Label>
            <Input id="title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Např. Operace kolene" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Datum *</Label>
            <Input id="date" type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Popis</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Podrobnosti o záznamu..." rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Místo</Label>
            <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Nemocnice nebo ordinace" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctor">Lékař</Label>
            <Input id="doctor" value={formData.doctor} onChange={(e) => setFormData({ ...formData, doctor: e.target.value })} placeholder="MUDr. Jan Novák" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment">Příloha (PDF / obrázek)</Label>
            <Input id="attachment" type="file" accept="application/pdf,image/*" onChange={(e) => setAttachment(e.target.files?.[0] ?? null)} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Zrušit
            </Button>
            <Button type="submit" className="flex-1">
              {initialEvent ? "Uložit změny" : "Přidat záznam"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
