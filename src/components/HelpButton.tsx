import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const HelpButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label={t("help")}> 
        <HelpCircle className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">{t("howToTitle")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{t("howToIntro")}</p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">1</div>
                <div>
                  <p className="font-semibold">{t("howToStep1")}</p>
                  <p className="text-xs text-muted-foreground">{t("howToStep1")}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">2</div>
                <div>
                  <p className="font-semibold">{t("howToStep2")}</p>
                  <p className="text-xs text-muted-foreground">{t("howToStep2")}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">3</div>
                <div>
                  <p className="font-semibold">{t("howToStep3")}</p>
                  <p className="text-xs text-muted-foreground">{t("howToStep3")}</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button onClick={() => setOpen(false)}>{t("close") ?? "Close"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HelpButton;
