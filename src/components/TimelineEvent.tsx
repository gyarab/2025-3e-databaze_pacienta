import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Pill, FileText, Stethoscope, Waves } from "lucide-react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import type { HealthEvent } from "@/pages/Dashboard";

type TimelineEventProps = {
  event: HealthEvent;
  isLast: boolean;
};

const eventIcons = {
  surgery: Activity,
  medication: Pill,
  rehabilitation: Stethoscope,
  document: FileText,
  spa: Waves
};

const eventColors = {
  surgery: "bg-warning/10 text-warning border-warning/20",
  medication: "bg-medical-cyan/10 text-medical-cyan border-medical-cyan/20",
  rehabilitation: "bg-success/10 text-success border-success/20",
  document: "bg-medical-blue/10 text-medical-blue border-medical-blue/20",
  spa: "bg-accent/10 text-accent border-accent/20"
};

const eventLabels = {
  surgery: "Operace",
  medication: "Léky",
  rehabilitation: "Rehabilitace",
  document: "Dokument",
  spa: "Lázně"
};

export const TimelineEvent = ({ event, isLast }: TimelineEventProps) => {
  const Icon = eventIcons[event.type];
  
  return (
    <div className="flex gap-4 group">
      {/* Timeline indicator */}
      <div className="flex flex-col items-center">
        <div className={`h-12 w-12 rounded-xl ${eventColors[event.type]} flex items-center justify-center border-2 shadow-sm transition-all group-hover:scale-110`}>
          <Icon className="h-6 w-6" />
        </div>
        {!isLast && (
          <div className="w-0.5 h-full min-h-[2rem] bg-border mt-2" />
        )}
      </div>

      {/* Event content */}
      <Card className="flex-1 p-4 mb-4 hover:shadow-md transition-all group-hover:border-primary/50">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground text-lg">{event.title}</h3>
              <Badge variant="outline" className={eventColors[event.type]}>
                {eventLabels[event.type]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {format(new Date(event.date), "d. MMMM yyyy", { locale: cs })}
            </p>
          </div>
        </div>
        
        {event.description && (
          <p className="text-foreground mb-2">{event.description}</p>
        )}
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {event.location && (
            <span>📍 {event.location}</span>
          )}
          {event.doctor && (
            <span>👨‍⚕️ {event.doctor}</span>
          )}
        </div>
      </Card>
    </div>
  );
};
