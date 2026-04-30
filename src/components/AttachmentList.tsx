import React from "react";
import type { DocumentRecord } from "@/types/health";
import { Button } from "@/components/ui/button";
import { FileText, ImageIcon, Download, ExternalLink } from "lucide-react";
import { getToken } from "@/lib/api";
import { useI18n } from "@/lib/i18n";

type Props = {
  documents: DocumentRecord[];
  onOpenDocument?: (doc: DocumentRecord) => void;
  className?: string;
};

export const AttachmentList: React.FC<Props> = ({ documents, onOpenDocument, className = "" }) => {
  const { t } = useI18n();
  const previewRemote = async (doc: DocumentRecord) => {
    // open in-site viewer if consumer provided the handler
    if (onOpenDocument) {
      return onOpenDocument(doc);
    }

    try {
      const token = getToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(doc.file, { headers });
      if (!res.ok) {
        window.open(doc.file, "_blank");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (e) {
      window.open(doc.file, "_blank");
    }
  };

  const downloadRemote = async (doc: DocumentRecord) => {
    try {
      const token = getToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(doc.file, { headers });
      if (!res.ok) {
        // fallback to direct link
        const a = document.createElement("a");
        a.href = doc.file;
        a.target = "_blank";
        a.download = "";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ext = (doc.file.split(".").pop() || "").split(/[?#]/)[0];
      const safeTitle = doc.title.replace(/[^a-z0-9\-_.]/gi, "_");
      a.download = `${safeTitle || "file"}${ext ? "." + ext : ""}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (e) {
      const a = document.createElement("a");
      a.href = doc.file;
      a.target = "_blank";
      a.download = "";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  if (!documents || documents.length === 0) return null;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {documents.map((d) => (
        <div key={d.id} className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm text-primary">
            {d.file.match(/\.(png|jpe?g|gif|webp)$/i) ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
            <span className="truncate">{d.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => previewRemote(d)}>
              <ExternalLink className="h-4 w-4 mr-1" />
              {t("open")}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => downloadRemote(d)}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttachmentList;
