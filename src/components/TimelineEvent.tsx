import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Pencil, Pill, FileText, Stethoscope, Waves } from "lucide-react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import type { HealthEvent, DocumentRecord } from "@/types/health";
import { useI18n } from "@/lib/i18n";
import AttachmentList from "@/components/AttachmentList";

type TimelineEventProps = {
  event: HealthEvent;
  isLast: boolean;
  onEdit: (event: HealthEvent) => void;
  documents?: DocumentRecord[];
  onOpenDocument?: (doc: DocumentRecord) => void;
};

const eventIcons = {
  surgery: Activity,
  medication: Pill,
  rehabilitation: Stethoscope,
  document: FileText,
  spa: Waves,
};

const eventColors = {
  surgery: "bg-warning/10 text-warning border-warning/20",
  medication: "bg-medical-cyan/10 text-medical-cyan border-medical-cyan/20",
  rehabilitation: "bg-success/10 text-success border-success/20",
  document: "bg-medical-blue/10 text-medical-blue border-medical-blue/20",
  spa: "bg-accent/10 text-accent border-accent/20",
};

const eventLabels = (t: (k: string) => string) => ({
  surgery: t("surgery"),
  medication: t("medication_label"),
  rehabilitation: t("rehabilitation"),
  document: t("documents"),
  spa: t("spa"),
});

export const TimelineEvent = ({ event, isLast, onEdit, documents = [], onOpenDocument }: TimelineEventProps) => {
  const Icon = eventIcons[event.type];
  const { t } = useI18n();
  const labels = eventLabels(t);

  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center">
        <div className={`h-12 w-12 rounded-xl ${eventColors[event.type]} flex items-center justify-center border-2 shadow-sm transition-all group-hover:scale-110`}>
          <Icon className="h-6 w-6" />
        </div>
        {!isLast && <div className="w-0.5 h-full min-h-[2rem] bg-border mt-2" />}
      </div>

      <Card className="flex-1 p-4 mb-4 hover:shadow-md transition-all group-hover:border-primary/50">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground text-lg break-words">{event.title}</h3>
              <Badge variant="outline" className={eventColors[event.type]}>
                {labels[event.type]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{format(new Date(event.date), "d. MMMM yyyy", { locale: cs })}</p>
          </div>
          <Button variant="outline" size="sm" className="self-start" onClick={() => onEdit(event)}>
            <Pencil className="h-4 w-4 mr-1" /> {t("edit")}
          </Button>
        </div>

        {event.description && <p className="text-foreground mb-2">{event.description}</p>}

        {documents.length > 0 && (
          <div className="mt-3">
            <AttachmentList documents={documents} onOpenDocument={onOpenDocument} />
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {event.location && <span>📍 {event.location}</span>}
          {event.doctor && <span>👨‍⚕️ {event.doctor}</span>}
        </div>
      </Card>
    </div>
  );
};
